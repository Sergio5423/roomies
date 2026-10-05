import { motion, type Variants } from "framer-motion";
import { Search, MessageSquare, Key, Sparkles } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Explora y Filtra",
    description: "Filtra habitaciones por ciudad, presupuesto, servicios incluidos y estilo de vida.",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Conecta y Coordina",
    description: "Habla directamente con el anfitrión o roommate para agendar una visita o llamada.",
  },
  {
    number: "03",
    icon: Key,
    title: "Múdate con Tranquilidad",
    description: "Confirma tu cupo de forma segura y comienza tu nueva etapa sin sorpresas.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-800">
          PROCESO SIMPLE Y RÁPIDO
        </span>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          ¿Cómo funciona Roomies?
        </h2>

        <p className="mt-3 text-base text-gray-600">
          En tan solo 3 sencillos pasos podrás encontrar tu espacio ideal o el compañero de departamento perfecto.
        </p>
      </motion.div>

      {/* PASOS DE PROCESO */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative mt-16 grid gap-8 md:grid-cols-3"
      >
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              variants={stepVariants}
              whileHover={{ y: -6 }}
              className="relative flex flex-col rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 font-bold text-emerald-700 border border-emerald-100">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-4xl font-extrabold text-gray-200">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>

              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}