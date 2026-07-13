import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Save,
  RefreshCw,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";

type AttState = "presente" | "tarde" | "ausente";

interface Alumno {
  id: number;
  nombre: string;
  dni: string;
  estado: AttState;
}

const CURSOS = ["1ro A", "1ro B", "3ro A", "4to A", "5to A", "6to A"];

const SEED: Record<string, Alumno[]> = {
  "4to A": [
    { id: 1, nombre: "Juan Pérez", dni: "42.123.456", estado: "presente" },
    { id: 2, nombre: "María González", dni: "43.234.567", estado: "presente" },
    { id: 3, nombre: "Lucas Díaz", dni: "44.345.678", estado: "tarde" },
    { id: 4, nombre: "Sofía Ramírez", dni: "45.456.789", estado: "presente" },
    { id: 5, nombre: "Tomás López", dni: "46.567.890", estado: "ausente" },
    { id: 6, nombre: "Valentina Ruiz", dni: "47.678.901", estado: "presente" },
    { id: 7, nombre: "Bruno Martínez", dni: "48.789.012", estado: "presente" },
    { id: 8, nombre: "Catalina Sosa", dni: "49.890.123", estado: "tarde" },
  ],
  "1ro A": [
    { id: 9, nombre: "Mateo Fernández", dni: "50.111.222", estado: "presente" },
    { id: 10, nombre: "Emilia Castro", dni: "51.222.333", estado: "presente" },
    { id: 11, nombre: "Benjamín Vega", dni: "52.333.444", estado: "ausente" },
  ],
};

const STATES: Record<AttState, { label: string; icon: typeof CheckCircle2; btn: string; active: string }> = {
  presente: {
    label: "Presente",
    icon: CheckCircle2,
    btn: "border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600",
    active: "bg-emerald-500 border-emerald-500 text-white",
  },
  tarde: {
    label: "Tarde",
    icon: Clock,
    btn: "border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-600",
    active: "bg-amber-500 border-amber-500 text-white",
  },
  ausente: {
    label: "Ausente",
    icon: XCircle,
    btn: "border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-600",
    active: "bg-rose-500 border-rose-500 text-white",
  },
};

const ORDER: AttState[] = ["presente", "tarde", "ausente"];

export default function Asistencia() {
  const [curso, setCurso] = useState("4to A");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [alumnos, setAlumnos] = useState<Record<string, Alumno[]>>(() => ({
    ...SEED,
    ...Object.fromEntries(CURSOS.filter((c) => !SEED[c]).map((c) => [c, []])),
  }));

  const list = (alumnos[curso] ?? []).filter((a) => {
    const q = query.toLowerCase();
    return !q || a.nombre.toLowerCase().includes(q) || a.dni.includes(q);
  });

  const setEstado = (id: number, estado: AttState) => {
    setAlumnos((p) => ({
      ...p,
      [curso]: (p[curso] ?? []).map((a) => (a.id === id ? { ...a, estado } : a)),
    }));
    setSaved(false);
  };

  const markAll = (estado: AttState) => {
    setAlumnos((p) => ({
      ...p,
      [curso]: (p[curso] ?? []).map((a) => ({ ...a, estado })),
    }));
    setSaved(false);
  };

  const counts = list.reduce(
    (acc, a) => { acc[a.estado]++; return acc; },
    { presente: 0, tarde: 0, ausente: 0 } as Record<AttState, number>
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Control de asistencia</h1>
          <p className="mt-1 text-sm text-slate-500">Registro diario por curso</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <CalendarDays size={17} className="text-sky-600" />
          <span className="text-sm font-bold text-slate-700">
            {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
          </span>
          <div className="ml-1 flex items-center">
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <ChevronLeft size={16} />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Course tabs */}
      <div className="flex flex-wrap gap-2">
        {CURSOS.map((c) => (
          <button
            key={c}
            onClick={() => { setCurso(c); setSaved(false); }}
            className={[
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all",
              curso === c
                ? "border-sky-300 bg-sky-50 text-sky-700"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700",
            ].join(" ")}
          >
            <GraduationCap size={16} strokeWidth={2.3} />
            {c}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {ORDER.map((s) => {
          const S = STATES[s];
          const pct = list.length ? Math.round((counts[s] / list.length) * 100) : 0;
          return (
            <div key={s} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
                  <S.icon size={18} className={s === "presente" ? "text-emerald-500" : s === "tarde" ? "text-amber-500" : "text-rose-500"} />
                  {S.label}
                </span>
                <span className="text-xs font-bold text-slate-400">{pct}%</span>
              </div>
              <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{counts[s]}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative min-w-[200px] flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar alumno..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Marcar todos:</span>
          {ORDER.map((s) => (
            <button
              key={s}
              onClick={() => markAll(s)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-50"
            >
              {STATES[s].label}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          className={[
            "ml-auto inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5",
            saved ? "bg-emerald-600 shadow-emerald-600/25" : "bg-sky-600 shadow-sky-600/25 hover:bg-sky-700",
          ].join(" ")}
        >
          {saved ? <><CheckCircle2 size={16} strokeWidth={2.5} /> Guardado</> : <><Save size={16} strokeWidth={2.5} /> Guardar</>}
        </button>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {list.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <ClipboardCheck size={36} className="mx-auto text-slate-200" />
            <p className="mt-3 text-sm font-semibold text-slate-400">No hay alumnos para mostrar</p>
            <button className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600">
              <RefreshCw size={14} /> Cargar lista
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {list.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/60">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                    {a.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">{a.nombre}</p>
                    <p className="text-xs text-slate-400">DNI {a.dni}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ORDER.map((s) => {
                    const S = STATES[s];
                    const active = a.estado === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setEstado(a.id, s)}
                        className={[
                          "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all",
                          active ? S.active : S.btn,
                        ].join(" ")}
                      >
                        <S.icon size={14} strokeWidth={2.5} />
                        <span className="hidden sm:inline">{S.label}</span>
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
