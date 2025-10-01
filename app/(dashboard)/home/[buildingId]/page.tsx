import { rooms } from "@/lib/data";
import RoomCard from "@/components/RoomCard";

export default function BuildingDetail({
  params,
}: {
  params: { buildingId: string };
}) {
  const buildingRooms = rooms.filter((r) => r.buildingId === params.buildingId);

  return (
    <div className="flex-1 flex flex-col p-2 gap-2">
      <div className="text-center text-xl text-gray-800 font-bold mb-4 bg-blue-200 p-2">
        Lecture Halls
      </div>
      <div className="flex gap-4 flex-wrap justify-between bg-white rounded-sm p-2">
        {buildingRooms.map((room) => (
          <RoomCard key={room.id} room={room} buildingId={params.buildingId} />
        ))}
      </div>
    </div>
  );
}
