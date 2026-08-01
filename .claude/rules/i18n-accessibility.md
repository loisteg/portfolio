---
globs: "src/**/*.{ts,tsx}"
---

# Internationalization and Accessibility Rules

## Copy and locale

- Keep user-facing copy in the configured translation/content system, not scattered in JSX.
- Use sentence case unless brand or language rules require otherwise.
- Do not concatenate translated fragments. Use interpolation and plural rules.
- Use `Intl` with the active locale for dates, times, numbers, and currency.
- Do not expose raw error messages from APIs to users; map them to safe localized messages.

## Accessibility

- Target WCAG 2.2 AA for the portfolio.
- Use correct semantic HTML and landmark/headings hierarchy before adding ARIA.
- All functionality is keyboard accessible with a visible focus indicator.
- Controls have accessible names, correct states, and sufficiently large targets.
- Respect `prefers-reduced-motion`; animation must not be required to understand content.
- Maintain color contrast and never communicate meaning by color alone.
- Modal/dialog behavior traps focus appropriately, labels the dialog, and restores focus on close.
- Dynamic status/error updates use appropriate live regions without excessive announcements.
- Verify important flows manually with keyboard navigation and browser accessibility tools.
