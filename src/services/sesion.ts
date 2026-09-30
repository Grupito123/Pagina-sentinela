// ============================================================
// SESIÓN Y RANGOS — MODO DEMO (sin Firebase)
// ------------------------------------------------------------
// Las cuentas viven en este archivo y la sesión en el navegador.
// Sirve para ocultar y cerrar /qr a quien no tenga el rango "qr",
// pero NO es seguridad real: sin servidor, alguien con
// conocimientos puede saltearlo. Al conectar Firebase, reemplazar
// por authService (Firebase Auth + rol en Firestore + reglas).
// ============================================================
import { useEffect, useState } from "react";

export type Rango = "qr" | "admin" | "docente" | "alumno" | "padre";

export interface Sesion {
  email: string;
  nombre: string;
  rango: Rango;
}

interface CuentaDemo extends Sesion {
  claveSha256: string; // la contraseña no se guarda en texto plano
}

const CUENTAS: CuentaDemo[] = [
  {
    email: "qr@eest3.edu.ar",
    nombre: "Pantalla QR",
    rango: "qr",
    claveSha256: "80e65930024b2cf3fdabf98b15d1f3316030c604bd7e26373b7b044493c02042",
  },
];

const KEY_SESION = "sentinel-sesion";
const EVENTO = "sentinel-sesion-cambio";

async function sha256(texto: string): Promise<string> {
  const datos = new TextEncoder().encode(texto);
  // crypto.subtle solo existe en https/localhost; por IP de red (http://192.168...) se usa la versión JS
  const bytes = crypto.subtle ? new Uint8Array(await crypto.subtle.digest("SHA-256", datos)) : sha256Js(datos);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sha256Js(msg: Uint8Array): Uint8Array {
  const K = new Uint32Array(64);
  const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  const esPrimo = (n: number) => { for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  for (let n = 2, i = 0; i < 64; n++) if (esPrimo(n)) K[i++] = (Math.cbrt(n) % 1) * 2 ** 32;

  const largo = Math.ceil((msg.length + 9) / 64) * 64;
  const buf = new Uint8Array(largo);
  buf.set(msg);
  buf[msg.length] = 0x80;
  const vista = new DataView(buf.buffer);
  vista.setUint32(largo - 4, msg.length * 8);

  const W = new Uint32Array(64);
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < largo; off += 64) {
    for (let t = 0; t < 16; t++) W[t] = vista.getUint32(off + t * 4);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
      const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
      W[t] = W[t - 16] + s0 + W[t - 7] + s1;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let t = 0; t < 64; t++) {
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + W[t]) >>> 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      [h, g, f, e, d, c, b, a] = [g, f, e, (d + t1) >>> 0, c, b, a, (t1 + t2) >>> 0];
    }
    [a, b, c, d, e, f, g, h].forEach((v, i) => (H[i] = H[i] + v));
  }
  const out = new Uint8Array(32);
  H.forEach((v, i) => new DataView(out.buffer).setUint32(i * 4, v));
  return out;
}

export function leerSesion(): Sesion | null {
  try {
    const raw = localStorage.getItem(KEY_SESION);
    return raw ? (JSON.parse(raw) as Sesion) : null;
  } catch {
    return null;
  }
}

function guardarSesion(s: Sesion | null): void {
  try {
    if (s) localStorage.setItem(KEY_SESION, JSON.stringify(s));
    else localStorage.removeItem(KEY_SESION);
  } catch {
    /* ignorar */
  }
  window.dispatchEvent(new Event(EVENTO));
}

export async function iniciarSesion(email: string, clave: string): Promise<Sesion | null> {
  const cuenta = CUENTAS.find((c) => c.email === email.trim().toLowerCase());
  if (!cuenta || cuenta.claveSha256 !== (await sha256(clave))) return null;
  const sesion: Sesion = { email: cuenta.email, nombre: cuenta.nombre, rango: cuenta.rango };
  guardarSesion(sesion);
  return sesion;
}

export function cerrarSesion(): void {
  guardarSesion(null);
}

export function tieneRango(s: Sesion | null, rango: Rango): boolean {
  return s?.rango === rango;
}

/** Sesión actual; se actualiza al iniciar/cerrar sesión (también desde otra pestaña). */
export function useSesion(): Sesion | null {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesion);
  useEffect(() => {
    const actualizar = () => setSesion(leerSesion());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY_SESION) actualizar();
    };
    window.addEventListener(EVENTO, actualizar);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENTO, actualizar);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return sesion;
}
