import { Link } from "react-router";
import { bannerSlides } from "../../app/data/mock/bannerSlides";
import { useBanner } from "./useBanner";

export default function Banner() {
  const {
    activeSlide,
    slide,
    previousSlide,
    nextSlide,
    goToSlide,
  } = useBanner(bannerSlides);

  return (
    <section className="w-full pt-6">
      <div className="relative h-[520px] overflow-hidden rounded-[2rem] bg-gray-900 shadow-xl sm:h-[560px]">

        {/* IMÁGENES */}
        {bannerSlides.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide
              ? "opacity-100"
              : "pointer-events-none opacity-0"
              }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className={`h-full w-full object-cover transition-transform duration-[6000ms] ${index === activeSlide ? "scale-105" : "scale-100"
                }`}
            />

            {/* Overlay principal */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/45 to-slate-900/10" />
            {/* Overlay inferior */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ))}

        {/* CONTENIDO */}
        <div className="relative z-10 flex h-full items-center">
          <div className="max-w-2xl px-7 sm:px-12 lg:px-16">

            <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white backdrop-blur-md">
              {slide.eyebrow}
            </span>

            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-white/85 sm:text-lg">
              {slide.description}
            </p>

            <div className="mt-8">
              <Link
                to={slide.route}
                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition duration-200 hover:bg-emerald-700 hover:shadow-xl"              >
                {slide.button}

                <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

          </div>
        </div>

        {/* BOTÓN ANTERIOR */}
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Slide anterior"
          className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-xl text-white backdrop-blur-md transition hover:bg-black/45"
        >
          ←
        </button>

        {/* BOTÓN SIGUIENTE */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Slide siguiente"
          className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-xl text-white backdrop-blur-md transition hover:bg-black/45"
        >
          →
        </button>

        {/* INDICADORES */}
        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {bannerSlides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${index === activeSlide
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}