import { Link } from "react-router";
import { Home, Heart, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          
          {/* COLUMNA 1: LOGO Y DESCRIPCIÓN */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                ROOMIES<span className="text-emerald-500">.</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              La plataforma líder en Colombia para encontrar habitaciones verificadas y personas compatibles para compartir vivienda de forma transparente y segura.
            </p>

            {/* SUSCRIPCIÓN A BOLETÍN */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Recibe nuevas habitaciones
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-2 flex max-w-md gap-2">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* COLUMNAS DE ENLACES */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Navegación</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition">Inicio</Link></li>
              <li><Link to="/explore-rooms" className="hover:text-emerald-400 transition">Explorar Habitaciones</Link></li>
              <li><Link to="/roommates" className="hover:text-emerald-400 transition">Buscar Roommates</Link></li>
              <li><Link to="/publish" className="hover:text-emerald-400 transition">Publicar un Espacio</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Ciudades</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/explore-rooms?city=bogota" className="hover:text-emerald-400 transition">Bogotá</Link></li>
              <li><Link to="/explore-rooms?city=medellin" className="hover:text-emerald-400 transition">Medellín</Link></li>
              <li><Link to="/explore-rooms?city=cali" className="hover:text-emerald-400 transition">Cali</Link></li>
              <li><Link to="/explore-rooms?city=barranquilla" className="hover:text-emerald-400 transition">Barranquilla</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Soporte</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Roomies Colombia. Todos los derechos reservados.</p>
          <p className="inline-flex items-center gap-1">
            Diseñado con <Heart className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" /> para encontrar tu hogar ideal.
          </p>
        </div>
      </div>
    </footer>
  );
}