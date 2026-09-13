import { Link } from "react-router";
import { quickActions } from "../../app/data/mock/quickActions";

export default function QuickActions() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
          ENCUENTRA LO QUE NECESITAS
        </span>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          ¿Qué buscas hoy?
        </h2>

        <p className="mt-4 text-base leading-7 text-gray-600">
          Elige una opción y comienza a encontrar el espacio o la persona
          que estás buscando.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            to={action.route}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
          >
            {/* IMAGEN */}
            <div className="relative h-52 overflow-hidden">
              <img
                src={action.image}
                alt={action.imageAlt}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* ICONO */}
              <div className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-lg font-semibold text-green-700 shadow-md">
                {action.icon}
              </div>
            </div>

            {/* CONTENIDO */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {action.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {action.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-green-700">
                  Comenzar
                </span>

                <span className="text-lg text-green-700 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>

              {/* ATRIBUCIÓN */}
              <span className="mt-4 block text-[11px] text-gray-400">
                Imagen: {action.imageSource}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}