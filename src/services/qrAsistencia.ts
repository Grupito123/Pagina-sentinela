// ============================================================
// HORARIOS Y VENTANAS DE ASISTENCIA POR QR
// ------------------------------------------------------------
// - El código del QR ya NO se genera con un secreto embebido en el
//   frontend. Sale del documento `sesionesQR/{id}` (ver qrSessions.ts):
//   es un valor aleatorio guardado en Firestore, y la validez la deciden
//   `activo` y `horaFin` del documento. Acá solo queda la lógica de
//   horarios, tolerancia y ventanas, que es pura y no depende de la auth.
// - El día se divide en módulos y cada módulo en horas de clase.
//   La asistencia se toma por hora: quien entra a la 2ª hora queda
//   presente en la 2ª hora (no "tarde" en la 1ª).
//   Por cada hora: abre X min antes → PRESENTE hasta que empieza →
//   MEDIA FALTA durante la tolerancia → BLOQUEADO hasta que se
//   prende la hora siguiente. Recreos: apagado.
// - La identidad del alumno NO pasa por acá: sale de `useAuth().perfil`
//   y de `usuarios/{UID}.alumnoId` (ver asistencia.ts).
// ============================================================

/** Cada cuánto rota el código de la sesión. */
export const ROTACION_MS = 30_000;

export interface HoraClase {
  id: string;
  modulo: string; // "Mañana" | "Tarde"
  nombre: string; // "1ª hora"
  inicio: string; // "HH:MM"
  fin: string; // "HH:MM"
}

export interface ConfigHorario {
  horas: HoraClase[];
  abreAntesMin: number; // el QR se prende estos minutos antes de cada hora
  toleranciaMin: number; // desde el inicio hasta inicio + tolerancia es llegada tarde; después se bloquea
}

export const CONFIG_DEFAULT: ConfigHorario = {
  abreAntesMin: 10,
  toleranciaMin: 15,
  horas: [
    // Cada "hora" es una materia de 2 horas reloj
    { id: "m1", modulo: "Mañana", nombre: "1ª hora", inicio: "07:20", fin: "09:20" },
    { id: "m2", modulo: "Mañana", nombre: "2ª hora", inicio: "09:40", fin: "11:40" },
    { id: "t1", modulo: "Tarde", nombre: "1ª hora", inicio: "13:00", fin: "15:00" },
    { id: "t2", modulo: "Tarde", nombre: "2ª hora", inicio: "15:20", fin: "17:20" },
  ],
};

/** Estado de la ventana de la hora en curso (solo presentación). */
export type EstadoHorario = "antes" | "presente" | "media_falta" | "bloqueado" | "cerrado";

export interface SituacionActual {
  estado: EstadoHorario;
  hora?: HoraClase; // hora de clase en curso
  proxima?: HoraClase; // si está apagado o bloqueado: la próxima hora del día
  toleranciaHasta?: string; // fin de la ventana de tolerancia de la hora en curso
}

export const CURSOS = ["1°A", "1°B", "2°A", "2°B", "3°A", "3°B", "4°A", "4°B", "5°A", "5°B", "6°A", "6°B", "7°A", "7°B"];

export function etiquetaHora(h: HoraClase): string {
  return `${h.modulo} · ${h.nombre}`;
}

// ---------- Reloj ----------

export function msHastaProximoCambio(ahora = Date.now()): number {
  return ROTACION_MS - (ahora % ROTACION_MS);
}

// ---------- Horario ----------

export function aMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function deMinutos(m: number): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(m / 60))}:${p(m % 60)}`;
}

/** Minuto en que se prende el QR para esa hora. */
export function aperturaDe(config: ConfigHorario, h: HoraClase): number {
  return aMinutos(h.inicio) - config.abreAntesMin;
}

/** Minuto en que termina la tolerancia (llegada tarde) y el QR se bloquea. */
export function finToleranciaDe(config: ConfigHorario, h: HoraClase): number {
  return Math.min(aMinutos(h.inicio) + config.toleranciaMin, aMinutos(h.fin));
}

export function situacionActual(config: ConfigHorario, fecha = new Date()): SituacionActual {
  const ahora = fecha.getHours() * 60 + fecha.getMinutes();
  const proxima = config.horas.find((h) => aperturaDe(config, h) > ahora);

  // Hora abierta para marcar: desde que se prende hasta que termina la tolerancia
  const abierta = config.horas.find((h) => ahora >= aperturaDe(config, h) && ahora < finToleranciaDe(config, h));
  if (abierta) {
    return {
      estado: ahora < aMinutos(abierta.inicio) ? "presente" : "media_falta",
      hora: abierta,
      toleranciaHasta: deMinutos(finToleranciaDe(config, abierta)),
    };
  }

  // Pasó la tolerancia y la hora sigue en curso: bloqueado hasta la próxima
  const enCurso = config.horas.find((h) => ahora >= aMinutos(h.inicio) && ahora < aMinutos(h.fin));
  if (enCurso) return { estado: "bloqueado", hora: enCurso, proxima };

  return proxima ? { estado: "antes", proxima } : { estado: "cerrado" };
}

export function configEsValida(c: ConfigHorario): boolean {
  if (!(c.toleranciaMin >= 0 && c.abreAntesMin >= 0)) return false;
  return c.horas.every((h, i) => {
    if (!h.inicio || !h.fin || aMinutos(h.inicio) >= aMinutos(h.fin)) return false;
    const previa = c.horas[i - 1];
    return !previa || aMinutos(previa.fin) <= aMinutos(h.inicio);
  });
}

// ---------- Config local de presentación ----------
// Solo afecta cómo se muestra el horario en ESTE navegador. No es fuente de
// autenticación ni de autorización: la validez real la impone `sesionesQR`
// y las reglas de Firestore.

const KEY_CONFIG = "sentinel-qr-config";

export function leerConfig(): ConfigHorario {
  try {
    const raw = localStorage.getItem(KEY_CONFIG);
    if (raw) {
      const c = { ...CONFIG_DEFAULT, ...JSON.parse(raw) } as ConfigHorario;
      if (configEsValida(c)) return c;
    }
  } catch {
    /* sin storage: usar default */
  }
  return CONFIG_DEFAULT;
}

export function guardarConfig(c: ConfigHorario): void {
  try {
    localStorage.setItem(KEY_CONFIG, JSON.stringify(c));
  } catch {
    /* ignorar */
  }
}

export function hoy(fecha = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${p(fecha.getMonth() + 1)}-${p(fecha.getDate())}`;
}

export function horaHHMM(fecha = new Date()): string {
  return deMinutos(fecha.getHours() * 60 + fecha.getMinutes());
}
