import { Prisma } from "@prisma/client";
import EmptyState from "@/components/EmptyState";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import ImportStudentsModal from "@/components/students/ImportStudentsModal";
import StudentFilters from "@/components/students/StudentFilters";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import StudentBulkManager from "@/components/students/Studentbulkmanager";

const StudentsListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 1;
  const p = page > 0 ? page : 1;

  const search = resolvedSearchParams.search;
  const departmentId = resolvedSearchParams.departmentId;
  const academicYearId = resolvedSearchParams.academicYearId;

  const query: Prisma.StudentWhereInput = {};

  if (search) {
    query.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { username: { contains: search, mode: "insensitive" } },
    ];
  }

  if (departmentId && departmentId !== "all") {
    query.departmentId = parseInt(departmentId);
  }

  if (academicYearId && academicYearId !== "all") {
    query.academicYearId = parseInt(academicYearId);
  }

  if (role === "lecturer") {
    query.subjects = {
      some: { lecturers: { some: { id: currentUserId! } } },
    };
  }

  const data = await prisma.student.findMany({
    where: query,
    take: ITEM_PER_PAGE,
    skip: ITEM_PER_PAGE * (p - 1),
    include: {
      subjects: true,
      department: { select: { name: true } },
      academicYear: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  const count = await prisma.student.count({ where: query });

  const departments = await prisma.department.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const academicYears = await prisma.academicYear.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const actionMap: Record<string, React.ReactNode> = {};
  if (role === "admin") {
    for (const item of data) {
      actionMap[item.id] = (
        <>
          <FormContainer table="student" type="update" data={item} />
          <FormContainer table="student" type="delete" id={item.id} />
        </>
      );
    }
  }

  const activeFilters = {
    departmentId: departmentId ?? "all",
    academicYearId: academicYearId ?? "all",
    search: search ?? "",
  };

  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 m-2 mt-0 space-y-4">
      {/* ── Top bar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold text-slate-800">All Students</h1>
        <div className="flex flex-wrap items-center gap-2">
          <TableSearch />
          {role === "admin" && (
            <>
              <ImportStudentsModal
                departments={departments}
                academicYears={academicYears}
              />
              <FormContainer table="student" type="create" />
            </>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <StudentFilters
        departments={departments}
        academicYears={academicYears}
        active={activeFilters}
        totalCount={count}
        role={role}
      />

      {/* ── Content ── */}
      {count === 0 ? (
        <EmptyState
          title="No students found"
          description="Try adjusting your filters or add a new student."
          imageSrc="/no-data.gif"
        />
      ) : (
        <>
          <StudentBulkManager data={data} role={role} actionMap={actionMap} />
          <Pagination page={p} count={count} />
        </>
      )}
    </div>
  );
};

export default StudentsListPage;
