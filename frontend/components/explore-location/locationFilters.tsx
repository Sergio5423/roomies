
import type { LocationType } from "../../app/data/mock/locations";

interface LocationFiltersProps {
  activeType: LocationType | "all";
  onTypeChange: (type: LocationType | "all") => void;
}

const filters = [
  {
    value: "all" as const,
    label: "Todos",
  },
  {
    value: "room" as const,
    label: "Habitaciones",
  },
  {
    value: "roommate" as const,
    label: "Roomies",
  },
  {
    value: "post" as const,
    label: "Publicaciones",
  },
];

export default function LocationFilters({
  activeType,
  onTypeChange,
}: LocationFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeType === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onTypeChange(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-green-700 text-white"
                : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
