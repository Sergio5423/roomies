import { trustItems } from "../../app/data/mock/trustItems";

export default function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
          CONFIANZA Y SEGURIDAD
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Encuentra tu próximo espacio con confianza
        </h2>

        <p className="mt-3 text-base leading-7 text-gray-600">
          ROOMIES te ayuda a conocer mejor los espacios y las personas
          antes de tomar una decisión.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg font-bold text-green-700">
              {item.icon}
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              {item.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}