import Link from "next/link";
import Image from "next/image";

export default function RoomCard({
  room,
  buildingId,
}: {
  room: { id: string; name: string; capacity?: number };
  buildingId: string;
}) {
  return (
    <Link
      href={`/home/${buildingId}/${room.id}`}
      className="w-full md:w-1/4 flex items-center gap-4 rounded-2xl bg-white border border-gray-200 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:min-w-sm"
    >
      {/* Department Image */}
      <div className="flex-shrink-0 w-16 h-16 relative">
        <Image
          src="/corporation.png"
          alt="Room"
          fill
          className="object-contain"
        />
      </div>

      {/* Text */}
      <div className="flex-1">
        <h2 className="text-lg font-bold mb-1">{room.name}</h2>
        <p className="text-sm text-gray-500">
          Capacity: {room.capacity ?? "N/A"}
        </p>
      </div>
    </Link>
  );
}
