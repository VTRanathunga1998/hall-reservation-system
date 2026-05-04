import EmptyState from "@/components/EmptyState";
import { prisma } from "@/lib/prisma";
import RoomCard from "@/components/RoomCard";

export default async function HomePage() {
  const lectureRooms = await prisma.lectureRoom.findMany();

  return (
    <div className="flex-1 text-2xl w-full h-full ">
      <div className="p-4 bg-white">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Lecture Rooms
          </h1>
          <p className="text-sm text-slate-500">
            Select a lecture room to view schedules
          </p>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap w-full bg-white p-4">
        {lectureRooms.length > 0 ? (
          lectureRooms.map((room) => <RoomCard key={room.id} room={room} />)
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
