import { LectureRoom, Prisma } from "@prisma/client";
import EmptyState from "@/components/EmptyState";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";

type LectureRoomList = LectureRoom;

const LectureRoomsListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { sessionClaims } = await auth();
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
      header: "Lecture Room",
      accessor: "lectureRoom",
    },
    {
      header: "Capacity",
      accessor: "capacity",
    },
    {
      header: "Actions",
      accessor: "actions",
    },
  ];

  const renderRow = (item: LectureRoomList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="py-2">{item.name}</td>
      <td className="py-2">{item.maxCapacity}</td>
      <td className="py-2">
        <div className="flex flex-col md:flex-row items-center gap-2 py-2">
          {role === "admin" && (
            <>
              <FormContainer table="lecture_room" type="update" data={item} />
              <FormContainer table="lecture_room" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const query: Prisma.LectureRoomWhereInput = {};

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

  const [data, count] = await prisma.$transaction([
    prisma.lectureRoom.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lectureRoom.count({
      where: query,
    }),
  ]);

  return (
    <div className="flex-1 bg-white rounded-md p-4 m-2 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Lecture Rooms
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />

          <div className="flex items-center gap-4 self-end">
            {role === "admin" && (
              <FormContainer table="lecture_room" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {count === 0 ? (
        <EmptyState
          title="No lecture rooms found"
          description="Start by adding a new lecture room."
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

export default LectureRoomsListPage;
