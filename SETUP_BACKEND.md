# Backend Setup

The frontend calls the deployed admin backend directly, by absolute URL:

```
https://telexph-admin.onrender.com/api
```

Client code hardcodes this URL rather than reading it from an environment variable.
`NEXT_PUBLIC_*` values are inlined into the browser bundle at build time, so a stale one
silently overrides every fallback — that is what caused the "Network Error - No response
from server" this app used to show, and why `NEXT_PUBLIC_API_URL` is intentionally gone.

## Calling the API from client code

For auth endpoints, use the helpers in `lib/api-base.ts` — they keep the URL in one place
and cover every login, 2FA, and password-reset call:

```ts
import { getAdminAuthenticateUrl } from '@/lib/api-base'

const res = await fetch(getAdminAuthenticateUrl(), {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ email, password }),
})
```

Elsewhere, write the full URL:

```ts
const res = await fetch('https://telexph-admin.onrender.com/api/blogs', {
  credentials: 'include',
})
```

Always include the `/api` prefix. The backend mounts every router twice — at `/blogs` and
`/api/blogs`, `/auth` and `/api/auth`, and so on (see `src/index.ts` in the backend repo) —
but `/api` is the form this codebase standardizes on.

Auth calls must pass `credentials: 'include'`. Because these requests are cross-site
(`telexph.com` → `onrender.com`), the backend sets its cookies with
`SameSite=None; Secure` (see `src/auth/auth.controller.ts`).

Note that uploaded files are served from the backend **root**, not under `/api` — e.g.
applicant resumes in `ApplicantsList.tsx` build their URL as `${HOST}${applicant.resumeUrl}`
with no `/api` segment.

## Local route handlers — do not point these at Render

Some routes are served by this app, not the backend, and are called by **relative** path:

| Path | Handled by |
|---|---|
| `/api/page-views/funnels` | `app/api/page-views/funnels/route.ts` |
| `/api/page-views/funnels/:url` | `app/api/page-views/funnels/[url]/route.ts` |
| `/api/page-views/track` | proxied via the rewrite |
| `/api/ghl/pageview` | `app/api/ghl/pageview/route.ts` |

Rewriting these to the absolute Render URL would bypass the local handler's auth and
data-shaping logic and break funnel analytics. Leave them relative.

These handlers run in Node, where a relative `fetch()` has no origin to resolve against,
so they read the backend URL from a server-only variable:

```
ADMIN_API_BASE_URL=https://telexph-admin.onrender.com
```

Set in `.env`, and **required in the Render environment for this frontend too** — without
it the funnel analytics routes return 500.

## The rewrite in next.config.ts

`next.config.ts` proxies `/api/:path*` to the backend. It's what makes the relative paths
above resolve. Real route files under `app/api/*` take precedence over it.

## Pointing at a local backend

Client code hardcodes the production URL, so a local backend means editing the URLs you
want to redirect (the backend's default port is `5000`). For auth flows, changing the
return value of `getApiBaseUrl()` in `lib/api-base.ts` covers all of them at once. Revert
before committing.

## Troubleshooting

**"Network Error - No response from server"** — the backend is unreachable. Render's free
instances sleep and take ~30s to wake on the first request.

**401 on every request** — the auth cookie isn't being sent. Confirm the call passes
`credentials: 'include'`. Since these are cross-site requests, also check whether the
browser is blocking third-party cookies (Safari blocks them by default, as does Chrome in
incognito) — that is the main cost of calling the backend by absolute URL, and the
`next.config.ts` rewrite is the fix if it becomes a problem.

**404 on a route that exists** — check the `/api` prefix.
