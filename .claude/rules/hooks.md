---
globs: "src/**/*.{hooks,hook}.ts"
---

# Hook Rules

- Hooks coordinate React lifecycle and reusable stateful behavior; pure transformations belong in
  helpers.
- Names begin with `use`; return values are typed and stable in shape.
- Obey hook rules unconditionally. Never call hooks inside branches, loops, or callbacks.
- Effects synchronize with external systems and include correct dependencies and cleanup.
- Abort or ignore stale asynchronous work during cleanup.
- Do not hide unrelated responsibilities inside one hook; split by behavior.
- Do not call Zustand `getState()` from a hook. Subscribe through selectors.
- Prefer returning an object when multiple same-typed values would make tuple positions unclear.
