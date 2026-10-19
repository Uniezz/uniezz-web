# Coding Style Guide

This is the web counterpart to the Uniezz mobile coding style guide. Follow the existing React 19, TypeScript, Vite, and TanStack Router patterns in this repository.

## Project structure

| Directory         | Purpose                                                                            |
| ----------------- | ---------------------------------------------------------------------------------- |
| `src/routes/`     | Pages and layouts. Route files should stay focused on rendering and navigation.    |
| `src/components/` | Reusable application components. Use PascalCase names.                             |
| `src/ui/`         | Base UI components and variants. Reuse these before adding page-specific controls. |
| `src/hooks/`      | Stateful screen or feature logic. Name hooks `useSomething`.                       |
| `src/api/`        | API client configuration and request helpers.                                      |
| `src/schemas/`    | Zod schemas for runtime validation and forms.                                      |
| `src/@types/`     | Shared types and generated OpenAPI types. Do not hand-edit `schema.d.ts`.          |
| `src/utils/`      | Small, focused utilities without React state.                                      |

## TypeScript and React

- Type component props, function parameters, and public return values where inference does not make the contract clear. Avoid `any` and non-null assertions unless the value is guaranteed.
- Keep components and render functions pure. Put side effects in event handlers or effects. Follow the Rules of Hooks.
- Use a custom hook when a page has meaningful state or async workflow. Keep simple page-only state with the page.
- Show loading, failure, and success states for requests. Do not change the UI as though a request succeeded before receiving success from the API.
- Use `react-hook-form` with a Zod resolver for forms that need validation, following the existing OTP form.
- Use `@/` imports for shared modules; use relative imports for nearby files in the same feature.
- Add memoization only when it solves a measured issue or stabilizes a required reference.

## Routing and UI

- Use TanStack Router file routes under `src/routes/`. Navigate with router APIs instead of assigning browser paths directly, except when leaving the app for external authorization.
- Keep accessible button labels, input labels, and visible error messages. Use the existing `src/ui/components` building blocks and Tailwind utility classes.
- Keep provider names and instructions aligned with the implemented API flow. A button must not claim that an email was sent if no send request succeeded.

## API and environments

- Treat the generated OpenAPI schema as the source for request and response types. Generate it from the selected remote environment with `bun run schema:dev` or `bun run schema:prod`.
- Use the typed `openapi-fetch` client in `src/api/` for direct requests and its `openapi-react-query` wrapper for query and mutation hooks. Check both returned `data` and `error`, and handle network failures.
- Read the API origin through the Zod-validated `src/schemas/env.ts`; do not hardcode an API host in application code. Keep credentials and secrets out of `VITE_` variables because Vite exposes them to the browser.
- Use `bun run dev:dev` for staging and `bun run dev:prod` for production API testing. Avoid mixing generated types from one environment with a different server version without checking compatibility.

## Checks

Run `bun run typecheck`, `bun run lint`, and `bun run build` before considering a change complete. Format touched TypeScript, TSX, JSON, and Markdown files with Prettier. Add tests when they verify behavior that could otherwise regress; avoid tests that merely copy the implementation.
