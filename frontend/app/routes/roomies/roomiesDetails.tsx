import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

import type { Roommate } from "../../../domain/roomies/Roommate";
import type { Accommodation } from "../../../domain/habitaciones/Accommodation";

import { MockRoommateRepository } from "../../../infrastructure/repositories/MockRoommateRepository";
import { MockAccommodationRepository } from "../../../infrastructure/repositories/MockAccommodationRepository";

const roommateRepository =
  new MockRoommateRepository();

const accommodationRepository =
  new MockAccommodationRepository();

export default function RoomiesDetails() {
  const { id } = useParams();

  const [roommate, setRoommate] =
    useState<Roommate | null>(null);

  const [accommodation, setAccommodation] =
    useState<Accommodation | null>(null);

  const [interestedAccommodations, setInterestedAccommodations] =
    useState<Accommodation[]>([]);

  useEffect(() => {
    if (!id) return;

    const roommateId = Number(id);

    roommateRepository
      .getById(roommateId)
      .then(async (data) => {
        setRoommate(data);

        if (!data) return;

        /* Habitación actual */
        if (data.habitacionId) {
          const currentAccommodation =
            await accommodationRepository.getById(
              data.habitacionId
            );

          setAccommodation(currentAccommodation);
        }

        /* Habitaciones de interés */
        if (data.habitacionesInteresadasIds.length > 0) {
          const accommodations =
            await Promise.all(
              data.habitacionesInteresadasIds.map(
                (habitacionId) =>
                  accommodationRepository.getById(
                    habitacionId
                  )
              )
            );

          setInterestedAccommodations(
            accommodations.filter(
              (
                accommodation
              ): accommodation is Accommodation =>
                accommodation !== null
            )
          );
        }
      });
  }, [id]);

  if (!roommate) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Roomie no encontrado
          </h1>

          <p className="mt-3 text-slate-500">
            El perfil que buscas no existe.
          </p>

          <Link
            to="/roomies"
            className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Volver a roomies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Volver */}
        <Link
          to="/roomies"
          className="mb-8 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          ← Volver a roomies
        </Link>

        {/* Perfil */}
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">

          {/* Imagen */}
          <div className="relative h-80 overflow-hidden bg-slate-100">
            <img
              src={roommate.imagen}
              alt={roommate.nombre}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          </div>

          {/* Información */}
          <div className="p-8 md:p-10">

            {/* Encabezado */}
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {roommate.nombre}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      roommate.disponible
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {roommate.disponible
                      ? "Disponible"
                      : "No disponible"}
                  </span>
                </div>

                <p className="mt-2 text-slate-500">
                  {roommate.edad} años · 📍{" "}
                  {roommate.ciudad}
                </p>
              </div>

              {/* Presupuesto */}
              <div className="rounded-2xl border border-slate-100 bg-[#F7F5F0] px-5 py-4">
                <p className="text-xs font-medium text-slate-400">
                  Presupuesto máximo
                </p>

                <p className="mt-1 text-xl font-bold text-emerald-700">
                  $
                  {roommate.presupuestoMaximo.toLocaleString(
                    "es-CO"
                  )}

                  <span className="ml-1 text-xs font-medium text-slate-400">
                    COP / mes
                  </span>
                </p>
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Perfil
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Sobre este roomie
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                {roommate.descripcion}
              </p>
            </div>

            {/* Intereses personales */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-800">
                Intereses
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {roommate.intereses.map((interes) => (
                  <span
                    key={interes}
                    className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700"
                  >
                    {interes}
                  </span>
                ))}
              </div>
            </div>

            {/* Habitación actual */}
            {accommodation && (
              <div className="mt-10 border-t border-slate-100 pt-8">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Alojamiento actual
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Habitación actual
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Alojamiento donde vive actualmente este roomie.
                </p>

                <div className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-[#F7F5F0]">
                  <div className="grid md:grid-cols-[260px_1fr]">

                    {/* Imagen */}
                    <div className="h-56 overflow-hidden bg-slate-100 md:h-full">
                      <img
                        src={accommodation.imagenes[0]}
                        alt={accommodation.titulo}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>

                    {/* Información */}
                    <div className="p-6">

                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

                        <div>
                          <h3 className="text-xl font-bold text-slate-800">
                            {accommodation.titulo}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            📍 {accommodation.ciudad} ·{" "}
                            {accommodation.barrio}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                            accommodation.aceptaRoomie
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {accommodation.aceptaRoomie
                            ? "Acepta roomie"
                            : "No acepta roomie"}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-500">
                        {accommodation.descripcion}
                      </p>

                      <div className="mt-5">
                        <p className="text-xs font-medium text-slate-400">
                          Precio mensual
                        </p>

                        <p className="mt-1 text-xl font-bold text-emerald-700">
                          $
                          {accommodation.precioMensual.toLocaleString(
                            "es-CO"
                          )}

                          <span className="ml-1 text-xs font-medium text-slate-400">
                            COP / mes
                          </span>
                        </p>
                      </div>

                      <Link
                        to={`/habitaciones/${encodeURIComponent(
                          accommodation.ciudad.toLowerCase()
                        )}/${accommodation.slug}`}
                        className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Ver habitación
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Habitaciones que le interesan */}
            <div className="mt-10 border-t border-slate-100 pt-8">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Sus opciones
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Habitaciones que le interesan
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Alojamientos que este roomie está considerando
                  como posibles opciones.
                </p>
              </div>

              {interestedAccommodations.length > 0 ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  {interestedAccommodations.map(
                    (interestedAccommodation) => (
                      <article
                        key={interestedAccommodation.id}
                        className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                      >

                        {/* Imagen */}
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <img
                            src={
                              interestedAccommodation
                                .imagenes[0]
                            }
                            alt={
                              interestedAccommodation.titulo
                            }
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />

                          <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
                            ♡ Le interesa
                          </span>
                        </div>

                        {/* Información */}
                        <div className="p-5">

                          <h3 className="text-lg font-bold text-slate-900">
                            {
                              interestedAccommodation.titulo
                            }
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            📍{" "}
                            {
                              interestedAccommodation.ciudad
                            }{" "}
                            ·{" "}
                            {
                              interestedAccommodation.barrio
                            }
                          </p>

                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                            {
                              interestedAccommodation.descripcion
                            }
                          </p>

                          <div className="mt-4 flex items-end justify-between gap-3">

                            <div>
                              <p className="text-xs font-medium text-slate-400">
                                Precio mensual
                              </p>

                              <p className="mt-1 text-lg font-bold text-emerald-700">
                                $
                                {interestedAccommodation.precioMensual.toLocaleString(
                                  "es-CO"
                                )}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                interestedAccommodation.aceptaRoomie
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {interestedAccommodation.aceptaRoomie
                                ? "Acepta roomie"
                                : "No acepta"}
                            </span>
                          </div>

                          <Link
                            to={`/habitaciones/${encodeURIComponent(
                              interestedAccommodation.ciudad.toLowerCase()
                            )}/${interestedAccommodation.slug}`}
                            className="mt-5 flex w-full items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            Ver habitación
                          </Link>
                        </div>
                      </article>
                    )
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-[2rem] border border-blue-100 bg-blue-50/60 px-6 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    ♡
                  </div>

                  <p className="mt-4 font-semibold text-slate-700">
                    Aún no tiene habitaciones de interés
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Este roomie todavía no ha guardado
                    alojamientos como posibles opciones.
                  </p>
                </div>
              )}
            </div>

            {/* Acción */}
            <div className="mt-10 border-t border-slate-100 pt-8">
              <button
                type="button"
                className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700 md:w-auto"
              >
                Contactar
              </button>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}