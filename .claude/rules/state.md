---
globs:
  - "src/stores/**"
  - "src/**/*store*.ts"
---

# Client State Rules

- Use Zustand only for state shared across distant components or required outside a local tree.
- Keep URL state in the router. Keep remote data in the narrowest owning component or feature;
  promote it to shared state only when multiple distant consumers genuinely require it.
- One store per coherent domain; keep state and actions typed in a neighboring `*.types.ts`.
- Expose narrow selector hooks. Components must not subscribe to the entire store.
- Never call `store.getState()` inside components or React hooks.
- Actions describe intent (`openMenu`, `setTheme`) rather than generic mutation (`setValue`).
- Keep derived state derived; do not persist duplicate values.
- Persist only the minimum safe data, version persisted shapes, and handle migration/failure.
- Never persist access tokens or sensitive user data in local storage unless the security design
  explicitly requires and protects it.
- Reset user-scoped stores when identity/session changes.
