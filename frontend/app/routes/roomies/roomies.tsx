import { useEffect, useState } from "react";

import type { Roommate } from "../../../domain/roomies/Roommate";
import { MockRoommateRepository } from "../../../infrastructure/repositories/MockRoommateRepository";

import RoommateFilters from "../../../components/roomies/RoommateFilters";
import RoommateGrid from "../../../components/roomies/RoommateGrid";

const roommateRepository =
  new MockRoommateRepository();

export default function Roomies() {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [filteredRoommates, setFilteredRoommates] =
    useState<Roommate[]>([]);

  useEffect(() => {
    roommateRepository.getAll().then((data) => {
      setRoommates(data);
      setFilteredRoommates(data);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      
      {/* Encabezado */}
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Encuentra tu próximo roomie
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
            Personas con las que compartir
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-500">
            Conoce personas que buscan compartir alojamiento
            y encuentra alguien compatible con tu estilo de vida.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="mx-auto max-w-7xl px-6 pb-20">

        {/* Filtros */}
        <RoommateFilters
          roommates={roommates}
          onFilter={setFilteredRoommates}
        />

        {/* Resultado */}
        <div className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              {filteredRoommates.length}{" "}
              {filteredRoommates.length === 1
                ? "roomie encontrado"
                : "roomies encontrados"}
            </p>
          </div>

          <RoommateGrid
            roommates={filteredRoommates}
          />
        </div>
      </section>
    </main>
  );
}