import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Building2 } from "lucide-react";
import RoomCard, { type Room } from "./roomCard";

// Mock data de ejemplo
const MOCK_ROOMS: Room[] = [
  {
    id: 1,
    title: "Habitación Amoblada cerca a la Universidad",
    city: "Bogotá",
    neighborhood: "Chapinero",
    price: 850000,
    roomType: "Individual",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Habitación Amplia con Baño Privado",
    city: "Medellín",
    neighborhood: "El Poblado",
    price: 1200000,
    roomType: "Suite",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Espacio Luminoso con Balcón",
    city: "Cali",
    neighborhood: "Ciudad Jardín",
    price: 750000,
    roomType: "Individual",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Habitación Moderna en Zona Residencial",
    city: "Bogotá",
    neighborhood: "Usaquén",
    price: 950000,
    roomType: "Compartida",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
  },
];

const CITIES = ["Todas", "Bogotá", "Medellín", "Cali"];

export default function ExploreRooms() {
  const [selectedCity, setSelectedCity] = useState("Todas");

  const filteredRooms = selectedCity === "Todas"
    ? MOCK_ROOMS
    : MOCK_ROOMS.filter((room) => room.city === selectedCity);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-800">
            DISPONIBLES AHORA
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Habitaciones destacadas
          </h2>

          <p className="mt-2 text-base text-gray-600">
            Explora las mejores opciones con fotos reales y precios transparentes.
          </p>
        </div>

        {/* FILTROS POR CIUDAD CON ANIMACIÓN LAYOUT */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="h-4 w-4 text-gray-500 shrink-0 mr-1" />
          {CITIES.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isSelected ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="selectedCityPill"
                    className="absolute inset-0 rounded-xl bg-emerald-600"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{city}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GRILLA CON ANIMACIÓN EN TIEMPO REAL */}
      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredRooms.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center py-12 rounded-2xl border border-dashed border-gray-300"
        >
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-3 text-base font-medium text-gray-600">
            No se encontraron habitaciones en la ciudad seleccionada.
          </p>
        </motion.div>
      )}
    </section>
  );
}