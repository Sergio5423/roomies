import type { Roommate } from "../../domain/roomies/Roommate";
import RoommateCard from "./RoommateCard";

interface RoommateGridProps {
  roommates: Roommate[];
}

export default function RoommateGrid({
  roommates,
}: RoommateGridProps) {
  if (roommates.length === 0) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl">
          🏠
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-800">
          No encontramos roomies
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          No hay perfiles que coincidan con los filtros
          seleccionados. Intenta ajustar tus criterios de búsqueda.
        </p>

      </section>
    );
  }

  return (
    <section>
      {/* Encabezado */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Comunidad ROOMIES
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Personas que buscan compartir
          </h2>
        </div>

        <p className="text-sm text-slate-500">
          {roommates.length}{" "}
          {roommates.length === 1
            ? "perfil encontrado"
            : "perfiles encontrados"}
        </p>
      </div>

      {/* Tarjetas */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roommates.map((roommate) => (
          <RoommateCard
            key={roommate.id}
            roommate={roommate}
          />
        ))}
      </div>
    </section>
  );
}