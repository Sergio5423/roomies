import type { Alojamiento } from "../../domain/models/Alojamiento";

interface RoomCardProps {
  room: Alojamiento;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="h-48 bg-gray-200 relative">
        {/* Etiqueta de tipo */}
        <span className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">
          {room.tipo}
        </span>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{room.titulo}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{room.descripcion}</p>
        
        <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Precio / Mes</p>
            <p className="font-bold text-xl text-green-600">${room.precio}</p>
          </div>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Ver más
          </button>
        </div>
      </div>
    </article>
  );
}