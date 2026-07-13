# 01 — Descripción del Proyecto

## 1.1 Resumen ejecutivo

El **Sistema de Asistencia Inteligente Escolar** (marca interna: **Sentinel**) es
un proyecto de la **E.E.S.T. Nro. 3 de Padua** (Provincia de Buenos Aires) para
automatizar el control de asistencia escolar mediante **lectores de código de
barras y QR** conectados a computadoras, con registros en tiempo real y una
aplicación para que alumnos, docentes, preceptores y administradores accedan a
la información académica (asistencias, notas, horarios y reportes).

## 1.2 Extracto de `PROYECTO.MD` (especificación oficial)

> **Título:** Sistema de Asistencia Inteligente Escolar
>
> El proyecto consiste en un sistema de asistencia escolar automatizado que
> integra **hardware, software y redes**. Se utilizarán lectores de código de
> barras y QR conectados a computadoras para registrar el ingreso de los alumnos
> en tiempo real. La información se almacenará en una base de datos en la nube
> mediante **Firebase**, permitiendo acceso desde distintos dispositivos.
>
> El sistema determinará automáticamente si el alumno está **presente**, llegó
> **tarde** o se encuentra **ausente** según el horario establecido. Habrá una
> aplicación donde los alumnos podrán visualizar sus asistencias, notas,
> horarios y reportes. Los docentes podrán cargar calificaciones y observar la
> asistencia diaria, los preceptores tendrán control general de todos los
> cursos, y la administración contará con acceso total para validación y
> gestión de usuarios.
>
> Se implementarán medidas de seguridad: validación de usuarios, control por
> roles y credenciales protegidas. El sistema permitirá múltiples puntos de
> acceso para evitar demoras en el ingreso.

## 1.3 Objetivos del proyecto

1. **Automatizar** el registro de ingreso de alumnos (eliminación del registro manual).
2. **Clasificar automáticamente** la asistencia en Presente / Tarde / Ausente según el horario escolar.
3. **Centralizar** la información en la nube (Firebase) para acceso multi-dispositivo.
4. **Brindar una app** para que cada rol consulte y gestione datos académicos.
5. **Controlar accesos por roles** y proteger credenciales.
6. **Reducir errores** y demoras en el control de asistencia.
7. **Mejorar la organización escolar** general.

## 1.4 Alcance previsto (según especificación)

| Área                         | Descripción                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| Registro de asistencia       | Escaneo de QR/código de barras en múltiples puntos de ingreso                 |
| Determinación de estado      | Presente / Tarde / Ausente automático según horario                          |
| Base de datos en la nube     | Firebase (Firestore) — sincronización en tiempo real                         |
| App para alumnos             | Consulta de asistencias, notas, horarios y reportes                          |
| App para docentes            | Carga de calificaciones y vista de asistencia diaria                         |
| App para preceptores         | Control general de todos los cursos                                          |
| App para administradores     | Acceso total: validación y gestión de usuarios                               |
| Seguridad                    | Validación de usuarios, control por roles, credenciales protegidas            |
| Múltiples puntos de acceso   | Para evitar demoras en el ingreso                                            |

## 1.5 Alcance actual (implementado en el repositorio)

Hoy el repositorio contiene **sólo el front-end público** de presentación del
proyecto:

- Página de inicio (landing) con barra de navegación, banner “hero” de la app
  móvil y sección de especialidades de la escuela.
- Página de autenticación con dos modos (inicio de sesión y registro) mediante
  un diseño deslizante.
- Página de especialidades con la oferta académica de la escuela.

**No existe todavía**: autenticación real, integración con Firebase, control de
roles, registro de asistencia, escaneo de QR, ni dashboards por rol. El detalle
completo de brechas está en el documento **09 — Estado de Implementación y TODOs**.

## 1.6 Contexto institucional

- **Escuela:** E.E.S.T. Nro. 3 (Escuela de Educación Secundaria Técnica).
- **Localidad:** Padua, Provincia de Buenos Aires, Argentina.
- **Oferta académica:** dos especialidades técnicas:
  - **Técnico en Informática** (color naranja `#FF6B00`).
  - **Técnico en Electromecánica** (color verde `#00FF00`).
- **Duración:** 7 años (3 años básicos + 4 años superiores) → título de Técnico.
- **App móvil planteada:** disponible en iOS y Android, gratuita y sin
  publicidad (según el mockup de la sección Hero).