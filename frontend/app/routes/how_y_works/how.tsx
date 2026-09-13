export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
          ROOMIES
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
          ¿Cómo funciona?
        </h1>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              1. Busca
            </h2>

            <p className="mt-2 text-gray-600">
              Explora habitaciones y espacios disponibles según ubicación,
              precio y características.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              2. Conecta
            </h2>

            <p className="mt-2 text-gray-600">
              Conoce personas y posibles roommates con preferencias de
              convivencia similares.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              3. Encuentra tu espacio
            </h2>

            <p className="mt-2 text-gray-600">
              Revisa la información de una publicación y contacta al
              propietario o interesado.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}