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

The API origins are set in `.env.development` and `.env.production`. Copy `.env.example` when creating a local override. Schema commands fetch from the selected remote API; the checked-in `api/openapi.yaml` is not a code generation source.

See [Coding Style Guide](docs/csg.md) for project conventions.
