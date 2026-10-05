import { motion } from "framer-motion";
import { MapPin, Bed, Check, Sparkles } from "lucide-react";

export interface Room {
  id: number;
  title: string;
  city: string;
  neighborhood: string;
  price: number;
  roomType: string;
  image: string;
  isAvailable?: boolean;
}

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  // Formato de moneda para Colombia (COP)
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(room.price);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5"
    >
      {/* IMAGEN Y BADGES */}
      <div className="relative h-60 w-full overflow-hidden bg-gray-100">
        <img
          src={room.image}
          alt={room.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* BADGE TIPO DE HABITACIÓN */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-md shadow-sm">
            <Bed className="h-3.5 w-3.5 text-emerald-600" />
            {room.roomType}
          </span>
        </div>

        {/* BADGE DISPONIBLE */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md shadow-sm">
            <Check className="h-3 w-3" />
            Disponible
          </span>
        </div>

        {/* UBICACIÓN SOBRE LA IMAGEN */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-xs font-medium text-white/90">
          <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{room.neighborhood}, {room.city}</span>
        </div>
      </div>

      {/* CONTENIDO DE LA TARJETA */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-emerald-700 line-clamp-1">
            {room.title}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Excelente ubicación con servicios incluidos y acceso a zonas comunes.
          </p>
        </div>

        {/* PRECIO Y BOTÓN */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <span className="text-xs text-gray-500">Desde</span>
            <p className="text-lg font-extrabold text-emerald-700">
              {formattedPrice} <span className="text-xs font-normal text-gray-500">/ mes</span>
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ver detalle
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}