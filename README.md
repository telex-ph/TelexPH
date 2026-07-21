# TelexPH — Client (MERN)

React + Vite frontend for TelexPH. This is the **R** in MERN; the API lives in
the separate `telexph-admin` repository (Express + MongoDB).

Previously a Next.js App Router app — now plain React with JSX. The UI markup
and Tailwind classes were carried over unchanged, so the design is identical.

## Getting started

```bash
npm install
npm run dev            # http://localhost:5173
```

`.env` is gitignored, so a fresh clone has none — ask a teammate for it. The
keys it needs are listed under [Environment variables](#environment-variables).

The backend must be running separately:

```bash
cd ../telexph-admin
npm run dev            # http://localhost:5000
```

`/api/*` requests are proxied to the backend (see `VITE_API_PROXY` in `.env`),
so the browser only ever talks to one origin.

## Scripts

| Command           | Purpose                            |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Dev server with hot reload         |
| `npm run build`   | Production build into `dist/`      |
| `npm run preview` | Serve the production build locally |

## Structure

```
index.html            # document shell (fonts, meta tags, favicon)
src/
  main.jsx            # entry point — mounts <App> in a BrowserRouter
  App.jsx             # route table (replaces Next's file-based routing)
  globals.css         # Tailwind + design tokens
  pages/              # one file per route, co-located sections in a subfolder
  components/         # shared UI (Navbar, Footer, Home sections, …)
  shared/             # small helpers, incl. the next/* compatibility shims
  lib/                # API clients and browser utilities
  constant/  data/  context/
```

### Routing

Routes are declared in `src/App.jsx`. Paths match the old Next.js URLs exactly,
so existing links and bookmarks keep working.

### The `next/*` shims

`src/shared/` provides drop-in replacements for the Next APIs the components
used, aliased in `vite.config.js`:

| Import             | Replacement     | Notes                                           |
| ------------------ | --------------- | ----------------------------------------------- |
| `next/image`       | `Image.jsx`     | renders `<img>`; supports `fill` / `priority`   |
| `next/link`        | `Link.jsx`      | wraps React Router; `<a>` for external links    |
| `next/navigation`  | `navigation.js` | `useRouter` / `usePathname` / `useSearchParams` |
| `next/font/google` | `fonts.js`      | fonts load via `<link>` in `index.html`         |

This keeps the original import lines intact, which is why the components did
not need rewriting. New code can use `react-router-dom` directly.

For per-page titles and meta tags, use `<Seo />` from `src/shared/Seo.jsx`
(replaces Next's `export const metadata`).

## Performance notes

Two things Next.js did automatically had to be re-added by hand. Both are easy
to undo accidentally, so they are worth knowing about:

**Code splitting.** `src/App.jsx` loads every route with `React.lazy` except the
homepage. Importing a page statically there instead would pull it — and its
dependencies — into the entry chunk that every visitor downloads. Before this
was in place the bundle was 2.8 MB; it is now ~490 kB with the rest fetched per
route. Heavy libraries (recharts, jspdf, swiper) are split out via
`manualChunks` in `vite.config.js` so they stay cached across deploys.

**Image optimization.** `next/image` resized and re-encoded images on the fly.
Losing it was the single biggest cause of sluggish navigation: several source
images are 7000px+ wide but render at ~150px, and the browser still decodes
every pixel (measured: 1212 ms of image decode on one navigation).

`src/shared/Image.jsx` restores this on two fronts:

- **Cloudinary uploads** get `f_auto,q_auto,w_<n>` delivery transforms plus a
  `srcSet`, so the CDN does the resizing.
- **Local files** under `public/images/` are served from pre-generated variants
  in `public/images-opt/`. Run `node scripts/generate-image-variants.mjs` after
  adding or replacing an image; it writes 640/1280/1920px WebP copies and never
  touches the originals.

Always prefer `<Image>` over a bare `<img>` — a plain `<img>` bypasses all of
this and serves the multi-megabyte original. Pass `sizes` whenever an image is
not roughly full-width; without it the browser assumes `100vw` and fetches a
larger variant than it needs.

**Link prefetch.** `src/shared/Link.jsx` warms a route's chunk on hover/focus,
which is what `next/link` did. Routes are registered in the `registerPrefetch`
call in `App.jsx` — a route missing from that list still works, it just loads
on click instead. Measured at 4x CPU throttle: 1276 ms without hover, 516 ms
with.

### Measured results

| | Before | After |
| --- | --- | --- |
| Entry bundle | 2,818 kB | 492 kB |
| Cold-load JS | 9,241 kB | 288 kB |
| Images (Services page) | 16.2 MB | 2.5 MB |
| Image decode | 1,212 ms | ~200 ms |
| Navigation (hover → click, 4x throttle) | — | 516 ms |

## Environment variables

Vite only exposes variables prefixed with `VITE_`, and **everything exposed is
public** — never put secrets there. Read them with `import.meta.env.VITE_FOO`,
not `process.env`.

This is the main migration trap: the old `NEXT_PUBLIC_*` names are invisible to
Vite, so a key kept under its old name silently reads as `undefined` (that is
what blanked the Turnstile widget). Add the `VITE_` name when migrating a value.

| Variable | Purpose | Required |
| --- | --- | --- |
| `VITE_API_PROXY` | Origin the dev server proxies `/api/*` to | yes |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile on the login pages | yes |
| `VITE_GEMINI_API_KEY` | AI assist in the admin blog editor | optional |
| `VITE_GHL_WIDGET_ID` | Chatbot widget | optional |
| `VITE_RECAPTCHA_SITE_KEY` | Contact-form captcha | optional |

The optional ones are currently unset (they were unset in the Next.js app too);
those widgets simply do not render until a key is supplied.

The backend keeps its own `.env` in the `telexph-admin` repo — server secrets
(Mongo URI, JWT keys, Cloudinary, Gmail) belong there, never here.

## Authentication

The old `middleware.ts` verified the JWT cookie on the server before rendering
`/admin/*`. A SPA has no server render step and cannot hold a verification key,
so `src/shared/ProtectedRoute.jsx` takes over: it asks the API whether the
session cookie is valid and redirects to the right login page if not.

The backend remains the real authority — the guard only decides what is shown
while that answer is pending. Each portal probes its own endpoint:

| Portal | Probe | Login |
| ------ | ----- | ----- |
| Admin  | `/users/me`         | `/admin/login` |
| Client | `/auth/client/me`   | `/client/login` |
| VA     | `/auth/va/me`       | `/VirtualAssistant/login` |

## Status

Fully converted and verified: the public marketing site, the funnels, all auth
pages, and all four dashboards (admin, client, VirtualAssistant, VAdash) —
33 dashboard pages plus 23 public/auth routes render, and every guarded route
redirects correctly when signed out.
