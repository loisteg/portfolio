---
globs: "src/**/*.constants.ts"
---

# Constant Rules

- Application constants live in focused `*.constants.ts` modules close to their owner.
- Use `UPPER_SNAKE_CASE` for immutable exported values.
- Prefer typed literal objects with `as const` and `satisfies` over enums.
- Never store user-facing prose in general constants; keep copy in the i18n/content layer.
- Never put secrets, environment-specific credentials, or mutable state in constants.
- Centralize route builders and other cross-feature catalogues in their owning modules.
  Parameterized routes are typed functions.
- Avoid catch-all `constants.ts` files that become unrelated dumping grounds.
