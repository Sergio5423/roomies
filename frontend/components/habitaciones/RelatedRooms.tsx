import type { Accommodation } from "../../domain/habitaciones/Accommodation";
import RoomCard from "./RoomCard";

interface RelatedRoomsProps {
  accommodations: Accommodation[];
}

export default function RelatedRooms({
  accommodations,
}: RelatedRoomsProps) {
  const relatedRooms = accommodations.slice(0, 3);

  if (relatedRooms.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedRooms.map((accommodation) => (
          <div
            key={accommodation.id}
            className="transition duration-300 hover:-translate-y-1"
          >
            <RoomCard
              accommodation={accommodation}
            />
          </div>
        ))}
      </div>
    </div>
  );
}