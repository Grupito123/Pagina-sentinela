// ============================================================
// ASISTENCIA POR QR — lógica compartida por /qr y /qr/marcar
// ------------------------------------------------------------
// - El QR cambia cada ROTACION_MS: cada período tiene un código
//   distinto, así una foto del QR deja de servir enseguida.
// - El día se divide en módulos y cada módulo en horas de clase.
//   La asistencia se toma por hora: quien entra a la 2ª hora queda
//   presente en la 2ª hora (no "tarde" en la 1ª).
//   Por cada hora: abre X min antes → PRESENTE hasta que empieza →
//   MEDIA FALTA durante la tolerancia → BLOQUEADO hasta que se
//   prende la hora siguiente. Recreos: apagado.
// - MODO DEMO: las marcas se guardan en este navegador
//   (localStorage). Cuando se conecte Firebase, reemplazar
//   leerMarcas/registrarMarca por el asistenciaService compartido.
// ============================================================

export const ROTACION_MS = 30_000;

// Sin backend el secreto vive en el cliente: evita fotos reenviadas,
// no a alguien que lea el código fuente. Con Firebase se valida en servidor.
const SECRETO = "sentinel-eest3-qr";

const KEY_CONFIG = "sentinel-qr-config";
const KEY_MARCAS = "sentinel-qr-marcas";

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
  toleranciaMin: number; // desde el inicio hasta inicio + tolerancia es media falta; después se bloquea
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

export type EstadoHorario = "antes" | "presente" | "media_falta" | "bloqueado" | "cerrado";
export type EstadoMarca = "presente" | "media_falta";

/** Cuánta falta suma cada estado. */
export const FALTA: Record<EstadoMarca, number> = { presente: 0, media_falta: 0.5 };

export interface SituacionActual {
  estado: EstadoHorario;
  hora?: HoraClase; // hora de clase en curso (presente/media_falta/bloqueado)
  proxima?: HoraClase; // si está apagado o bloqueado: la próxima hora del día
  toleranciaHasta?: string; // fin de la media falta de la hora en curso
}

export interface Marca {
  id: string;
  nombre: string;
  dni: string;
  curso: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM en que escaneó
  horaClaseId: string;
  horaClase: string; // "Mañana · 2ª hora"
  estado: EstadoMarca;
  falta: number; // 0 presente, 0.5 media falta
}

export const CURSOS = ["1°A", "1°B", "2°A", "2°B", "3°A", "3°B", "4°A", "4°B", "5°A", "5°B", "6°A", "6°B", "7°A", "7°B"];

export function etiquetaHora(h: HoraClase): string {
  return `${h.modulo} · ${h.nombre}`;
}

// ---------- Código rotativo ----------

function hash(texto: string): string {
  // FNV-1a 32 bits, dos pasadas para tener 12 caracteres
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x811c9dc5) >>> 0;
  }
  return (h1.toString(36) + h2.toString(36)).padStart(12, "0").slice(0, 12);
}

export function periodoActual(ahora = Date.now()): number {
  return Math.floor(ahora / ROTACION_MS);
}

export function codigoDelPeriodo(periodo: number): string {
  return hash(`${SECRETO}:${periodo}`);
}

/** Acepta el período actual y los vecinos, por si el reloj del celular está corrido o el QR cambió justo al escanear. */
export function codigoValido(codigo: string, ahora = Date.now()): boolean {
  const p = periodoActual(ahora);
  return [p - 1, p, p + 1].some((x) => codigoDelPeriodo(x) === codigo);
}

export function msHastaProximoCambio(ahora = Date.now()): number {
  return ROTACION_MS - (ahora % ROTACION_MS);
}

// ---------- Horario ----------

export function aMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function deMinutos(min: number): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(min / 60))}:${p(min % 60)}`;
}

/** Minuto en que se prende el QR para esa hora. */
export function aperturaDe(config: ConfigHorario, h: HoraClase): number {
  return aMinutos(h.inicio) - config.abreAntesMin;
}

/** Minuto en que termina la tolerancia (media falta) y el QR se bloquea. */
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

// ---------- Marcas (demo local) ----------

export function hoy(fecha = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${p(fecha.getMonth() + 1)}-${p(fecha.getDate())}`;
}

export function horaHHMM(fecha = new Date()): string {
  return deMinutos(fecha.getHours() * 60 + fecha.getMinutes());
}

export function leerMarcas(): Marca[] {
  try {
    const raw = localStorage.getItem(KEY_MARCAS);
    return raw ? (JSON.parse(raw) as Marca[]) : [];
  } catch {
    return [];
  }
}

export function marcasDeHoy(): Marca[] {
  const f = hoy();
  return leerMarcas().filter((m) => m.fecha === f);
}

export type ResultadoMarca =
  | { ok: true; marca: Marca }
  | { ok: false; motivo: "codigo" | "vencido" | "antes" | "bloqueado" | "cerrado" | "duplicado"; marca?: Marca };

/** Tiempo que tiene el alumno para completar sus datos después de escanear. */
export const PLAZO_CONFIRMAR_MS = 3 * 60_000;

/**
 * El código se valida contra el momento del escaneo (no el del envío), así
 * el alumno puede tardar en completar sus datos; la hora de clase y el
 * estado también se toman del momento en que escaneó.
 */
export function registrarMarca(datos: { nombre: string; dni: string; curso: string; codigo: string; escaneadoEn: number }): ResultadoMarca {
  const ahora = new Date();
  if (!codigoValido(datos.codigo, datos.escaneadoEn)) return { ok: false, motivo: "codigo" };
  if (ahora.getTime() - datos.escaneadoEn > PLAZO_CONFIRMAR_MS) return { ok: false, motivo: "vencido" };

  const escaneo = new Date(datos.escaneadoEn);
  const sit = situacionActual(leerConfig(), escaneo);
  if (!sit.hora || (sit.estado !== "presente" && sit.estado !== "media_falta")) {
    return { ok: false, motivo: sit.estado === "antes" || sit.estado === "bloqueado" ? sit.estado : "cerrado" };
  }

  const todas = leerMarcas();
  const fecha = hoy(escaneo);
  const dni = datos.dni.replace(/\D/g, "");
  const previa = todas.find((m) => m.fecha === fecha && m.dni === dni && m.horaClaseId === sit.hora!.id);
  if (previa) return { ok: false, motivo: "duplicado", marca: previa };

  const marca: Marca = {
    id: `${ahora.getTime()}-${dni}`,
    nombre: datos.nombre.trim(),
    dni,
    curso: datos.curso,
    fecha,
    hora: horaHHMM(escaneo),
    horaClaseId: sit.hora.id,
    horaClase: etiquetaHora(sit.hora),
    estado: sit.estado,
    falta: FALTA[sit.estado],
  };
  try {
    localStorage.setItem(KEY_MARCAS, JSON.stringify([...todas, marca]));
  } catch {
    /* ignorar */
  }
  return { ok: true, marca };
}

export function borrarMarcasDeHoy(): void {
  const f = hoy();
  try {
    localStorage.setItem(KEY_MARCAS, JSON.stringify(leerMarcas().filter((m) => m.fecha !== f)));
  } catch {
    /* ignorar */
  }
}

export const KEYS_STORAGE = { config: KEY_CONFIG, marcas: KEY_MARCAS };
