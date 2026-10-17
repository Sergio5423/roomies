import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../../../src/components/navbar/navbar";
import Footer from "../../../src/components/footer/footer";
import { AuthStore, type StoredUser } from "../../../src/application/services/auth.store";
import { AlojamientoService } from "../../../src/application/services/alojamiento.service";
import type { CrearAlojamientoPayload } from "../../../src/domain/models/Alojamiento";
import {
  Building,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Lock,
  PlusCircle,
  MapPin,
  Bed,
} from "lucide-react";

export default function PublicarPage() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<"Apartamento" | "Casa" | "Pensionado">("Apartamento");
  const [precio, setPrecio] = useState<number>(850000);
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("Calle 16 # 12-30");
  const [ciudad, setCiudad] = useState("Valledupar");
  const [barrio, setBarrio] = useState("Centro");
  const [distancia, setDistancia] = useState("5 mins a la universidad");
  const [numeroCuartos, setNumeroCuartos] = useState(1);
  const [metrosCuadrados, setMetrosCuadrados] = useState(35);
  const [capacidad, setCapacidad] = useState(1);
  const [amoblado, setAmoblado] = useState(true);
  const [buscandoRoomie, setBuscandoRoomie] = useState(false);
  const [imagenUrl, setImagenUrl] = useState(
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
  );

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentUser(AuthStore.getUser());
    const unsubscribe = AuthStore.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const isArrendatario = currentUser?.role === "ARRENDATARIO";

  const handleDemoLoginArrendatario = async () => {
    try {
      await AuthStore.loginDemoArrendatario();
      setCurrentUser(AuthStore.getUser());
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isArrendatario) {
      setError("Solo los usuarios con rol ARRENDATARIO tienen autorización para publicar.");
      return;
    }

    if (!titulo.trim() || !descripcion.trim() || precio < 0) {
      setError("Por favor completa todos los campos requeridos con datos válidos.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CrearAlojamientoPayload = {
        titulo,
        descripcion,
        tipoAlojamiento: tipo,
        imagenes: [imagenUrl],
        ubicacion: {
          direccion,
          ciudad,
          barrio,
          distancia,
          latitud: 10.463,
          longitud: -73.253,
        },
        caracteristica: {
          numeroCuartos,
          metrosCuadrados,
          capacidad,
          amoblado,
          buscandoRoomie,
        },
        precio: {
          precioMensual: precio,
        },
        reglas: ["Convivencia tranquila", "No fumar en habitaciones"],
      };

      await AlojamientoService.publicar(payload);
      navigate("/habitaciones");
    } catch (err: any) {
      console.error("Error al publicar:", err);
      setError(err.message || "Hubo un error al conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* BLOQUE DE CONTROL DE AUTENTICACIÓN / MODO VISITANTE O ESTUDIANTE */}
        {mounted && !isArrendatario && (
          <div className="mb-8 p-6 rounded-3xl bg-amber-50 border-2 border-amber-300/80 shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500 text-white rounded-2xl shrink-0 shadow-sm">
                <Lock className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-extrabold text-amber-950">
                  {currentUser ? "Rol insuficiente para publicar" : "Modo Visitante activo"}
                </h3>
                <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                  Para publicar un alojamiento debes haber iniciado sesión con el rol de{" "}
                  <strong>ARRENDATARIO</strong> (Propietario).
                  {currentUser
                    ? ` Actualmente tu sesión es de rol "${currentUser.role}".`
                    : " Actualmente estás navegando como visitante sin sesión."}
                </p>

                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <button
                    type="button"
                    onClick={handleDemoLoginArrendatario}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Building className="h-4 w-4" />
                    Iniciar como Arrendatario (Demo)
                  </button>

                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100/50 transition"
                  >
                    Ir al Login
                  </Link>

                  <Link
                    to="/habitaciones"
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline ml-auto"
                  >
                    Volver a habitaciones
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <header className="mb-8 border-b border-gray-100 pb-6 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
                <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                Nueva Publicación
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Publicar Alojamiento
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Completa los detalles de la habitación o inmueble para recibir solicitudes de roomies y estudiantes.
              </p>
            </div>
          </header>

          {error && (
            <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl">
              <p className="text-sm font-semibold text-rose-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Título del anuncio *
              </label>
              <input
                type="text"
                id="titulo"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Habitación luminosa cerca a la Universidad"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              />
            </div>

            {/* Tipo y Precio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tipo" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Tipo de propiedad *
                </label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                >
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Pensionado">Pensionado</option>
                </select>
              </div>

              <div>
                <label htmlFor="precio" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Precio mensual (COP) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    id="precio"
                    required
                    min={0}
                    step={10000}
                    value={precio}
                    onChange={(e) => setPrecio(Number(e.target.value))}
                    className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Barrio
                </label>
                <input
                  type="text"
                  value={barrio}
                  onChange={(e) => setBarrio(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Características */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cuartos
                </label>
                <input
                  type="number"
                  min={1}
                  value={numeroCuartos}
                  onChange={(e) => setNumeroCuartos(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Metros²
                </label>
                <input
                  type="number"
                  min={5}
                  value={metrosCuadrados}
                  onChange={(e) => setMetrosCuadrados(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Capacidad
                </label>
                <input
                  type="number"
                  min={1}
                  value={capacidad}
                  onChange={(e) => setCapacidad(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
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
                <span>Amoblado</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                <input
                  type="checkbox"
                  checked={buscandoRoomie}
                  onChange={(e) => setBuscandoRoomie(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <span>Buscando Roomie</span>
              </label>
            </div>

            {/* Foto URL */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                URL de Imagen Principal
              </label>
              <input
                type="url"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs"
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Descripción detallada *
              </label>
              <textarea
                id="descripcion"
                required
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe los servicios incluidos, normas del hogar, ambiente..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm resize-none"
              />
            </div>

            {/* Botón de Enviar */}
            <div className="pt-4 flex items-center justify-between">
              <Link
                to="/habitaciones"
                className="text-xs font-bold text-gray-500 hover:text-gray-800 transition"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={isSubmitting || !isArrendatario}
                className={`flex justify-center py-3 px-8 rounded-xl shadow-md text-sm font-bold text-white transition ${isSubmitting || !isArrendatario
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99]"
                  }`}
              >
                {isSubmitting ? "Publicando en el servidor..." : "Publicar Alojamiento"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}