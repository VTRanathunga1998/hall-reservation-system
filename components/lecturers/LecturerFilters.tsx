"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

type Department = { id: number; name: string };

type Props = {
  departments: Department[];
  active: { departmentId: string };
  totalCount: number;
};

export default function LecturerFilters({ departments, active, totalCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const activeDeptName =
    active.departmentId !== "all"
      ? departments.find((d) => String(d.id) === active.departmentId)?.name
      : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filter by
      </div>

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

      <span className="ml-auto text-xs text-slate-400">
        {totalCount} lecturer{totalCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}