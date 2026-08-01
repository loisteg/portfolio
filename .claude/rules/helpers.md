---
globs: "src/**/*.helpers.ts"
---

# Helper Rules

- Helpers are pure by default: same input, same output, no hidden I/O or mutation.
- Use named exports and descriptive verb-noun names.
- Type inputs and returns explicitly when inference does not make the contract obvious.
- Handle boundary cases deliberately: empty values, invalid numbers, locale, and time zone.
- Prefer `Intl` APIs for user-facing dates, numbers, and relative time.
- Never read environment variables, storage, DOM globals, or network clients from a pure helper.
  Put such access in an adapter and pass the result in.
