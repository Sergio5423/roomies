import { Link } from "react-router";
import type { Accommodation } from "../../domain/habitaciones/Accommodation";

interface RoomCardProps {
  accommodation: Accommodation;
}

export default function RoomCard({
  accommodation,
}: RoomCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">

      {/* Imagen */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={accommodation.imagenes[0]}
          alt={accommodation.titulo}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* Degradado */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

        {/* Estado */}
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Disponible
          </span>
        </div>

        {/* Valoración */}
        <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
          <span className="text-amber-400">★</span>{" "}
          {accommodation.puntuacionPromedio}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">

        {/* Precio */}
        <div>
          <span className="text-xl font-bold text-emerald-700">
            ${accommodation.precioMensual.toLocaleString("es-CO")}
          </span>

          <span className="ml-1 text-xs text-slate-400">
            COP / mes
          </span>
        </div>

        {/* Título */}
        <h2 className="mt-2 line-clamp-1 text-lg font-bold text-slate-800">
          {accommodation.titulo}
        </h2>

        {/* Ubicación */}
        <p className="mt-1 text-sm text-slate-500">
          📍 {accommodation.barrio}, {accommodation.ciudad}
        </p>

        {/* Descripción */}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
          {accommodation.descripcion}
        </p>

        {/* Servicios */}
        <div className="mt-4 flex flex-wrap gap-2">
          {accommodation.serviciosIncluidos
            .slice(0, 3)
            .map((servicio) => (
              <span
                key={servicio}
                className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
              >
                {servicio}
              </span>
            ))}
        </div>

        {/* Acción */}
        <Link
          to={`/habitaciones/${accommodation.ciudad.toLowerCase()}/${accommodation.slug}`}
          className="mt-5 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition duration-300 hover:bg-emerald-700"
        >
          Ver habitación
        </Link>
      </div>
    </article>
  );
}