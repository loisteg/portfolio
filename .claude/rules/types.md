---
globs: "src/**/*.types.ts"
---

# Type Rules

- Put exported or non-trivial custom contracts in co-located `*.types.ts` files.
- Prefer `type` for unions/composition and `interface` for intentionally extendable object APIs;
  follow an established local convention if stricter.
- Never use `any`. Use `unknown` and narrow with runtime checks.
- Avoid `as` assertions and non-null assertions. Prefer type guards, schema parsing, exhaustive
  switches, and `satisfies`. `as const` is allowed.
- Model valid states with discriminated unions instead of unrelated booleans and optionals.
- Derive types from schemas, constants, and library APIs rather than duplicating them.
- Do not use enums when a typed literal catalogue is sufficient.
- Keep API DTOs distinct from view models when transformation is meaningful.
- Use exhaustive `never` checks for important discriminated unions.
