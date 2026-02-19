# CHANGELOG — russellbates.com (Eleventy)

This file records **design, data-model, architectural, and deployment decisions**
that are not obvious from the code alone.

It is intentionally **high-level, editorial, and human-readable**.
This is not a commit log.

---

## 2026-02-17 — Eleventy Site Live + Deployment Canonicalized

### Canonical site & hosting
- The Eleventy rebuild is now the **canonical live site** at:
  - https://russellbates.com/
- Site is served via **GitHub Pages**, backed by GitHub Actions.
- GitHub Pages default URL (`https://organleroy.github.io/`) remains as a technical alias only.

### Canonical repository
- The authoritative live repository is now:
  - `organleroy/organleroy.github.io`
- All future development, fixes, and enhancements happen there.

### Deployment architecture
- GitHub Pages deployment is **GitHub Actions only**.
- Branch-based publishing is intentionally not used.

### Historical preservation (intentional)
- Preserved the previous WordPress static export as a Git tag:
  - `wp-static-export-pages`
- Marked the initial Eleventy live baseline as:
  - `eleventy-live`

### Workflow hygiene
- Canonical deploy workflow:
  - `.github/workflows/pages.yml` (“Build and Deploy (Eleventy)”)
- Removed redundant legacy workflow:
  - `.github/workflows/deploy.yml`
- The auto-generated `pages-build-deployment` workflow history is considered obsolete.

### Domain & routing
- `russellbates.com` now points directly to GitHub Pages via DNS.
- HTTPS is enforced at the GitHub Pages layer.
- Secondary domains:
  - `otisproductions.com`
  - `porkfist.com`
  - `russellbates.tv`
  continue to 301-redirect to `https://russellbates.com` via InMotion Hosting.

### 404 behavior
- Added a custom `404.html` (via Eleventy) to handle unknown routes.
- Any unknown path (e.g. `/foo/bar`) now cleanly redirects to the homepage.

---

## 2026-02-15 — Baseline Established

### Homepage curation & ordering
- Replaced WordPress drag-and-drop homepage ordering with a **slug-based curation system**.
- Homepage order is defined by `src/_data/home.json`, containing an ordered list of project slugs.
- Only the **first 39 slugs** are rendered on the Home / Work page (13 × 3 grid).
- Bench projects remain untouched until explicitly promoted.

#### Editorial workflow
- Added a local-only curator tool: `tools/home-curator.html`.
- Tool provides a **text-only “note card” list** of homepage projects.
- Export function writes the first 39 slugs into `home.json`.
- Tool is intentionally committed to document editorial intent.
- Tool does not ship to production and has no runtime impact.

---

### Data model unification
- Standardized **all projects** (homepage + bench) on a single schema in `projects.json`.
- Canonical fields:
  - `subtitle` → descriptive line
  - `agency` → agency / production credit
- Removed ambiguity around legacy `blurb` usage.
- Ensured every project includes `subtitle` and `agency` (strings, may be empty).

#### Compatibility handling
- `projects.cjs` provides backward-compatibility aliases:
  - `subhed` → `subtitle`
  - `blurb` → `agency`
- Aliases exist only to prevent regressions.
- New work must not introduce `blurb` again.

---

### Title parsing & normalization
- Project titles stored as: `Brand "Spot Title"`.
- Reliable parsing of:
  - `brand`
  - `spot`
  - straight and curly quotes
- Prevented double-brand rendering.
- Titles render consistently:
  - Line 1: Brand (ALL CAPS)
  - Line 2: Quoted spot title (ALL CAPS)

---

### Homepage thumbnail rules
- Grid locked to **39 items max**, CSS-only.
- Thumbnail behavior:
  - Default: `object-fit: contain`
  - Outliers: `object-fit: cover`
- Outlier detection uses:
  - `thumbMeta.isOutlier` when present
  - filename heuristic fallback (`-500x350` standard)

#### Thumbnail text logic (homepage only)
- Line 1: Brand
- Line 2: Quoted title
- Line 3:
  - Show `subtitle` if present
  - Else show `agency`
  - Else show nothing

(Featured Work thumbnails intentionally do not use this fallback.)

---

### Project pages (`/work/<slug>/`)
- Two-line title above video (brand + quoted spot).
- Credits under video:
  - Left-aligned
  - Displays `subtitle`, then `agency`
  - Fallback to `blurb` only if `agency` missing
  - De-duplication guard prevents repetition
- Featured Work strip restored:
  - “FEATURED WORK” + “MORE >”
  - Depends on `projectBySlug` global data

---

### About / Contact
- Lead paragraph styling added for stronger editorial opening.
- Contact form implemented via **Google Sheets + Apps Script**.
- Honeypot spam protection verified.
- `/thanks/` confirmation page added with CTA back to Work.

---

### Layout / design system
- Tightened vertical rhythm throughout.
- Reaffirmed non-negotiable rule:
  - Header, grid, and footer inner widths must always match.
- Layout remains CSS-only.

---

## 2026-02-10

### Data / templates
- Fixed missing Featured Work thumbnails by restoring `projectBySlug`.
- Standardized project title formatting across homepage and project pages.

---

## 2026-02-08

### Architecture
- Migrated site from WordPress to static Eleventy (11ty).
- Established `src/` as the only editable source.
- Treated `_site/` as disposable build output.
- Initial GitHub Pages deployment established.