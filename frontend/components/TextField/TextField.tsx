import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}

export default function TextField({
  label,
  icon,
  error,
  id,
  className = "",
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white px-4 h-14 transition-colors focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft ${
          error ? "border-red-300" : "border-border"
        }`}
      >
        {icon && <span className="text-muted shrink-0">{icon}</span>}
        <input
          id={inputId}
          className={`w-full h-full bg-transparent text-[15px] text-ink placeholder:text-muted outline-none ${className}`}
          {...rest}
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}