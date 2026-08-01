# Portfolio Development Rules

## Project

Personal portfolio built as a production-quality React web application. The repository is
currently being initialized; keep commands and concrete library references in this file aligned
with `package.json` as the stack becomes established.

## Source of truth

- Read this file and the relevant files in `.claude/rules/` before changing code.
- Existing code and configuration are the source of truth. Do not invent paths or commands.
- Rules are adapted from Hmara's architecture for React web. React Native, Expo, native styling,
  and native navigation patterns do not apply.

## Provisional architecture

```text
src/
  app/          application bootstrap, providers, router
  pages/        route-level composition; keep thin
  features/     feature-owned UI, hooks, API, types, helpers
  components/   shared reusable UI
  api/          cross-feature API domains
  stores/       Zustand client-state stores
  constants/    application-wide constants and keys
  hooks/        shared React hooks
  helpers/      pure shared utilities
  lib/          typed adapters around third-party libraries
  types/        truly shared TypeScript types
```

Do not create empty directories pre-emptively. Follow the configured framework's routing
conventions if the eventual scaffold differs; preserve the same separation of concerns.

## Critical rules

1. TypeScript strict mode. Never introduce `any`; use `unknown` and narrow it.
2. Put non-trivial custom types in co-located `*.types.ts` files. Small inferred local types do
   not need ceremonial extraction.
3. Do not use unsafe type assertions. Prefer type guards, schema validation, and `satisfies`.
   `as const` is allowed.
4. Never hardcode secrets or expose server-only credentials to browser bundles.
5. Never call third-party SDKs directly from product components. Wrap them in `src/lib/`.
6. Keep networking out of UI. Route requests through the project HTTP adapter and service layer.
7. Use Zustand only for genuine shared client state; do not duplicate remote data without a
   documented product need.
8. Use semantic HTML, keyboard support, visible focus, and accessible names.
9. Keep user-facing copy centralized and translation-ready; do not scatter strings through JSX.
10. Handle errors explicitly. Never leave empty `catch` blocks or silently discard failures.
11. Keep every source file at or below 300 lines. Split by responsibility before exceeding it.
12. Never auto-commit. Show the diff and obtain explicit user approval before committing.

## Component authoring order

1. Imports
2. Constants
3. Component body: library hooks, custom hooks, state, refs, effects, memoized values,
   callbacks, guards, JSX
4. Named component declaration
5. Default export when the surrounding project uses default exports

Avoid defining reusable helpers or child components inside a render function.

## Naming

- Components and their folders: `PascalCase`
- Hooks: `useSomething`
- Event props: `onX`; local handlers: `handleX`
- Utilities: descriptive `verbNoun`
- Booleans: `is`, `has`, `can`, or `should` prefix
- Constants: `UPPER_SNAKE_CASE` for immutable application constants

## State ownership

- Component-local UI state: React state
- Shared client state: Zustand selectors
- Remote/server state: fetched through typed services; keep it in the narrowest owning scope
- URL-shareable state: route/search parameters
- Form state: the configured form library or controlled React state

Never call `store.getState()` in components or hooks. Select state and actions through the store
hook. Imperative access is limited to non-React services/helpers with a documented need.

## Rule index

- `general.md` — engineering and security baseline
- `architecture.md` — dependency direction and folder ownership
- `components.md` — web component structure
- `routing.md` — route boundaries
- `api-layer.md` — HTTP adapter and typed services
- `state.md` — Zustand and state ownership
- `types.md`, `hooks.md`, `helpers.md`, `constants.md`, `lib.md`
- `i18n-accessibility.md` — copy, semantics, keyboard and WCAG
- `commits.md` — safe git workflow

## Conflicts

- Project configuration and explicit user requirements outrank provisional assumptions here.
- Prefer type safety and accessibility over brevity.
- Prefer adapter isolation over direct vendor usage.
- If a justified deviation is unavoidable, leave a concise `NOTE` explaining why.
