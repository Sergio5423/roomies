export default function Help() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
          SOPORTE
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
          Ayuda y contacto
        </h1>

        <p className="mt-6 text-base leading-7 text-gray-600">
          Si tienes preguntas sobre ROOMIES, puedes comunicarte con nuestro
          equipo de atención.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Correo de atención
          </p>

          <a
            href="mailto:soporte@roomies.com"
            className="mt-1 inline-block font-medium text-green-700 hover:text-green-800"
          >
            soporte@roomies.com
          </a>
        </div>
      </section>
    </main>
  );
}