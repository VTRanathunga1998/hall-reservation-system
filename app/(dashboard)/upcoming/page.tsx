import EmptyState from "@/components/EmptyState";
import EventCard from "@/components/EventCard";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function Upcoming() {
  const { userId, sessionClaims } = await auth();
  const currentUserId = userId;

  const now = new Date();

  const reservations = await prisma.reservation.findMany({
    where: {
      subject: {
        students: {
          some: {
            id: currentUserId as string,
          },
        },
      },
      startTime: {
        gte: now, // only today and future
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
      startTime: "asc", // nearest upcoming first
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
              hallId={res.lecRoomId}
              roomId={res.lectureRoom.hallId}
              title={res.subject.name}
              subject={res.subject.code}
              startTime={new Date(res.startTime)}
              endTime={new Date(res.endTime)}
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
