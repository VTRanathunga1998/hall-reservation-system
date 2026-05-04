import { Department, Lecturer, Prisma, Subject } from "@prisma/client";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/FormContainer";
import SubjectFormContainer from "@/components/SubjectFormContainer";

type SubjectList = Subject & { lecturers: Lecturer[]; department: Department };

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 1;

  const queryParams = { ...resolvedSearchParams };
  delete queryParams.page;
  const p = page ? page : 1;

  const columns = [
    {
      header: "Subject",
      accessor: "code",
    },
    {
      header: "Lecturers",
      accessor: "lecturers",
      className: "hidden md:table-cell",
    },
    {
      header: "Department",
      accessor: "departments",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  const renderRow = (item: SubjectList) => (
    <tr
      key={item.id}
      className="border-b border-gray-100 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] transition-colors"
    >
      {/* Subject code + name stacked, with mobile extras below */}
      <td className="py-3 px-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-gray-800">{item.code}</span>
          <span className="text-xs text-gray-500">{item.name}</span>
          {/* Lecturers — shown only on mobile */}
          {item.lecturers.length > 0 && (
            <span className="text-xs text-gray-400 md:hidden mt-0.5">
              {item.lecturers
                .map((l) => `${l.name.toUpperCase()} ${l.surname}`)
                .join(", ")}
            </span>
          )}
          {/* Department — shown only on mobile/tablet */}
          {item.department?.name && (
            <span className="text-xs text-gray-400 lg:hidden">
              {item.department.name}
            </span>
          )}
        </div>
      </td>

      {/* Lecturers — hidden on mobile */}
      <td className="hidden md:table-cell py-3 px-2 align-top">
        <div className="flex flex-col gap-0.5">
          {item.lecturers.length === 0 ? (
            <span className="text-gray-400 text-xs">—</span>
          ) : (
            item.lecturers.map((lecturer) => (
              <span key={lecturer.id} className="text-gray-700">
                {lecturer.name.toUpperCase()} {lecturer.surname}
              </span>
            ))
          )}
        </div>
      </td>

      {/* Department — hidden on mobile/tablet */}
      <td className="hidden lg:table-cell py-3 px-2 align-top text-gray-700">
        {item.department?.name || "—"}
      </td>

      {/* Actions */}
      <td className="py-3 px-2 align-top">
        <div className="flex items-center gap-2">
          {role === "admin" ? (
            <>
              <FormContainer table="subject" type="update" data={item} />
              <FormContainer table="subject" type="delete" id={item.id} />
            </>
          ) : (
            <SubjectFormContainer
              type="remove"
              id={item.id}
              userId={userId!}
              role={role}
            />
          )}
        </div>
      </td>
    </tr>
  );

  // URL PARAMS CONDITIONS
  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;
    case "lecturer":
      query.lecturers = { some: { id: userId! } };
      break;
    case "student":
      query.students = { some: { id: userId! } };
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      include: {
        lecturers: true,
        department: true,
      },
    }),
    prisma.subject.count({ where: query }),
  ]);

  const subData = await prisma.subject.findMany({
    where: query,
    select: { id: true, name: true, code: true },
  });

  return (
    <div className="bg-white p-3 md:p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
          All Subjects
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {role === "admin" && (
              <FormContainer table="subject" type="create" />
            )}
            {(role === "student" || role === "lecturer") && (
              <SubjectFormContainer
                type="select"
                userId={userId!}
                role={role}
                data={subData}
              />
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {count === 0 ? (
        <EmptyState
          title="No subjects found"
          description="Start by adding a new subject."
          imageSrc="/no-data.gif"
        />
      ) : (
        <>
          <Table columns={columns} renderRow={renderRow} data={data} />
          <Pagination page={p} count={count} />
        </>
      )}
    </div>
  );
};

export default SubjectListPage;
