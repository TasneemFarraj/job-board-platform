# Jobbr — Job Board Application

A job board built for the Engagesoft frontend coding assessment. Fetches live
listings from the [Himalayas](https://himalayas.app/jobs/api/search) API,
supports bookmarking, a full apply flow with client-side application tracking,
and complete English / Arabic (RTL) localization.

## Running the app

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. To build for production: `npm run build` (output in `dist/`).

## Tech stack & decisions

| Tool | Role | Why |
|---|---|---|
| React 18 + TypeScript + Vite | Core framework | Fast HMR dev loop; TS catches shape mismatches at compile time |
| Tailwind CSS v4 | Styling | Theme tokens in `src/index.css` map directly to the Jobbr design system (indigo primary, gray neutrals, dark palette) |
| Zustand + `persist` | Global state | Minimal boilerplate vs Redux/Context; selective subscriptions avoid unnecessary re-renders; `persist` middleware satisfies the "survive refresh" requirement with zero extra code |
| React Hook Form + Zod | Apply form | Schema-driven validation — errors only appear after blur/submit as specified; Zod schema lives in `applySchema.ts` and is shared between the form and TypeScript types |
| react-i18next | i18n / RTL | EN/AR translations in `src/i18n/locales/`; language switch flips `document.dir` at runtime via a `languageChanged` listener — no reload needed |
| React Router v6 | Routing | Three routes: `/` (Browse), `/saved` (Saved Jobs), `/applications` (My Applications) |

## Architecture

```
src/
├── api/              Himalayas fetch + response normalization to the internal Job type
├── components/
│   ├── ui/           Generic building blocks: Badge, Button, Dropdown, EmptyState,
│   │                 Skeleton, Tooltip
│   ├── jobs/         JobCard, SearchBar, Filters, Pagination, JobCardSkeleton
│   ├── apply/        ApplyModal, ConfirmationModal, Zod validation schema
│   └── layout/       Navbar, UserMenu, MobileTabBar, ThemeToggle, ErrorBoundary
├── pages/            BrowseJobs, SavedJobs, MyApplications (route-level components only)
├── store/            Zustand stores: bookmarksStore, applicationsStore, themeStore
├── hooks/            useDebounce — generic debounce hook
├── i18n/             Locale JSON files (en / ar) + runtime RTL config
├── lib/              format.ts — salary formatting, cx class helper
└── types/            Shared TypeScript types: Job, JobApplication, ApplicationStatus
```

## Key features & behaviors

### Job browsing & search

- **Live keyword search** — debounced 300 ms; typing filters results automatically. The **Search button** commits the current query instantly (bypasses the debounce timer), useful for keyboard / accessibility users. Pressing Enter on either input has the same effect.
- **Location search** — debounced 300 ms; filters by the job's location string (`city · country`).
- **Category & seniority filters** — pill-style dropdowns in the filter bar. Category supports incremental search. Seniority options are derived from the live API response (excluding "Not specified").
- **Sort** — five orders (Most relevant / Newest / Salary high–low / Salary low–high / Company A–Z) available both as a pill dropdown and as quick-access chips below the filter bar.
- **Clear all filters** — single button resets keyword, location, category, seniority, and sort simultaneously. The button activates whenever *any* filter is non-default, including a typed keyword. Clearing from an empty-results state always restores all jobs.
- **Inline clear (×) buttons** — appear inside each text input whenever it has a value, allowing instant clearing without the keyboard.
- **Pagination** — 6 jobs per page; arrow direction flips correctly in RTL.

### Job cards

- Job title and location each truncate to one line with a custom tooltip that only appears when the text is actually overflowing (detected via `ResizeObserver`).
- Location prefixed with a `MapPin` icon.
- Salary displayed on its own line; shows italic muted text when undisclosed.
- Bookmark toggle updates the saved-count badge in the navbar in real time.

### Apply flow

1. Click **Apply** on any job card → `ApplyModal` opens (wider `max-w-lg`, scrollable).
2. Required fields (Full name, Email, CV upload) are marked with a red `*`. The Submit button is disabled until a CV file is selected.
3. On submit the modal closes and `ConfirmationModal` shows the submitted details (name, email, CV filename) with the submission date.
4. The job card's button changes to **Applied** and is disabled — persists across page reloads via `localStorage`.

### Saved Jobs

- Bookmark any job from the card; find it on `/saved`.
- Stale bookmark IDs (jobs no longer returned by the API) are silently pruned on page load so the badge count is always accurate.
- Apply flow is available directly from the Saved Jobs page.

### My Applications

- Reads exclusively from the Zustand `applicationsStore` — no API calls.
- Real-time search (job title / company), status filter chips, and a date-range dropdown (All time / Last 30 days / Last 90 days).
- Status assigned randomly on submit from the four required values: Under review, Interview, Rejected, Withdrawn.
- Company avatars use a deterministic color derived from the company name so the same company always gets the same color across sessions.

### Theme & localization

- Light / Dark mode toggle in the user menu; preference persisted in `localStorage`.
- Language toggle (EN ↔ AR) in the navbar; flipping to Arabic switches the entire layout to RTL including sort chip order, pagination arrows, and input icon placement.

## Why client-side filtering

The Himalayas API's `keywords`, `category`, and `seniority` query params do not
reliably filter server-side (verified by comparing responses with and without them).
Rather than build against an unreliable contract, the app fetches ~100 listings once
and handles all filtering client-side. This is also faster for the user — no network
round-trip per keystroke — and keeps the job listing feature fully functional regardless
of upstream API behavior.

## CORS note

The Himalayas API does not send permissive CORS headers for arbitrary browser origins.
`npm run dev` routes requests through a Vite dev proxy (`vite.config.ts`) so the
browser talks same-origin and Vite forwards the request server-side. **This covers
local development only.** For a production deployment, place a small serverless / edge
function in front of the Himalayas endpoint and point `BASE_URL` in
`src/api/himalayas.ts` at that proxy instead.

## Known limitations / next steps

- **No automated tests** — given the timeline, manual verification was prioritized.
  Would add Vitest + Testing Library for store logic, form validation, and filter
  behaviour next.
- **Application status is static** — status is assigned randomly on submit and never
  updated, as there is no backend. A real implementation would poll or use WebSockets
  to reflect recruiter actions.
- **CV file not uploaded** — only the filename is stored in the Zustand store. A
  production version would upload to object storage and store a URL.
