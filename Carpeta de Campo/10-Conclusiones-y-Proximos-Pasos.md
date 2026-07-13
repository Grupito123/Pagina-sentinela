# 10 — Conclusiones y Próximos Pasos

## 10.1 Conclusión general

El repositorio analizado es un **prototipo front-end temprano** del Sistema de
Asistencia Inteligente Escolar de la E.E.S.T. Nro. 3 de Padua. Actualmente
contiene:

- Una **landing pública** con barra de navegación, banner hero simulando la
  app móvil y la oferta de especialidades de la escuela.
- Una **página de autenticación** con diseño deslizante (login/registro), aunque
  sin ninguna lógica de autenticación real.

El **núcleo del sistema** descrito en `PROYECTO.MD` —registro automático de
asistencia por QR/código de barras, Firebase, roles, dashboards por rol y
determinación automática de presente/tarde/ausente— **aún no está
implementado**. El avance global respecto de la especificación se estima en un
**10-15%**.

## 10.2 Fortalezas detectadas

- **Stack moderno y adecuado:** React 19 + TypeScript + Vite + Tailwind v4.
- **Diseño visual consistente** con identidad de la escuela y colores por
  especialidad.
- **Routing centralizado** claro y simple.
- **Bases de lint y tipos** en buen estado (ESLint + TS estricto).
- **Proyecto bien especificado** en `PROYECTO.MD`, lo cual sirve como guia
  directa para los próximos desarrollos.

## 10.3 Riesgos y debilidades

- **Ausencia total de backend:** Firebase no está instalado ni configurado.
- **Ausencia de lógica de roles y rutas protegidas** (riesgo de seguridad
  futuro si se avanza sin atender esto).
- **Rutas rotas:** 3 de 5 links del navbar no llevan a ninguna página.
- **Componentes huérfanos** y assets sin usar (`Login.tsx`, `Register.tsx`,
  `hero.png`, `.hintrc`) que pueden confundir a nuevos desarrolladores.
- **Branding inconsistente** y configuración de `index.html` aún de template.
- **No tests, no CI, no `.env`** — la calidad y la configuración deben
  instrumentarse antes de crecer el equipo o agregar features críticas.

## 10.4 Roadmap propuesto

### Fase 0 — Higiene y base (1-2 semanas)
1. Reescribir `README.md` y `index.html`.
2. Eliminar archivos huérfanos (`Login.tsx`, `Register.tsx`, `hero.png`, `.hintrc`)
   o reintegrarlos con un propósito.
3. Unificar branding y `lang="es"`.
4. Agregar rutas faltantes del navbar y una 404.
5. Configurar **alias de ruta** (`@/`) en Vite + TS.
6. Cargar la fuente **Barlow** y centralizar design tokens.

### Fase 1 — Firebase y autenticación (2-3 semanas)
1. Instalar `firebase`.
2. Crear `src/services/firebase.ts` y `.env`.
3. Implementar `AuthContext` con Firebase Auth.
4. Conectar `Auth.tsx` a servicios reales y redirigir según rol.
5. Configurar **Security Rules** por rol.

### Fase 2 — Roles y dashboards (3-4 semanas)
1. Definir tipos de dominio (`src/types/`).
2. Implementar `<ProtectedRoute>` y redirección por rol.
3. Construir dashboards básicos para **alumno**, **docente**, **preceptor** y **admin**.
4. Vista de gestión y validación de usuarios para el admin.

### Fase 3 — Núcleo de asistencia (3-4 semanas)
1. Generación de credenciales (QR / código de barras) por alumno.
2. Vista de **punto de acceso** para los lectores.
3. Lógica de cálculo de estado según horario.
4. Soporte de **múltiples puntos de acceso** simultáneos.
5. Panel de control del preceptor.

### Fase 4 — Académico (2-3 semanas)
1. Carga de calificaciones (docente).
2. Boletín digital y reportes (alumno).
3. Horarios (vista por rol).
4. Comunicados.

### Fase 5 — Calidad y despliegue (continuo)
1. Tests (Vitest + Testing Library) y e2e (Playwright).
2. CI en GitHub Actions (lint, typecheck, build, test).
3. Hosting (Firebase Hosting o alternativa) y variables de entorno por entorno.
4. Monitoreo y analítica.

## 10.5 Recomendaciones finales

- **Priorizar Firebase + Roles** antes que cualquier feature nueva: sin
  autenticación y roles bien definidos, los dashboards no podrán protegerse
  correctamente.
- **Aprovechar el diseño actual** como base visual de todos los dashboards,
  reutilizando la paleta y los componentes (`Navbar`, tarjetas, botones).
- **Documentar cada cambio** en esta Carpeta de Campo, así queda como
  bitácora del proyecto.
- **Mantener el `PROYECTO.MD`** como especificación canónica y reflejar en
  el documento 09 el avance real a medida que se implemente cada feature.

---

## Anexo — Archivos de la Carpeta de Campo

Esta carpeta de campo se encuentra en:
`<raíz-del-proyecto>\Carpeta de Campo\`

| Archivo                                    | Contenido                                  |
|--------------------------------------------|--------------------------------------------|
| `00-Portada-e-Indice.md`                    | Portada e índice                           |
| `01-Descripcion-del-Proyecto.md`           | Descripción y especificación oficial       |
| `02-Arquitectura-y-Tecnologias.md`         | Stack y arquitectura                        |
| `03-Estructura-de-Archivos.md`              | Árbol de archivos y descripción por archivo |
| `04-Detalle-de-Componentes-y-Paginas.md`    | Análisis individual de componentes y páginas |
| `05-Rutas-y-Navegacion.md`                  | Mapa de rutas y links                       |
| `06-Roles-y-Permisos.md`                    | Modelo de roles y matriz de permisos        |
| `07-Backend-y-Firebase.md`                  | Estado y plan de Firebase + modelo de datos |
| `08-Diseno-y-Sistema-de-Estilos.md`         | Guía visual y design tokens                |
| `09-Estado-de-Implementacion-y-TODOs.md`    | Brechas y backlog                           |
| `10-Conclusiones-y-Proximos-Pasos.md`       | Conclusiones y roadmap (este archivo)       |

---

*Documento generado el 12 de julio de 2026 tras un escaneo completo del
repositorio. El análisis se basa en el código fuente actual; las secciones de
Firebase, roles y modelo de datos contienen propuestas pensadas para acotar el
desarrollo futuro y no representan código existente.*