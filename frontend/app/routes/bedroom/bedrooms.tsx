import { useState, useEffect, useMemo, useTransition } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Building,
  CheckCircle2,
  Users,
  DollarSign,
  Plus,
  SearchX,
  Sparkles,
  MapPin,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

import Navbar from '../../../src/components/navbar/navbar';
import Footer from '../../../src/components/footer/footer';
import RoomCard from '../../../src/components/cards/RoomCard';
import RoomFilters, { type FilterState } from '../../../src/components/bedroom/RoomFilters';
import AuthBanner from '../../../src/components/bedroom/AuthBanner';
import RoomDetailModal from '../../../src/components/bedroom/RoomDetailModal';
import RoomFormModal from '../../../src/components/bedroom/RoomFormModal';
import RoomMap from '../../../src/components/bedroom/RoomMap';
import ToastContainer, { type ToastMessage } from '../../../src/components/bedroom/Toast';

import { AlojamientoService } from '../../../src/application/services/alojamiento.service';
import { AuthStore, type StoredUser } from '../../../src/application/services/auth.store';
import type {
  Alojamiento,
  CrearAlojamientoPayload,
  ActualizarAlojamientoPayload,
} from '../../../src/domain/models/Alojamiento';

// 1. LOADER (SSR): Obtiene los alojamientos antes de renderizar
export async function loader(): Promise<Alojamiento[]> {
  try {
    const list = await AlojamientoService.obtenerTodos();
    return list;
  } catch (error) {
    console.error('Error al cargar alojamientos en loader:', error);
    return [];
  }
}

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  tipo: 'Todos',
  estado: 'Todos',
  precioPreset: 'all',
  soloAmoblado: false,
  soloRoomie: false,
  minCuartos: 0,
  sortBy: 'recent',
  viewMode: 'grid',
};

export default function BedroomsPage() {
  const initialAlojamientos = useLoaderData<typeof loader>();
  const [alojamientos, setAlojamientos] = useState<Alojamiento[]>(initialAlojamientos);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  // Filtros
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Modales
  const [selectedRoom, setSelectedRoom] = useState<Alojamiento | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Alojamiento | null>(null);

  // Notificaciones Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cargar usuario autenticado en cliente
  useEffect(() => {
    setCurrentUser(AuthStore.getUser());
    const unsubscribe = AuthStore.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Función para refrescar datos desde el backend
  const refreshAlojamientos = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const data = await AlojamientoService.obtenerTodos();
      if (Array.isArray(data)) {
        setAlojamientos(data);
      }
    } catch (err: any) {
      if (!silent) {
        addToast('error', 'Error al sincronizar datos', err.message);
      }
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  // Función para determinar si el usuario autenticado publicó este alojamiento específico
  const checkIsOwner = (room: Alojamiento | null): boolean => {
    if (!room || !currentUser || currentUser.role !== 'ARRENDATARIO') return false;
    const ownerId = room.landlord_id || room.propietarioId || (room as any).landlord?.id;
    return Boolean(ownerId && ownerId === currentUser.id);
  };

  // HANDLER: Cambiar estado (PATCH /api/alojamientos/:id/estado)
  const handleChangeStatus = async (room: Alojamiento, nuevoEstado: string) => {
    if (!AuthStore.isAuthenticated()) {
      addToast('error', 'Permiso denegado', 'Debes iniciar sesión como Arrendatario para cambiar el estado.');
      return;
    }

    if (!checkIsOwner(room)) {
      addToast(
        'error',
        'Acción no autorizada',
        'Solo puedes cambiar la disponibilidad de los alojamientos que tú publicaste.'
      );
      return;
    }

    try {
      // Actualización optimista en el estado local
      setAlojamientos((prev) =>
        prev.map((item) => (item.id === room.id ? { ...item, estado: nuevoEstado } : item))
      );
      if (selectedRoom && selectedRoom.id === room.id) {
        setSelectedRoom({ ...selectedRoom, estado: nuevoEstado });
      }

      // Llamada al backend
      await AlojamientoService.cambiarEstado(room.id, nuevoEstado);
      addToast(
        'success',
        'Estado modificado',
        `"${room.titulo}" ahora está marcado como ${nuevoEstado}.`
      );
      await refreshAlojamientos(true);
    } catch (err: any) {
      // Revertir si falló
      await refreshAlojamientos(true);
      addToast('error', 'No se pudo cambiar el estado', err.message);
      throw err;
    }
  };

  // HANDLER: Duplicar alojamiento (POST /api/alojamientos/:id/duplicar)
  const handleDuplicate = async (room: Alojamiento) => {
    if (!AuthStore.isAuthenticated()) {
      addToast('error', 'Permiso denegado', 'Inicia sesión como Arrendatario para duplicar publicaciones.');
      return;
    }

    try {
      addToast('info', 'Duplicando alojamiento...', 'Creando una copia en el servidor.');
      const duplicado = await AlojamientoService.duplicar(room.id, room);
      addToast(
        'success',
        'Alojamiento duplicado',
        `Se creó con éxito "${duplicado.titulo || `Copia de ${room.titulo}`} ready para arrendar.`
      );
      await refreshAlojamientos(true);
    } catch (err: any) {
      addToast('error', 'Error al duplicar', err.message);
    }
  };

  // HANDLER: Crear nuevo (POST /api/alojamientos)
  const handleCreateAlojamiento = async (payload: CrearAlojamientoPayload) => {
    const nuevo = await AlojamientoService.publicar(payload);
    setAlojamientos((prev) => [nuevo, ...prev]);
    await refreshAlojamientos(true);
  };

  // HANDLER: Actualizar (PUT /api/alojamientos/:id)
  const handleUpdateAlojamiento = async (id: string, payload: ActualizarAlojamientoPayload) => {
    const targetRoom = alojamientos.find((a) => a.id === id);
    if (targetRoom && !checkIsOwner(targetRoom)) {
      addToast(
        'error',
        'Acción denegada',
        'Solo puedes modificar los alojamientos que tú publicaste.'
      );
      return;
    }

    try {
      const actualizado = await AlojamientoService.actualizar(id, payload);
      setAlojamientos((prev) => prev.map((item) => (item.id === id ? { ...item, ...actualizado } : item)));
      if (selectedRoom && selectedRoom.id === id) {
        setSelectedRoom({ ...selectedRoom, ...actualizado });
      }
      await refreshAlojamientos(true);
    } catch (err: any) {
      addToast('error', 'No se pudo actualizar', err.message);
      throw err;
    }
  };

  // Estadísticas para las tarjetas superiores
  const stats = useMemo(() => {
    const total = alojamientos.length;
    const disponibles = alojamientos.filter(
      (a) => (a.estado || 'disponible').toLowerCase() === 'disponible'
    ).length;
    const buscandoRoomie = alojamientos.filter((a) => {
      const c = a.caracteristicas || a.caracteristica;
      return c?.buscandoRoomie;
    }).length;

    let sumaPrecios = 0;
    let countPrecios = 0;
    for (const a of alojamientos) {
      const p =
        typeof a.precio === 'object' && a.precio !== null
          ? a.precio.precioMensual || (a.precio as any).monto || 0
          : Number(a.precio ?? 0);
      if (p > 0) {
        sumaPrecios += p;
        countPrecios++;
      }
    }
    const promedio = countPrecios > 0 ? Math.round(sumaPrecios / countPrecios) : 850000;

    return {
      total,
      disponibles,
      buscandoRoomie,
      promedio: new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(promedio),
    };
  }, [alojamientos]);

  // Filtrado y ordenamiento de alojamientos
  const filteredAlojamientos = useMemo(() => {
    return alojamientos
      .filter((room) => {
        // 1. Búsqueda por texto (query)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const titulo = (room.titulo || '').toLowerCase();
          const desc = (room.descripcion || '').toLowerCase();
          const ciudad = (room.ubicacion?.ciudad || '').toLowerCase();
          const barrio = (room.ubicacion?.barrio || '').toLowerCase();
          const distancia = (room.ubicacion?.distancia || '').toLowerCase();

          const matches =
            titulo.includes(q) ||
            desc.includes(q) ||
            ciudad.includes(q) ||
            barrio.includes(q) ||
            distancia.includes(q);

          if (!matches) return false;
        }

        // 2. Filtro por tipo
        if (filters.tipo !== 'Todos') {
          const tipoNombre =
            typeof room.tipoAlojamiento === 'object' && room.tipoAlojamiento !== null
              ? room.tipoAlojamiento.nombre || ''
              : (room.tipoAlojamiento as string) || room.tipo || '';
          if (tipoNombre.toLowerCase() !== filters.tipo.toLowerCase()) {
            return false;
          }
        }

        // 3. Filtro por estado (disponible / ocupado)
        if (filters.estado !== 'Todos') {
          const estado = (room.estado || 'disponible').toLowerCase();
          if (estado !== filters.estado.toLowerCase()) {
            return false;
          }
        }

        // 4. Filtro por precio preset
        const precio =
          typeof room.precio === 'object' && room.precio !== null
            ? room.precio.precioMensual || (room.precio as any).monto || 0
            : Number(room.precio ?? 0);

        if (filters.precioPreset === 'under500' && precio > 500000) return false;
        if (filters.precioPreset === '500to900' && (precio < 500000 || precio > 900000)) return false;
        if (filters.precioPreset === 'over900' && precio < 900000) return false;

        // 5. Características
        const c = room.caracteristicas || room.caracteristica;
        if (filters.soloAmoblado && !c?.amoblado) return false;
        if (filters.soloRoomie && !c?.buscandoRoomie) return false;
        if (filters.minCuartos > 0 && (c?.numeroCuartos ?? 0) < filters.minCuartos) return false;

        return true;
      })
      .sort((a, b) => {
        const precioA =
          typeof a.precio === 'object' && a.precio !== null
            ? a.precio.precioMensual || 0
            : Number(a.precio ?? 0);
        const precioB =
          typeof b.precio === 'object' && b.precio !== null
            ? b.precio.precioMensual || 0
            : Number(b.precio ?? 0);

        if (filters.sortBy === 'priceAsc') return precioA - precioB;
        if (filters.sortBy === 'priceDesc') return precioB - precioA;
        if (filters.sortBy === 'rating') return (b.puntuacionPromedio || 0) - (a.puntuacionPromedio || 0);

        // Por defecto: más recientes primero
        const fechaA = a.fechaPublicacion ? new Date(a.fechaPublicacion).getTime() : 0;
        const fechaB = b.fechaPublicacion ? new Date(b.fechaPublicacion).getTime() : 0;
        return fechaB - fechaA;
      });
  }, [alojamientos, filters]);

  const isArrendatario = currentUser?.role === 'ARRENDATARIO';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* NAVBAR GLOBAL */}
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ENCABEZADO Y HERO DE HABITACIONES */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Catálogo Oficial de Alojamientos
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                Habitaciones & Alojamientos
              </h1>

              <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                Encuentra tu próximo hogar universitario o el roomie ideal para compartir gastos.
                Alojamientos verificados en Valledupar y principales ciudades estudiantiles.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => refreshAlojamientos()}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-sm transition"
                title="Sincronizar con el backend"
              >
                <RefreshCw className={`h-4 w-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>

              {isArrendatario && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingRoom(null);
                    setIsFormModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Publicar Alojamiento</span>
                </button>
              )}
            </div>
          </div>

          {/* TARJETAS DE ESTADÍSTICAS RÁPIDAS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Total Publicados</span>
                <span className="text-xl font-black text-gray-900">{stats.total}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Disponibles Ahora</span>
                <span className="text-xl font-black text-emerald-700">{stats.disponibles}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Buscan Roomie</span>
                <span className="text-xl font-black text-indigo-700">{stats.buscandoRoomie}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Precio Promedio</span>
                <span className="text-sm sm:text-base font-black text-gray-900">{stats.promedio}</span>
              </div>
            </div>
          </div>
        </section>

        {/* BANNER DE AUTENTICACIÓN / ROLES (Permite probar como Arrendatario en 1 clic) */}
        <AuthBanner
          currentUser={currentUser}
          onOpenCreateModal={() => {
            setEditingRoom(null);
            setIsFormModalOpen(true);
          }}
          onAuthChange={() => {
            setCurrentUser(AuthStore.getUser());
          }}
          onShowToast={addToast}
        />

        {/* FILTROS Y CONTROLES DE VISTA */}
        <RoomFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(INITIAL_FILTERS)}
          totalCount={alojamientos.length}
          filteredCount={filteredAlojamientos.length}
        />

        {/* CONTENIDO PRINCIPAL SEGÚN MODO DE VISTA */}
        {filters.viewMode === 'map' ? (
          /* VISTA EN MAPA */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Mapa de Alojamientos ({filteredAlojamientos.length} ubicaciones encontradas)
              </h3>
              <span className="text-xs text-gray-500">
                Haz clic en cualquier marcador para ver precio y detalles.
              </span>
            </div>

            <RoomMap
              rooms={filteredAlojamientos}
              onSelectRoom={(room) => setSelectedRoom(room)}
            />
          </div>
        ) : filteredAlojamientos.length === 0 ? (
          /* ESTADO VACÍO (SIN RESULTADOS) */
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center shadow-sm"
          >
            <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <SearchX className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              No se encontraron alojamientos
            </h2>
            <p className="text-gray-500 text-sm mt-1.5 max-w-md">
              No hay publicaciones que coincidan con los filtros seleccionados. Intenta modificar
              tu búsqueda o limpiar los filtros.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition"
              >
                Restablecer todos los filtros
              </button>

              {isArrendatario && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingRoom(null);
                    setIsFormModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-sm"
                >
                  Publicar una habitación
                </button>
              )}
            </div>
          </motion.section>
        ) : filters.viewMode === 'list' ? (
          /* VISTA EN LISTA HORIZONTAL */
          <motion.section layout className="space-y-4">
            <AnimatePresence>
              {filteredAlojamientos.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  viewMode="list"
                  isArrendatario={isArrendatario}
                  isOwner={checkIsOwner(room)}
                  onSelect={(r) => setSelectedRoom(r)}
                  onEdit={(r) => {
                    setEditingRoom(r);
                    setIsFormModalOpen(true);
                  }}
                  onDuplicate={(r) => handleDuplicate(r)}
                  onChangeStatus={(r, status) => handleChangeStatus(r, status)}
                />
              ))}
            </AnimatePresence>
          </motion.section>
        ) : (
          /* VISTA EN CUADRÍCULA (GRID) */
          <motion.section
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredAlojamientos.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  viewMode="grid"
                  isArrendatario={isArrendatario}
                  isOwner={checkIsOwner(room)}
                  onSelect={(r) => setSelectedRoom(r)}
                  onEdit={(r) => {
                    setEditingRoom(r);
                    setIsFormModalOpen(true);
                  }}
                  onDuplicate={(r) => handleDuplicate(r)}
                  onChangeStatus={(r, status) => handleChangeStatus(r, status)}
                />
              ))}
            </AnimatePresence>
          </motion.section>
        )}
      </main>

      {/* MODAL DE DETALLE COMPLETO */}
      <RoomDetailModal
        room={selectedRoom}
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        isArrendatario={isArrendatario}
        isOwner={checkIsOwner(selectedRoom)}
        onEdit={(r) => {
          setSelectedRoom(null);
          setEditingRoom(r);
          setIsFormModalOpen(true);
        }}
        onDuplicate={(r) => handleDuplicate(r)}
        onChangeStatus={(r, st) => handleChangeStatus(r, st)}
        onShowToast={addToast}
      />

      {/* MODAL PARA CREAR / EDITAR ALOJAMIENTO */}
      <RoomFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRoom(null);
        }}
        onSubmitCreate={handleCreateAlojamiento}
        onSubmitUpdate={handleUpdateAlojamiento}
        editingRoom={editingRoom}
        onShowToast={addToast}
      />

      {/* NOTIFICACIONES TOAST FLOTANTES */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* FOOTER GLOBAL */}
      <Footer />
    </div>
  );
}