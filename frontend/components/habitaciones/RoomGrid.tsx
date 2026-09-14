import type { Accommodation } from "../../domain/habitaciones/Accommodation";
import RoomCard from "./RoomCard";

interface RoomGridProps {
  accommodations: Accommodation[];
}

export default function RoomGrid({
  accommodations,
}: RoomGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {accommodations.map((accommodation) => (
        <RoomCard
          key={accommodation.id}
          accommodation={accommodation}
        />
      ))}
    </div>
  );
}