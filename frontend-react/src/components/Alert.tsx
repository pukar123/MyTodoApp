import type { ReactNode } from "react";

type AlertVariant = "success" | "error";

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
  onDismiss?: () => void;
}

const VARIANT_STYLES: Record<AlertVariant, string> = {
  success:
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  error: "border-rose-400/30 bg-rose-400/10 text-rose-200",
};

export function Alert({ variant, children, onDismiss }: AlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`animate-in flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm backdrop-blur ${VARIANT_STYLES[variant]}`}
    >
      <span className="min-w-0">{children}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-current/80 transition hover:bg-white/10 hover:text-current"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
