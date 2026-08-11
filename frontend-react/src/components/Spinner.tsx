interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className = "h-5 w-5", label }: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-2 border-white/25 border-t-white ${className}`}
    />
  );
}

/** Centered full-viewport loader used while auth state is resolving. */
export function FullScreenLoader({ message }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-slate-400">
      <Spinner className="h-7 w-7" label={message ?? "Loading"} />
      {message ? <p className="text-sm">{message}</p> : null}
    </div>
  );
}
