import EmptyState from "@/components/EmptyState";
import EventCard from "@/components/EventCard";
import prisma from "@/lib/prisma";
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
          some: { id: currentUserId as string },
        },
        yearSem: student?.yearSem,
      },
      startTime: { gte: now },
    },
    include: {
      subject: true,
      lecturer: true,
      lectureRoom: true,
    },
    orderBy: { startTime: "asc" },
  });

  return (
    <div className="flex-1 text-2xl w-full h-full text-center md:text-left">
      <div className="bg-white rounded-md p-2 md:p-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 ">
            Upcoming Lectures
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full bg-white rounded-sm">
        {reservations.length > 0 ? (
          reservations.map((res) => (
            <EventCard
              key={res.id}
              id={res.id}
              roomId={res.lectureRoom.id}
              roomName={res.lectureRoom.name}
              title={res.subject.name}
              subject={res.subject.code}
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
