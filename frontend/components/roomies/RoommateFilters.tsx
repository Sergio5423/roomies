import type { Roommate } from "../../domain/roomies/Roommate";

interface RoommateFiltersProps {
  roommates: Roommate[];
  onFilter: (filteredRoommates: Roommate[]) => void;
}

export default function RoommateFilters({
  roommates,
  onFilter,
}: RoommateFiltersProps) {
  const cities = [
    "Todas",
    ...Array.from(
      new Set(roommates.map((roommate) => roommate.ciudad))
    ),
  ];

  const handleFilter = (
    ciudad: string,
    presupuesto: string,
    disponible: string
  ) => {
    const filtered = roommates.filter((roommate) => {
      const matchesCity =
        ciudad === "Todas" ||
        roommate.ciudad === ciudad;

      const matchesBudget =
        presupuesto === "Todos" ||
        roommate.presupuestoMaximo <= Number(presupuesto);

      const matchesAvailability =
        disponible === "Todos" ||
        roommate.disponible ===
          (disponible === "Disponible");

      return (
        matchesCity &&
        matchesBudget &&
        matchesAvailability
      );
    });

    onFilter(filtered);
  };

  const handleChange = () => {
    const ciudad = (
      document.getElementById(
        "roommate-city"
      ) as HTMLSelectElement
    ).value;

    const presupuesto = (
      document.getElementById(
        "roommate-budget"
      ) as HTMLSelectElement
    ).value;

    const disponible = (
      document.getElementById(
        "roommate-availability"
      ) as HTMLSelectElement
    ).value;

    handleFilter(
      ciudad,
      presupuesto,
      disponible
    );
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">

      {/* Encabezado */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          Encuentra tu match
        </p>

        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Filtrar roomies
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Ajusta los criterios para encontrar personas compatibles.
        </p>
      </div>

      {/* Filtros */}
      <div className="grid gap-5 md:grid-cols-3">

        {/* Ciudad */}
        <div>
          <label
            htmlFor="roommate-city"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Ciudad
          </label>

          <select
            id="roommate-city"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Presupuesto */}
        <div>
          <label
            htmlFor="roommate-budget"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Presupuesto máximo
          </label>

          <select
            id="roommate-budget"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
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

        {/* Disponibilidad */}
        <div>
          <label
            htmlFor="roommate-availability"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Disponibilidad
          </label>

          <select
            id="roommate-availability"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="Todos">
              Todos
            </option>

            <option value="Disponible">
              Disponible
            </option>

            <option value="No disponible">
              No disponible
            </option>
          </select>
        </div>
      </div>

      {/* Indicador inferior */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          🔎
        </div>

        <p className="text-xs leading-5 text-blue-700">
          Combina ciudad, presupuesto y disponibilidad para
          encontrar perfiles que se ajusten a tu búsqueda.
        </p>
      </div>
    </section>
  );
}