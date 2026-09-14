interface RoomServicesProps {
  services: string[];
}

const serviceIcons: Record<string, string> = {
  WiFi: "⌁",
  Cocina: "⌂",
  Lavadora: "◌",
  Agua: "≈",
  Energía: "⚡",
};

export default function RoomServices({
  services,
}: RoomServicesProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {services.map((service) => (
        <div
          key={service}
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-[#FAFAF7] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-700 transition duration-300 group-hover:bg-emerald-200">
            {serviceIcons[service] ?? "✓"}
          </div>

          <div>
            <p className="font-medium text-slate-700">
              {service}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              Incluido en el alojamiento
            </p>
          </div>

          <span className="ml-auto text-sm text-emerald-600">
            ✓
          </span>
        </div>
      ))}
    </div>
  );
}