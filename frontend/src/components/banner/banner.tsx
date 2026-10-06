import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Search } from "lucide-react";

// Palabras dinámicas que cambian automáticamente
const WORDS = ["hogar", "tu espacio", "comunidad", "tu lugar ideal"];

export default function Banner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-20 shadow-2xl sm:px-12 lg:px-16 lg:py-28">
        
        {/* FONDO ANIMADO Y LUCES DE NEÓN (Estilo Aceternity UI) */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.18),transparent_50%)]" />
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          {/* BADGE CON BRILLO */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
            <span>Encuentra tu espacio en Colombia</span>
          </motion.div>

          {/* TÍTULO CON TEXTO ROTATIVO (Estilo Magic UI) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Encuentra un lugar que se sienta como{" "}
            <span className="relative inline-block text-emerald-400">
              <AnimatePresence mode="wait">
                <motion.span
                  key={WORDS[index]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {WORDS[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* SUBTÍTULO */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-gray-300 sm:text-xl sm:leading-8"
          >
            Explora habitaciones verificadas y conecta con roomies compatibles en las principales ciudades del país.
          </motion.p>

          {/* BOTONES DE ACCIÓN MEJORADOS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link to="/explore-rooms">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500"
              >
                <Search className="h-5 w-5" />
                <span>Explorar habitaciones</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </Link>

            <Link to="/roommates">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/80 px-7 py-3.5 text-base font-semibold text-gray-200 backdrop-blur-sm transition hover:border-gray-500 hover:bg-gray-800 hover:text-white"
              >
                Buscar Roommates
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}