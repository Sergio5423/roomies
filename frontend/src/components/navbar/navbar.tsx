import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Menu,
  X,
  PlusCircle,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Building,
  Sparkles,
} from "lucide-react";
import { AuthStore, type StoredUser } from "../../application/services/auth.store";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Escuchar estado de autenticación y scroll
  useEffect(() => {
    setCurrentUser(AuthStore.getUser());
    const unsubscribe = AuthStore.subscribe((user) => {
      setCurrentUser(user);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    AuthStore.clearAuth();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/habitaciones");
  };

  const isArrendatario = currentUser?.role === "ARRENDATARIO";

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "Habitaciones", path: "/habitaciones" },
    { name: "Roommates", path: "/roommates" },
    { name: "¿Cómo funciona?", path: "/como-funciona" },
  ];

  const handlePublicarClick = (e: React.MouseEvent) => {
    if (!isArrendatario) {
      e.preventDefault();
      // Si no es arrendatario, redirige a habitaciones con aviso o al login
      navigate("/habitaciones?need_arrendatario=true");
    }
  };

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
          {/* Botón Publicar (Visible destacado o con validación) */}
          <Link
            to="/publicar"
            onClick={handlePublicarClick}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition ${
              isArrendatario
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "text-gray-700 hover:text-emerald-700 hover:bg-gray-50"
            }`}
          >
            <PlusCircle className="h-4 w-4 text-emerald-600" />
            Publicar
          </Link>

          {/* ESTADO DE USUARIO / PERFIL O LOGIN */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-100 transition shadow-sm"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs text-white ${
                    isArrendatario ? "bg-emerald-600" : "bg-blue-600"
                  }`}
                >
                  {(currentUser.first_name || currentUser.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 leading-none">
                    {currentUser.first_name || "Usuario"}
                  </p>
                  <span
                    className={`text-[10px] font-semibold leading-tight block mt-0.5 ${
                      isArrendatario ? "text-emerald-700" : "text-blue-700"
                    }`}
                  >
                    {isArrendatario ? "Arrendatario" : "Estudiante"}
                  </span>
                </div>

                <ChevronDown
                  className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* MENÚ DESPLEGABLE DE PERFIL */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-xl border border-gray-100 ring-1 ring-black/5 z-50"
                  >
                    {/* Encabezado del Perfil */}
                    <div className="px-3 py-2.5 border-b border-gray-100">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                        Perfil Activo
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">
                        {currentUser.first_name} {currentUser.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>

                      <div className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        Rol: {currentUser.role}
                      </div>
                    </div>

                    {/* Opciones */}
                    <div className="py-1">
                      {isArrendatario && (
                        <Link
                          to="/publicar"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                        >
                          <Building className="h-4 w-4 text-emerald-600" />
                          Publicar nueva habitación
                        </Link>
                      )}

                      <Link
                        to="/habitaciones"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Home className="h-4 w-4 text-gray-500" />
                        Explorar Alojamientos
                      </Link>
                    </div>

                    {/* Botón Cerrar Sesión */}
                    <div className="pt-1 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
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
            </>
          )}
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
              {currentUser && (
                <div className="p-3 mb-2 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                        isArrendatario ? "bg-emerald-600" : "bg-blue-600"
                      }`}
                    >
                      {(currentUser.first_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {currentUser.first_name} {currentUser.last_name}
                      </p>
                      <p className="text-[10px] text-gray-500">{currentUser.role}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                    title="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}

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
                  to="/publicar"
                  onClick={(e) => {
                    handlePublicarClick(e);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-800"
                >
                  <PlusCircle className="h-4 w-4 text-emerald-600" />
                  Publicar espacio
                </Link>

                {!currentUser ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-xl border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      Iniciar sesión
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white"
                    >
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 text-rose-600 py-2.5 text-sm font-bold hover:bg-rose-100 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}