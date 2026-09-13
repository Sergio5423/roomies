import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* ROOMIES */}
          <div>
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-green-400"
            >
              ROOMIES
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Encuentra habitaciones, conecta con roommates y descubre
              espacios para vivir de acuerdo con tus necesidades.
            </p>

            <div className="mt-5 flex gap-4 text-sm">
              <a
                href="#"
                className="text-slate-300 transition hover:text-green-400"
              >
                Instagram
              </a>

              <a
                href="#"
                className="text-slate-300 transition hover:text-green-400"
              >
                Facebook
              </a>

              <a
                href="#"
                className="text-slate-300 transition hover:text-green-400"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* NAVEGACIÓN */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Navegación
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 transition hover:text-green-400"
                >
                  Inicio
                </Link>
              </li>

              <li>
                <Link
                  to="/habitaciones"
                  className="text-slate-300 transition hover:text-green-400"
                >
                  Buscar alojamiento
                </Link>
              </li>

              <li>
                <Link
                  to="/roommates"
                  className="text-slate-300 transition hover:text-green-400"
                >
                  Encontrar roommate
                </Link>
              </li>

              <li>
                <Link
                  to="/publicar"
                  className="text-slate-300 transition hover:text-green-400"
                >
                  Publicar habitación
                </Link>
              </li>
            </ul>
          </div>

          {/* INFORMACIÓN */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Información
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/quienes-somos"
                  className="text-slate-300 transition hover:text-green-400"
                >
                  Quiénes somos
                </Link>
              </li>

              <li>
                <Link
                  to="/como-funciona"
                  className="text-slate-300 transition hover:text-green-400"
                >
                  ¿Cómo funciona?
                </Link>
              </li>

              <li>
                <Link
                  to="/ayuda"
                  className="text-slate-300 transition hover:text-green-400"
                >
                  Ayuda y contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* REGLAS Y CONTACTO */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Reglas y contacto
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/terminos"
                  className="text-slate-300 transition hover:text-green-400"
                >
                  Términos y condiciones
                </Link>
              </li>

              <li>
                <Link
                  to="/privacidad"
                  className="text-slate-300 transition hover:text-green-400"
                >
                  Política de privacidad
                </Link>
              </li>

              <li className="pt-2 text-slate-300">
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                  Correo de atención
                </span>

                <a
                  href="mailto:soporte@roomies.com"
                  className="mt-1 inline-block transition hover:text-green-400"
                >
                  soporte@roomies.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-700 pt-6">
          <p className="text-center text-sm text-slate-400">
            © 2026 ROOMIES. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}