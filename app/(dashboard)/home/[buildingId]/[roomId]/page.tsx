import { Prisma } from "@prisma/client";
import BigCalendar from "@/components/BigCalendar";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const LectureCalendar = async ({
  params,
}: {
  params: Promise<{ buildingId: string; roomId: string }>;
}) => {
  // ✅ Await params (required in Next.js 15+)
  const { buildingId, roomId } = await params;

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const query: Prisma.ReservationWhereInput = {};

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;

    case "lecturer":
      break;

    case "student":
      if (currentUserId) {
        query.subject = {
          students: {
            some: {
              id: currentUserId,
            },
          },
        };
      }
      break;
  }

  if (buildingId && roomId) {
    query.lectureRoom = {
      id: parseInt(roomId), // filter by room
      hallId: parseInt(buildingId), // filter by hall
    };
  }

  const [resData, hall, room] = await prisma.$transaction([
    prisma.reservation.findMany({
      where: query,
      include: {
        subject: { select: { code: true } },
        lectureRoom: {
          select: { name: true, hall: { select: { name: true } } },
        },
        lecturer: { select: { name: true, surname: true } },
      },
    }),

    prisma.hall.findUnique({
      where: { id: parseInt(buildingId) },
      select: { name: true },
    }),

    prisma.lectureRoom.findUnique({
      where: { id: parseInt(roomId) },
      select: { name: true },
    }),
  ]);

  const data = resData.map((reservation) => ({
    title:
      (reservation.subject?.code ?? "No Subject") +
      (reservation.lecturer
        ? ` - ${reservation.lecturer.name} ${reservation.lecturer.surname}`
        : ""),
    allDay: false,
    start: new Date(reservation.startTime),
    end: new Date(reservation.endTime),
    resource: {
      hall: reservation.lectureRoom.hall.name,
      room: reservation.lectureRoom?.name ?? "No Room",
    },
  }));

  return (
    <div className="flex-1 mb-10 ml-1 mr-1  bg-white rounded-sm p-2">
      <h1 className="w-full p-1 font-bold">
        {hall?.name} - {room?.name}
      </h1>
      <BigCalendar data={data} />
    </div>
  );
};

export default LectureCalendar;
