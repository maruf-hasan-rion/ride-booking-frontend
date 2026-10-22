# GoMove — Frontend

React 19 + Vite SPA for the GoMove ride-booking platform: public marketing pages plus role dashboards for riders, drivers and admins. Data and state run entirely through **Redux Toolkit + RTK Query** against the GoMove backend (cookie-based auth), styled with **Tailwind v4 + shadcn/ui** on one emerald token system, with Leaflet maps and OpenRouteService routing.

> Companion backend: `ride-booking-system` (Express 5 + Mongoose 9). Its README documents the API list and the ride state machine enforced server-side.

## What actually works (verified)

- **Marketing:** Home, About, Features, Pricing, Contact, FAQ — token-driven styling (light + dark), `.brand-gradient-*` utilities, `section-shell` layout.
- **Auth:** login/register (React Hook Form + Zod), OTP verification, Google OAuth (deployed-only), one-time role setup for role-less accounts, session gates via `useAccount()` with a dedicated blocked/suspended page and role-aware redirects.
- **Rider:** map-first booking — pickup auto-filled via geolocation, tap to set destination, live route polyline with a graceful no-route fallback (booking never depends on the route service: fares are computed server-side), 5-second status polling, **cancel until pickup** with conflict-aware toasts (the losing side of a race gets the backend's precise message), ride details with timeline + driver info, filterable history (server status/search/date + client-side fare range).
- **Driver:** profile gate → availability switch (needs admin approval to enable) → incoming-requests queue with Accept/Reject; a race loser sees the backend message (`already accepted by another driver` / `you already have an active ride`); active ride advances with one button that mirrors the server's transition map; earnings cards + chart.
- **Admin:** analytics, ride oversight (server-side filters/search/pagination), user management (block/unblock riders, approve/suspend drivers), single-ride map view.

## Tech stack

React 19 · Vite 7 · TypeScript · Redux Toolkit + RTK Query (axios base) · Tailwind v4 (`@theme` tokens) · shadcn/ui (new-york) · Leaflet / react-leaflet 5 · Recharts · Sonner · React Router 7 (lazy routes) · Vitest + React Testing Library.

## Requirements

Node.js ≥ 20 · npm 10+ · a running GoMove backend (reachable `/api/v1`).

## Setup

```bash
cp .env.example .env.local   # VITE_API_URL_DEV / VITE_API_URL_PROD (backend URL incl. /api/v1)
npm install
npm run dev                  # http://localhost:5173
```

Useful accounts once the backend seed ran (`npm run seed` in the backend). The emails are fixed; the passwords come from the backend's `SEED_PASSWORD` and `SEED_ADMIN_PASSWORD`:

| Role   | Email                  |
| ------ | ---------------------- |
| Admin  | admin@seed.gomove.app  |
| Rider  | rider@seed.gomove.app  |
| Driver | driver@seed.gomove.app |

`.env.example` documents every variable (demo-login vars are optional; `VITE_ORS_API_KEY` only controls client-side route drawing, not the booking flow). Real values stay in `.env.local` (gitignored) or in the hosting provider's environment settings.

### Scripts

| Command          | Purpose                               |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Vite dev server                       |
| `npm run build`  | `tsc -b` + production build (`dist/`) |
| `npm run preview`| serve the production build            |
| `npm run lint`   | eslint                                |
| `npx vitest run` | unit/component tests                  |

## Architecture map

```text
src/
  components/
    ui/                 shadcn primitives (token-driven)
    shared/             DataStateView, PaginatedDataTable, ListFilterBar,
                        FareRangeInputs, StatusBadge, account/safety cards
    modules/            feature components: Authentication, User, Driver, Admin
    layout/             Navbar, Footer, AppSidebar, DashboardLayout
  pages/                public pages + User/, Driver/, Admin/ dashboards
  routes/               role sidebar manifests → generateRoutes + withAuth guards
  redux/                store, baseApi (axiosBaseQuery), feature APIs:
                        auth, ride, driver, admin, stats
  hooks/                useAccount, useToastAction, useLogoutSession,
                        useListQueryState, useRoleRedirect
  constants/            role, urls (ORS/OSM/auth), polling intervals, paths,
                        rideStatus options
  types/                domain.ts (enums/statuses), ride.ts (shared helpers)
  utils/                apiResponse (envelope parsing), mapRoute, formatters,
                        formValidation, withAuth, generateRoutes
```

## Backend contract

- Envelope: `{ statusCode, success, message, data, meta? }`; `utils/apiResponse.ts` unwraps single/double-nested payloads and reads messages from `message` or zod-style `errorSources[]`.
- Booking posts GeoJSON points (`pickupLocation`, `destination`, `currentLocation`, coordinates `[lng, lat]`); the server validates coordinate ranges and rejects `same-location` or unrouteable requests instead of booking fare-0 rides.
- Auth is cookie-based (`withCredentials`); a 401 surfaces as a re-login path (no silent refresh loop, by design).
- Roles come from the server; every UI guard is convenience, not security (enforcement is the API's job — see the backend README).

## Quality checks

```bash
npm run lint && npx vitest run && npm run build
```

All three are clean at the time of writing (0 errors; two upstream shadcn `react-refresh` warnings).

## Deployment notes

- Set `VITE_API_URL_PROD` to the deployed backend URL (including `/api/v1`); CORS and Google OAuth origins must match — see `../DEPLOYMENT.md`.
- Keep real values in the provider's environment. `VITE_*` values are public in the built bundle: never put server-side secrets (including the backend ORS key) there. Demo-login defaults to off in production; enable it only for a demo deployment with rotating credentials.

## Known limitations (honest list)

- Realtime is polling (no websockets); no ETA or live-driver-position streaming.
- Payments are out of scope (cash-on-completion messaging in the UI).
- Google OAuth and OTP email depend on the deployed backend environment; locally they degrade (OTP needs SMTP/Redis).
- Address search/geocoding is not implemented — destinations are chosen on the map.
