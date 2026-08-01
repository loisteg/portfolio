---
globs: "src/**"
---

# Architecture Rules

Dependency direction is one-way:

```text
app/pages -> features -> shared components/hooks/helpers -> lib adapters
                     -> api services -> external systems
```

- Route/page modules compose features; they do not own networking or reusable business logic.
- Features may depend on shared modules. Shared modules must not depend on features.
- Components render UI and emit events; services perform I/O; hooks coordinate React behavior;
  helpers transform data; stores own client state.
- Avoid barrel files that introduce cycles or obscure ownership. Prefer direct imports.
- Keep domain-specific code inside its feature. Promote code to shared only after real reuse.
- Never import a vendor SDK outside its adapter in `src/lib/`.
- Keep server-only code outside the browser dependency graph and use framework-supported server
  boundaries when available.
- Favor composition over global state and inheritance.
