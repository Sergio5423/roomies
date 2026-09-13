import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "w-full h-14 rounded-2xl font-semibold text-[15px] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-accent text-white shadow-button hover:bg-accent-hover",
    ghost: "bg-transparent text-ink border border-border hover:bg-black/[0.02]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}