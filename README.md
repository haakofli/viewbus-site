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
  `developers`, `service-bus-explorer-alternative`, `changelog/` (index + a
  page per version — the in-app update toast links `/changelog/<version>`),
  `rss.xml` (changelog feed), `support`, `privacy`, `terms`, `404`
- `src/content/changelog/` — Markdown per release (content collection)
- `src/content.config.ts` — Content Layer collection definitions
- `src/layouts/Base.astro` — shared `<head>` with SEO + OG + JSON-LD slot
- `src/components/` — Nav, Footer, FeatureTabs, CodeTabs, marks
- `src/styles/global.css` — tokens, both themes, carousel, shared code panels
- `src/assets/screenshots/` — hero + one per feature tab, optimized to
  responsive WebP at build by `astro:assets` (see below)
- `public/latest.json` — the update feed
- `public/llms.txt` / `public/llms-full.txt` — agent-oriented product summaries
- `public/robots.txt` — allowlists major LLM crawlers
- `public/og.png` — Open Graph card
- `public/.well-known/security.txt` — security contact (expiry date inside)
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
- **Screenshots live in `src/assets/screenshots/`, not `public/`.** They're
  rendered through `astro:assets` `<Image>`, which generates responsive WebP
  variants at build (663 kB hero PNG → 50 kB at 1024w) and reads intrinsic
  `width`/`height` from the file, so slides never collapse while loading.
  Re-capturing a screenshot = overwrite the PNG, same filename, done. One
  exception: `og-card.html` references the hero PNG by relative file path,
  because it's rendered outside the build.
- **Scroll-reveal never hides content from crawlers.** `.reveal` elements are
  visible by default; an inline head script adds `html.js-reveal` only when
  IntersectionObserver exists, and only then does CSS hide them for the
  entrance animation.
- **`apple-touch-icon` has to be a PNG.** iOS ignores an SVG here and puts a
  generated letter tile on the home screen instead. `apple-touch-icon.png` is
  the `favicon.svg` mark on the brand dark (`#0b0d10`) at 180×180 — iOS
  composites transparency onto black, so the background is baked in.

## Related

- Private app repo: `haakofli/viewbus` (source — not public)
- Update-check consumer: `src/services/updateCheck.ts` in the app repo
