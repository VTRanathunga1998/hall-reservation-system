import Link from "next/link";

export default function RoomCard({
  room,
  buildingId,
}: {
  room: { id: string; name: string; capacity?: number };
  buildingId: string;
}) {
  return (
    <Link
      href={`/buildings/${buildingId}/${room.id}`}
      className="w-full md:w-1/4 rounded-2xl odd:bg-[#FAE27C] even:bg-[#CFCEFF] text-gray-800 p-6 shadow-md hover:scale-101 transition-transform md:min-w-sm"
    >
      <div className="">
        <h2 className="font-bold">{room.name}</h2>
        <p>Capacity: {room.capacity ?? "N/A"}</p>
      </div>
    </Link>
  );
}
