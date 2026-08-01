---
globs: "src/**/*.{ts,tsx}"
---

# General Engineering Rules

- Keep TypeScript strict and code lint/format clean.
- Use path aliases only after they are defined consistently in TypeScript, the bundler, and lint
  configuration. Otherwise use relative imports.
- Prefer small pure functions, early returns, and explicit data flow.
- Use block comments for reasoning and constraints; do not narrate obvious code.
- No `any`, unsafe assertions, non-null assertions, swallowed errors, or disabled lint rules as
  substitutes for correct code.
- Validate untrusted data at system boundaries. Static types do not validate runtime input.
- Never log secrets, tokens, contact details, form contents, or other personal data.
- Never expose secrets in client-prefixed environment variables.
- Use browser APIs through focused helpers or adapters when behavior needs SSR guards or reuse.
- Remove dead code instead of commenting it out. Do not leave unexplained TODOs.
- Keep source files under 300 lines and functions focused on one responsibility.
- Before adding a dependency, confirm the existing stack cannot solve the problem cleanly.
