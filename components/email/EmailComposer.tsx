"use client";

import { useState, useMemo, useTransition } from "react";
import { sendEmails, type Recipient } from "@/lib/emails/actions";
import {
  Search,
  X,
  Send,
  Users,
  GraduationCap,
  ChevronDown,
  CheckSquare,
  Square,
  CheckCheck,
} from "lucide-react";

// ─── Year/Sem label ──────────────────────────────────────────────────────────
const yearSemLabel = (ys: number) => {
  const map: Record<number, string> = {
    11: "Y1 S1",
    12: "Y1 S2",
    21: "Y2 S1",
    22: "Y2 S2",
    31: "Y3 S1",
    32: "Y3 S2",
    41: "Y4 S1",
    42: "Y4 S2",
  };
  return map[ys] ?? `${ys}`;
};

// ─── Pill ────────────────────────────────────────────────────────────────────
function Pill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2.5 py-1 text-xs font-medium text-violet-700">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-violet-900 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ─── Recipient Row ───────────────────────────────────────────────────────────
function RecipientRow({
  r,
  selected,
  onToggle,
}: {
  r: Recipient;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      onClick={onToggle}
      className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors ${
        selected ? "bg-violet-50/60" : ""
      }`}
    >
      {selected ? (
        <CheckSquare className="h-4 w-4 flex-shrink-0 text-violet-600" />
      ) : (
        <Square className="h-4 w-4 flex-shrink-0 text-slate-300" />
      )}
      <div
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase
        bg-slate-100 text-slate-600"
      >
        {r.name[0]}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">{r.name}</p>
        <p className="truncate text-xs text-slate-400">{r.email}</p>
      </div>
      <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            r.type === "student"
              ? "bg-violet-50 text-violet-600"
              : "bg-sky-50 text-sky-600"
          }`}
        >
          {r.type === "student" ? "Student" : "Lecturer"}
        </span>
        {r.yearSem && (
          <span className="text-xs text-slate-400">
            {yearSemLabel(r.yearSem)}
          </span>
        )}
      </div>
    </li>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function EmailComposer({
  recipients,
}: {
  recipients: Recipient[];
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "student" | "lecturer">(
    "all",
  );
  const [deptFilter, setDeptFilter] = useState("all");
  const [yearSemFilter, setYearSemFilter] = useState("all");

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { success: true; sent: number } | { success: false; error: string } | null
  >(null);

  // Unique departments & yearSems
  const departments = useMemo(
    () => [
      "all",
      ...Array.from(new Set(recipients.map((r) => r.department))).sort(),
    ],
    [recipients],
  );
  const yearSems = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(
          recipients
            .filter((r) => r.yearSem != null)
            .map((r) => String(r.yearSem)),
        ),
      ).sort(),
    ],
    [recipients],
  );

  // Filtered list
  const filtered = useMemo(() => {
    return recipients.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (deptFilter !== "all" && r.department !== deptFilter) return false;
      if (yearSemFilter !== "all" && String(r.yearSem) !== yearSemFilter)
        return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [recipients, search, typeFilter, deptFilter, yearSemFilter]);

  const selectedList = recipients.filter((r) => selected.has(r.id));

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAllFiltered() {
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((r) => next.add(r.id));
      return next;
    });
  }

  function deselectAllFiltered() {
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((r) => next.delete(r.id));
      return next;
    });
  }

  function clearAll() {
    setSelected(new Set());
  }

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((r) => selected.has(r.id));

  function handleSend() {
    setResult(null);
    startTransition(async () => {
      const res = await sendEmails({
        recipientIds: Array.from(selected),
        subject,
        body,
      });
      setResult(res);
      if (res.success) {
        setSelected(new Set());
        setSubject("");
        setBody("");
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* ── LEFT: Recipient Selector ── */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {/* Filter bar */}
          <div className="border-b border-slate-100 p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, department…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Filter selects */}
            <div className="flex flex-wrap gap-2">
              {/* Type */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as typeof typeFilter)
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 cursor-pointer"
                >
                  <option value="all">All types</option>
                  <option value="student">Students</option>
                  <option value="lecturer">Lecturers</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              </div>

              {/* Department */}
              <div className="relative">
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d === "all" ? "All departments" : d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              </div>

              {/* Year/Sem (students only) */}
              {typeFilter !== "lecturer" && (
                <div className="relative">
                  <select
                    value={yearSemFilter}
                    onChange={(e) => setYearSemFilter(e.target.value)}
                    className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 cursor-pointer"
                  >
                    {yearSems.map((ys) => (
                      <option key={ys} value={ys}>
                        {ys === "all"
                          ? "All year/sem"
                          : yearSemLabel(Number(ys))}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                </div>
              )}
            </div>

            {/* Bulk actions */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                {filtered.length} shown · {selected.size} selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={
                    allFilteredSelected
                      ? deselectAllFiltered
                      : selectAllFiltered
                  }
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <CheckCheck className="h-3 w-3" />
                  {allFilteredSelected ? "Deselect shown" : "Select all shown"}
                </button>
                {selected.size > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 rounded-lg border border-rose-100 px-2.5 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* List */}
          <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-slate-400">
                No recipients match your filters.
              </li>
            ) : (
              filtered.map((r) => (
                <RecipientRow
                  key={r.id}
                  r={r}
                  selected={selected.has(r.id)}
                  onToggle={() => toggleOne(r.id)}
                />
              ))
            )}
          </ul>
        </div>

        {/* Selected pills */}
        {selectedList.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Selected ({selectedList.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {selectedList.map((r) => (
                <Pill
                  key={r.id}
                  label={r.name}
                  onRemove={() => toggleOne(r.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Compose ── */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Compose Message</h2>

          {/* Recipients summary */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
            {selected.size === 0 ? (
              <span className="text-xs text-slate-400">
                No recipients selected yet
              </span>
            ) : (
              <>
                <div className="flex gap-1.5">
                  {selectedList.some((r) => r.type === "student") && (
                    <span className="flex items-center gap-1 rounded-full bg-violet-50 border border-violet-100 px-2 py-0.5 text-xs font-medium text-violet-600">
                      <GraduationCap className="h-3 w-3" />
                      {
                        selectedList.filter((r) => r.type === "student").length
                      }{" "}
                      students
                    </span>
                  )}
                  {selectedList.some((r) => r.type === "lecturer") && (
                    <span className="flex items-center gap-1 rounded-full bg-sky-50 border border-sky-100 px-2 py-0.5 text-xs font-medium text-sky-600">
                      <Users className="h-3 w-3" />
                      {
                        selectedList.filter((r) => r.type === "lecturer").length
                      }{" "}
                      lecturers
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here…"
              rows={10}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"
            />
          </div>

          {/* Result feedback */}
          {result && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                result.success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {result.success
                ? `✓ Email sent to ${result.sent} recipient${result.sent !== 1 ? "s" : ""}.`
                : `✗ ${result.error}`}
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={
              isPending ||
              selected.size === 0 ||
              !subject.trim() ||
              !body.trim()
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            {isPending
              ? "Sending…"
              : `Send to ${selected.size} recipient${selected.size !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
