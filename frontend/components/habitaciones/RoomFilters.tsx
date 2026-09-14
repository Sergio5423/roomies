import type { Accommodation } from "../../domain/habitaciones/Accommodation";

interface RoomFiltersProps {
  accommodations: Accommodation[];
  onFilter: (filteredAccommodations: Accommodation[]) => void;
}

export default function RoomFilters({
  accommodations,
  onFilter,
}: RoomFiltersProps) {
  const cities = [
    "Todas",
    ...Array.from(
      new Set(
        accommodations.map(
          (accommodation) => accommodation.ciudad
        )
      )
    ),
  ];

  const handleFilter = (
    ciudad: string,
    precio: string,
    tipo: string,
    banioPrivado: string,
    buscandoRoomie: string,
    estado: string
  ) => {
    const filtered = accommodations.filter(
      (accommodation) => {
        const matchesCity =
          ciudad === "Todas" ||
          accommodation.ciudad === ciudad;

        const matchesPrice =
          precio === "Todos" ||
          accommodation.precioMensual <= Number(precio);

        const matchesType =
          tipo === "Todos" ||
          accommodation.tipoAlojamiento === tipo;

        const matchesBathroom =
          banioPrivado === "Todos" ||
          accommodation.banioPrivado ===
            (banioPrivado === "Sí");

        const matchesRoomie =
          buscandoRoomie === "Todos" ||
          accommodation.aceptaRoomie ===
            (buscandoRoomie === "Sí");

        const matchesStatus =
          estado === "Todos" ||
          accommodation.estado === estado;

        return (
          matchesCity &&
          matchesPrice &&
          matchesType &&
          matchesBathroom &&
          matchesRoomie &&
          matchesStatus
        );
      }
    );

    onFilter(filtered);
  };

  const handleChange = () => {
    const ciudad = (
      document.getElementById(
        "room-city"
      ) as HTMLSelectElement
    ).value;

    const precio = (
      document.getElementById(
        "room-price"
      ) as HTMLSelectElement
    ).value;

    const tipo = (
      document.getElementById(
        "room-type"
      ) as HTMLSelectElement
    ).value;

    const banioPrivado = (
      document.getElementById(
        "room-bathroom"
      ) as HTMLSelectElement
    ).value;

    const buscandoRoomie = (
      document.getElementById(
        "room-roomie"
      ) as HTMLSelectElement
    ).value;

    const estado = (
      document.getElementById(
        "room-status"
      ) as HTMLSelectElement
    ).value;

    handleFilter(
      ciudad,
      precio,
      tipo,
      banioPrivado,
      buscandoRoomie,
      estado
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label
            htmlFor="room-city"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Ciudad
          </label>

          <select
            id="room-city"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="room-price"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Precio máximo
          </label>

          <select
            id="room-price"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="Todos">Todos</option>
            <option value="700000">
              Hasta $700.000
            </option>
            <option value="800000">
              Hasta $800.000
            </option>
            <option value="900000">
              Hasta $900.000
            </option>
            <option value="1000000">
              Hasta $1.000.000
            </option>
            <option value="1200000">
              Hasta $1.200.000
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="room-type"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Tipo de alojamiento
          </label>

          <select
            id="room-type"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="Todos">Todos</option>
            <option value="Habitación privada">
              Habitación privada
            </option>
            <option value="Habitación compartida">
              Habitación compartida
            </option>
            <option value="Apartamento">
              Apartamento
            </option>
            <option value="Casa">Casa</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="room-bathroom"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Baño privado
          </label>

          <select
            id="room-bathroom"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="Todos">Todos</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="room-roomie"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Compartir con roomie
          </label>

          <select
            id="room-roomie"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="Todos">Todos</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="room-status"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Disponibilidad
          </label>

          <select
            id="room-status"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="Todos">Todos</option>
            <option value="Disponible">
              Disponible
            </option>
            <option value="No disponible">
              No disponible
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}