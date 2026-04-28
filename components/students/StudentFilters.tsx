"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X, RefreshCw, ArrowRight } from "lucide-react";
import { bulkUpdateYearSemByFilter } from "@/lib/students/actions";

const YEAR_SEM_OPTIONS = [
  { value: "11", label: "Year 1 — Sem 1" },
  { value: "12", label: "Year 1 — Sem 2" },
  { value: "21", label: "Year 2 — Sem 1" },
  { value: "22", label: "Year 2 — Sem 2" },
  { value: "31", label: "Year 3 — Sem 1" },
  { value: "32", label: "Year 3 — Sem 2" },
  { value: "41", label: "Year 4 — Sem 1" },
  { value: "42", label: "Year 4 — Sem 2" },
];

const ysLabel = (v: string) =>
  YEAR_SEM_OPTIONS.find((o) => o.value === v)?.label ?? v;

type Department = { id: number; name: string };
type AcademicYear = { id: number; name: string };

type Props = {
  departments: Department[];
  academicYears: AcademicYear[];
  active: {
    departmentId: string;
    academicYearId: string;
    search?: string;
  };
  totalCount: number;
};

export default function StudentFilters({
  departments,
  academicYears,
  active,
  totalCount,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [targetYearSem, setTargetYearSem] = useState("12");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("departmentId");
    params.delete("academicYearId");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleBulkUpdate() {
    setFeedback(null);
    startTransition(async () => {
      const res = await bulkUpdateYearSemByFilter(
        {
          departmentId:
            active.departmentId !== "all"
              ? parseInt(active.departmentId)
              : undefined,
          academicYearId:
            active.academicYearId !== "all"
              ? parseInt(active.academicYearId)
              : undefined,
          search: active.search || undefined,
        },
        parseInt(targetYearSem)
      );

      if (res.success) {
        setFeedback({
          type: "success",
          msg: `Updated ${res.updated} student(s) to ${ysLabel(targetYearSem)}.`,
        });
        router.refresh();
      } else {
        setFeedback({ type: "error", msg: res.error });
      }
    });
  }

  const hasFilter =
    active.departmentId !== "all" || active.academicYearId !== "all";

  const activeDeptName =
    active.departmentId !== "all"
      ? departments.find((d) => String(d.id) === active.departmentId)?.name
      : null;

  const activeAcYearName =
    active.academicYearId !== "all"
      ? academicYears.find((y) => String(y.id) === active.academicYearId)?.name
      : null;

  return (
    <div className="space-y-3">
      {/* ── Filter row ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter by
        </div>

        {/* Department */}
        <div className="relative">
          <select
            value={active.departmentId}
            onChange={(e) => updateParam("departmentId", e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 cursor-pointer transition-colors"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
        </div>

        {/* Academic Year */}
        <div className="relative">
          <select
            value={active.academicYearId}
            onChange={(e) => updateParam("academicYearId", e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 cursor-pointer transition-colors"
          >
            <option value="all">All Academic Years</option>
            {academicYears.map((y) => (
              <option key={y.id} value={String(y.id)}>
                {y.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
        </div>

        {/* Active filter pills */}
        {activeDeptName && (
          <span className="flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
            {activeDeptName}
            <button
              onClick={() => updateParam("departmentId", "all")}
              className="hover:text-violet-900 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
        {activeAcYearName && (
          <span className="flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
            {activeAcYearName}
            <button
              onClick={() => updateParam("academicYearId", "all")}
              className="hover:text-sky-900 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
        {hasFilter && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        )}

        <span className="ml-auto text-xs text-slate-400">
          {totalCount} student{totalCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Promote Year/Sem panel ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <span className="text-xs font-semibold text-amber-800">
            Promote year / sem
          </span>
        </div>

        {/* Context — shows what the update will apply to */}
        <div className="flex items-center gap-1.5 text-xs text-amber-700">
          <span>
            {hasFilter ? (
              <>
                {activeDeptName && <strong>{activeDeptName}</strong>}
                {activeDeptName && activeAcYearName && " · "}
                {activeAcYearName && <strong>{activeAcYearName}</strong>}
                {" — "}
              </>
            ) : null}
            {totalCount} student{totalCount !== 1 ? "s" : ""}
          </span>
        </div>

        <ArrowRight className="h-3.5 w-3.5 text-amber-400" />

        {/* Target Year/Sem */}
        <div className="relative">
          <select
            value={targetYearSem}
            onChange={(e) => setTargetYearSem(e.target.value)}
            className="appearance-none rounded-xl border border-amber-300 bg-white py-1.5 pl-3 pr-7 text-xs font-semibold text-amber-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 cursor-pointer"
          >
            {YEAR_SEM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-amber-400" />
        </div>

        <button
          onClick={handleBulkUpdate}
          disabled={isPending || totalCount === 0}
          className="rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-40 transition-colors"
        >
          {isPending ? "Updating…" : `Apply to ${totalCount}`}
        </button>

        {/* Feedback */}
        {feedback && (
          <span
            className={`flex items-center gap-1.5 text-xs font-medium ${
              feedback.type === "success" ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {feedback.type === "success" ? "✓" : "✗"} {feedback.msg}
            <button onClick={() => setFeedback(null)}>
              <X className="h-3 w-3 opacity-60 hover:opacity-100" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}