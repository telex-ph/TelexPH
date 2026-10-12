# TelexPH client

Vite + React 19 + Tailwind 4 + react-router-dom 7. `@` → `src/`. Backend API lives in the sibling `telexph-admin` project.

```
npm run dev      # images + vite
npm run build    # images + vite build + prerender
npm run lint
npm test         # node --test
```

## Admin dashboard (`src/pages/admin/dashboard/`)

- Routes are registered in `src/App.jsx` (lazy import + `<Route>` under `/admin/dashboard`, inside `ProtectedRoute`).
- Sidebar entries live in `baseNavigationItems` in `dashboard/Layout.jsx`.
- Each page is a folder with `Page.jsx` (thin wrapper) + the real component.
- Colors come from CSS tokens in `src/styles/admin-theme.css`; the active theme is set by `data-admin-theme` on `<html>` (`src/lib/admin-theme.jsx`, 20 themes, default `light`).
- In JS, `useDashboardTheme()` returns the same tokens as `var(--admin-*)` strings plus `isdarkmode`.

## Admin design branding — MANDATORY for every new or edited admin page

### Palette

| Name | Token | Hex | Use |
| --- | --- | --- | --- |
| Red | `--brand-red` → `--admin-accent` | `#A10000` | Primary buttons, links, active nav, key highlights |
| Dark Maroon | `--brand-maroon` → `--admin-accent-hover` | `#530607` | Hover/pressed state, dark gradient ends |
| Dark Gray/Black | `--brand-black` → `--admin-text` | `#282828` | Body text, dark-mode surfaces |
| Light Gray | `--brand-gray` → `--admin-bg` | `#F5F5F4` | Page background |
| White | `--brand-white` → `--admin-surface` | `#FFFFFF` | Cards, panels, modals |

CMYK for print: Red 0/100/100/37 · Black 0/0/0/84 · Light Gray 0/0/0/4 · Maroon 0/93/92/67.

### Rules

1. **Never write raw hex for brand or neutral colors.** Use `var(--admin-*)`:
   `--admin-bg`, `--admin-bg-soft`, `--admin-bg-hover`, `--admin-surface`, `--admin-surface-raised`,
   `--admin-text`, `--admin-text-sub`, `--admin-text-faint`, `--admin-text-on-accent`,
   `--admin-border`, `--admin-border-strong`, `--admin-accent`, `--admin-accent-hover`, `--admin-accent-soft`, `--admin-accent-text`,
   `--admin-shadow-sm|md|lg`. Raw hex breaks the 20-theme switcher and dark mode.
2. **Red as TEXT or icon color** (asterisks, links, step numbers, selected pills) must be `var(--admin-accent-text)`, not `--admin-accent`: dark themes lighten it so it stays readable. `--admin-accent` is for fills and borders only.
3. **Status colors** use `--admin-danger|success|warning|info|noshow` (+ `-bg`). Red is the brand color, so use `--admin-danger` for destructive/error states only — not as decoration.
4. **Primary button**: `bg-[var(--admin-accent)] text-[var(--admin-text-on-accent)] hover:bg-[var(--admin-accent-hover)]`.
   Gradients: `linear-gradient(135deg, var(--admin-accent), var(--admin-accent-hover))`.
5. **Canvas/Chart.js can't read CSS vars** — pass literal `#A10000` / `#530607` (brand reds) there, and branch on `isdarkmode` for neutrals.
6. Cards: `var(--admin-surface)` + `1px solid var(--admin-border)` + `--admin-shadow-sm`. Page background: `var(--admin-bg)`.
7. Both light and dark must work — check at least `light` and `dark-maroon` (brand dark) before finishing.

### Typography

| Role | Font | Weight | How |
| --- | --- | --- | --- |
| Headers | **Poppins** | **900 (Black)** | Use real `<h1>`–`<h6>` (or `className="font-heading"`) — `dashboard/Layout.jsx` forces Poppins 900 on them |
| Body | **Open Sans** | 400 (600/700 for emphasis) | Default for everything else; forced globally by `Layout.jsx` |
| Accent | **Bright (DEMO)** — serif/slab | — | `className="font-accent"`. **Sparingly**: one tagline/subtitle per page at most (e.g. the Dashboard overview subtitle). Never for body, tables, buttons or labels |

- Tokens: `--font-heading`, `--font-body`, `--font-accent` in `src/styles/admin-theme.css`.
- Do **not** add `fontFamily: "'Poppins'..."`, per-page `@import url(...fonts.googleapis...)`, or `* { font-family }` rules in new pages. They are redundant or fight the global rule.
- Poppins 900 and Open Sans 400/600/700 are loaded by `index.html`. Need another weight? Add it there.
- "Bright (DEMO)" has no font file in the repo; `--font-accent` falls back to Rockwell → Roboto Slab → Georgia. To use the real face, add an `@font-face { font-family: "Bright"; src: url(/fonts/...) }` — no other change needed.

### Scale and sidebar

- The whole dashboard is scaled by `--admin-zoom` (1.28, in `admin-theme.css`) via `html { zoom }` in `dashboard/Layout.jsx`. Keep authoring in normal px sizes (body 11–13px, titles 18–22px) — do **not** add your own scaling. Full-height shells must be `fixed inset-0` (never `100dvh`/`100vh`: browsers disagree on whether zoom scales them).
- There is **no top navbar**. The sidebar holds nav, the profile card (links to Settings) and Log out (in that order, bottom). Pages start at the top of the content area, so don't add top padding to compensate. On mobile a floating menu button opens the sidebar drawer.
- Sidebar: nav text `--admin-text` 13px/600, icons in 32px chips (accent-colored, white tint when active), hover `--admin-accent-soft`. Don't go back to `--admin-text-faint` for nav labels (unreadable) and don't tighten the row spacing.

### Loading (one file: `src/components/DashboardLoader.jsx`)

Modeled on HostOps' FetchingOverlay: full-screen blurred overlay, random animated brand icon, title, rotating hint. It is the **only** loading UI in the dashboard.

- **Page open only.** `const initialLoading = useInitialLoad(loading);` then `<DashboardLoader isVisible={initialLoading} message="Loading blogs…" />`. `useInitialLoad` is true only for the first load, so refetches caused by filters, tabs, sorting, pagination or toggles never bring it back.
- **Filters/toggles show no loading state at all.** Keep the previous data on screen while the new request is in flight (see `dashboard/EngagementMetricsCard.jsx`: no loading flag after the first fetch, stale responses ignored). Never gate content on the raw `loading` flag (`!loading && <Content/>` unmounts it on every filter click) — gate on `initialLoading`.
- **Busy buttons** (save, approve, restore, generate…) use `<Spinner />` from the same file. No hand-rolled `border-t-transparent` spinners, `animate-spin` svgs, `@keyframes spin`, pulse skeletons or "Loading…" text.
- `<DashboardLoader>` only registers a request; one `<DashboardLoaderHost />` (mounted in `App.jsx`) draws a single overlay while any request is open. Auth check → user fetch → route chunk → page data therefore read as ONE continuous animation. Don't render your own overlay; login/logout use the same loader (`LoginSuccessOverlay`, `LogoutOverlay`).
- Public site: `src/components/PageLoader.jsx` (hourglass + %) is the loading screen for Blogs, Case Studies and case-study details.
- Dev note: dashboard pages can be driven in Playwright by mocking `**/api/**` (`/users/me` must return `{ firstName, lastName, role: 1, department, theme }`).

### New page checklist

- [ ] Folder under `dashboard/<Name>/` with `Page.jsx` + component; route in `App.jsx`; nav item in `Layout.jsx`
- [ ] Zero raw hex for colors (grep your files for `#[0-9a-fA-F]{3,6}` — only chart canvas literals and status data allowed)
- [ ] Title is an `<h1>`; subtitle optionally `font-accent`
- [ ] Primary actions use accent + accent-hover tokens
- [ ] Create/edit forms use the numbered-step card layout of Create Case Study (page header with title + actions, one card per step with a numbered badge, labels above inputs, pills for choices, Reset + primary action at the bottom). `blogs/AddBlogs.jsx` is the cleanest reference: shared `card`/`lbl`/`inp`/`pillStyle`/`StepHead` helpers at the top of the file.
- [ ] Initial fetch wrapped in `useInitialLoad` + `<DashboardLoader />`; filters/toggles keep stale data (no loader)
- [ ] Looks right in `light` and `dark-maroon`
