# React + TypeScript + Vite

## Run with Docker

This repo covers **frontend development only**. Production is handled by the outer compose file that
combines this service with the backend — see [Production](#production) below.

### Development (hot reload)

```bash
docker compose up --build
```

Open http://localhost:5173

Your local code is bind-mounted into the container, so any edit under `src/` hot-reloads in the browser
immediately — no image rebuild needed. (`CHOKIDAR_USEPOLLING=true` is set in `docker-compose.yml`
because file-system events don't propagate across bind mounts on macOS/Windows, so HMR won't fire
without polling.)

Other common commands:

```bash
docker compose up -d --build          # run in the background
docker compose logs -f frontend       # follow logs
docker compose down                   # stop and remove containers
docker compose exec frontend sh       # open a shell in the container
```

> If you add or remove a dependency in `package.json`, rebuild the image:
> `docker compose up --build --force-recreate`
> or run `docker compose exec frontend npm install` and restart the container.

### Production

Production isn't run from this repo's compose file, but the image is built here. The `Dockerfile`'s
`prod` target produces a self-contained image: it builds the bundle, then serves it with nginx.
The outer compose only has to point at this directory and run it.

```yaml
# outer docker-compose.yml, alongside the backend service
services:
  frontend:
    build:
      context: ./frontend      # path to this repo
      target: prod
    ports:
      - "8080:80"
    depends_on:
      - backend
```

Build targets in `Dockerfile`:

| Target | What it does |
| --- | --- |
| `dev` | Vite dev server with HMR on port 5173 |
| `build` | runs `npm run build`, leaves the bundle at `/app/dist` |
| `prod` | nginx serving that bundle on port 80 |

`build` is an intermediate stage — it has no `CMD` of its own, so don't point a compose service at it
directly or the container will exit immediately. Use it only as the source of a `COPY --from=build`.

`nginx.conf` handles the three things a SPA needs in production: a `try_files` fallback so client-side
routes don't 404 on refresh, immutable caching for the content-hashed files under `/assets/`, and
`no-cache` on `index.html` so clients don't pin themselves to an old bundle.

This still works behind an outer reverse proxy (Traefik, Caddy, another nginx) — point the proxy at
this service's port 80. If you'd rather not run nginx here at all, the alternative is to have the
backend serve the static files, which means copying `/app/dist` out of the `build` stage into the
backend image at build time.

### Run without Compose

```bash
docker build --target dev -t toc-front:dev .
docker run --rm -it -p 5173:5173 \
  -v "$(pwd)":/app -v /app/node_modules \
  -e CHOKIDAR_USEPOLLING=true \
  toc-front:dev
```

### Local development (without Docker)

```bash
npm install
npm run dev
```


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
