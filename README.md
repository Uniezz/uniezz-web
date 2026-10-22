# Uniezz web

Vite + React + TanStack Router.

## Development

```bash
bun install
bun run dev
```

App runs at http://localhost:7711. Development uses the staging API by default.

| Command               | Description                            |
| --------------------- | -------------------------------------- |
| `bun run dev:dev`     | Dev server with staging API            |
| `bun run dev:prod`    | Dev server with production API         |
| `bun run schema:dev`  | Generate types from staging OpenAPI    |
| `bun run schema:prod` | Generate types from production OpenAPI |
| `bun run build`       | Production build                       |
| `bun run build:dev`   | Build with staging API                 |
| `bun run typecheck`   | Type-check                             |
| `bun run lint`        | Lint                                   |

Set the API origins in ignored `.env.staging.local` and `.env.production.local` files, following `.env.example`. Vite selects them through the staging and production modes. Schema commands fetch from the selected remote API.

Local development sends API requests through Vite's `/api` proxy, so the staging API does not need a CORS entry for `localhost`. USOS returns to `/auth/done`; the backend's `APP_WEB_URL` must be the web app's origin (for local development, `http://localhost:7711`). The staging backend currently defaults to `http://localhost:3000` if `APP_WEB_URL` is unset. Deployed web origins still need backend CORS access.

See [Coding Style Guide](docs/csg.md) for project conventions.
