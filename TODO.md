# Site TODO

Public backlog for follow-up work on viewbus-site. Local/manual steps that the
agent can't do are tracked in `docs/todo.md` instead.

## Content

- [ ] Replace placeholder `public/og.png` (currently solid bg + cyan accent bar) with a designed version — "ViewBus" in Geist + tagline in muted grey
- [ ] Capture `public/screenshots/hero.png` (1920×1200, dark mode, tree + messages) and swap the placeholder div in `src/pages/index.astro`
- [ ] Capture `public/screenshots/spotlight.png` — `Ctrl+I` open with results
- [ ] Capture `public/screenshots/mcp.png` — MCP tool list or Claude integration demo
- [ ] Replace the placeholder ViewBus mark (currently a generic cyan+plus glyph) with the real logo — used in `src/components/Nav.astro` and `public/favicon.svg`
- [ ] Short "About the author" blurb (footer or `/about`)

## SEO

- [ ] Submit the site to Google Search Console, verify via DNS TXT
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Add `AggregateRating` to the JSON-LD schema once there are real reviews / stars

## Automation

- [ ] GitHub Action that regenerates `public/latest.json` from the latest release tag automatically, so cutting a release is one step instead of two
- [ ] Check — after the first real release — whether the GitHub Releases API (`/repos/.../releases/latest`) would let us drop the manual `latest.json` entirely. If yes, update the app's parser in `updateCheck.ts` to read GitHub's payload shape instead

## MS Store readiness (long-term)

- [ ] Acquire code-signing certificate (EV or SPC via Microsoft Partner Center) — required for MS Store acceptance and eliminates SmartScreen warnings on direct downloads
- [ ] Configure MSIX packaging in `src-tauri/tauri.conf.json` (explicit `bundle.targets: ["nsis", "msix"]` plus MSIX-specific metadata)
- [ ] Swap release-playbook bundle path from `nsis/` to `msix/` in README once MSIX becomes the primary shipped target
- [ ] Once MSIX ships: add the MSIX asset as a second download option on the landing page's Download section

## Analytics (optional, opt-in only)

- [ ] Evaluate privacy-respecting analytics: Plausible, Fathom, or self-hosted Umami. Only if we want to know which pages get traffic. Skip if "everything local" feels incompatible with even site analytics.
