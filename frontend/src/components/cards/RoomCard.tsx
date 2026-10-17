import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Bed,
  Maximize2,
  Users,
  Armchair,
  UserCheck,
  Check,
  XCircle,
  Copy,
  Edit3,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import type { Alojamiento } from '../../domain/models/Alojamiento';

interface RoomCardProps {
  room: Alojamiento;
  isArrendatario?: boolean;
  isOwner?: boolean;
  viewMode?: 'grid' | 'list';
  onSelect: (room: Alojamiento) => void;
  onEdit?: (room: Alojamiento) => void;
  onDuplicate?: (room: Alojamiento) => void;
  onChangeStatus?: (room: Alojamiento, nuevoEstado: string) => Promise<void>;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';

export default function RoomCard({
  room,
  isArrendatario = false,
  isOwner = false,
  viewMode = 'grid',
  onSelect,
  onEdit,
  onDuplicate,
  onChangeStatus,
}: RoomCardProps) {
  const [changingStatus, setChangingStatus] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    room.imagenes && room.imagenes.length > 0 && room.imagenes[0].startsWith('http')
      ? room.imagenes[0]
      : DEFAULT_IMAGE
  );

  // Extraer precio
  const precioMensual =
    typeof room.precio === 'object' && room.precio !== null
      ? room.precio.precioMensual || (room.precio as any).monto || 0
      : Number(room.precio ?? 0);

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precioMensual);

  // Extraer tipo de alojamiento
  const tipoNombre =
    typeof room.tipoAlojamiento === 'object' && room.tipoAlojamiento !== null
      ? room.tipoAlojamiento.nombre || 'Apartamento'
      : (room.tipoAlojamiento as string) || room.tipo || 'Alojamiento';

  // Características
  const carac = room.caracteristicas || room.caracteristica || {
    numeroCuartos: 1,
    metrosCuadrados: 30,
    capacidad: 1,
    amoblado: false,
    buscandoRoomie: false,
  };

  const isDisponible = (room.estado || 'disponible').toLowerCase() === 'disponible';

  // Handler rápido para cambiar estado
  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onChangeStatus || changingStatus) return;

    setChangingStatus(true);
    try {
      const nuevoEstado = isDisponible ? 'ocupado' : 'disponible';
      await onChangeStatus(room, nuevoEstado);
    } finally {
      setChangingStatus(false);
    }
  };

  // VISTA LISTA HORIZONTAL
  if (viewMode === 'list') {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        whileHover={{ y: -2 }}
        onClick={() => onSelect(room)}
        className="group cursor-pointer bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row gap-5 p-4"
      >
        {/* Imagen lateral */}
        <div className="relative md:w-64 h-48 md:h-auto rounded-xl overflow-hidden bg-gray-100 shrink-0">
          <img
            src={imgSrc}
            alt={room.titulo}
            onError={() => setImgSrc(DEFAULT_IMAGE)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm backdrop-blur-md">
            {tipoNombre}
          </span>
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 ${
              isDisponible ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full bg-white ${isDisponible ? 'animate-pulse' : ''}`} />
            {isDisponible ? 'Disponible' : 'Ocupado'}
          </span>

          {isOwner && (
            <span className="absolute bottom-3 left-3 bg-indigo-600/95 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Tu publicación
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {room.titulo}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {room.ubicacion?.barrio ? `${room.ubicacion.barrio}, ` : ''}
                    {room.ubicacion?.ciudad || 'Valledupar'}
                    {room.ubicacion?.distancia ? ` • ${room.ubicacion.distancia}` : ''}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 font-medium">Precio / Mes</span>
                <p className="text-xl font-extrabold text-emerald-600 leading-tight">
                  {formattedPrice}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mt-2 line-clamp-2">{room.descripcion}</p>

            {/* Chips de características */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-700">
                <Bed className="h-3.5 w-3.5 text-emerald-600" />
                {carac.numeroCuartos} {carac.numeroCuartos === 1 ? 'Cuarto' : 'Cuartos'}
              </span>

              {carac.metrosCuadrados > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-700">
                  <Maximize2 className="h-3 w-3 text-emerald-600" />
                  {carac.metrosCuadrados} m²
                </span>
              )}

              {carac.capacidad && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-700">
                  <Users className="h-3.5 w-3.5 text-emerald-600" />
                  Cap. {carac.capacidad}
                </span>
              )}

              {carac.amoblado && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-xs font-medium text-teal-700 border border-teal-200">
                  <Armchair className="h-3.5 w-3.5" />
                  Amoblado
                </span>
              )}

              {carac.buscandoRoomie && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-xs font-medium text-indigo-700 border border-indigo-200">
                  <UserCheck className="h-3.5 w-3.5" />
                  Busca Roomie
                </span>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {isOwner && (
                <>
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    disabled={changingStatus}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isDisponible
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    <RefreshCw className={`h-3 w-3 ${changingStatus ? 'animate-spin' : ''}`} />
                    {isDisponible ? 'Marcar Ocupado' : 'Marcar Disponible'}
                  </button>

                  {onEdit && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(room);
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                      title="Editar mi Alojamiento"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}

              {isArrendatario && !isOwner && (
                <span className="text-xs text-gray-400 italic">Solo lectura (publicado por otro propietario)</span>
              )}

              {isArrendatario && onDuplicate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(room);
                  }}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                  title="Duplicar como plantilla"
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onSelect(room)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition shadow-sm"
            >
              <span>Ver Detalle</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  // VISTA GRID (CUADRÍCULA)
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelect(room)}
      className="group cursor-pointer relative bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col"
    >
      {/* IMAGEN Y BADGES */}
      <div className="h-52 bg-gray-100 relative overflow-hidden">
        <img
          src={imgSrc}
          alt={room.titulo}
          onError={() => setImgSrc(DEFAULT_IMAGE)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Tipo de propiedad */}
        <span className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm backdrop-blur-md">
          {tipoNombre}
        </span>

        {isOwner && (
          <span className="absolute top-11 left-3 bg-indigo-600/95 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" />
            Tu publicación
          </span>
        )}

        {/* Badge Estado */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 backdrop-blur-md ${
            isDisponible ? 'bg-emerald-600/90' : 'bg-rose-600/90'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full bg-white ${isDisponible ? 'animate-pulse' : ''}`} />
          {isDisponible ? 'Disponible' : 'Ocupado'}
        </span>

        {/* Ubicación sobre la imagen */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-xs font-medium text-white">
          <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">
            {room.ubicacion?.barrio ? `${room.ubicacion.barrio}, ` : ''}
            {room.ubicacion?.ciudad || 'Valledupar'}
            {room.ubicacion?.distancia ? ` • ${room.ubicacion.distancia}` : ''}
          </span>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {room.titulo}
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {room.descripcion}
          </p>

          {/* Chips de características resumidas */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-medium text-gray-700">
              <Bed className="h-3 w-3 text-emerald-600" />
              {carac.numeroCuartos} {carac.numeroCuartos === 1 ? 'Cuarto' : 'Cuartos'}
            </span>

            {carac.metrosCuadrados > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-medium text-gray-700">
                <Maximize2 className="h-2.5 w-2.5 text-emerald-600" />
                {carac.metrosCuadrados} m²
              </span>
            )}

            {carac.amoblado && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-[11px] font-semibold text-teal-700 border border-teal-200/60">
                Amoblado
              </span>
            )}

            {carac.buscandoRoomie && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-[11px] font-semibold text-indigo-700 border border-indigo-200/60">
                Busca Roomie
              </span>
            )}
          </div>
        </div>

        {/* TOOLBAR PARA ARRENDATARIO: Solo el propietario que publicó puede modificarlo */}
        {(isOwner || (isArrendatario && onDuplicate)) && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-3.5 pt-2.5 border-t border-dashed border-gray-200 flex items-center justify-between text-xs"
          >
            {isOwner ? (
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={changingStatus}
                className={`inline-flex items-center gap-1 font-bold transition px-2 py-1 rounded-md ${
                  isDisponible
                    ? 'text-amber-700 hover:bg-amber-50'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
                title="Alternar estado entre disponible y ocupado"
              >
                <RefreshCw className={`h-3 w-3 ${changingStatus ? 'animate-spin' : ''}`} />
                <span>{isDisponible ? 'Poner Ocupado' : 'Poner Disponible'}</span>
              </button>
            ) : (
              <span className="text-[11px] text-gray-400 italic">Publicado por otro propietario</span>
            )}

            <div className="flex items-center gap-1">
              {isOwner && onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(room)}
                  className="p-1 rounded-md text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                  title="Editar mi Alojamiento"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              )}

              {isArrendatario && onDuplicate && (
                <button
                  type="button"
                  onClick={() => onDuplicate(room)}
                  className="p-1 rounded-md text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                  title="Duplicar como plantilla"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* PIE DE TARJETA: PRECIO Y VER MÁS */}
        <div className="mt-3.5 pt-3 flex justify-between items-center border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Precio / Mes
            </p>
            <p className="font-extrabold text-lg text-emerald-600 leading-tight">
              {formattedPrice}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(room);
            }}
            className="inline-flex items-center gap-1 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-600 transition shadow-sm"
          >
            <span>Ver más</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}