import {
  Hall,
  Lecturer,
  LectureRoom,
  Prisma,
  Reservation,
  Subject,
} from "@/app/generated/prisma";
import EmptyState from "@/components/EmptyState";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

type ReservationList = Reservation & {
  lectureRoom: LectureRoom & { hall: Hall };
  lecturer: Lecturer;
  subject: Subject;
};

const ReservationsListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Reservation ID",
      accessor: "reservationId",
      className: "hidden md:table-cell",
    },
    { header: "Hall", accessor: "hall", className: "hidden md:table-cell" },
    { header: "Room", accessor: "room" },
    {
      header: "Subject",
      accessor: "subject",
      className: "hidden md:table-cell",
    },
    {
      header: "Reserved By",
      accessor: "reservedBy",
      className: "hidden md:table-cell",
    },
    {
      header: "Start Time",
      accessor: "startTime",
    },
    {
      header: "End Time",
      accessor: "endTime",
    },
    ...(role === "admin" || role === "lecturer"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ReservationList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="hidden md:table-cell py-4">{item.id}</td>
      <td className="hidden md:table-cell py-4">
        {item.lectureRoom.hall.name}
      </td>
      <td className="py-4">{item.lectureRoom.name}</td>
      <td className="hidden md:table-cell py-4">{item.subject.code}</td>
      <td className="hidden md:table-cell py-4">
        {item.lecturer.name} {item.lecturer.surname}
      </td>
      <td className="py-4">{new Date(item.startTime).toLocaleString()}</td>
      <td className="py-4">{new Date(item.endTime).toLocaleString()}</td>
      <td className="py-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          {(role === "admin" || role === "lecturer") && (
            <>
              <FormContainer table="reservation" type="update" data={item} />
              <FormContainer table="reservation" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITIONS
  const query: Prisma.ReservationWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              // Search lecturer
              {
                lecturer: {
                  OR: [
                    { name: { contains: value, mode: "insensitive" } },
                    { surname: { contains: value, mode: "insensitive" } },
                  ],
                },
              },
              // Search subject
              {
                subject: {
                  name: { contains: value, mode: "insensitive" },
                },
              },
              // Search lecture room
              {
                lectureRoom: {
                  name: { contains: value, mode: "insensitive" },
                },
              },
              // Search hall name
              {
                lectureRoom: {
                  hall: {
                    name: { contains: value, mode: "insensitive" },
                  },
                },
              },
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
      query.lecturerId = currentUserId!;
      break;
    case "student":
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.reservation.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      include: {
        lectureRoom: {
          include: {
            hall: true,
          },
        },
        lecturer: true,
        subject: true,
      },
    }),
    prisma.reservation.count({
      where: query,
    }),
  ]);

  return (
    <div className="flex-1 bg-white rounded-md p-4 m-2 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Reservations
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] cursor-pointer">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] cursor-pointer">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="reservation" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {count === 0 ? (
        <EmptyState
          title="No reservations found"
          description="Start by adding a new reservations."
          imageSrc="/no-data.gif"
        />
      ) : (
        <>
          {/* LIST */}
          <Table columns={columns} renderRow={renderRow} data={data} />

          {/* PAGINATION */}
          <Pagination page={p} count={count} />
        </>
      )}
    </div>
  );
};

export default ReservationsListPage;
