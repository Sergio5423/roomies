
import { useEffect, useState } from "react";

import type { Accommodation } from "../../../domain/habitaciones/Accommodation";
import { MockAccommodationRepository } from "../../../infrastructure/repositories/MockAccommodationRepository";

import RoomFilters from "../../../components/habitaciones/RoomFilters";
import RoomGrid from "../../../components/habitaciones/RoomGrid";

const accommodationRepository =
  new MockAccommodationRepository();

export default function Habitaciones() {
  const [accommodations, setAccommodations] =
    useState<Accommodation[]>([]);

  const [filteredAccommodations, setFilteredAccommodations] =
    useState<Accommodation[]>([]);

  useEffect(() => {
    accommodationRepository
      .getAll()
      .then((data) => {
        setAccommodations(data);
        setFilteredAccommodations(data);
      });
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Encuentra tu habitación
        </h1>

        <p className="mt-2 text-gray-600">
          Explora habitaciones disponibles y encuentra el
          espacio ideal para ti.
        </p>
      </div>

      <RoomFilters
        accommodations={accommodations}
        onFilter={setFilteredAccommodations}
      />

      <div className="mb-5 mt-8">
        <p className="text-sm font-medium text-gray-500">
          {filteredAccommodations.length}{" "}
          {filteredAccommodations.length === 1
            ? "habitación encontrada"
            : "habitaciones encontradas"}
        </p>
      </div>

      <RoomGrid
        accommodations={filteredAccommodations}
      />
    </main>
  );
}

