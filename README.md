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

USOS returns to `/auth/done`. The backend's `APP_WEB_URL` must be the web app's origin (for local development, `http://localhost:7711`), and its CORS origins must include that origin. The staging backend currently defaults to `http://localhost:3000` if `APP_WEB_URL` is unset.

See [Coding Style Guide](docs/csg.md) for project conventions.
