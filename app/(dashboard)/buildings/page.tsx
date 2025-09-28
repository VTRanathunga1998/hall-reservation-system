import { buildings } from "@/lib/data";
import BuildingCard from "@/components/BuildingCard";

export default function BuildingsPage() {
  return (
    <div className="flex-1 p-2 md:p-4 text-2xl w-full h-full">
      <div className="text-center text-xl text-gray-800 font-bold mb-4 bg-blue-200 p-1">
        Buildings
      </div>

      <div className="flex gap-4 flex-wrap justify-between w-full bg-white rounded-sm p-2">
        {buildings.map((b) => (
          <BuildingCard key={b.id} building={b} />
        ))}
      </div>
    </div>
  );
}
