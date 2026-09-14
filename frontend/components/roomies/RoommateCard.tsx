import { Link } from "react-router";
import type { Roommate } from "../../domain/roomies/Roommate";

interface RoommateCardProps {
  roommate: Roommate;
}

export default function RoommateCard({
  roommate,
}: RoommateCardProps) {
  const habitacionesInteresadas =
    roommate.habitacionesInteresadasIds?.length ?? 0;

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">

      {/* Imagen */}
      <div className="relative h-72 overflow-hidden bg-slate-100">

        <img
          src={roommate.imagen}
          alt={roommate.nombre}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* Degradado */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

        {/* Disponibilidad */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-2 rounded-full border border-white/70 px-3.5 py-2 text-xs font-semibold shadow-sm backdrop-blur ${
              roommate.disponible
                ? "bg-white/90 text-emerald-700"
                : "bg-white/90 text-slate-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                roommate.disponible
                  ? "bg-emerald-500"
                  : "bg-slate-400"
              }`}
            />

            {roommate.disponible
              ? "Disponible"
              : "No disponible"}
          </span>
        </div>

        {/* Habitaciones de interés */}
        {habitacionesInteresadas > 0 && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
              <span className="text-sm">♡</span>

              {habitacionesInteresadas}{" "}
              {habitacionesInteresadas === 1
                ? "habitación de interés"
                : "habitaciones de interés"}
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">

        {/* Nombre y ubicación */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {roommate.nombre}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {roommate.edad} años · 📍 {roommate.ciudad}
          </p>
        </div>

        {/* Descripción */}
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
          {roommate.descripcion}
        </p>

        {/* Intereses personales */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
            Intereses
          </p>

          <div className="flex flex-wrap gap-2">
            {roommate.intereses.slice(0, 3).map((interes) => (
              <span
                key={interes}
                className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
              >
                {interes}
              </span>
            ))}
          </div>
        </div>

        {/* Presupuesto */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-[#F7F5F0] p-4">

          <p className="text-xs font-medium text-slate-400">
            Presupuesto máximo
          </p>

          <p className="mt-1 text-xl font-bold text-emerald-700">
            ${roommate.presupuestoMaximo.toLocaleString("es-CO")}

            <span className="ml-1 text-xs font-medium text-slate-400">
              COP / mes
            </span>
          </p>
        </div>

        {/* Información de convivencia */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm shadow-sm">
            🏠
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-800">
              Busca compartir alojamiento
            </p>

            <p className="mt-0.5 text-xs text-blue-600">
              Conoce su perfil y preferencias
            </p>
          </div>
        </div>

        {/* Acción */}
        <Link
          to={`/roomies/${roommate.id}`}
          className="mt-5 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3.5 font-semibold text-white transition duration-300 hover:bg-emerald-700"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}