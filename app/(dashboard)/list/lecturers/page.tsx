import { Department, Lecturer, Prisma, Subject } from "@prisma/client";
import EmptyState from "@/components/EmptyState";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";

type LecturerList = Lecturer & { subjects: Subject[]; department: Department };

const LeuturersListPage = async ({
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

  const queryParams = { ...resolvedSearchParams };
  delete queryParams.page;

  const p = page ? page : 1;

  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Department",
      accessor: "department",
    },
    {
      header: "Email",
      accessor: "email",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden md:table-cell",
    },
    {
      header: "Subjects",
      accessor: "subjects",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: LecturerList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="py-4">
        {item.title + ". " + item.name + " " + item.surname}
      </td>
      <td className="">{item.department.name}</td>
      <td className="hidden md:table-cell py-4">{item.email}</td>
      <td className="hidden md:table-cell py-4">{item.phone}</td>
      <td className="hidden lg:table-cell py-4">
        {item.subjects && item.subjects.length > 0
          ? item.subjects.length > 3
            ? `${item.subjects
                .slice(0, 3)
                .map((s) => s.code)
                .join(", ")}...`
            : item.subjects.map((s) => s.code).join(", ")
          : "-"}
      </td>
      <td>
        <div className="flex flex-col md:flex-row items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="lecturer" type="update" data={item} />
              <FormContainer table="lecturer" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // URL PARAMS CONDITIONS
  const query: Prisma.LecturerWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== "") {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { surname: { contains: value, mode: "insensitive" } },
            ];
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
      break;
    case "student":
      query.subjects = {
        some: {
          students: {
            some: {
              id: currentUserId!,
            },
          },
        },
      };
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.lecturer.findMany({
      where: query,
      include: {
        subjects: true,
        department: {
          select: {
            name: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lecturer.count({
      where: query,
    }),
  ]);

  return (
    <div className="flex-1 bg-white rounded-md p-4 m-2 mt-0">
      {/* TOP  */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lecturers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] cursor-pointer">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] cursor-pointer">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button> */}
            {role === "admin" && (
              <FormContainer table="lecturer" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {count === 0 ? (
        <EmptyState
          title="No lecturers found"
          description="Start by adding a new lecturer."
          imageSrc="/no-data.gif"
        />
      ) : (
        <>
          {/* LIST  */}
          <Table columns={columns} renderRow={renderRow} data={data} />
          {/* PAGINATION  */}
          <Pagination page={p} count={count} />
        </>
      )}
    </div>
  );
};

export default LeuturersListPage;
