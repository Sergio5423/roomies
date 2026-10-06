import { motion } from "framer-motion";
import type { LocationType } from "~/data/mock/locations";


interface LocationFiltersProps {
  activeType: LocationType | "all";
  onTypeChange: (type: LocationType | "all") => void;
}

const FILTER_OPTIONS: { label: string; type: LocationType | "all" }[] = [
  { label: "Todos", type: "all" },
  { label: "Habitaciones", type: "room" },
  { label: "Roommates", type: "roommate" },
];

export default function LocationFilters({
  activeType,
  onTypeChange,
}: LocationFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {FILTER_OPTIONS.map((filter) => {
        const isSelected = activeType === filter.type;
        return (
          <button
            key={filter.type}
            type="button"
            onClick={() => onTypeChange(filter.type)}
            className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-colors shrink-0 ${
              isSelected
                ? "text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="activeLocationFilter"
                className="absolute inset-0 rounded-xl bg-emerald-600"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}