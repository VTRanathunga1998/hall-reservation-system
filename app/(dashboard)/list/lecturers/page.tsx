import { Prisma } from "@prisma/client";
import EmptyState from "@/components/EmptyState";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";

import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import ImportLecturersModal from "@/components/lecturers/ImportLecturersModal";
import LecturerFilters from "@/components/lecturers/LecturerFilters";
import LecturerBulkManager from "@/components/lecturers/LecturerBulkManager";

const LecturersListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;
  const p = page > 0 ? page : 1;

  const search = resolvedSearchParams.search;
  const departmentId = resolvedSearchParams.departmentId;

  const query: Prisma.LecturerWhereInput = {};

  if (search) {
    query.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { surname: { contains: search, mode: "insensitive" } },
    ];
  }

  if (departmentId && departmentId !== "all") {
    query.departmentId = parseInt(departmentId);
  }

  if (role === "student") {
    query.subjects = {
      some: { students: { some: { id: currentUserId! } } },
    };
  }

  const data = await prisma.lecturer.findMany({
    where: query,
    take: ITEM_PER_PAGE,
    skip: ITEM_PER_PAGE * (p - 1),
    include: {
      subjects: true,
      department: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  const count = await prisma.lecturer.count({ where: query });

  const departments = await prisma.department.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const actionMap: Record<string, React.ReactNode> = {};
  if (role === "admin") {
    for (const item of data) {
      actionMap[item.id] = (
        <>
          <FormContainer table="lecturer" type="update" data={item} />
          <FormContainer table="lecturer" type="delete" id={item.id} />
        </>
      );
    }
  }

  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 m-2 mt-0 space-y-4">

      {/* ── Top bar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold text-slate-800">All Lecturers</h1>
        <div className="flex flex-wrap items-center gap-2">
          <TableSearch />
          {role === "admin" && (
            <>
              <ImportLecturersModal departments={departments} />
              <FormContainer table="lecturer" type="create" />
            </>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <LecturerFilters
        departments={departments}
        active={{ departmentId: departmentId ?? "all" }}
        totalCount={count}
      />

      {/* ── Content ── */}
      {count === 0 ? (
        <EmptyState
          title="No lecturers found"
          description="Try adjusting your filters or add a new lecturer."
          imageSrc="/no-data.gif"
        />
      ) : (
        <>
          <LecturerBulkManager data={data} role={role} actionMap={actionMap} />
          <Pagination page={p} count={count} />
        </>
      )}
    </div>
  );
};

export default LecturersListPage;