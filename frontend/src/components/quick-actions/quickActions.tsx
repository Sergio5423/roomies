import { Link } from "react-router";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { quickActions } from "../../../app/data/mock/quickActions";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function QuickActions() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* HEADER CON ANIMACIÓN AL HACER SCROLL */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-800">
          ENCUENTRA LO QUE NECESITAS
        </span>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          ¿Qué buscas hoy?
        </h2>

        <p className="mt-3 text-base text-gray-600">
          Selecciona una opción para comenzar a explorar opciones verificadas.
        </p>
      </motion.div>

      {/* GRILLA DE TARJETAS ANIMADAS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-12 grid gap-8 md:grid-cols-3"
      >
        {quickActions.map((action) => (
          <motion.div
            key={action.id}
            variants={cardVariants}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link
              to={action.route}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/10"
            >
              {/* CONTENEDOR DE IMAGEN CON OVERLAY */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={action.image}
                  alt={action.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-2xl font-bold text-emerald-700 shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  {action.icon}
                </div>
              </div>

              {/* DETALLES */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-emerald-700">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {action.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm font-semibold text-emerald-700">
                    Comenzar ahora
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}