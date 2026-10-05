import { motion, type Variants } from "framer-motion";
import { ShieldCheck, UserCheck, Lock, Sparkles, Building2 } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const featureVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const FEATURES = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "Perfiles e Identidad Verificados",
    description: "Validamos la identidad de propietarios y roomies para garantizar experiencias de convivencia seguras.",
  },
  {
    id: 2,
    icon: Building2,
    title: "Espacios de Calidad",
    description: "Habitaciones revisadas minuciosamente con fotos reales, precios transparentes y sin costos ocultos.",
  },
  {
    id: 3,
    icon: UserCheck,
    title: "Algoritmo de Compatibilidad",
    description: "Encuentra personas que compartan tu estilo de vida, horarios y hábitos de orden.",
  },
  {
    id: 4,
    icon: Lock,
    title: "Comunicación Protegida",
    description: "Conecta y coordina visitas de forma directa y segura a través de nuestro sistema de mensajes.",
  },
];

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-24 text-white">
      {/* DEGRADADOS Y LUCES DE FONDO */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-emerald-600/10 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Tranquilidad Garantizada</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Tu seguridad y comodidad son nuestra prioridad
          </h2>

          <p className="mt-4 text-base leading-relaxed text-gray-400 sm:text-lg">
            Diseñamos una plataforma transparente para que rentar o encontrar un roommate sea una experiencia ágil y confiable.
          </p>
        </motion.div>

        {/* TARJETAS DE BENEFICIOS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={featureVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative rounded-2xl border border-gray-800 bg-gray-950/60 p-7 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-lg font-bold text-white transition-colors group-hover:text-emerald-400">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* METRICAS / ESTADÍSTICAS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 rounded-2xl border border-gray-800 bg-gray-950/80 px-8 py-8 backdrop-blur-md"
        >
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="text-3xl font-extrabold text-emerald-400 sm:text-4xl">+5,000</p>
              <p className="mt-1 text-sm text-gray-400">Habitaciones publicadas</p>
            </div>
            <div className="border-t border-gray-800 pt-6 sm:border-r sm:border-t-0 sm:border-l sm:pt-0">
              <p className="text-3xl font-extrabold text-emerald-400 sm:text-4xl">98%</p>
              <p className="mt-1 text-sm text-gray-400">Usuarios satisfechos</p>
            </div>
            <div className="border-t border-gray-800 pt-6 sm:border-t-0 sm:pt-0">
              <p className="text-3xl font-extrabold text-emerald-400 sm:text-4xl">100%</p>
              <p className="mt-1 text-sm text-gray-400">Perfiles con verificación</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}