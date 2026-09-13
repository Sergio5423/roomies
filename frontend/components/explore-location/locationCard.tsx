
import type { LocationItem } from "../../app/data/mock/locations";

interface LocationCardProps {
  location: LocationItem;
}

export default function LocationCard({
  location,
}: LocationCardProps) {
  const typeLabel = {
    room: "Habitación",
    roommate: "Roomie",
    post: "Publicación",
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <img
        src={location.image}
        alt={location.title}
        className="h-44 w-full object-cover"
      />

      <div className="p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-green-700">
          {typeLabel[location.type]}
        </span>

        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          {location.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {location.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span>📍</span>
          <span>
            {location.neighborhood}, {location.cityId}
          </span>
        </div>
      </div>
    </article>
  );
}

