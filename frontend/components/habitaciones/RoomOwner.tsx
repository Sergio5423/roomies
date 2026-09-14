interface RoomOwnerProps {
  owner: {
    id: number;
    nombre: string;
    imagen: string;
    puntuacion: number;
  };
}

export default function RoomOwner({
  owner,
}: RoomOwnerProps) {
  return (
    <div>
      {/* Propietario */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={owner.imagen}
            alt={owner.nombre}
            className="h-16 w-16 rounded-2xl object-cover ring-4 ring-emerald-50"
          />

          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[10px] text-white">
            ✓
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Propietario
          </p>

          <h2 className="mt-1 font-bold text-slate-800">
            {owner.nombre}
          </h2>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-amber-400">
              ★
            </span>

            <span className="text-sm font-semibold text-slate-700">
              {owner.puntuacion}
            </span>

            <span className="text-xs text-slate-400">
              / 5
            </span>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="my-6 h-px bg-slate-100" />

      {/* Contacto */}
      <div>
        <p className="text-sm font-semibold text-slate-700">
          ¿Te interesa este espacio?
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Contacta al propietario para conocer disponibilidad y resolver tus dudas.
        </p>
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-700 transition duration-300 hover:border-emerald-300 hover:bg-emerald-100"
      >
        Ver teléfono
      </button>

      <button
        type="button"
        className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-sm transition duration-300 hover:bg-emerald-700 hover:shadow-md"
      >
        Enviar mensaje
      </button>

      {/* Seguridad */}
      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm text-blue-600">
            ✓
          </span>

          <div>
            <p className="text-sm font-semibold text-blue-800">
              Contacto protegido
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-700/70">
              Tu información se mantiene segura durante el contacto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}