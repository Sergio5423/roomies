
import { useMemo, useState } from "react";
import { rooms } from "../../app/data/mock/rooms";
import RoomCard from "../../components/explore-rooms/roomCard";
import RoomFilters from "../../components/explore-rooms/roomFilters";

export default function ExploreRooms() {
  const [city, setCity] = useState("");
  const [roomType, setRoomType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const filteredRooms = useMemo(() => {
    const result = rooms.filter((room) => {
      const matchesCity = !city || room.city === city;

      const matchesType = !roomType || room.roomType === roomType;

      const matchesPrice =
        !maxPrice || room.price <= Number(maxPrice);

      return matchesCity && matchesType && matchesPrice;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "priceAsc") {
        return a.price - b.price;
      }

      if (sortBy === "priceDesc") {
        return b.price - a.price;
      }

      return b.id - a.id;
    });
  }, [city, roomType, maxPrice, sortBy]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      {/* Encabezado */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
            ENCUENTRA TU ESPACIO
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Descubre habitaciones
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Encuentra espacios que se adapten a tu presupuesto, ubicación
            y preferencias de convivencia.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          {filteredRooms.length}{" "}
          {filteredRooms.length === 1
            ? "habitación encontrada"
            : "habitaciones encontradas"}
        </p>
      </div>

      {/* Filtros */}
      <div className="mt-7">
        <RoomFilters
          city={city}
          roomType={roomType}
          maxPrice={maxPrice}
          sortBy={sortBy}
          onCityChange={setCity}
          onRoomTypeChange={setRoomType}
          onMaxPriceChange={setMaxPrice}
          onSortChange={setSortBy}
        />
      </div>

      {/* Habitaciones */}
      {filteredRooms.length > 0 ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl text-green-700">
            ⌂
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No encontramos habitaciones
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Prueba cambiando alguno de los filtros para encontrar más
            opciones disponibles.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 text-center">
        <button
          type="button"
          className="rounded-xl border border-green-700 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
        >
          Ver todas las habitaciones
        </button>
      </div>
    </section>
  );
}

