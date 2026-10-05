import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Menu, X, PlusCircle } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Cambia la apariencia del Navbar al bajar en la página
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "Buscar Habitaciones", path: "/explore-rooms" },
    { name: "Roommates", path: "/roommates" },
    { name: "¿Cómo funciona?", path: "/how-it-works" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/60 py-3"
          : "bg-white py-5 border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md transition-transform duration-300 group-hover:scale-105">
            <Home className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            ROOMIES<span className="text-emerald-600">.</span>
          </span>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 text-sm font-semibold transition-colors text-gray-700 hover:text-emerald-700"
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-emerald-600"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ACCIONES DESKTOP */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Link
            to="/publish"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-emerald-700 px-3 py-2 transition"
          >
            <PlusCircle className="h-4 w-4 text-emerald-600" />
            Publicar
          </Link>

          <Link
            to="/login"
            className="text-sm font-semibold text-gray-700 hover:text-emerald-700 px-3 py-2 transition"
          >
            Iniciar sesión
          </Link>

          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
            >
              Registrarse
            </motion.button>
          </Link>
        </div>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* MENÚ MÓVIL CON ANIMACIÓN */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white border-b border-gray-200 lg:hidden"
          >
            <div className="space-y-1 px-6 pb-6 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-2">
                <Link
                  to="/publish"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-800"
                >
                  <PlusCircle className="h-4 w-4 text-emerald-600" />
                  Publicar espacio
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}