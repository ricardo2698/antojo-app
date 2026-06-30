---
name: nextjs-senior
description: >
  Standards, architecture, and code conventions for senior-level Next.js projects (App Router).
  Use this skill whenever building or reviewing any Next.js feature, component, hook, page, or
  service — especially for multi-feature apps like menus, dashboards, order systems, or admin panels.
  Trigger for any prompt involving: component creation, folder structure, custom hooks, TypeScript
  interfaces, API routes, state management, or code reviews in a Next.js project.
---

# Next.js Senior — Skill

Este skill define los estándares de arquitectura, estructura y código para proyectos Next.js escalables y mantenibles. Todo código generado debe seguir estas reglas sin excepción.

> Para detalle de cada área, lee los archivos en `references/` según el contexto de la tarea.

---

## Referencias disponibles

| Archivo | Cuándo leerlo |
|---|---|
| `references/structure.md` | Al crear carpetas, features, o nuevos módulos |
| `references/components.md` | Al crear o editar cualquier componente React |
| `references/hooks.md` | Al crear custom hooks |
| `references/typescript.md` | Al definir tipos, interfaces o props |
| `references/api.md` | Al crear API routes o server actions |
| `references/conventions.md` | Para naming, imports, lint y reglas generales |

---

## Principios fundamentales

1. **Legibilidad sobre brevedad** — El código debe entenderse sin comentarios extensos.
2. **Archivos pequeños y enfocados** — Máximo 300–400 líneas por archivo.
3. **Separación de responsabilidades** — UI, lógica, tipos y servicios en archivos distintos.
4. **TypeScript estricto** — Sin `any`, sin `as unknown`, sin shortcuts.
5. **Componentes atómicos** — Un componente = una responsabilidad.
6. **Hooks para lógica** — Nada de lógica de negocio dentro del JSX.

---

## Stack del proyecto

```
Next.js 14+ (App Router)
TypeScript (strict mode)
Tailwind CSS
React Query (TanStack Query) para server state
Zustand para client state (si aplica)
Zod para validación
ESLint + Prettier
```

---

## Regla de oro al generar código

Antes de escribir cualquier archivo, pregúntate:
- ¿Este archivo tiene más de una responsabilidad? → Divídelo.
- ¿Esta interfaz está en el mismo archivo que el componente? → Muévela a `types.ts`.
- ¿Este hook tiene más de 80 líneas? → Extrae helpers.
- ¿Este componente tiene más de 300 líneas? → Divide en sub-componentes.
