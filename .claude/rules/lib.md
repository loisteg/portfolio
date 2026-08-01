---
globs: "src/lib/**"
---

# Third-Party Adapter Rules

- Every third-party SDK used by product code has a typed adapter in `src/lib/<Vendor>/`.
- Only the adapter imports the vendor package. Product modules import the adapter contract.
- Adapters isolate initialization, configuration, runtime guards, error normalization, and
  consent where relevant.
- Never leak vendor-specific response objects across the application boundary; map them to domain
  types.
- Browser-only adapters guard SSR access to `window`, `document`, and storage.
- Initialization is idempotent and failure behavior is explicit.
- Keep secrets server-side. Client adapters receive only public configuration intended for the
  browser.
- Wrap forced-`any` vendor surfaces internally and expose safe `unknown`/narrow domain types; do
  not spread unsafe types into product code.
