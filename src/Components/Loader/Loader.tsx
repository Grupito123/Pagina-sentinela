import { ShieldCheck, Loader2 } from "lucide-react";

type Variant = "spinner" | "dots" | "fullscreen" | "branded";
type Size = "sm" | "md" | "lg" | "xl";

interface LoaderProps {
  variant?: Variant;
  size?: Size;
  label?: string;
  overlay?: boolean;
}

const SIZES: Record<Size, { box: string; spinner: number; dots: string; text: string }> = {
  sm: { box: "h-12 w-12", spinner: 20, dots: "h-1.5 w-1.5", text: "text-xs" },
  md: { box: "h-16 w-16", spinner: 28, dots: "h-2.5 w-2.5", text: "text-sm" },
  lg: { box: "h-24 w-24", spinner: 40, dots: "h-3.5 w-3.5", text: "text-base" },
  xl: { box: "h-32 w-32", spinner: 54, dots: "h-4 w-4", text: "text-lg" },
};

export default function Loader({
  variant = "spinner",
  size = "md",
  label,
  overlay = false,
}: LoaderProps) {
  const s = SIZES[size];

  const content = (
    <>
      {variant === "spinner" && (
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={s.spinner}
            className="animate-spin text-sky-600"
            strokeWidth={2.5}
          />
          {label && <span className={`font-semibold text-slate-600 ${s.text}`}>{label}</span>}
        </div>
      )}

      {variant === "dots" && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-end gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 ${s.dots}`}
                style={{
                  animation: "bounce-dot 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
          {label && <span className={`font-semibold text-slate-600 ${s.text}`}>{label}</span>}
        </div>
      )}

      {variant === "branded" && (
        <div className="flex flex-col items-center gap-5">
          <div className={`relative flex ${s.box} items-center justify-center`}>
            <span
              className="absolute inset-0 rounded-full border-4 border-sky-100"
              aria-hidden
            />
            <span
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-600 border-r-cyan-500"
              style={{ animation: "spin 0.9s linear infinite" }}
              aria-hidden
            />
            <div className="flex h-1/2 w-1/2 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-600/30">
              <ShieldCheck size={s.spinner * 0.55} strokeWidth={2.5} />
            </div>
          </div>
          {label && (
            <span
              className={`font-extrabold tracking-tight text-slate-800 ${s.text}`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {label}
            </span>
          )}
        </div>
      )}

      {variant === "fullscreen" && (
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-4 border-sky-100" aria-hidden />
            <span
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-600 border-r-cyan-500"
              style={{ animation: "spin 0.9s linear infinite" }}
              aria-hidden
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-600/30">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="text-center">
            <p
              className="font-extrabold tracking-tight text-slate-800"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem" }}
            >
              {label || "Cargando"}
            </p>
            <p className="mt-1 text-sm text-slate-500">Sentinel · E.E.S.T. Nro. 3</p>
          </div>
        </div>
      )}
    </>
  );

  if (variant === "fullscreen" || overlay) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-white px-4"
        role="status"
        aria-live="polite"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
        </div>
        <div className="relative z-10 animate-[fade-in_0.3s_ease-out_both]">{content}</div>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="flex justify-center">
      {content}
    </div>
  );
}
