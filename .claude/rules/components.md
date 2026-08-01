---
globs: "src/**/*.{tsx,css,scss}"
---

# React Web Component Rules

## Structure

```text
ComponentName/
  index.ts
  ComponentName.tsx
  ComponentName.types.ts
  ComponentName.module.css
  ComponentName.helpers.ts       # optional
  ComponentName.hooks.ts         # optional
```

Use only files the component needs. Follow an already-established project convention when one
exists.

## Boundaries

- Components must not perform raw network requests or import vendor SDKs.
- Keep props minimal and explicit. Prefer children/composition to mode-heavy boolean props.
- Reuse existing primitives before creating near-duplicates.
- Extract a subcomponent when it owns behavior, improves readability, or is reusable; do not
  fragment trivial markup.
- Do not mirror props into state. Derive values during render or memoize only proven expensive
  computation.
- Effects synchronize with external systems. Do not use effects for ordinary derivation.
- Keep callbacks stable only when there is a measured or structural reason.

## Web UI

- Use semantic elements (`button`, `a`, headings, landmarks, lists, forms) before ARIA.
- Use `<button>` for actions and `<a>` for navigation. Never make clickable `div` elements.
- Every form control has a programmatic label; errors are associated with their fields.
- Interactive UI works by keyboard, has visible focus, and meets contrast requirements.
- Images require meaningful `alt`; decorative images use empty `alt`.
- Prefer CSS Modules or the project's configured styling system. Avoid inline styles for static
  presentation and avoid global selectors for feature-local UI.
