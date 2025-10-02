import BuildingCard from "@/components/BuildingCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const buildings = await prisma.hall.findMany();

  return (
    <div className="flex-1 p-2 md:p-4 text-2xl w-full h-full">
      <div className="text-center mb-1 p-2 bg-white rounded-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Buildings
        </h1>
        <p className="text-gray-600 text-sm">
          Select a building to view lecture rooms
        </p>
      </div>

      <div className="flex gap-4 flex-wrap w-full bg-white rounded-sm p-2">
        {buildings.map((b) => (
          <BuildingCard key={b.id} building={b} />
        ))}
      </div>
    </div>
  );
}
