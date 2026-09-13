import type { ReactNode } from "react";

export function BackButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Volver"
      className="h-10 w-10 rounded-full bg-black/4 flex items-center justify-center text-ink hover:bg-black/[0.07] transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 5l-7 7 7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle: ReactNode;
  onBack?: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <BackButton onClick={onBack} />
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] leading-tight font-bold text-ink">
          {title}
        </h1>
        <p className="text-[15px] text-muted leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}