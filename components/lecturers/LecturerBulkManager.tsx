"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X, CheckSquare, Square } from "lucide-react";
import { bulkDeleteLecturers } from "@/lib/lecturers/actions";
import { Department, Lecturer, Subject } from "@prisma/client";

export type LecturerWithDetails = Lecturer & {
  subjects: Subject[];
  department: Pick<Department, "name">;
};

type Props = {
  data: LecturerWithDetails[];
  role: string | undefined;
  actionMap: Record<string, React.ReactNode>;
};

export default function LecturerBulkManager({ data, role, actionMap }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const allSelected = data.length > 0 && data.every((l) => selected.has(l.id));

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        data.forEach((l) => next.delete(l.id));
      } else {
        data.forEach((l) => next.add(l.id));
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
      const res = await bulkDeleteLecturers(Array.from(selected));
      if (res.success) {
        const warn =
          res.clerkFailed.length > 0
            ? ` (${res.clerkFailed.length} Clerk account(s) could not be removed — delete manually)`
            : "";
        setFeedback({
          type: "success",
          msg: `Deleted ${res.deleted} lecturer(s).${warn}`,
        });
        clearSelection();
        router.refresh();
      } else {
        setFeedback({ type: "error", msg: res.error });
        setConfirmDelete(false);
      }
    });
  }

  return (
    <div className="space-y-3">
      {/* ── Toolbar ── */}
      {role === "admin" && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleAll}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            {allSelected ? "Deselect all" : `Select all ${data.length}`}
          </button>

          {selected.size > 0 && (
            <>
              <span className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                {selected.size} selected
                <button
                  onClick={clearSelection}
                  className="hover:text-violet-900 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>

              {confirmDelete ? (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5">
                  <span className="text-xs font-medium text-rose-700">
                    Delete {selected.size} lecturer(s)?
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
              <th className="py-3 pr-4">Name</th>
              <th className="hidden md:table-cell py-3 pr-4">Department</th>
              <th className="hidden md:table-cell py-3 pr-4">Email</th>
              <th className="hidden md:table-cell py-3 pr-4">Phone</th>
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
                  {item.title}. {item.name.toUpperCase()} {item.surname}
                </td>
                <td className="hidden md:table-cell py-3 pr-4 text-slate-500">
                  {item.department.name}
                </td>
                <td className="hidden md:table-cell py-3 pr-4 text-slate-500">
                  {item.email || "—"}
                </td>
                <td className="hidden md:table-cell py-3 pr-4 text-slate-500">
                  {item.phone || "—"}
                </td>
                <td className="hidden lg:table-cell py-3 pr-4 text-slate-500">
                  {item.subjects.length > 0
                    ? item.subjects
                        .slice(0, 3)
                        .map((s) => s.code)
                        .join(", ")
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
