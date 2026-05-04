import {
  Lecturer,
  LectureRoom,
  Prisma,
  Reservation,
  Subject,
} from "@prisma/client";
import EmptyState from "@/components/EmptyState";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";

type ReservationList = Reservation & {
  lectureRoom: LectureRoom;
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

  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page)
    : 1;

  const queryParams = { ...resolvedSearchParams };
  delete queryParams.page;
  const p = page ? page : 1;

  const columns = [
    {
      header: "Room",
      accessor: "room",
    },
    {
      header: "Subject",
      accessor: "subject",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Reserved By",
            accessor: "reservedBy",
            className: "hidden lg:table-cell",
          },
        ]
      : []),
    {
      header: "Date & Time",
      accessor: "date",
      className: "hidden sm:table-cell",
    },
    ...(role === "admin" || role === "lecturer"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item: ReservationList) => {
    const date = new Date(item.startTime).toLocaleDateString("en-LK", {
      timeZone: "Asia/Colombo",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const startTime = new Date(item.startTime).toLocaleTimeString("en-LK", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Colombo",
    });
    const endTime = new Date(item.endTime).toLocaleTimeString("en-LK", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Colombo",
    });

    return (
      <tr
        key={item.id}
        className="border-b border-gray-100 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] transition-colors"
      >
        {/* Room + mobile-only stacked info */}
        <td className="py-3 px-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-gray-800">
              {item.lectureRoom.name}
            </span>
            {/* Subject — shown only on mobile */}
            <span className="text-xs text-gray-500 md:hidden">
              {item.subject.code}
            </span>
            {/* Date & time — shown only on mobile */}
            <span className="text-xs text-gray-400 sm:hidden">
              {date} · {startTime} – {endTime}
            </span>
            {/* Reserved by — shown only on mobile for admin */}
            {role === "admin" && (
              <span className="text-xs text-gray-400 lg:hidden">
                {item.lecturer.name.toUpperCase()} {item.lecturer.surname}
              </span>
            )}
          </div>
        </td>

        {/* Subject — hidden on mobile */}
        <td className="hidden md:table-cell py-3 px-2 text-gray-700">
          {item.subject.code}
        </td>

        {/* Reserved By — hidden on mobile/tablet */}
        {role === "admin" && (
          <td className="hidden lg:table-cell py-3 px-2 text-gray-700">
            {item.lecturer.name.toUpperCase()} {item.lecturer.surname}
          </td>
        )}

        {/* Date & Time — hidden on mobile */}
        <td className="hidden sm:table-cell py-3 px-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-700">{date}</span>
            <span className="text-xs text-gray-400">
              {startTime} – {endTime}
            </span>
          </div>
        </td>

        {/* Actions */}
        {(role === "admin" || role === "lecturer") && (
          <td className="py-3 px-2">
            <div className="flex gap-2">
              <FormContainer table="reservation" type="update" data={item} />
              <FormContainer table="reservation" type="delete" id={item.id} />
            </div>
          </td>
        )}
      </tr>
    );
  };

  // URL PARAMS CONDITIONS
  const query: Prisma.ReservationWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              {
                lecturer: {
                  OR: [
                    { name: { contains: value, mode: "insensitive" } },
                    { surname: { contains: value, mode: "insensitive" } },
                  ],
                },
              },
              { subject: { name: { contains: value, mode: "insensitive" } } },
              {
                lectureRoom: {
                  name: { contains: value, mode: "insensitive" },
                },
              },
            ];
            break;
        }
      }
    }
  }

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
        lectureRoom: true,
        lecturer: true,
        subject: { select: { name: true, code: true, departmentId: true } },
      },
    }),
    prisma.reservation.count({ where: query }),
  ]);

  return (
    <div className="flex-1 bg-white rounded-md p-3 md:p-4 mt-0">
      {/* TOP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
          All Reservations
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <TableSearch />
          {(role === "admin" || role === "lecturer") && (
            <div className="self-end sm:self-auto">
              <FormContainer table="reservation" type="create" />
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      {count === 0 ? (
        <EmptyState
          title="No reservations found"
          description="Start by adding a new reservation."
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

export default ReservationsListPage;
