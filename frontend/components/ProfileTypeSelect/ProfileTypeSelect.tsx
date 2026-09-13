interface ProfileOption {
  value: string;
  label: string;
  hint: string;
}

interface ProfileTypeSelectProps {
  label: string;
  options: ProfileOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function ProfileTypeSelect({
  label,
  options,
  value,
  onChange,
}: ProfileTypeSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`text-left rounded-2xl border px-4 py-3 transition-all ${
                selected
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-white hover:border-ink/20"
              }`}
            >
              <span
                className={`block text-[15px] font-semibold ${
                  selected ? "text-accent-hover" : "text-ink"
                }`}
              >
                {option.label}
              </span>
              <span className="block text-xs text-muted mt-0.5">
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}