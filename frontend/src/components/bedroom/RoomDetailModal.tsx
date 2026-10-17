import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Bed,
  Maximize2,
  Users,
  Armchair,
  UserCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  Share2,
  Sparkles,
  Calendar,
  AlertCircle,
  Copy,
  Edit3,
  RefreshCw,
  Building,
} from 'lucide-react';
import type { Alojamiento, LandlordProfileDTO } from '../../domain/models/Alojamiento';
import { UserService } from '../../application/services/user.service';

interface RoomDetailModalProps {
  room: Alojamiento | null;
  isOpen: boolean;
  onClose: () => void;
  isArrendatario?: boolean;
  isOwner?: boolean;
  onEdit?: (room: Alojamiento) => void;
  onDuplicate?: (room: Alojamiento) => void;
  onChangeStatus?: (room: Alojamiento, nuevoEstado: string) => Promise<void>;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';

export default function RoomDetailModal({
  room,
  isOpen,
  onClose,
  isArrendatario = false,
  isOwner = false,
  onEdit,
  onDuplicate,
  onChangeStatus,
  onShowToast,
}: RoomDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [landlord, setLandlord] = useState<LandlordProfileDTO | null>(null);
  const [loadingLandlord, setLoadingLandlord] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  useEffect(() => {
    if (!room || !isOpen) {
      setLandlord(null);
      setSelectedImageIndex(0);
      return;
    }

    // Intentar buscar el perfil del propietario asociado
    const landlordId = room.landlord_id || room.propietarioId;
    if (landlordId) {
      setLoadingLandlord(true);
      UserService.obtenerPorId(landlordId)
        .then((data) => {
          if (data) setLandlord(data);
        })
        .finally(() => setLoadingLandlord(false));
    }
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

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

  // Extraer tipo
  const tipoNombre =
    typeof room.tipoAlojamiento === 'object' && room.tipoAlojamiento !== null
      ? room.tipoAlojamiento.nombre || 'Apartamento'
      : (room.tipoAlojamiento as string) || room.tipo || 'Apartamento';

  // Características
  const carac = room.caracteristicas || room.caracteristica || {
    numeroCuartos: 1,
    metrosCuadrados: 30,
    capacidad: 1,
    amoblado: false,
    buscandoRoomie: false,
  };

  // Reglas
  const reglasRaw = room.reglas || [];
  const reglasList: string[] = reglasRaw.map((r: any) =>
    typeof r === 'string' ? r : r.descripcion || String(r)
  );

  const isDisponible = (room.estado || 'disponible').toLowerCase() === 'disponible';
  const images = room.imagenes && room.imagenes.length > 0 ? room.imagenes : [DEFAULT_IMAGE];

  const handleToggleStatus = async () => {
    if (!onChangeStatus || togglingStatus) return;
    setTogglingStatus(true);
    try {
      const nuevoEstado = isDisponible ? 'ocupado' : 'disponible';
      await onChangeStatus(room, nuevoEstado);
      onShowToast(
        'success',
        'Estado actualizado',
        `El alojamiento ahora está marcado como ${nuevoEstado}.`
      );
    } catch (err: any) {
      onShowToast('error', 'Error al cambiar estado', err.message);
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('info', 'Enlace copiado', 'Puedes compartir este alojamiento con tus amigos.');
    }
  };

  // Datos de contacto para WhatsApp
  const phone = landlord?.telefono || landlord?.phone || '3001234567';
  const landlordName = landlord
    ? `${landlord.first_name || ''} ${landlord.last_name || ''}`.trim() || 'Propietario Verificado'
    : 'Carlos Gómez (Propietario)';
  const whatsappUrl = `https://wa.me/57${phone.replace(
    /\D/g,
    ''
  )}?text=${encodeURIComponent(
    `Hola ${landlordName}, vi tu publicación "${room.titulo}" en Roomies y me gustaría recibir más información.`
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <Building className="h-3.5 w-3.5" />
                {tipoNombre}
              </span>

              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  isDisponible ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full bg-white ${isDisponible ? 'animate-pulse' : ''}`} />
                {isDisponible ? 'Disponible para alquilar' : 'Actualmente Ocupado'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                title="Compartir enlace"
              >
                <Share2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                title="Cerrar ventana"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* 1. GALERÍA DE IMÁGENES */}
            <div>
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                <img
                  src={images[selectedImageIndex] || DEFAULT_IMAGE}
                  alt={room.titulo}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                  }}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-xl">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                    {room.ubicacion?.direccion || 'Calle 16 # 12-30'} •{' '}
                    {room.ubicacion?.barrio ? `${room.ubicacion.barrio}, ` : ''}
                    {room.ubicacion?.ciudad || 'Valledupar'}
                  </span>
                  <span className="font-semibold text-emerald-300">
                    {room.ubicacion?.distancia || 'Cerca al campus'}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-16 w-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                        selectedImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. TÍTULO, PRECIO Y DESCRIPCIÓN */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {room.titulo}
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <span>
                    Publicado el{' '}
                    {room.fechaPublicacion
                      ? new Date(room.fechaPublicacion).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'recientemente'}
                  </span>
                </div>
              </div>

              <div className="sm:text-right shrink-0 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block">
                  Canon de Arrendamiento
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {formattedPrice}
                </span>
                <span className="text-xs text-gray-500 block">COP / mes</span>
              </div>
            </div>

            {/* 3. DESCRIPCIÓN DETALLADA */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                Acerca de este espacio
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {room.descripcion}
              </p>
            </div>

            {/* 4. CARACTERÍSTICAS Y COMODIDADES */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                Características del inmueble
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Bed className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block">Habitaciones</span>
                    <span className="text-sm font-bold text-gray-900">
                      {carac.numeroCuartos} {carac.numeroCuartos === 1 ? 'Cuarto' : 'Cuartos'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Maximize2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block">Área</span>
                    <span className="text-sm font-bold text-gray-900">
                      {carac.metrosCuadrados || 30} m²
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block">Capacidad</span>
                    <span className="text-sm font-bold text-gray-900">
                      {carac.capacidad || 1} {carac.capacidad === 1 ? 'Persona' : 'Personas'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Armchair className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block">Amoblado</span>
                    <span className="text-sm font-bold text-gray-900">
                      {carac.amoblado ? 'Sí, incluye muebles' : 'No amoblado'}
                    </span>
                  </div>
                </div>
              </div>

              {carac.buscandoRoomie && (
                <div className="mt-3 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-indigo-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-indigo-900">
                      ¡Buscando Roomie para compartir gastos!
                    </p>
                    <p className="text-[11px] text-indigo-700 mt-0.5">
                      Este espacio está abierto para compartir habitación o vivienda entre estudiantes.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 5. REGLAS DE CONVIVENCIA */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                Reglas de convivencia
              </h3>

              {reglasList.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  No se especificaron reglas adicionales. Aplican normas estándar de convivencia.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {reglasList.map((regla, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-gray-100 text-xs text-gray-800"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{regla}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. TARJETA DE CONTACTO DEL PROPIETARIO */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-50 via-emerald-50/30 to-gray-50 border border-emerald-100/80">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {landlordName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-gray-900">{landlordName}</h4>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3 w-3" />
                        Verificado
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Propietario en Roomies • Respuesta en menos de 2 horas
                    </p>
                    {landlord?.email && (
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {landlord.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botones de acción directa */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-sm hover:scale-[1.02]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>

                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition"
                  >
                    <Phone className="h-4 w-4" />
                    Llamar
                  </a>
                </div>
              </div>
            </div>

            {/* 7. BARRA DE GESTIÓN (SI ES ARRENDATARIO) */}
            {isArrendatario && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="text-xs">
                  <span className={`font-bold block ${isOwner ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isOwner
                      ? 'Tu Publicación • Acciones de Propietario'
                      : 'Alojamiento de Otro Propietario (Modo Lectura)'}
                  </span>
                  <span className="text-slate-300">
                    {isOwner
                      ? 'Como publicaste este alojamiento, tienes autorización para editarlo o cambiar su disponibilidad.'
                      : 'Solo el arrendatario que publicó este alojamiento tiene permisos para modificarlo.'}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {isOwner && (
                    <>
                      <button
                        type="button"
                        onClick={handleToggleStatus}
                        disabled={togglingStatus}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          isDisponible
                            ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        }`}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${togglingStatus ? 'animate-spin' : ''}`} />
                        {isDisponible ? 'Marcar Ocupado' : 'Marcar Disponible'}
                      </button>

                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onEdit(room);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Editar
                        </button>
                      )}
                    </>
                  )}

                  {onDuplicate && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onDuplicate(room);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition"
                      title="Duplicar como plantilla para crear una nueva publicación"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Duplicar como plantilla
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
