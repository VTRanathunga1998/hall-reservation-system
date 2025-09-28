import Link from "next/link";

export default function BuildingCard({
  building,
}: {
  building: { id: string; name: string };
}) {
  return (
    <Link
      href={`/buildings/${building.id}`}
      className="w-full md:w-1/4 rounded-2xl odd:bg-[#FAE27C] even:bg-[#CFCEFF] text-gray-800 p-6 shadow-md hover:scale-105 transition-transform md:min-w-sm"
    >
      {building.name}
    </Link>
  );
}
