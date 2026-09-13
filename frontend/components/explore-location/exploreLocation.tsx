
import { useMemo, useState } from "react";

import {
  locations,
  type LocationType,
} from "../../app/data/mock/locations";

import LocationFilters from "../../components/explore-location/locationFilters";
import LocationMap from "../../components/explore-location/locationMap";
import LocationCard from "../../components/explore-location/locationCard";

export default function ExploreLocation() {
  const [activeType, setActiveType] = useState<
    LocationType | "all"
  >("all");

  const filteredLocations = useMemo(() => {
    if (activeType === "all") {
      return locations;
    }

    return locations.filter(
      (location) => location.type === activeType,
    );
  }, [activeType]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      {/* Encabezado */}
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
          EXPLORA CERCA DE TI
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Encuentra por tu ubicación
        </h2>

        <p className="mt-3 text-base leading-7 text-gray-600">
          Descubre habitaciones, posibles roommates y publicaciones
          disponibles en diferentes zonas.
        </p>
      </div>

      {/* Filtros */}
      <div className="mt-7">
        <LocationFilters
          activeType={activeType}
          onTypeChange={setActiveType}
        />
      </div>

      {/* Mapa */}
      <div className="mt-6">
        <LocationMap locations={filteredLocations} />
      </div>

      {/* Resultados */}
      <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredLocations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
          />
        ))}
      </div>

      {/* Estado sin resultados */}
      {filteredLocations.length === 0 && (
        <div className="mt-7 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="font-medium text-gray-900">
            No encontramos resultados.
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Prueba seleccionando otra categoría.
          </p>
        </div>
      )}
    </section>
  );
}

