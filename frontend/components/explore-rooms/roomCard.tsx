
import type { Room } from "../../app/data/mock/rooms";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Imagen */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={room.image}
          alt={room.imageAlt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Disponibilidad */}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
          Disponible
        </span>

        {/* Favorito */}
        <button
          type="button"
          aria-label={`Agregar ${room.title} a favoritos`}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-lg text-gray-600 shadow-sm transition hover:bg-green-700 hover:text-white"
        >
          ♡
        </button>
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Ubicación */}
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
          {room.city} · {room.neighborhood}
        </p>

        {/* Título */}
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-6 text-gray-900">
          {room.title}
        </h3>

        {/* Características */}
        <div className="mt-4 flex flex-wrap gap-2">
          {room.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Precio */}
        <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-500">Desde</p>
            <p className="text-lg font-bold text-gray-900">
              ${room.price.toLocaleString("es-CO")}
              <span className="ml-1 text-xs font-normal text-gray-500">
                / mes
              </span>
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            Ver habitación →
          </button>
        </div>
      </div>
    </article>
  );
}
