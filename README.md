# viewbus-site

Public marketing + release-metadata site for [ViewBus](https://viewbus.app).

## Stack

- Astro 6 + Tailwind 4 (via `@tailwindcss/vite`)
- Geist + JetBrains Mono (via `@fontsource-variable/*`)
- Deployed to GitHub Pages at `viewbus.app` on push to `main`
- `public/latest.json` is the update feed the desktop app reads on startup

## Local dev

```
pnpm install
pnpm dev
```

Visit http://localhost:4321.

For output that includes the sitemap, run `pnpm build && pnpm preview` — sitemap
generation runs at build time.

## Cutting a release

Releases are **driven from the `haakofli/viewbus` repo**, not here. Pushing a
`v*.*.*` tag there runs a GitHub Action (`release.yml`) that builds the
installers, creates the GitHub Release on *this* repo, rewrites
`public/latest.json`, and writes a changelog stub at
`src/content/changelog/<version>.md`. **Do not create releases or hand-edit
`latest.json` here** — the next release will overwrite them.

The only manual follow-up on this repo: **fill in the auto-generated changelog
stub.** It ships as `summary: "TODO: fill in summary."` and a `TODO: write
changelog entry.` body, and the in-app update toast links users straight to
`https://viewbus.app/changelog/<version>` — so an unedited stub ships a TODO to
users.

Full flow, secrets, and the locked installer-filename contract:
`viewbus/CLAUDE.md` → "Release Coordination" and
`viewbus/docs/wiki/release/release-flow.md`.

## Structure

- `src/pages/` — Astro pages: `index`, `why-viewbus`, `download`, `mcp-server`,
  `developers`, `service-bus-explorer-alternative`, `changelog`, `support`,
  `privacy`, `terms`, `404`
- `src/content/changelog/` — Markdown per release (content collection)
- `src/content.config.ts` — Content Layer collection definitions
- `src/layouts/Base.astro` — shared `<head>` with SEO + OG + JSON-LD slot
- `src/components/` — Nav, Footer, FeatureTabs, CodeTabs, marks
- `src/styles/global.css` — tokens, both themes, carousel, shared code panels
- `public/latest.json` — the update feed
- `public/llms.txt` / `public/llms-full.txt` — agent-oriented product summaries
- `public/robots.txt` — allowlists major LLM crawlers
- `public/og.png` — Open Graph card
- `public/screenshots/` — hero + one per feature tab (see below)
- `public/CNAME` — custom domain for GitHub Pages
- `.github/workflows/deploy.yml` — Pages deploy on push to `main`

## Conventions worth knowing

- **Canonicals and internal links carry a trailing slash.** GitHub Pages serves
  directory-style URLs, so `/privacy` 301s to `/privacy/`. `Base.astro`
  normalizes the `path` prop; write internal `href`s with the slash too, or
  every click pays for a redirect.
- **Meta descriptions stay under ~160 characters.** Longer copy belongs in the
  JSON-LD `description`, not the `<meta>` tag.
- **The brand is lowercase `viewbus`** in all user-facing copy. `ViewBus` only
  survives where it's a literal filename (`ViewBus.app`, the NSIS installer).
- **`html.handheld`** is set before first paint in `Base.astro` from
  `pointer: coarse` + `hover: none`, not from a viewport breakpoint — a narrow
  window on a laptop must still get real download buttons. Mark elements with
  `data-handheld-only` / `data-desktop-only` to swap them.
- **Screenshots need intrinsic `width`/`height`.** `FeatureTabs.astro` keeps a
  `visualSize` map; without it a slide collapses to zero height until the PNG
  lands, and autoplay can park on a blank card.

## Related

- Private app repo: `haakofli/viewbus` (source — not public)
- Update-check consumer: `src/services/updateCheck.ts` in the app repo
