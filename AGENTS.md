# AGENTS.md

Guidance for coding agents working in this repository.

## Project Snapshot

- Framework: Next.js 16 (App Router) + React 19 + TypeScript 5.
- Styling: Tailwind CSS v4 via `@import "tailwindcss"` in `app/globals.css`.
- Linting: ESLint 9 with `eslint-config-next` (`core-web-vitals` + TypeScript config).
- Package manager: npm (`package-lock.json` is present).
- TS mode: strict (`"strict": true` in `tsconfig.json`).
- Path alias: `@/*` maps to repo root.

## Rules Files Check

- `.cursorrules`: not found.
- `.cursor/rules/`: not found.
- `.github/copilot-instructions.md`: not found.
- If any of these are added later, treat them as higher-priority repo instructions and update this file.

## Repo Layout (Current)

- `app/layout.tsx`: root layout and font setup.
- `app/page.tsx`: homepage.
- `app/globals.css`: global styles and theme variables.
- `eslint.config.mjs`: lint config.
- `tsconfig.json`: TypeScript compiler settings.
- `next.config.ts`: Next.js config.

## Build / Lint / Test Commands

Run commands from repo root: `/Users/Galock/CS/portfolio-website_4`.

### Install

- `npm ci`
  - Preferred for clean, reproducible installs.
- `npm install`
  - Acceptable for local dependency updates.

### Dev / Build / Run

- `npm run dev`
  - Starts local dev server (default port 3000).
- `npm run build`
  - Creates production build.
- `npm run start`
  - Runs built app (requires successful build first).

### Lint

- `npm run lint`
  - Lints the whole project.
- `npm run lint -- app/page.tsx`
  - Lints a single file (use this as a targeted check).
- `npm run lint -- app/**/*.tsx`
  - Lints matching files via glob expansion (shell-dependent).

### Tests (Important)

- There is currently **no test runner configured** in `package.json`.
- There is currently **no `test` script**.
- For now, quality gate is: `npm run lint` and `npm run build`.

### Running a Single Test

- Not available yet because no test framework is installed.
- If tests are introduced, add explicit scripts and document single-test usage here.
- Suggested future patterns (only after framework setup):
  - Jest: `npx jest path/to/file.test.ts -t "test name"`
  - Vitest: `npx vitest run path/to/file.test.ts -t "test name"`

## Code Style Guidelines

Follow existing code patterns first, then these defaults.

### Formatting

- Use 2-space indentation.
- Use semicolons.
- Use double quotes for strings.
- Keep trailing commas in multiline arrays/objects/params.
- Keep lines reasonably short; prefer readability over dense one-liners.

### Imports

- Put imports at top of file.
- Group order:
  1. Framework/external imports (`next`, `react`, etc.).
  2. Internal absolute imports (`@/...`).
  3. Relative imports (`./...`, `../...`).
- Separate groups with one blank line when groups are all present.
- Prefer `import type` for type-only imports.
- Avoid deep relative chains when `@/*` alias improves clarity.

### TypeScript and Types

- Respect strict mode; do not weaken compiler settings.
- Add explicit types where inference is unclear at boundaries.
- Prefer precise types over `any`; use `unknown` when needed and narrow.
- Model data shapes with `type` or `interface` consistently within a file.
- Type component props explicitly (including `children`).
- Avoid non-null assertions (`!`) unless truly guaranteed.

### Naming Conventions

- React components: `PascalCase`.
- Functions/variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- Files:
  - Next route files follow framework names (`page.tsx`, `layout.tsx`, etc.).
  - Other component files use `PascalCase.tsx` when introduced.
- CSS custom properties use kebab-case (for example `--color-foreground`).

### React / Next.js Conventions

- App Router defaults to Server Components; use Client Components only when needed.
- Add `"use client"` only for files requiring client-side hooks/events/browser APIs.
- Keep metadata in `export const metadata` where appropriate.
- Prefer semantic HTML and accessible structure.
- Use `next/image` for optimized images when practical.

### Styling (Tailwind + CSS)

- Prefer Tailwind utility classes for component styling.
- Keep global styles minimal and centralized in `app/globals.css`.
- Reuse CSS variables from `:root` / `@theme inline` when possible.
- Avoid introducing conflicting design tokens without updating globals.

### Error Handling

- Fail fast for invalid inputs in utilities and server logic.
- Do not silently swallow errors.
- Catch errors only when you can add context or recover.
- In UI code, show user-safe fallback states/messages instead of crashing.
- Avoid leaking sensitive details in error messages.

### Accessibility and UX Baselines

- Ensure interactive elements are keyboard accessible.
- Provide meaningful text for links/buttons.
- Keep sufficient color contrast.
- Add `alt` text for informative images.

## Agent Workflow Expectations

- Before finishing, run at least:
  - `npm run lint`
  - `npm run build` (for substantial changes)
- Do not introduce new tooling/config unless required by the task.
- Keep changes minimal and targeted; avoid broad refactors without request.
- Preserve existing conventions in touched files.
- Update this `AGENTS.md` if commands/conventions change.

## Pre-Handoff Checklist

- Changes compile with `npm run build`.
- Lint passes with `npm run lint`.
- No obvious type regressions under strict TS.
- Imports are clean and unused code removed.
- Any new script/tooling is documented here.
