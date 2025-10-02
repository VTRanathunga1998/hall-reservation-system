import Link from "next/link";
import Image from "next/image";

export default function BuildingCard({
  building,
}: {
  building: { id: number; name: string };
}) {
  return (
    <Link
      href={`/home/${building.id}`}
      className="w-full md:w-1/4 flex items-center gap-4 rounded-2xl bg-white border border-gray-200 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:min-w-sm"
    >
      {/* Building Image */}
      <div className="flex-shrink-0 w-16 h-16 relative">
        <Image
          src="/building.png"
          alt="Building"
          fill
          className="object-contain"
        />
      </div>

      {/* Text */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-1">{building.name}</h2>
        <p className="text-sm text-gray-500">
          View lecture rooms & reservations
        </p>
      </div>
    </Link>
  );
}
