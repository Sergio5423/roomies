
interface RoomFiltersProps {
  city: string;
  roomType: string;
  maxPrice: string;
  sortBy: string;
  onCityChange: (value: string) => void;
  onRoomTypeChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function RoomFilters({
  city,
  roomType,
  maxPrice,
  sortBy,
  onCityChange,
  onRoomTypeChange,
  onMaxPriceChange,
  onSortChange,
}: RoomFiltersProps) {
  return (
    <div className="border-y border-gray-200 py-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Ciudad */}
        <div>
          <label
            htmlFor="city"
            className="mb-1.5 block text-xs font-semibold text-gray-700"
          >
            Ciudad
          </label>

          <select
            id="city"
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="">Todas las ciudades</option>
            <option value="Valledupar">Valledupar</option>
            <option value="Medellín">Medellín</option>
            <option value="Bogotá">Bogotá</option>
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label
            htmlFor="roomType"
            className="mb-1.5 block text-xs font-semibold text-gray-700"
          >
            Tipo
          </label>

          <select
            id="roomType"
            value={roomType}
            onChange={(event) => onRoomTypeChange(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="">Todos los tipos</option>
            <option value="Privada">Privada</option>
            <option value="Compartida">Compartida</option>
          </select>
        </div>

        {/* Precio */}
        <div>
          <label
            htmlFor="maxPrice"
            className="mb-1.5 block text-xs font-semibold text-gray-700"
          >
            Presupuesto máximo
          </label>

          <select
            id="maxPrice"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="">Cualquier precio</option>
            <option value="500000">$500.000</option>
            <option value="700000">$700.000</option>
            <option value="900000">$900.000</option>
            <option value="1000000">$1.000.000</option>
          </select>
        </div>

        {/* Orden */}
        <div>
          <label
            htmlFor="sortBy"
            className="mb-1.5 block text-xs font-semibold text-gray-700"
          >
            Ordenar por
          </label>

          <select
            id="sortBy"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="recent">Más recientes</option>
            <option value="priceAsc">Menor precio</option>
            <option value="priceDesc">Mayor precio</option>
          </select>
        </div>
      </div>
    </div>
  );
}

