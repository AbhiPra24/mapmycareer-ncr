# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MapMyCareer is a geo-spatial tech job discovery platform for India. It maps 1,450+ verified real job postings from major ATS systems (Greenhouse, Lever, Ashby, Naukri) to exact office campus coordinates across Indian tech corridors (Bengaluru, Gurugram, Noida, Hyderabad, Pune, Mumbai, Chennai). Deployed at https://www.mapmycareer.online on Vercel.

## Repository Structure

```
mapmycareer-ncr/
├── web/                    # Next.js 16 App Router frontend (main app)
│   ├── src/
│   │   ├── app/            # App Router pages + API routes
│   │   ├── components/     # React components (MapView, FilterBar, modals, etc.)
│   │   ├── lib/            # Core logic (atsAuditor, emailValidator, filterUtils, latexTemplates, corridors)
│   │   └── types/          # TypeScript interfaces (Job, FilterState)
│   └── public/data/        # Static jobs.json served to client
├── utils/                  # Python data pipeline scripts
│   ├── job_ingestion_engine.py   # Multi-source ATS ingestion (Greenhouse/Lever/Ashby APIs)
│   ├── job_liveness_validator.py # Prunes stale job listings
│   ├── geocoder.py               # Nominatim geocoding with SQLite cache + fallback hubs
│   └── update_exact_locations.py # Exact office tower coordinates database
├── data/                   # Master job dataset (sample_jobs.json, ~12MB)
└── content/                # SEO strategy docs, LinkedIn post templates
```

## Development Commands

All commands run from the `web/` directory unless noted otherwise.

```bash
# From repo root
cd web

# Development
npm run dev          # Next.js dev server on http://localhost:3000

# Build & Production
npm run build        # Production build (TypeScript errors ignored in next.config.ts)
npm run start        # Start production server

# Linting & Typecheck
npm run lint         # ESLint (next/core-web-vitals + typescript configs)
npx tsc --noEmit     # TypeScript typecheck (run from web/)

# Testing
npm run test         # Vitest single run (happy-dom environment)
npm run test:watch   # Vitest in watch mode
npm run test:coverage # Vitest with coverage

# Running a single test file
npx vitest run src/lib/__tests__/emailValidator.test.ts

# Python data pipeline (from repo root, requires python 3.10+ with requests + geopy)
python3 utils/job_ingestion_engine.py    # Ingest fresh jobs from ATS APIs
python3 utils/job_liveness_validator.py  # Validate and prune stale jobs
```

## Architecture

### Frontend (`web/`)
- **Next.js 16 App Router** with React 19. The main page (`src/app/page.tsx`) is a client component that fetches `/data/jobs.json` statically and renders a split-screen layout: scrollable job card list (left) + Leaflet map (right).
- **Filtering pipeline**: Client-side filtering using `filterUtils.ts` with `Fuse.js` fuzzy search. Filters include city, hub, experience level, workplace model, salary range, and skills. Results are lazily rendered (40-item increments on scroll).
- **CareerForge modals**: Three utility modals — ATS Resume Auditor (PDF/DOCX/TXT parsing via `pdfjs-dist` and `mammoth`), Resume Builder (LaTeX/Markdown/Text export via `latexTemplates.ts`), and Recruiter Email Validator (RFC 5322 syntax + DNS/MX lookup via API route).
- **Dynamic corridor pages**: `src/app/jobs/[city]/[corridor]/page.tsx` is statically generated from `TECH_CORRIDORS` config in `lib/corridors.ts`. Each corridor has structured FAQ schema, salary benchmarks, and metro transit info.
- **Vercel integrations**: Edge Config (`lib/edgeConfig.ts`) for feature flags/announcements, KV (`lib/kvCache.ts`) for DNS MX cache and rate limiting with in-memory fallback when KV env vars are absent.
- **Styling**: Tailwind CSS v4 with dark/light theme via `prefers-color-scheme`. Use `dark:` variant consistently.
- **Maps**: React-Leaflet with `leaflet.markercluster`. Map tiles from OpenStreetMap/CartoDB CDN. Map is always mounted (even when hidden on mobile) to pre-warm tile cache.

### Data Pipeline (`utils/`)
- **Ingestion engine** (`job_ingestion_engine.py`): Fetches jobs from Greenhouse, Lever, Ashby, Arbeitnow, Remotive, and Jobicy APIs. Builds job records with city detection, experience level inference, and hub assignment. Deduplicates by `apply_url` and appends to `data/sample_jobs.json` and `web/public/data/jobs.json`.
- **Location refinement** (`update_exact_locations.py`): Contains a large `EXACT_OFFICES` dictionary mapping `(City, Company)` tuples to verified office tower names and GPS coordinates. Applies deterministic micro-jitter to prevent overlapping map pins.
- **Liveness validator** (`job_liveness_validator.py`): HTTP-checks existing job URLs in parallel using `ThreadPoolExecutor` and prunes dead/stale entries.

### CI/CD (GitHub Actions)
- **ci.yml**: Runs on push/PR to main — ESLint, TypeScript typecheck, Vitest tests, Next.js production build.
- **ingest.yml**: Scheduled every 12 hours + on merge to main — runs Python ingestion engine, commits updated job data with `[skip ci]` to avoid re-triggering CI.
- CI ignores changes in `data/**`, `web/public/data/**`, and `README.md`.

## Key Patterns

- **Path alias**: `@/` maps to `src/` in both TypeScript and Vitest config.
- **Data flow**: Python ingestion → `data/sample_jobs.json` + `web/public/data/jobs.json` → fetched client-side at runtime → filtered in-browser.
- **Corridor config**: All tech corridor metadata (coordinates, metro lines, salary ranges, FAQs) lives in `src/lib/corridors.ts` as a single source of truth.
- **API routes**: `POST /api/verify-email` — DNS MX lookup with KV caching and rate limiting. `GET /api/og` — Dynamic OG image generation. `GET /api/cron/health-check` — Vercel cron endpoint.
- **TypeScript config**: `tsconfig.json` targets ES2017 with bundler module resolution. `next.config.ts` has `ignoreBuildErrors: true` (CI runs tsc separately).

## AGENTS.md Operational Rules

This repo enforces strict token optimization for agent interactions. Key rules:
- **Zero fluff**: No greetings, preambles, or unsolicited explanations.
- **Surgical edits only**: Never rewrite entire files for small changes.
- **No folder crawls**: Ask for specific file paths instead of recursive directory listings.
- **Plan gate**: For multi-file changes, present a 3-4 bullet plan and await confirmation before executing.
- **2-strike fail-fast**: If a command fails twice consecutively, halt and present the error. Do not auto-retry.
- **Session hygiene**: Remind user to `/clear` after completing self-contained tasks.
