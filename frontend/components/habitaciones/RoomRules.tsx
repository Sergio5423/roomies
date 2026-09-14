interface RoomRulesProps {
  rules: string[];
}

function getRuleStyle(rule: string) {
  const value = rule.toLowerCase();

  if (value.includes("fumar")) {
    return {
      icon: "◉",
      background: "bg-rose-50",
      iconBackground: "bg-rose-100",
      iconColor: "text-rose-600",
    };
  }

  if (value.includes("mascota")) {
    return {
      icon: "◇",
      background: "bg-amber-50",
      iconBackground: "bg-amber-100",
      iconColor: "text-amber-600",
    };
  }

  if (value.includes("pareja")) {
    return {
      icon: "◈",
      background: "bg-blue-50",
      iconBackground: "bg-blue-100",
      iconColor: "text-blue-600",
    };
  }

  return {
    icon: "✓",
    background: "bg-emerald-50",
    iconBackground: "bg-emerald-100",
    iconColor: "text-emerald-600",
  };
}

export default function RoomRules({
  rules,
}: RoomRulesProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rules.map((rule) => {
        const style = getRuleStyle(rule);

        return (
          <div
            key={rule}
            className={`group flex items-center gap-4 rounded-2xl border border-slate-100 ${style.background} p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-sm`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBackground} ${style.iconColor} text-lg`}
            >
              {style.icon}
            </div>

            <div>
              <p className="font-medium text-slate-700">
                {rule}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                Condición de convivencia
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}