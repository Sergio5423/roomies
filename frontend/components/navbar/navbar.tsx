import { Link } from "react-router";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-green-700"
        >
          ROOMIES
        </Link>

        {/* Navegación principal */}
        <div className="hidden items-center gap-7 md:flex">

          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-green-700"
          >
            Inicio
          </Link>

          <Link
            to="/habitaciones"
            className="text-sm font-medium text-gray-700 transition hover:text-green-700"
          >
            Buscar 
          </Link>

          <Link
            to="/roomies"
            className="text-sm font-medium text-gray-700 transition hover:text-green-700"
          >
            Roomies
          </Link>

          <Link
            to="/publicar"
            className="text-sm font-medium text-gray-700 transition hover:text-green-700"
          >
            Publicar 
          </Link>

          <Link
            to="/como-funciona"
            className="text-sm font-medium text-gray-700 transition hover:text-green-700"
          >
            ¿Cómo funciona?
          </Link>

        </div>

        {/* Acciones de autenticación */}
        <div className="flex items-center gap-2">

          <Link
            to="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Registrarse
          </Link>

        </div>

      </nav>
    </header>
  );
}

