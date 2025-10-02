import RoomCard from "@/components/RoomCard";
import { prisma } from "@/lib/prisma";

export default async function BuildingDetail({
  params,
}: {
  params: { buildingId: string };
}) {
  const { buildingId } = params;

  const buildingRooms = await prisma.lectureRoom.findMany({
    where: { hallId: parseInt(buildingId) },
  });

  return (
    <div className="flex-1 flex flex-col p-2 gap-2">
      <div className="text-center mb-1 bg-white rounded-md p-2">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Lecture Halls
        </h1>
        <p className="text-gray-600 text-sm">
          Select a lecture room to view reservations
        </p>
      </div>

      <div className="flex gap-4 flex-wrap bg-white rounded-sm p-2">
        {buildingRooms.map((room) => (
          <RoomCard key={room.id} room={room} buildingId={buildingId} />
        ))}
      </div>
    </div>
  );
}
