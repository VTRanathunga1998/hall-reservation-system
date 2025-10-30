// pages/Upcoming (or your component file)
import EmptyState from "@/components/EmptyState";
import EventCard from "@/components/EventCard";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function Upcoming() {
  const { userId } = await auth();
  const currentUserId = userId;

  const now = new Date();

  const student = await prisma.student.findUnique({
    where: { id: currentUserId as string },
    select: { yearSem: true },
  });

  const reservations = await prisma.reservation.findMany({
    where: {
      subject: {
        students: {
          some: {
            id: currentUserId as string,
          },
        },
        yearSem: student?.yearSem, // Filter by yearSem at database level
      },
      startTime: {
        gte: now,
      },
    },
    include: {
      subject: true,
      lecturer: true,
      lectureRoom: {
        include: {
          hall: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return (
    <div className="flex-1 p-2 md:p-4 text-2xl w-full h-full">
      <div className="text-center mb-1 p-2 bg-white rounded-md">
        <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 mb-2">
          Upcoming Lectures
        </h1>
      </div>

      <div className="flex flex-col gap-4 w-full bg-white rounded-sm p-2">
        {reservations.length > 0 ? (
          reservations.map((res) => (
            <EventCard
              key={res.id}
              id={res.id}
              // Pass lectureRoom.hallId and lectureRoom.id as the canonical fields
              hallId={res.lectureRoom.hallId}
              hallName={res.lectureRoom.hall.name}
              roomId={res.lectureRoom.id}
              roomName={res.lectureRoom.name}
              title={res.subject.name}
              subject={res.subject.code}
              // pass the raw Date object (Prisma returns Date on the server)
              startTime={res.startTime}
              endTime={res.endTime}
              lecturer={`${res.lecturer.name} ${res.lecturer.surname}`}
            />
          ))
        ) : (
          <EmptyState
            title="No upcoming events found"
            description=""
            imageSrc="/no-data.gif"
          />
        )}
      </div>
    </div>
  );
}
