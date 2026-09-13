import type { InputHTMLAttributes } from "react";
import { useId, useState } from "react";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="10" width="16" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M6.6 6.7C4.4 8.1 2.9 10 2 12c0 0 3.5 7 10 7 2 0 3.7-.5 5.1-1.3M9.5 5.2A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7-.5 1-1.3 2.2-2.4 3.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );

export default function PasswordField({
  label,
  error,
  id,
  className = "",
  ...rest
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

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
        <span className="text-muted shrink-0">
          <LockIcon />
        </span>
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={`w-full h-full bg-transparent text-[15px] text-ink placeholder:text-muted outline-none ${className}`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-muted shrink-0 hover:text-ink transition-colors"
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}