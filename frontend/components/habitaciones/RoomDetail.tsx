
import type { Accommodation } from "../../domain/habitaciones/Accommodation";
import type { Roommate } from "../../domain/roomies/Roommate";

import RoomServices from "./RoomServices";
import RoomRules from "./RoomRules";
import RoomOwner from "./RoomOwner";
import RelatedRooms from "./RelatedRooms";

interface RoomDetailProps {
  accommodation: Accommodation;
  roommates?: Roommate[];
  relatedAccommodations?: Accommodation[];
}

export default function RoomDetail({
  accommodation,
  roommates = [],
  relatedAccommodations = [],
}: RoomDetailProps) {
  const mainImage = accommodation.imagenes[0];

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-slate-800">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-10">

          {/* Breadcrumb */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Habitaciones</span>
            <span className="text-emerald-500">/</span>
            <span>{accommodation.ciudad}</span>
            <span className="text-emerald-500">/</span>
            <span>{accommodation.barrio}</span>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              {/* Estado */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Disponible ahora
              </div>

              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                {accommodation.titulo}
              </h1>

              <p className="mt-4 text-slate-600">
                📍 {accommodation.direccion}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {accommodation.referencia}
              </p>

            </div>

            {/* Valoración */}
            <div className="rounded-2xl border border-white/80 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Valoración
              </p>

              <div className="mt-1 flex items-center gap-3">

                <span className="text-3xl font-bold text-slate-900">
                  {accommodation.puntuacionPromedio}
                </span>

                <div>
                  <div className="text-amber-400">
                    ★★★★★
                  </div>

                  <p className="text-xs text-slate-500">
                    Experiencia de huéspedes
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          GALERÍA
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-6">

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">

          {/* Imagen principal */}
          <div className="group relative min-h-[430px] overflow-hidden rounded-[2rem] bg-slate-200 shadow-xl">

            <img
              src={mainImage}
              alt={accommodation.titulo}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6">

              <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg backdrop-blur">
                Vista principal
              </span>

            </div>

          </div>


          {/* Fotos secundarias */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">

            {accommodation.imagenes.slice(1, 3).map((imagen, index) => (
              <div
                key={index}
                className="group relative min-h-[200px] overflow-hidden rounded-[2rem] bg-slate-200"
              >
                <img
                  src={imagen}
                  alt={`${accommodation.titulo} ${index + 2}`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
            ))}


            {accommodation.imagenes.length === 1 && (
              <>
                <div className="flex min-h-[200px] items-center justify-center rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">

                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-600">
                      ✦
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Más imágenes próximamente
                    </p>
                  </div>

                </div>

                <div className="hidden min-h-[200px] items-center justify-center rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white md:flex">

                  <div className="text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl text-blue-600">
                      ◈
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Explora este espacio
                    </p>

                  </div>

                </div>
              </>
            )}

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTENIDO
      ===================================================== */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_360px]">

        {/* =================================================
            COLUMNA PRINCIPAL
        ================================================= */}
        <section className="space-y-8">


          {/* CARACTERÍSTICAS */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Precio
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-700">
                ${accommodation.precioMensual.toLocaleString("es-CO")}
              </p>

              <p className="text-xs text-slate-500">
                COP / mes
              </p>
            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Espacio
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {accommodation.metrosCuadrados} m²
              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tipo
              </p>

              <p className="mt-2 text-sm font-bold text-slate-800">
                {accommodation.tipoAlojamiento}
              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Capacidad
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {accommodation.capacidad}
              </p>

              <p className="text-xs text-slate-500">
                persona(s)
              </p>

            </div>

          </section>


          {/* DESCRIPCIÓN */}
          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">

            <div className="mb-5 flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-600">
                ◇
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Sobre este espacio
                </h2>

                <p className="text-sm text-slate-500">
                  Conoce mejor el alojamiento
                </p>
              </div>

            </div>

            <p className="max-w-3xl leading-8 text-slate-600">
              {accommodation.descripcion}
            </p>

          </section>


          {/* ROOMIES ACTUALES */}
          {roommates.length > 0 && (
            <section className="rounded-[2rem] border border-emerald-100 bg-white p-7 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Convivencia
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Roomies actuales
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Personas que actualmente viven en este alojamiento.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {roommates.map((roommate) => (
                  <div
                    key={roommate.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >

                    <div className="flex items-center gap-4">

                      {/* Imagen */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                        <img
                          src={roommate.imagen}
                          alt={roommate.nombre}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Información */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-lg font-bold text-slate-800">
                            {roommate.nombre}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roommate.disponible
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-200 text-slate-500"
                              }`}
                          >
                            {roommate.disponible
                              ? "Disponible"
                              : "No disponible"}
                          </span>

                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {roommate.edad} años · 📍 {roommate.ciudad}
                        </p>

                      </div>

                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                      {roommate.descripcion}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {roommate.intereses
                        .slice(0, 3)
                        .map((interes) => (
                          <span
                            key={interes}
                            className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                          >
                            {interes}
                          </span>
                        ))}

                    </div>

                  </div>
                ))}

              </div>

            </section>
          )}


          {/* SERVICIOS */}
          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              Comodidad
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Todo lo que incluye
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Servicios disponibles para hacer tu estancia más cómoda.
            </p>

            <div className="mt-6">
              <RoomServices
                services={accommodation.serviciosIncluidos}
              />
            </div>

          </section>


          {/* REGLAS */}
          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Convivencia
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Reglas del espacio
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Conoce las condiciones de convivencia antes de reservar.
            </p>

            <div className="mt-6">
              <RoomRules
                rules={accommodation.reglas}
              />
            </div>

          </section>


          {/* UBICACIÓN */}
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">

            <div className="p-7">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Explora
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Ubicación
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Descubre qué hay alrededor de este alojamiento.
              </p>

            </div>


            <div className="relative flex h-80 items-center justify-center overflow-hidden bg-[#E8EFEA]">

              <div className="absolute inset-0 opacity-40">

                <div className="h-full w-full bg-[linear-gradient(rgba(71,107,87,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(71,107,87,0.12)_1px,transparent_1px)] bg-[size:40px_40px]" />

              </div>


              <div className="relative text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-8 border-white bg-emerald-600 text-2xl text-white shadow-xl">
                  ⌖
                </div>

                <p className="mt-4 font-bold text-slate-800">
                  {accommodation.barrio}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {accommodation.ciudad}
                </p>

                <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-xs font-medium text-emerald-700 shadow-sm">
                  Mapa interactivo próximamente
                </span>

              </div>

            </div>

          </section>

        </section>


        {/* =================================================
            SIDEBAR
        ================================================= */}
        <aside className="lg:sticky lg:top-24 lg:self-start">

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">

            <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

            <div className="p-6">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Disponible ahora
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                ${accommodation.precioMensual.toLocaleString("es-CO")}
              </p>

              <p className="text-sm text-slate-500">
                COP / mes
              </p>

              <div className="my-6 h-px bg-slate-100" />

              <RoomOwner
                owner={accommodation.propietario}
              />

            </div>

          </div>


          {/* Seguridad */}
          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

            <div className="flex gap-3">

              <span className="text-xl text-emerald-600">
                ✓
              </span>

              <div>

                <p className="font-semibold text-emerald-800">
                  Conexión segura
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-700/70">
                  ROOMIES protege tu información durante el proceso de contacto.
                </p>

              </div>

            </div>

          </div>

        </aside>

      </div>


      {/* =====================================================
          RELACIONADAS
      ===================================================== */}
      {relatedAccommodations.length > 0 && (

        <section className="border-t border-slate-200 bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              Descubre más
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Habitaciones que podrían interesarte
            </h2>

            <div className="mt-8">
              <RelatedRooms
                accommodations={relatedAccommodations}
              />
            </div>

          </div>

        </section>

      )}

    </main>
  );
}

