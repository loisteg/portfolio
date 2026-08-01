---
globs:
  - "src/pages/**"
  - "src/app/**"
---

# Routing Rules

- Route files are thin composition boundaries: parse validated parameters, set metadata, and
  render a page/feature component.
- Do not put API clients, large UI trees, or reusable business logic in route definitions.
- Centralize route builders/constants when the configured router does not provide type-safe
  generated routes. Never scatter path strings through components.
- Validate route and search parameters before use; define their contracts in `*.types.ts`.
- URL-shareable state belongs in search/path parameters, not Zustand.
- Provide explicit loading, error, empty, and not-found states.
- Preserve focus and meaningful page titles across navigation.
- Follow the actual framework's routing and server/client component conventions once selected.
