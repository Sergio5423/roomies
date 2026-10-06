import { useLoaderData } from "react-router";
import { RoommateService, type Roommate } from "../../../src/application/services/roommate.service";

// 1. LOADER: Obtiene los perfiles antes de pintar la pantalla (SSR)
export async function loader(): Promise<Roommate[]> {
  return await RoommateService.obtenerTodos();
}

// 2. COMPONENTE PRINCIPAL
export default function RoommatesPage() {
  const roommates = useLoaderData<typeof loader>();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado */}
      <header className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Conecta con Roomies
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Encuentra personas increíbles con quienes compartir gastos y crear un hogar.
        </p>
      </header>

      {/* Lista de Roommates */}
      {roommates.length === 0 ? (
        <section className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 mt-2">No hay perfiles de roomies disponibles en este momento.</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roommates.map((roomie) => (
            <RoommateCard key={roomie.id} profile={roomie} />
          ))}
        </section>
      )}
    </main>
  );
}

// 3. SUBCOMPONENTE: Tarjeta de Perfil (Podrías mover esto a src/components/cards luego)
function RoommateCard({ profile }: { profile: Roommate }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar Placeholder (Círculo con la inicial) */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl flex-shrink-0">
          {profile.nombre.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{profile.nombre}, {profile.edad}</h3>
          <p className="text-sm text-gray-500">{profile.ocupacion}</p>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-6 flex-grow italic">
        "{profile.descripcion}"
      </p>
      
      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Presupuesto</p>
          <p className="font-bold text-gray-900">Hasta ${profile.presupuestoMax}</p>
        </div>
        <button className="text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 px-4 py-2 rounded-lg transition-colors">
          Contactar
        </button>
      </div>
    </article>
  );
}