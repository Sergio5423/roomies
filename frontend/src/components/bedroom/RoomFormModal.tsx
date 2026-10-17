import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Building,
  MapPin,
  Bed,
  Maximize2,
  Users,
  Armchair,
  DollarSign,
  FileText,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type {
  Alojamiento,
  CrearAlojamientoPayload,
  ActualizarAlojamientoPayload,
} from '../../domain/models/Alojamiento';

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate: (payload: CrearAlojamientoPayload) => Promise<void>;
  onSubmitUpdate: (id: string, payload: ActualizarAlojamientoPayload) => Promise<void>;
  editingRoom: Alojamiento | null;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const DEFAULT_IMAGE_SUGGESTIONS = [
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
];

export default function RoomFormModal({
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  editingRoom,
  onShowToast,
}: RoomFormModalProps) {
  const isEditing = !!editingRoom;

  // Form State
  const [titulo, setTitulo] = useState('');
  const [tipoAlojamiento, setTipoAlojamiento] = useState('Apartamento');
  const [descripcion, setDescripcion] = useState('');
  const [precioMensual, setPrecioMensual] = useState<number>(850000);

  // Ubicación
  const [direccion, setDireccion] = useState('Calle 16 # 12-30');
  const [ciudad, setCiudad] = useState('Valledupar');
  const [barrio, setBarrio] = useState('Centro');
  const [distancia, setDistancia] = useState('5 mins a la universidad');
  const [latitud, setLatitud] = useState(10.463);
  const [longitud, setLongitud] = useState(-73.253);

  // Características
  const [numeroCuartos, setNumeroCuartos] = useState(1);
  const [metrosCuadrados, setMetrosCuadrados] = useState(35);
  const [capacidad, setCapacidad] = useState(1);
  const [amoblado, setAmoblado] = useState(true);
  const [buscandoRoomie, setBuscandoRoomie] = useState(false);

  // Imágenes
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE_SUGGESTIONS[0]);

  // Reglas
  const [reglas, setReglas] = useState<string[]>(['No fumar en habitaciones', 'Cuidar el aseo común']);
  const [newReglaInput, setNewReglaInput] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // Pre-cargar datos si estamos editando
  useEffect(() => {
    if (editingRoom) {
      setTitulo(editingRoom.titulo || '');
      setDescripcion(editingRoom.descripcion || '');

      const tipo =
        typeof editingRoom.tipoAlojamiento === 'object' && editingRoom.tipoAlojamiento !== null
          ? editingRoom.tipoAlojamiento.nombre || 'Apartamento'
          : (editingRoom.tipoAlojamiento as string) || editingRoom.tipo || 'Apartamento';
      setTipoAlojamiento(tipo);

      const p =
        typeof editingRoom.precio === 'object' && editingRoom.precio !== null
          ? editingRoom.precio.precioMensual || 0
          : Number(editingRoom.precio ?? 0);
      setPrecioMensual(p);

      const u = editingRoom.ubicacion || {
        direccion: '',
        ciudad: 'Valledupar',
        barrio: 'Centro',
        distancia: '',
      };
      setDireccion(u.direccion || '');
      setCiudad(u.ciudad || 'Valledupar');
      setBarrio(u.barrio || '');
      setDistancia(u.distancia || '');
      setLatitud(u.latitud ?? 10.463);
      setLongitud(u.longitud ?? -73.253);

      const c = editingRoom.caracteristicas || editingRoom.caracteristica || {
        numeroCuartos: 1,
        metrosCuadrados: 30,
        capacidad: 1,
        amoblado: true,
        buscandoRoomie: false,
      };
      setNumeroCuartos(c.numeroCuartos ?? 1);
      setMetrosCuadrados(c.metrosCuadrados ?? 30);
      setCapacidad(c.capacidad ?? 1);
      setAmoblado(Boolean(c.amoblado));
      setBuscandoRoomie(Boolean(c.buscandoRoomie));

      if (editingRoom.imagenes && editingRoom.imagenes.length > 0) {
        setImageUrl(editingRoom.imagenes[0]);
      }

      if (editingRoom.reglas && Array.isArray(editingRoom.reglas)) {
        setReglas(
          editingRoom.reglas.map((r: any) =>
            typeof r === 'string' ? r : r.descripcion || String(r)
          )
        );
      }
    } else {
      // Defaults para nuevo
      setTitulo('');
      setDescripcion('');
      setTipoAlojamiento('Apartamento');
      setPrecioMensual(850000);
      setDireccion('Calle 16 # 12-30');
      setCiudad('Valledupar');
      setBarrio('Centro');
      setDistancia('5 mins a la universidad');
      setNumeroCuartos(1);
      setMetrosCuadrados(35);
      setCapacidad(1);
      setAmoblado(true);
      setBuscandoRoomie(false);
      setImageUrl(DEFAULT_IMAGE_SUGGESTIONS[0]);
      setReglas(['No fumar en habitaciones', 'Cuidar el aseo común']);
    }
  }, [editingRoom, isOpen]);

  if (!isOpen) return null;

  const handleAddRegla = () => {
    if (!newReglaInput.trim()) return;
    setReglas([...reglas, newReglaInput.trim()]);
    setNewReglaInput('');
  };

  const handleRemoveRegla = (index: number) => {
    setReglas(reglas.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !descripcion.trim() || precioMensual < 0) {
      onShowToast('error', 'Campos obligatorios', 'Por favor completa título, descripción y precio válido.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && editingRoom) {
        const payload: ActualizarAlojamientoPayload = {
          titulo,
          descripcion,
          tipoAlojamiento,
          imagenes: [imageUrl],
          ubicacion: {
            direccion,
            ciudad,
            barrio,
            distancia,
            latitud,
            longitud,
          },
          caracteristica: {
            numeroCuartos,
            metrosCuadrados,
            capacidad,
            amoblado,
            buscandoRoomie,
          },
          precio: {
            precioMensual,
          },
          reglas,
        };
        await onSubmitUpdate(editingRoom.id, payload);
        onShowToast('success', 'Alojamiento actualizado', 'Los cambios se guardaron exitosamente.');
      } else {
        const payload: CrearAlojamientoPayload = {
          titulo,
          descripcion,
          tipoAlojamiento,
          imagenes: [imageUrl],
          ubicacion: {
            direccion,
            ciudad,
            barrio,
            distancia,
            latitud,
            longitud,
          },
          caracteristica: {
            numeroCuartos,
            metrosCuadrados,
            capacidad,
            amoblado,
            buscandoRoomie,
          },
          precio: {
            precioMensual,
          },
          reglas,
        };
        await onSubmitCreate(payload);
        onShowToast('success', '¡Publicación exitosa!', 'Tu nuevo alojamiento ya está visible para los estudiantes.');
      }
      onClose();
    } catch (err: any) {
      onShowToast('error', 'Error al guardar', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-20">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Alojamiento' : 'Publicar Nuevo Alojamiento'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isEditing
                  ? 'Modifica los datos del inmueble y guárdalos en el servidor.'
                  : 'Ingresa los detalles de la habitación o apartamento para arrendar.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* SECCIÓN 1: DATOS BÁSICOS */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-emerald-600" />
                Información Principal
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Título del Anuncio *
                </label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Habitación Amoblada cerca a la Universidad"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tipo de Propiedad *
                  </label>
                  <select
                    value={tipoAlojamiento}
                    onChange={(e) => setTipoAlojamiento(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Pensionado">Pensionado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Precio Mensual (COP) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={precioMensual}
                      onChange={(e) => setPrecioMensual(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Descripción Detallada *
                </label>
                <textarea
                  required
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe las comodidades, ambiente estudiantil, servicios incluidos (agua, luz, wifi)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* SECCIÓN 2: UBICACIÓN */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Ubicación
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Calle 16 # 12-30"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Barrio
                  </label>
                  <input
                    type="text"
                    value={barrio}
                    onChange={(e) => setBarrio(e.target.value)}
                    placeholder="Centro, Novalito, etc."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Valledupar"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Distancia a la Universidad
                  </label>
                  <input
                    type="text"
                    value={distancia}
                    onChange={(e) => setDistancia(e.target.value)}
                    placeholder="5 mins caminando a la U"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: CARACTERÍSTICAS */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-emerald-600" />
                Características del Espacio
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Cuartos
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={numeroCuartos}
                    onChange={(e) => setNumeroCuartos(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={metrosCuadrados}
                    onChange={(e) => setMetrosCuadrados(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={capacidad}
                    onChange={(e) => setCapacidad(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={amoblado}
                    onChange={(e) => setAmoblado(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span>Amoblado (con cama, clóset, escritorio)</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={buscandoRoomie}
                    onChange={(e) => setBuscandoRoomie(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span>Buscando Roomie para compartir</span>
                </label>
              </div>
            </div>

            {/* SECCIÓN 4: IMAGEN Y FOTO PREVIA */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-emerald-600" />
                Fotografía Principal (URL)
              </h3>

              <div className="flex gap-4 items-center">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />

                <div className="h-14 w-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Quick image choices */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400">Fotos sugeridas:</span>
                {DEFAULT_IMAGE_SUGGESTIONS.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(img)}
                    className="text-[11px] text-emerald-700 underline hover:text-emerald-900"
                  >
                    Opción {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* SECCIÓN 5: REGLAS */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Reglas de Convivencia
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newReglaInput}
                  onChange={(e) => setNewReglaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRegla();
                    }
                  }}
                  placeholder="Escribe una regla y pulsa Agregar (ej: No fiestas entre semana)..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddRegla}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition"
                >
                  Agregar
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {reglas.map((regla, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-800"
                  >
                    <span>{regla}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRegla(idx)}
                      className="text-gray-400 hover:text-rose-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Guardando en el servidor...</span>
                  </>
                ) : (
                  <span>{isEditing ? 'Guardar Cambios' : 'Publicar Alojamiento'}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
