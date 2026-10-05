import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { LocationItem } from "~/data/mock/locations";


type LocationWithData = LocationItem & {
  image?: string;
  img?: string;
  title?: string;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  neighborhood?: string;
  price?: number;
};

interface LocationCardProps {
  location: LocationItem;
  isHovered?: boolean;
  onHover?: (id: string | number | null) => void;
}

export default function LocationCard({
  location,
  isHovered,
  onHover,
}: LocationCardProps) {
  const loc = location as LocationWithData;
  const imageSrc = loc.image || loc.img;
  const displayTitle = loc.title || loc.name || "Sin título";
  const displayLocation = loc.address || loc.neighborhood || loc.city || "";

  const formattedPrice = typeof loc.price === "number"
    ? new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(loc.price)
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      onMouseEnter={() => onHover?.(loc.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ${
        isHovered
          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl"
          : "border-gray-200/80 hover:border-emerald-300 hover:shadow-xl"
      }`}
    >
      {imageSrc && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={imageSrc}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {displayLocation && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-xs font-medium text-white/90">
              <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{displayLocation}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h4 className="text-base font-bold text-gray-900 transition-colors group-hover:text-emerald-700 line-clamp-1">
            {displayTitle}
          </h4>
          {loc.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {loc.description}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            {formattedPrice ? (
              <>
                <span className="text-[10px] uppercase font-semibold text-gray-400">
                  Precio
                </span>
                <p className="text-base font-extrabold text-emerald-700">
                  {formattedPrice}{" "}
                  <span className="text-[10px] font-normal text-gray-500">
                    / mes
                  </span>
                </p>
              </>
            ) : (
              <span className="text-xs font-semibold text-emerald-600">
                Ver detalles
              </span>
            )}
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}