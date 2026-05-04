import { Prisma } from "@prisma/client";
import BigCalendar from "@/components/BigCalendar";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const LectureCalendar = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const { roomId } = await params;

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const query: Prisma.ReservationWhereInput = {};

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

  if (roomId) {
    query.lectureRoom = {
      id: parseInt(roomId),
    };
  }

  const resData = await prisma.reservation.findMany({
    where: query,
    include: {
      subject: { select: { code: true } },
      lectureRoom: {
        select: { name: true },
      },
      lecturer: { select: { name: true, surname: true } },
    },
  });

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
      room: reservation.lectureRoom?.name ?? "No Room",
    },
  }));

  return (
    <div className="flex-1 mb-10 bg-white rounded-sm p-2 md:p-4">
      <h1 className="w-full p-1 font-bold">Lecture Schedule</h1>
      <BigCalendar data={data} />
    </div>
  );
};

export default LectureCalendar;
