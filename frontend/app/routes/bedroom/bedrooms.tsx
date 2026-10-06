import { useLoaderData } from "react-router";
import { AlojamientoService } from "../../../src/application/services/alojamiento.service";
import RoomCard from "../../../src/components/cards/RoomCard";
import type { Alojamiento } from "../../../src/domain/models/Alojamiento";

// 1. LOADER (Mejor práctica SSR): Pide los datos en el servidor antes de mostrar la página.
// Esto mejora el SEO y evita los "parpadeos" de carga en el cliente.
export async function loader(): Promise<Alojamiento[]> {
  try {
    return await AlojamientoService.obtenerTodos();
  } catch (error) {
    console.error("Error al cargar los alojamientos:", error);
    // Si el backend falla, retornamos un array vacío para no romper la interfaz de usuario
    return [];
  }
}

// 2. COMPONENTE VISUAL (Clean Code): Solo se encarga de renderizar la UI con los datos que recibe.
export default function BedroomsPage() {
  // Consumimos los datos que el loader resolvió
  const alojamientos = useLoaderData<typeof loader>();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado de la página */}
      <header className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Alojamientos Disponibles
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Encuentra tu próximo hogar o el roomie ideal para compartir gastos.
        </p>
      </header>

      {/* Renderizado condicional basado en si hay datos */}
      {alojamientos.length === 0 ? (
        <section className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900">No hay alojamientos aún</h2>
          <p className="text-gray-500 mt-2">Vuelve más tarde para ver nuevas publicaciones.</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {alojamientos.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </section>
      )}
    </main>
  );
}