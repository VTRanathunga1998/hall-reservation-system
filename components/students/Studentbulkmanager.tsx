"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  RefreshCw,
  ChevronDown,
  X,
  CheckSquare,
  Square,
} from "lucide-react";
import { AcademicYear, Department, Student, Subject } from "@prisma/client";
import { bulkDeleteStudents, bulkUpdateYearSem } from "@/lib/students/actions";

export type StudentWithSubjects = Student & {
  subjects: Subject[];
  department: Pick<Department, "name">;
  academicYear: { name: string };
};

const YEAR_SEM_OPTIONS = [
  { value: 11, label: "Year 1 — Sem 1" },
  { value: 12, label: "Year 1 — Sem 2" },
  { value: 21, label: "Year 2 — Sem 1" },
  { value: 22, label: "Year 2 — Sem 2" },
  { value: 31, label: "Year 3 — Sem 1" },
  { value: 32, label: "Year 3 — Sem 2" },
  { value: 41, label: "Year 4 — Sem 1" },
  { value: 42, label: "Year 4 — Sem 2" },
];

const yearSemLabel = (v: number) =>
  YEAR_SEM_OPTIONS.find((o) => o.value === v)?.label ?? String(v);

type Props = {
  data: StudentWithSubjects[];
  role: string | undefined;
  actionMap: Record<string, React.ReactNode>;
};

export default function StudentBulkManager({ data, role, actionMap }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targetYearSem, setTargetYearSem] = useState(11);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const allSelected = data.length > 0 && data.every((s) => selected.has(s.id));

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        data.forEach((s) => next.delete(s.id));
      } else {
        data.forEach((s) => next.add(s.id));
      }
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
    setConfirmDelete(false);
    setFeedback(null);
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      const res = await bulkDeleteStudents(Array.from(selected));
      if (res.success) {
        const warn = res.clerkFailed.length > 0
          ? ` (${res.clerkFailed.length} Clerk account(s) could not be removed — delete manually)`
          : "";
        setFeedback({ type: "success", msg: `Deleted ${res.deleted} student(s).${warn}` });
        clearSelection();
        router.refresh();
      } else {
        setFeedback({ type: "error", msg: res.error });
        setConfirmDelete(false);
      }
    });
  }

  function handleYearSemUpdate() {
    startTransition(async () => {
      const res = await bulkUpdateYearSem(Array.from(selected), targetYearSem);
      if (res.success) {
        setFeedback({
          type: "success",
          msg: `Updated ${res.updated} student(s) to ${yearSemLabel(targetYearSem)}.`,
        });
        clearSelection();
        router.refresh();
      } else {
        setFeedback({ type: "error", msg: res.error });
      }
    });
  }

  return (
    <div className="space-y-3">
      {/* ── Bulk toolbar ── */}
      {role === "admin" && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Select / deselect all on page */}
          <button
            onClick={toggleAll}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            {allSelected ? "Deselect all" : `Select all ${data.length}`}
          </button>

          {selected.size > 0 && (
            <>
              {/* Badge */}
              <span className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                {selected.size} selected
                <button onClick={clearSelection} className="hover:text-violet-900 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>

              {/* Year/Sem update */}
              <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5">
                <RefreshCw className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                <div className="relative">
                  <select
                    value={targetYearSem}
                    onChange={(e) => setTargetYearSem(Number(e.target.value))}
                    className="appearance-none bg-transparent pr-5 text-xs font-semibold text-amber-700 outline-none cursor-pointer"
                  >
                    {YEAR_SEM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-amber-400" />
                </div>
                <button
                  onClick={handleYearSemUpdate}
                  disabled={isPending}
                  className="ml-1 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-40 transition-colors"
                >
                  {isPending ? "…" : "Apply"}
                </button>
              </div>

              {/* Delete */}
              {confirmDelete ? (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5">
                  <span className="text-xs font-medium text-rose-700">
                    Delete {selected.size} student(s)?
                  </span>
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-40 transition-colors"
                  >
                    {isPending ? "…" : "Confirm"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-rose-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete selected
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <span>{feedback.msg}</span>
          <button onClick={() => setFeedback(null)}>
            <X className="h-3.5 w-3.5 opacity-60 hover:opacity-100 transition-opacity" />
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              {role === "admin" && (
                <th className="py-3 pr-3 w-8">
                  <button
                    onClick={toggleAll}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {allSelected ? (
                      <CheckSquare className="h-4 w-4 text-violet-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
              )}
              <th className="py-3 pr-4">Username</th>
              <th className="hidden md:table-cell py-3 pr-4">Email</th>
              <th className="hidden md:table-cell py-3 pr-4">Phone</th>
              <th className="hidden lg:table-cell py-3 pr-4">Department</th>
              <th className="hidden lg:table-cell py-3 pr-4">Academic Year</th>
              <th className="py-3 pr-4">Year / Sem</th>
              <th className="hidden lg:table-cell py-3 pr-4">Subjects</th>
              {role === "admin" && <th className="py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-slate-100 text-sm transition-colors ${
                  selected.has(item.id)
                    ? "bg-violet-50"
                    : "even:bg-slate-50 hover:bg-slate-50"
                }`}
              >
                {role === "admin" && (
                  <td className="py-3 pr-3 w-8">
                    <button
                      onClick={() => toggleOne(item.id)}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {selected.has(item.id) ? (
                        <CheckSquare className="h-4 w-4 text-violet-600" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                )}
                <td className="py-3 pr-4 font-medium text-slate-800">
                  {item.username}
                </td>
                <td className="hidden md:table-cell py-3 pr-4 text-slate-500">
                  {item.email || "—"}
                </td>
                <td className="hidden md:table-cell py-3 pr-4 text-slate-500">
                  {item.phone || "—"}
                </td>
                <td className="hidden lg:table-cell py-3 pr-4 text-slate-500">
                  {item.department.name}
                </td>
                <td className="hidden lg:table-cell py-3 pr-4 text-slate-500">
                  {item.academicYear.name}
                </td>
                <td className="py-3 pr-4">
                  <span className="rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 whitespace-nowrap">
                    {yearSemLabel(item.yearSem)}
                  </span>
                </td>
                <td className="hidden lg:table-cell py-3 pr-4 text-slate-500">
                  {item.subjects.length > 0
                    ? item.subjects.slice(0, 3).map((s) => s.code).join(", ")
                    : "—"}
                </td>
                {role === "admin" && (
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {actionMap[item.id]}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}