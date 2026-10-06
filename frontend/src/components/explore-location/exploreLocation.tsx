import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, SearchX } from "lucide-react";

import {
  locations,
  type LocationType,
} from "../../../app/data/mock/locations";

import LocationFilters from "../../components/explore-location/locationFilters";
import LocationMap from "../../components/explore-location/locationMap";
import LocationCard from "../../components/explore-location/locationCard";

export default function ExploreLocation() {
  const [activeType, setActiveType] = useState<LocationType | "all">("all");
  const [activeLocationId, setActiveLocationId] = useState<string | number | null>(null);

  const filteredLocations = useMemo(() => {
    if (activeType === "all") {
      return locations;
    }

    return locations.filter((location) => location.type === activeType);
  }, [activeType]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* ENCABEZADO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-800">
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          EXPLORA CERCA DE TI
        </span>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Encuentra por tu ubicación
        </h2>

        <p className="mt-3 text-base text-gray-600">
          Descubre habitaciones, posibles roommates y publicaciones disponibles en diferentes zonas.
        </p>
      </motion.div>

      {/* FILTROS */}
      <div className="mt-8 flex justify-center">
        <LocationFilters
          activeType={activeType}
          onTypeChange={setActiveType}
        />
      </div>

      {/* MAPA INTERACTIVO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-8 overflow-hidden rounded-2xl border border-gray-200/80 shadow-md"
      >
        <LocationMap
          locations={filteredLocations}
          activeLocationId={activeLocationId}
        />
      </motion.div>

      {/* GRILLA DE RESULTADOS CON ANIMACIÓN LAYOUT */}
      <motion.div
        layout
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              isHovered={activeLocationId === location.id}
              onHover={setActiveLocationId}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ESTADO SIN RESULTADOS */}
      {filteredLocations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center"
        >
          <SearchX className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-3 text-base font-semibold text-gray-900">
            No encontramos resultados.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Prueba seleccionando otra categoría o limpiando los filtros.
          </p>
        </motion.div>
      )}
    </section>
  );
}