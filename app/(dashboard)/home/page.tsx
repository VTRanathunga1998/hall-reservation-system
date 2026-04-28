import EmptyState from "@/components/EmptyState";
import { prisma } from "@/lib/prisma";
import RoomCard from "@/components/RoomCard";

export default async function HomePage() {
  const lectureRooms = await prisma.lectureRoom.findMany();

  return (
    <div className="flex-1 p-2 md:p-4 text-2xl w-full h-full">
      <div className="text-center mb-1 p-2 bg-white rounded-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Lecture Rooms
        </h1>
        <p className="text-gray-600 text-sm">
          Select a lecture room to view schedules
        </p>
      </div>

      <div className="flex gap-4 flex-wrap w-full bg-white rounded-sm p-2">
        {lectureRooms.length > 0 ? (
          lectureRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        ) : (
          <EmptyState
            title="No lecture rooms found"
            description="Start by adding a new lecture room"
            imageSrc="/no-data.gif"
          />
        )}
      </div>
    </div>
  );
}