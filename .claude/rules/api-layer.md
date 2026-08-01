---
globs:
  - "src/api/**"
  - "src/features/**/api/**"
---

# API Layer Rules

## Domain layout

```text
  <domain>/
  <domain>.services.ts
  <domain>.types.ts
  <domain>.helpers.ts       # optional
  <domain>.constants.ts     # optional
```

- Services are framework-independent functions with typed input/output and no UI logic.
- Route HTTP through one configured client adapter. Do not mix raw `fetch` and multiple clients
  across the product. The adapter owns base URL, headers, cancellation, and error normalization.
- Validate external responses at runtime where trust matters.
- Reject/throw `Error` objects or one documented normalized error type.
- Components and feature hooks call typed services; keep loading, error, and cancellation behavior
  explicit at the owning boundary.
- Do not duplicate remote responses in global state unless multiple distant consumers require it
  and the invalidation strategy is documented.
- Keep server-only credentials and privileged calls behind a server endpoint/function.
- Types live in the domain `*.types.ts`; transformations live in helpers, not JSX.
