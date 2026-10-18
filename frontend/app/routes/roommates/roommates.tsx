import React, { useState, useMemo, useEffect } from 'react';
import { useLoaderData, Link, type LoaderFunctionArgs } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  MapPin,
  Bed,
  Maximize2,
  Armchair,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Calendar,
  RefreshCw,
  Copy,
  Check,
  X,
  LayoutGrid,
  List,
  Clock,
  Navigation,
  GraduationCap,
  Building,
  CheckCircle2,
  Lock,
  LogIn,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import {
  RoommateService,
  type EstudianteConRoomies,
  type PublicacionRoomie,
  type EstudianteRoomie,
  type AlojamientoRoomie,
} from '../../../src/application/services/roommate.service';
import { AuthStore, type StoredUser } from '../../../src/application/services/auth.store';

// Estructura aplanada para visualización ágil de publicaciones con su estudiante correspondiente
export interface RoomieCardItem {
  estudiante: EstudianteRoomie;
  publicacion: PublicacionRoomie;
  alojamiento: AlojamientoRoomie;
}

// 1. LOADER: Consulta SSR si viene token en encabezados, o retorna vacío para hidratar en cliente
export async function loader({ request }: LoaderFunctionArgs): Promise<EstudianteConRoomies[]> {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : undefined;
  if (!token) {
    return [];
  }
  try {
    return await RoommateService.obtenerRoomiesActivos(token);
  } catch {
    return [];
  }
}

export default function RoommatesPage() {
  const initialData = useLoaderData<typeof loader>();
  const [data, setData] = useState<EstudianteConRoomies[]>(initialData || []);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggingInDemo, setLoggingInDemo] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasLoadedClient, setHasLoadedClient] = useState(false);

  // Filtros y vista
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyFurnished, setOnlyFurnished] = useState(false);
  const [sortBy, setSortBy] = useState<'reciente' | 'precio-asc' | 'precio-desc'>('reciente');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDetail, setSelectedDetail] = useState<RoomieCardItem | null>(null);
  const [contactSuccessToast, setContactSuccessToast] = useState<string | null>(null);

  // Consultar endpoint con el token del usuario en el navegador
  const fetchRoomies = async (tokenToUse?: string) => {
    const token = tokenToUse ?? AuthStore.getToken() ?? undefined;
    if (!token) {
      setAuthError('Requiere sesión activa: el endpoint requiere autenticación.');
      setHasLoadedClient(true);
      return;
    }

    setLoading(true);
    setAuthError(null);
    try {
      const refreshed = await RoommateService.obtenerRoomiesActivos(token);
      setData(refreshed);
    } catch (err: any) {
      console.error('Error al actualizar lista de roomies:', err);
      setAuthError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
      setHasLoadedClient(true);
    }
  };

  // Inicializar en cliente con el token de localStorage y suscribirse a cambios de auth
  useEffect(() => {
    const user = AuthStore.getUser();
    const token = AuthStore.getToken();
    setCurrentUser(user);

    fetchRoomies(token || undefined);

    const unsubscribe = AuthStore.subscribe((updatedUser) => {
      setCurrentUser(updatedUser);
      const updatedToken = AuthStore.getToken();
      fetchRoomies(updatedToken || undefined);
    });

    return unsubscribe;
  }, []);

  const handleRefresh = () => {
    fetchRoomies();
  };

  const handleLoginDemo = async () => {
    setLoggingInDemo(true);
    try {
      await AuthStore.loginDemoEstudiante();
      showToast('Sesión iniciada como estudiante demo. Cargando datos...');
    } catch (err: any) {
      showToast('Error al iniciar sesión: ' + err.message);
    } finally {
      setLoggingInDemo(false);
    }
  };

  // Aplanar datos para procesar cada publicación activa
  const flattenedItems: RoomieCardItem[] = useMemo(() => {
    const list: RoomieCardItem[] = [];
    if (!Array.isArray(data)) return list;

    data.forEach((item) => {
      if (item && item.estudiante && Array.isArray(item.publicacionesRoomie)) {
        item.publicacionesRoomie.forEach((pub) => {
          if (pub && pub.alojamiento) {
            list.push({
              estudiante: item.estudiante,
              publicacion: pub,
              alojamiento: pub.alojamiento,
            });
          }
        });
      }
    });
    return list;
  }, [data]);

  // Extraer ciudades y barrios disponibles dinámicamente
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    flattenedItems.forEach((item) => {
      const city = item.alojamiento?.ubicacion?.ciudad;
      if (city) cities.add(city.trim());
    });
    return Array.from(cities);
  }, [flattenedItems]);

  // Extraer tipos de alojamiento disponibles dinámicamente
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    flattenedItems.forEach((item) => {
      const tipo = item.alojamiento?.tipo;
      if (tipo) types.add(tipo.trim());
    });
    return Array.from(types);
  }, [flattenedItems]);

  // Estadísticas rápidas para el dashboard
  const stats = useMemo(() => {
    const totalEstudiantes = data.length;
    const totalPublicaciones = flattenedItems.length;
    const precios = flattenedItems.map((i) => Number(i.alojamiento.precio || 0)).filter((p) => p > 0);
    const minPrecio = precios.length > 0 ? Math.min(...precios) : 0;
    const maxPrecio = precios.length > 0 ? Math.max(...precios) : 0;

    return {
      totalEstudiantes,
      totalPublicaciones,
      minPrecio,
      maxPrecio,
    };
  }, [data, flattenedItems]);

  // Filtrado y ordenamiento de publicaciones
  const filteredItems = useMemo(() => {
    return flattenedItems
      .filter((item) => {
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.estudiante.nombre.toLowerCase().includes(query) ||
          item.estudiante.email.toLowerCase().includes(query) ||
          item.estudiante.telefono.includes(query) ||
          item.publicacion.descripcion.toLowerCase().includes(query) ||
          item.alojamiento.titulo.toLowerCase().includes(query) ||
          (item.alojamiento.ubicacion.barrio || '').toLowerCase().includes(query) ||
          (item.alojamiento.ubicacion.direccion || '').toLowerCase().includes(query) ||
          (item.alojamiento.ubicacion.ciudad || '').toLowerCase().includes(query);

        const matchesCity =
          selectedCity === 'all' ||
          (item.alojamiento.ubicacion?.ciudad || '').toLowerCase() === selectedCity.toLowerCase();

        const matchesType =
          selectedType === 'all' ||
          (item.alojamiento.tipo || '').toLowerCase() === selectedType.toLowerCase();

        const matchesFurnished =
          !onlyFurnished || Boolean(item.alojamiento.caracteristicas?.amoblado);

        return matchesSearch && matchesCity && matchesType && matchesFurnished;
      })
      .sort((a, b) => {
        if (sortBy === 'precio-asc') {
          return (a.alojamiento.precio || 0) - (b.alojamiento.precio || 0);
        }
        if (sortBy === 'precio-desc') {
          return (b.alojamiento.precio || 0) - (a.alojamiento.precio || 0);
        }
        // Por fecha más reciente
        const dateA = new Date(a.publicacion.fecha || 0).getTime();
        const dateB = new Date(b.publicacion.fecha || 0).getTime();
        return dateB - dateA;
      });
  }, [flattenedItems, searchTerm, selectedCity, selectedType, onlyFurnished, sortBy]);

  const showToast = (message: string) => {
    setContactSuccessToast(message);
    setTimeout(() => setContactSuccessToast(null), 3500);
  };

  const isTokenMissing = !AuthStore.getToken() && !currentUser;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/60 pb-20">
      {/* Toast de notificación */}
      <AnimatePresence>
        {contactSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/40 text-sm font-medium"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{contactSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Comunidad Universitaria Roomies</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Estudiantes y Alojamientos buscando Roomie
              </h1>

              <p className="mt-4 text-base sm:text-lg text-emerald-100/80 leading-relaxed font-light max-w-2xl">
                Conecta directamente con estudiantes activos que tienen habitaciones o apartamentos
                disponibles para compartir gastos, estudio y convivencia.
              </p>
            </div>

            {/* Acciones de cabecera */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-sm font-semibold border border-white/20 backdrop-blur-md transition-all shadow-sm disabled:opacity-50"
                title="Actualizar datos desde el backend"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stats.totalEstudiantes}</p>
                  <p className="text-xs text-emerald-200/70 font-medium">Estudiantes Activos</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stats.totalPublicaciones}</p>
                  <p className="text-xs text-teal-200/70 font-medium">Publicaciones Roomie</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{availableCities.length || 1}</p>
                  <p className="text-xs text-cyan-200/70 font-medium">Zonas y Ciudades</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-black text-white truncate">
                    {stats.minPrecio > 0 ? formatPrice(stats.minPrecio) : 'Económicos'}
                  </p>
                  <p className="text-xs text-emerald-200/70 font-medium">Precios accesibles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER DE AUTENTICACIÓN SI NO HAY TOKEN O HAY ERROR */}
      {hasLoadedClient && (isTokenMissing || authError) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0 mt-0.5">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-amber-900">
                  Autenticación requerida para consultar Roomies Activos
                </h3>
                <p className="text-sm text-amber-700 mt-1 max-w-2xl leading-relaxed">
                  El endpoint <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">/api/users/roomies/activos</code> requiere el token de sesión de un usuario registrado.
                  {authError && !isTokenMissing && (
                    <span className="block mt-1 font-semibold text-rose-700">
                      Detalle del servidor: {authError}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={handleLoginDemo}
                disabled={loggingInDemo}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${loggingInDemo ? 'animate-spin' : ''}`} />
                <span>{loggingInDemo ? 'Iniciando...' : 'Iniciar como Estudiante Demo'}</span>
              </button>

              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100/70 text-amber-900 text-xs sm:text-sm font-bold transition shadow-xs"
              >
                <LogIn className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition shadow-xs"
              >
                <UserPlus className="h-4 w-4" />
                <span>Registrarse</span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* BARRA DE BÚSQUEDA Y FILTROS INTERACTIVOS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Input de Búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por estudiante, alojamiento, barrio, dirección o universidad..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Selectores de Filtro */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filtro Ciudad */}
              {availableCities.length > 0 && (
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Todas las Ciudades</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              )}

              {/* Filtro Tipo */}
              {availableTypes.length > 0 && (
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Todos los Tipos</option>
                  {availableTypes.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              )}

              {/* Filtro Amoblado */}
              <button
                type="button"
                onClick={() => setOnlyFurnished(!onlyFurnished)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                  onlyFurnished
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Armchair className="h-4 w-4" />
                <span>Amoblado</span>
              </button>

              {/* Ordenar */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="reciente">Más recientes</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
              </select>

              {/* Toggle de Vista Grid / List */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Vista en cuadrícula"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Vista en lista horizontal"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: LISTADO DE ROOMMATES */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Alojamientos con Roomie Activo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Mostrando <span className="font-semibold text-emerald-600">{filteredItems.length}</span>{' '}
              {filteredItems.length === 1 ? 'publicación' : 'publicaciones'} encontradas
            </p>
          </div>

          {(searchTerm || selectedCity !== 'all' || selectedType !== 'all' || onlyFurnished) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('all');
                setSelectedType('all');
                setOnlyFurnished(false);
              }}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-4"
            >
              Restablecer filtros
            </button>
          )}
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-700">Consultando datos del servidor...</p>
            <p className="text-xs text-slate-400 mt-1">Conectando a /api/users/roomies/activos</p>
          </div>
        )}

        {/* Estado Vacío */}
        {!loading && filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isTokenMissing ? 'Inicia sesión para visualizar la lista' : 'No se encontraron publicaciones activas'}
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {isTokenMissing
                ? 'Para consultar los estudiantes y alojamientos buscando roomie es necesario contar con un token válido.'
                : 'No hay publicaciones de roomie activas registradas en el backend o que coincidan con los filtros aplicados.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {isTokenMissing ? (
                <button
                  type="button"
                  onClick={handleLoginDemo}
                  disabled={loggingInDemo}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-600/20"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Probar con cuenta Demo</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-600/20"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Recargar publicaciones</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          !loading && (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
                  : 'flex flex-col gap-5'
              }
            >
              {filteredItems.map((item) => (
                <RoomieCard
                  key={item.publicacion.id}
                  item={item}
                  viewMode={viewMode}
                  onSelectDetail={(selected) => setSelectedDetail(selected)}
                  onNotifyCopy={(msg) => showToast(msg)}
                />
              ))}
            </div>
          )
        )}
      </main>

      {/* MODAL DE DETALLES Y CONTACTO COMPLETO */}
      <AnimatePresence>
        {selectedDetail && (
          <RoomieDetailModal
            item={selectedDetail}
            onClose={() => setSelectedDetail(null)}
            onNotifyCopy={(msg) => showToast(msg)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------------------
// COMPONENTE TARJETA DE ROOMMATE
// -------------------------------------------------------------------------
interface RoomieCardProps {
  item: RoomieCardItem;
  viewMode: 'grid' | 'list';
  onSelectDetail: (item: RoomieCardItem) => void;
  onNotifyCopy: (msg: string) => void;
}

function RoomieCard({ item, viewMode, onSelectDetail, onNotifyCopy }: RoomieCardProps) {
  const { estudiante, publicacion, alojamiento } = item;
  const { ubicacion, caracteristicas } = alojamiento;

  // Limpieza de teléfono para enlaces de WhatsApp y llamada
  const cleanPhone = estudiante.telefono.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/57${cleanPhone}?text=${encodeURIComponent(
    `Hola ${estudiante.nombre}, vi tu publicación en Roomies para "${alojamiento.titulo}" y me gustaría saber más sobre compartir el espacio.`
  )}`;

  const initials = estudiante.nombre
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

  const formattedDate = new Date(publicacion.fecha).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // MODO LISTA HORIZONTAL
  if (viewMode === 'list') {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all p-5 flex flex-col md:flex-row gap-6"
      >
        {/* Cabecera Estudiante en lateral */}
        <div className="md:w-64 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                {initials || 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-base truncate">{estudiante.nombre}</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Estudiante Activo" />
                </div>
                <p className="text-xs text-slate-500 font-medium">Buscando roomie</p>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 truncate">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{estudiante.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{estudiante.telefono}</span>
              </div>
            </div>
          </div>

          {/* Botones de contacto rápido */}
          <div className="mt-4 flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-colors"
              title="Contactar vía WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
              title="Llamar directamente"
            >
              <Phone className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Detalles del Alojamiento */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200/70">
                    {alojamiento.tipo || 'Alojamiento'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ● {publicacion.estado || 'Activo'}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">{alojamiento.titulo}</h4>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400">Precio / Mes</span>
                <p className="text-xl font-extrabold text-emerald-600 leading-tight">
                  {formatPrice(alojamiento.precio)}
                </p>
              </div>
            </div>

            {/* Cita de descripción */}
            <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 border-l-2 border-emerald-500 rounded-r-xl px-3 py-2 mt-3">
              "{publicacion.descripcion}"
            </p>

            {/* Ubicación */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mt-3">
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                {ubicacion.direccion}, {ubicacion.barrio ? `${ubicacion.barrio}, ` : ''}
                {ubicacion.ciudad}
              </span>
              {ubicacion.distancia && (
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                  <Clock className="h-3 w-3" />
                  {ubicacion.distancia}
                </span>
              )}
            </div>

            {/* Características */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
                <Bed className="h-3.5 w-3.5 text-emerald-600" />
                {caracteristicas?.numeroCuartos}{' '}
                {caracteristicas?.numeroCuartos === 1 ? 'Cuarto' : 'Cuartos'}
              </span>

              {caracteristicas?.metrosCuadrados ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
                  <Maximize2 className="h-3 w-3 text-emerald-600" />
                  {caracteristicas.metrosCuadrados} m²
                </span>
              ) : null}

              {caracteristicas?.amoblado && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-xs font-semibold text-teal-800 border border-teal-200">
                  <Armchair className="h-3.5 w-3.5" />
                  Amoblado
                </span>
              )}

              {caracteristicas?.buscandoRoomie && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-xs font-semibold text-indigo-700 border border-indigo-200">
                  <Users className="h-3.5 w-3.5" />
                  Buscando Roomie
                </span>
              )}
            </div>
          </div>

          {/* Pie */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Publicado {formattedDate}
            </span>

            <button
              type="button"
              onClick={() => onSelectDetail(item)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm"
            >
              <span>Ver Detalles Completos</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  // MODO GRID (CUADRÍCULA ESTILIZADA)
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col overflow-hidden"
    >
      {/* Encabezado: Perfil del Estudiante */}
      <div className="p-5 pb-4 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 border-b border-slate-100">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              {initials || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-base">{estudiante.nombre}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Activo" />
              </div>
              <p className="text-xs text-slate-500 font-medium">Estudiante Anfitrión</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800">
            {alojamiento.tipo || 'Alojamiento'}
          </span>
        </div>

        {/* Cita de búsqueda de Roomie */}
        <div className="mt-3.5 bg-white/90 border border-slate-200/80 rounded-2xl p-3 shadow-xs">
          <p className="text-xs text-slate-700 italic line-clamp-2 leading-relaxed">
            "{publicacion.descripcion}"
          </p>
        </div>
      </div>

      {/* Cuerpo: Detalles del Alojamiento */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-bold text-lg text-slate-900 line-clamp-1">{alojamiento.titulo}</h4>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider shrink-0">
              {publicacion.estado || 'Activo'}
            </span>
          </div>

          {/* Ubicación y distancia */}
          <div className="space-y-1 text-xs text-slate-500 mb-4">
            <div className="flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1 text-slate-700 font-medium">
                {ubicacion.direccion}
                {ubicacion.barrio ? `, ${ubicacion.barrio}` : ''}
                {ubicacion.ciudad ? ` (${ubicacion.ciudad})` : ''}
              </span>
            </div>

            {ubicacion.distancia && (
              <div className="flex items-center gap-1.5 text-emerald-700 pl-5 font-medium">
                <Clock className="h-3 w-3" />
                <span>{ubicacion.distancia}</span>
              </div>
            )}
          </div>

          {/* Chips de características */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700">
              <Bed className="h-3.5 w-3.5 text-emerald-600" />
              {caracteristicas?.numeroCuartos}{' '}
              {caracteristicas?.numeroCuartos === 1 ? 'Cuarto' : 'Cuartos'}
            </span>

            {caracteristicas?.metrosCuadrados ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700">
                <Maximize2 className="h-3 w-3 text-emerald-600" />
                {caracteristicas.metrosCuadrados} m²
              </span>
            ) : null}

            {caracteristicas?.amoblado && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-xs font-semibold text-teal-800 border border-teal-200/80">
                <Armchair className="h-3 w-3" />
                Amoblado
              </span>
            )}
          </div>
        </div>

        {/* Sección inferior: Precio y Contacto */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Precio mensual
              </p>
              <p className="text-xl font-black text-emerald-600 leading-tight">
                {formatPrice(alojamiento.precio)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectDetail(item)}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm"
            >
              <span>Ver Detalle</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          {/* Acciones de Contacto Inmediato */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-slate-200">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Llamar</span>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// -------------------------------------------------------------------------
// MODAL DE DETALLE COMPLETO Y CONTACTO
// -------------------------------------------------------------------------
interface RoomieDetailModalProps {
  item: RoomieCardItem;
  onClose: () => void;
  onNotifyCopy: (msg: string) => void;
}

function RoomieDetailModal({ item, onClose, onNotifyCopy }: RoomieDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { estudiante, publicacion, alojamiento } = item;
  const { ubicacion, caracteristicas } = alojamiento;

  const cleanPhone = estudiante.telefono.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/57${cleanPhone}?text=${encodeURIComponent(
    `Hola ${estudiante.nombre}, vi tu publicación en Roomies para "${alojamiento.titulo}" y estoy interesado en ser tu roomie.`
  )}`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    onNotifyCopy(`¡${label} copiado al portapapeles!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formattedDate = new Date(publicacion.fecha).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 relative my-8"
      >
        {/* Cabecera del modal */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Publicación de Roomie Activa</span>
          </div>

          <h3 className="text-2xl font-black">{alojamiento.titulo}</h3>
          <p className="text-emerald-100/80 text-sm mt-1">
            {alojamiento.tipo} • {ubicacion.barrio ? `${ubicacion.barrio}, ` : ''}
            {ubicacion.ciudad}
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {formatPrice(alojamiento.precio)}
            </span>
            <span className="text-xs text-emerald-200/80 font-medium">/ mes</span>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Descripción de la búsqueda */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Mensaje del Estudiante
            </h4>
            <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 rounded-r-2xl">
              <p className="text-sm text-slate-700 italic">"{publicacion.descripcion}"</p>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Publicado el {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Contacto del Estudiante */}
          <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border border-emerald-200/80 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-600/20">
                {estudiante.nombre.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{estudiante.nombre}</h4>
                <p className="text-xs text-emerald-700 font-semibold">Estudiante que busca roomie</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 truncate">
                    {estudiante.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(estudiante.email, 'Email')}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 transition"
                  title="Copiar correo"
                >
                  {copiedField === 'Email' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-700">{estudiante.telefono}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(estudiante.telefono, 'Teléfono')}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 transition"
                  title="Copiar teléfono"
                >
                  {copiedField === 'Teléfono' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Acciones principales de contacto */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chatear por WhatsApp</span>
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition"
              >
                <Phone className="h-4 w-4" />
                <span>Llamar</span>
              </a>

              <a
                href={`mailto:${estudiante.email}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Características del Alojamiento */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Detalles y Comodidades del Espacio
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
                <Bed className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Cuartos</p>
                <p className="text-sm font-bold text-slate-900">
                  {caracteristicas?.numeroCuartos || 1}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
                <Maximize2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Área</p>
                <p className="text-sm font-bold text-slate-900">
                  {caracteristicas?.metrosCuadrados || 0} m²
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
                <Users className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Capacidad</p>
                <p className="text-sm font-bold text-slate-900">
                  {caracteristicas?.capacidad || 1} {caracteristicas?.capacidad === 1 ? 'persona' : 'personas'}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
                <Armchair className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Mobiliario</p>
                <p className="text-sm font-bold text-slate-900">
                  {caracteristicas?.amoblado ? 'Amoblado' : 'Sin amoblar'}
                </p>
              </div>
            </div>
          </div>

          {/* Ubicación y Dirección */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Ubicación Geográfica
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {ubicacion.direccion}
                </p>
                <p className="text-xs text-slate-500 pl-5.5">
                  {ubicacion.barrio ? `Barrio ${ubicacion.barrio}, ` : ''}
                  {ubicacion.ciudad}
                </p>
                {ubicacion.distancia && (
                  <p className="text-xs font-semibold text-emerald-700 pl-5.5">
                    ● {ubicacion.distancia}
                  </p>
                )}
              </div>

              {typeof ubicacion.latitud === 'number' && typeof ubicacion.longitud === 'number' && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${ubicacion.latitud},${ubicacion.longitud}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-xs"
                >
                  <Navigation className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Ver en Google Maps</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper para formato de precios
function formatPrice(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$ 0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}