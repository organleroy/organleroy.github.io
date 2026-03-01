# PROJECT CONTEXT — russellbates.com (Eleventy rebuild)

## Purpose

Rebuild **russellbates.com** as a **fast, static Eleventy (11ty) site** hosted on **GitHub Pages**, matching the old WordPress site’s look precisely (typography, spacing, header width vs grid width, thumbnail behavior), while improving performance, maintainability, and editorial control.

This project strongly favors **CSS-only solutions** whenever possible. JavaScript is avoided for layout and rendering behavior; small JS is acceptable for non-layout behavior (e.g., contact form submission). A small local-only tool is used for homepage curation/export (see below).

This document reflects the **post-deployment, live state** of the project.

---

## Non-negotiables (Read First)

- **Never edit `_site/`** — it is build output and overwritten every build.
- **Edit only under `src/`.**
- **Global styling single source of truth:** `src/assets/css/site.css`
- Prefer **CSS-only** changes for layout and image behavior. No JS for layout.
- Prefer **full-file replacements** over partial diffs.
- **Header, grid, and footer widths must always match** (no full-bleed header).
- Preserve the existing typography system (Montserrat + Open Sans) and the restrained, clean editorial feel.

---

## If Something Breaks, Check Here First

Before assuming a bug or Eleventy issue, check these common causes:

1. **Was a file edited inside `_site/`?**  
   `_site/` is generated output and overwritten every build.  
   All real changes must be made under `src/`.

2. **Did header, grid, or footer widths stop matching?**  
   These must always align via the shared inner max-width math.  
   Check:
   - `--max`
   - `--gutter`
   - `.site-header-inner`
   - `.site-footer-inner`
   - grid containers

3. **Are homepage “outlier” thumbnails pillarboxing again?**  
   Outlier handling depends on:
   - `.card.is-outlier` CSS, AND
   - correct detection logic in `src/index.njk`  
   Detection uses:
   - `thumbMeta.isOutlier` when present
   - filename heuristic fallback (`-500x350` = standard)

4. **Are thumbnail overlays or hover states broken?**  
   Check:
   - `.card-meta`
   - overlay positioning
   - hover darkening rules

5. **Are Featured Work thumbnails missing on project pages?**  
   Confirm `projectBySlug` exists in Eleventy global data.  
   Featured thumbnails depend on this lookup.

6. **Is the contact form not submitting or not writing to Google Sheets / email not firing?**  
   There are two moving pieces:
   - Frontend: `src/about.njk` submits via `fetch()` to Apps Script and then redirects to `/thanks/`.
   - Backend: Google Apps Script must be deployed as a Web App (new version) for changes to take effect.
   Also confirm Apps Script `NOTIFY_EMAIL` is set (email notifications).

7. **Is spam suddenly getting through (or legit submissions disappearing)?**  
   Check:
   - honeypot field `company` exists in markup
   - `.hp-field` hides it via CSS but keeps it in the DOM
   - Apps Script discards submissions when `company` is non-empty

8. **Does something look “off” after spacing tweaks?**  
   Recheck recent changes to:
   - `.site-main` padding
   - negative margins (e.g. About page tightening)  
   Small spacing changes can cascade visually.

If a problem persists after these checks, review recent commits and consult `CHANGELOG.md` before changing behavior.

---

## Stack / Repos / Hosting (Authoritative)

### Live site
- **Primary live URL (canonical):** https://russellbates.com/
- **GitHub Pages URL:** https://organleroy.github.io/ (secondary; not the canonical brand URL)
- **Live repo (canonical):** `organleroy/organleroy.github.io`
- **Hosting:** GitHub Pages
- **Deployment:** GitHub Actions (custom workflow)

This repo contains:
- Eleventy **source**
- GitHub Actions **deployment workflow**
- No committed build output

### Rebuild / history repo
- **Source-history repo:** `organleroy/russellbates-rebuild`
- Purpose:
  - development history
  - architectural evolution
  - pre-launch rebuild work
- Not used for live deployment

### Historical preservation
The previous WordPress static export is preserved in the live repo as a tag:

- `wp-static-export-pages` → last deployed WordPress (Simply Static) version
- `eleventy-live` → moment the Eleventy rebuild became live and canonical

These tags are intentional and should not be removed.

---

## Domain & Redirects (Authoritative)

### Primary domain
- **russellbates.com** points to GitHub Pages (A records) with HTTPS enabled in GitHub Pages settings.

### Secondary domains (redirect-only)
- **porkfist.com**
- **russellbates.tv**
- **otisproductions.com**
These remain hosted at InMotion and are used only for redirects to russellbates.com.

Key redirect implementation detail:
- InMotion `.htaccess` contains **host-based redirects above WordPress rules** so WordPress cannot hijack `/anything`.

---

## Local Development

- From repo root:
  - `npm run dev`
  - served at: `http://localhost:8080`

---

## Project Structure (Key Files)

### CSS / Layout
- Global CSS: `src/assets/css/site.css`
- Base layout: `src/_includes/base.njk`
- Homepage (Work grid): `src/index.njk`

### Content / Data
- Portfolio data: `src/content/projects.json`
- Data normalization: `src/_data/projects.cjs`
- Homepage ordering: `src/_data/home.json`

### Tools (Local-only)
- Homepage curator: `tools/home-curator.html`
  - Drag-and-drop text-only “note card” ordering
  - Exports **first 39 slugs only** to `src/_data/home.json`
  - Mirrors WordPress admin ordering
  - **Intentionally committed**:
    - documents editorial intent
    - aids future maintenance
    - does not ship to production

### Templates / Pages
- Project pages: `src/work/project.njk` → `/work/{{ slug }}/`
- About / Contact: `src/about.njk`
- Thanks page: `src/thanks.njk`
- Sitemap: `src/sitemap.njk` → `/sitemap.xml`

---

## Data Model (`projects.json`)

All projects (homepage + bench) use a **single unified schema**:

- `title` (stored as `Brand "Project Title"`)
- `slug`
- `thumb`
- `vimeo_id`
- `subtitle` (string; may be empty)
- `agency` (string; may be empty)
- `featured_slugs` (array of 4)
- `featured_home` (boolean; informational only)

### Derived fields (`projects.cjs`)
- `brand`
- `spot`
- `spotQuoted`
- Compatibility aliases:
  - `subhed` → `subtitle`
  - `blurb` → `agency`

**Canonical fields are `subtitle` and `agency`.**  
Aliases exist only to prevent regressions and must not be reintroduced into `projects.json`.

---

## Homepage (“Work”) Page

### Ordering & Curation
- Ordered via `src/_data/home.json`
- Represents visual/editorial flow
- Only **first 39 items** render
- Bench projects remain untouched until promoted

### Grid
- Desktop: 3 × 13 (39 items)
- Responsive: 3 → 2 → 1
- Gap: 10px
- Aspect ratio: 10:7

### Thumbnail image behavior
- Default: `object-fit: contain`
- Outliers: `.card.is-outlier { object-fit: cover }`
- Detection:
  - `thumbMeta.isOutlier`
  - filename heuristic fallback

### Thumbnail text (homepage only)
- Brand: ALL CAPS (Montserrat)
- Title: ALL CAPS, quoted
- Line 3:
  - show `subtitle` if present
  - else show `agency`
  - else nothing

This fallback logic applies **only on the homepage**.

---

## Header (Critical Design Match)

- Not full-bleed
- Width exactly matches grid
- Implemented via:
.site-header-inner {
max-width: calc(var(--max) - (var(--gutter) * 2));
}

Typography:
- Name: Open Sans, 30px, orange `#ff5a01`, uppercase
- Role: Open Sans, 18px, white, uppercase
- Nav: Montserrat, 14px, uppercase

Breakpoint: ~760px

---

## Footer

- Text-only footer (matches old site)
- Width matches header and grid
- Tight vertical spacing beneath grid

---

## Individual Project Pages (`/work/<slug>/`)

Template: `src/work/project.njk`

### Title above video
- Line 1: Brand (ALL CAPS)
- Line 2: Spot title (ALL CAPS, quoted)
- Same size, centered

### Credits under video
- Left-aligned
- Order, no duplication:
- `subtitle`
- `agency`
- fallback to `blurb` only if `agency` missing

### Featured Work strip
- Uses `featured_slugs`
- Requires `projectBySlug`
- Line 3 remains **subtitle-only** (no agency fallback)

---

## About / Contact Page

Source: `src/about.njk`

- Bio from original WordPress site (with added disambiguation note about the sci-fi writer of the same name)
- Lead paragraph styled via `.about-lead`
- Contact form posts to Google Apps Script via `fetch()` and then redirects to `/thanks/`

### Honeypot
- Field name: `company`
- Hidden via `.hp-field`
- Apps Script ignores submissions when filled

---

## Contact Backend (Google Apps Script)

- Script is deployed as a Web App and receives POST submissions.
- Writes rows to Google Sheet tab: `Contact Responses` (Timestamp, Name, Email, Message).
- Sends email notifications to `NOTIFY_EMAIL` after successful append.
- IMPORTANT: Script edits require deploying a new Web App version to take effect.

---

## Thanks Page

Source: `src/thanks.njk`

- Confirmation message
- CTA links back to `/`

---

## SEO / Indexing / Analytics (Current State)

### Canonical tags
- Sitewide canonical tag is emitted from `src/_includes/base.njk`:
  - `https://russellbates.com{{ page.url }}`

### Structured data (disambiguation)
- Sitewide JSON-LD `Person` in `src/_includes/base.njk` includes:
  - `disambiguatingDescription` referencing the sci-fi writer (1941–2018)
  - `sameAs` IMDb URL for identity reinforcement

### Sitemap
- `src/sitemap.njk` generates `/sitemap.xml` from projects data (ensures full discovery of `/work/<slug>/` pages).
- Submitted in Google Search Console to accelerate discovery/indexing of work pages.

### Google Analytics
- GA4 is installed sitewide in `src/_includes/base.njk`.

### Search Console
- Search Console property is verified and linked to GA4.
- After migration, some pages may initially be “URL unknown to Google” until discovered; sitemap + selective “Request indexing” resolves discovery.

---

## CSS Notes

- Single source of truth: `src/assets/css/site.css`
- Variables defined in `:root`
- Spacing is intentionally tight and interdependent
- Be cautious adjusting:
- `.site-main`
- `.card-meta`
- header/footer inner widths

---

## Workflow (Authoritative)

Local:
1. Edit files under `src/`
2. Run `npm run dev`
3. Validate at `http://localhost:8080`

Deploy:
1. Commit to `main`
2. Push to `organleroy/organleroy.github.io`
3. GitHub Actions builds Eleventy and deploys `_site` to Pages

No manual Pages publishing.  
No branch-based deployment.  
No committed build output.

---

## Current Baseline (Post-Launch)

- Eleventy rebuild is live and canonical at russellbates.com
- Homepage grid stable and polished
- Outlier thumbnails handled correctly
- Text hierarchy intentional and consistent
- Project pages correctly formatted
- About/Contact working with spam protection + email notifications
- Footer aligned and tight
- Data schema unified
- Deployment workflow clean and intentional
- Canonicals, Person structured data, GA4, and sitemap.xml present and submitted

---

## Appendix: Quick Commands & Common Gotchas

### Local development
Run the Eleventy dev server locally:
```bash
npm run dev
```

### Check what changed
See the current Git working state:
```bash
git status
```

### See differences (paged output)
View uncommitted changes:
```bash
git diff
```

If the screen looks “stuck”, press:
```
q
```
(This exits the pager and returns you to the prompt.)

### Stage files
Stage a specific file:
```bash
git add path/to/file
```

Or stage everything intentionally:
```bash
git add .
```

### Commit (local snapshot)
Create a local commit:
```bash
git commit -m "Clear, descriptive message"
```

### Push to GitHub (deploy)
Send commits to GitHub (this triggers deployment):
```bash
git push origin main
```

### Terminology (important)
- **Commit** = save a snapshot locally in Git  
- **Push** = send commits to GitHub  
- **Deploy** = GitHub Actions builds + publishes automatically after push  

You never deploy manually.

### If something feels “off”
- Stop
- Run `git status`
- Check recent commits
- Revert cleanly rather than patching blindly

This project is designed to be **calm, reversible, and predictable**.