"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Download, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { ImportStudentRow, importStudents } from "@/lib/students/actions";

type Department = { id: number; name: string };
type AcademicYear = { id: number; name: string };

type Props = {
  departments: Department[];
  academicYears: AcademicYear[];
};

const EXPECTED_HEADERS = [
  "username",
  "name",
  "surname",
  "email",
  "phone",
  "sex",
  "yearSem",
  "departmentId",
  "academicYearId",
];

function downloadTemplate() {
  const header = EXPECTED_HEADERS.join(",");
  const example = "jdoe,John,Doe,john@example.com,0771234567,MALE,11,1,1";
  const csv = `${header}\n${example}\n`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students_import_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

function rowToImportRow(raw: Record<string, string>): ImportStudentRow {
  return {
    username: raw.username ?? "",
    name: raw.name ?? "",
    surname: raw.surname ?? "",
    email: raw.email || undefined,
    phone: raw.phone || undefined,
    sex: (raw.sex?.toUpperCase() as "MALE" | "FEMALE") ?? "MALE",
    yearSem: parseInt(raw.yearsem ?? raw.yearSem ?? "11") || 11,
    departmentId: parseInt(raw.departmentid ?? raw.departmentId ?? "0") || 0,
    academicYearId: parseInt(raw.academicyearid ?? raw.academicYearId ?? "0") || 0,
  };
}

export default function ImportStudentsModal({ departments, academicYears }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<ImportStudentRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParseError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setParseError("No data rows found in the file.");
          setRows([]);
          return;
        }
        setRows(parsed.map(rowToImportRow));
      } catch {
        setParseError("Failed to parse file. Make sure it's a valid CSV.");
        setRows([]);
      }
    };
    reader.readAsText(file);
  }

  function handleImport() {
    startTransition(async () => {
      const res = await importStudents(rows);
      if (res.success) {
        setResult({ imported: res.imported, skipped: res.skipped, errors: res.errors });
        setRows([]);
        setFileName(null);
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
      } else {
        setParseError(res.error);
      }
    });
  }

  function handleClose() {
    setOpen(false);
    setRows([]);
    setFileName(null);
    setParseError(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <Upload className="h-3.5 w-3.5" />
        Import CSV
      </button>

      {/* Modal backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Import Students</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload a CSV file to add multiple students at once.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Template download */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Required columns
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {EXPECTED_HEADERS.join(", ")}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠ email is required — used to create the Clerk account
                    </p>
                  </div>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Template
                </button>
              </div>

              {/* Reference panels */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
                  <p className="text-xs font-semibold text-sky-700 mb-1.5">Department IDs</p>
                  <div className="flex flex-wrap gap-1.5">
                    {departments.map((d) => (
                      <span key={d.id} className="rounded-full border border-sky-200 bg-white px-2 py-0.5 text-xs text-sky-700">
                        {d.id} — {d.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
                  <p className="text-xs font-semibold text-violet-700 mb-1.5">Academic Year IDs</p>
                  <div className="flex flex-wrap gap-1.5">
                    {academicYears.map((y) => (
                      <span key={y.id} className="rounded-full border border-violet-200 bg-white px-2 py-0.5 text-xs text-violet-700">
                        {y.id} — {y.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* File input */}
              <div>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center hover:border-violet-300 hover:bg-violet-50/40 transition-colors">
                  <Upload className="h-6 w-6 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">
                    {fileName ? fileName : "Click to upload CSV file"}
                  </span>
                  <span className="text-xs text-slate-400">
                    .csv files only
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFile}
                  />
                </label>
              </div>

              {/* Parse error */}
              {parseError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Preview */}
              {rows.length > 0 && !result && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Preview — {rows.length} rows
                  </p>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-slate-500">Username</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-500">Name</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-500">Sex</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-500">YearSem</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-500">Dept ID</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-500">Acad. Year ID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rows.slice(0, 20).map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-3 py-2 text-slate-800">{r.username || <span className="text-rose-400">missing</span>}</td>
                            <td className="px-3 py-2 text-slate-600">{r.name} {r.surname}</td>
                            <td className="px-3 py-2 text-slate-600">{r.sex}</td>
                            <td className="px-3 py-2 text-slate-600">{r.yearSem}</td>
                            <td className="px-3 py-2 text-slate-600">{r.departmentId}</td>
                            <td className="px-3 py-2 text-slate-600">
                              {r.academicYearId || <span className="text-rose-400">missing</span>}
                            </td>
                          </tr>
                        ))}
                        {rows.length > 20 && (
                          <tr>
                            <td colSpan={6} className="px-3 py-2 text-center text-slate-400">
                              + {rows.length - 20} more rows
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Import result */}
              {result && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm font-medium text-emerald-700">
                      Imported {result.imported} student(s).{" "}
                      {result.skipped > 0 && `${result.skipped} skipped.`}
                    </p>
                  </div>
                  {result.errors.length > 0 && (
                    <div className="max-h-32 overflow-y-auto rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 space-y-1">
                      {result.errors.map((err, i) => (
                        <p key={i} className="text-xs text-rose-700">
                          {err}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                onClick={handleClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              {rows.length > 0 && (
                <button
                  onClick={handleImport}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40 transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {isPending ? "Importing…" : `Import ${rows.length} students`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}