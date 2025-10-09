import EmptyState from "@/components/EmptyState";
import RoomCard from "@/components/RoomCard";
import { prisma } from "@/lib/prisma";

export default async function BuildingDetail({
  params,
}: {
  params: Promise<{ buildingId: string }>;
}) {
  const { buildingId } = await params;

  // Convert the route param to a number
  const buildingIdNum = parseInt(buildingId);

  // Fetch rooms for this building
  const buildingRooms = await prisma.lectureRoom.findMany({
    where: { hallId: buildingIdNum },
  });

  return (
    <div className="flex flex-col p-2 gap-2">
      {/* Header */}
      <div className="text-center mb-1 bg-white rounded-md p-2 shadow-sm">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Lecture Halls
        </h1>
        <p className="text-gray-600 text-sm">
          Select a lecture room to view reservations
        </p>
      </div>

      {/* Room List */}
      <div className="flex gap-4 flex-wrap bg-white rounded-sm p-2 shadow-sm">
        {buildingRooms.length > 0 ? (
          buildingRooms.map((room) => (
            <RoomCard key={room.id} room={room} buildingId={buildingIdNum} />
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
