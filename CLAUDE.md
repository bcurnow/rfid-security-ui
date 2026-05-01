# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:8080 (hot reload)
npm run build     # Production build → dist/
npm run preview   # Preview the production build locally
```

There is no lint script or test suite. ESLint config lives in `package.json` under `"eslintConfig"`.

### Bash commands

Prefer these over defaults when available. Fall back silently if missing.

- **Search content:** `rg` over `grep`
- **Find files:** `fd` over `find`
- **Never** use `find -exec` or `xargs` chains when `fd -x` or `rg -l | xargs` would be clearer. Prefer readable pipelines.
- **Structural/AST search:** `ast-grep` (`sg`) for refactors and pattern-based code search, especially in TS/TSX
- **JSON:** `jq` for any parsing, filtering, or transformation in pipelines
- **YAML/TOML:** `yq`
- **GitHub operations:** `gh` for PRs, issues, reviews, CI status, and releases. Do not scrape github.com or hit the REST API directly when `gh` can do it.
- **Benchmarking:** `hyperfine` when comparing command performance
- **Circular deps (JS/TS):** `madge --circular`
- **Dead code (JS/TS):** `knip`
- **Duplication (JS/TS):** `jscpd`
- **Typecheck only:** `tsc --noEmit` (or `tsc -b --noEmit` in monorepos)

## Environment Variables (`.env`)

The dev server reads from `.env`. Key variables:

| Variable | Purpose |
|---|---|
| `VITE_RFID_API_KEY` | Injected as `X-RFIDSECURITYSVC-API-KEY` header on all `/api` proxy requests |
| `VITE_PROXY_TARGET` | Backend URL for `/api` proxy (default: `http://localhost:5000`) |
| `VITE_RFID_API_URL` | Overrides the base API URL used by Axios (development config only) |
| `VITE_ALLOWED_HOSTS` | Comma-separated list of allowed hosts (defaults to all) |
| `VITE_HMR_HOST` / `VITE_HMR_CLIENT_PORT` | HMR host override for remote dev |
| `VITE_LIVE_RELOAD` | Set to `false` to disable file watching |

The dev server proxies all `/api/*` requests to the backend and injects the API key header automatically — no manual auth needed in the frontend code.

## Architecture

### Tech Stack
- Vue 3 (Composition API, `<script setup>`) + TypeScript
- Vite (replaced Webpack)
- Bootstrap Vue Next (`bootstrap-vue-next`) for UI components
- Vue Router 4
- Axios (provided via Vue plugin, accessed via `useAxios()` composable)

### Auto-imports
`vite.config.ts` configures `unplugin-auto-import` and `unplugin-vue-components`:
- Vue and Vue Router composables (`ref`, `computed`, `useRoute`, etc.) are globally available without explicit imports.
- Bootstrap Vue Next components (`BTable`, `BModal`, `BButton`, etc.) are auto-resolved — no imports needed in templates.
- Generated type declarations are in `auto-imports.d.ts` and `components.d.ts`.

### Layer Structure

```
src/
├── components/
│   ├── model/          # Domain model classes
│   └── rfidsecuritysvc/ # API service factory functions
├── composables/        # useApi(), useAxios()
├── views/
│   ├── common/         # Shared UI components (AppList, AppColor, AppSoundPlayer)
│   └── <domain>/       # Per-domain views (guests, media, permission, sound, config)
├── router/             # Route definitions, split by domain
├── config/             # Environment-specific config (development, production)
└── plugins/axios.ts    # Axios Vue plugin
```

### Model Layer (`src/components/model/`)

All domain models extend `BaseModel`, which provides:
- `fromApi(data)` — static factory that converts snake_case API keys to camelCase properties
- `toApiInput()` — converts camelCase properties back to snake_case for API writes; respects `inputExcludedProperties()` (defaults to excluding `id`)
- `displayName()` — static; used in table captions and confirmations
- `displayIdentifier()` — instance method; used in delete confirmations (defaults to primary key value)
- `primaryKey()` — returns the name of the primary key property (defaults to `'id'`)

Nested `BaseModel` instances (e.g., `Guest.sound: Sound | null`) must be explicitly constructed in the model's constructor since `Object.assign` does not deep-construct.

### Service Layer (`src/components/rfidsecuritysvc/`)

Each file exports a factory function that takes an `AxiosInstance` and returns a plain object of async methods. Example: `guestsSvc(axios)` returns `{ create, delete, get, list, update }`. The factory pattern allows dependency injection and avoids singletons.

### `useApi()` Composable

`src/composables/useApi.ts` is the single entry point for all backend services. Call it in any component to get typed access to every service:

```ts
const api = useApi()
api.guests.list()
api.sound.create(...)
api.errorToString(err)
```

`useApi()` internally calls `useAxios()`, which uses Vue's `inject()` to retrieve the Axios instance provided by `AxiosPlugin` in `main.ts`.

### `AppList` Component (`src/views/common/AppList.vue`)

The central UI pattern. It is a generic, reusable paginated table with a create/edit modal. Configure it by constructing an `AppListConfig<T>` and passing it as the `:config` prop.

### Config (`src/config/`)

`src/config/index.ts` dynamically imports `config.development.ts` or `config.production.ts` based on `import.meta.env.MODE`. The `Config` interface (`config.types.ts`) defines `{ appVersion, production, apiUrl }`. `appVersion` is set in `main.ts` from the `package.json` version injected by Vite.
