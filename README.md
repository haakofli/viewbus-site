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

- `src/pages/` — Astro pages (`index`, `privacy`, `changelog`)
- `src/content/changelog/` — Markdown per release (content collection)
- `src/content.config.ts` — Content Layer collection definitions
- `src/layouts/Base.astro` — shared `<head>` with SEO + OG + JSON-LD slot
- `src/components/` — Nav, Footer
- `public/latest.json` — the update feed
- `public/llms.txt` — agent-oriented product summary
- `public/robots.txt` — allowlists major LLM crawlers
- `public/og.png` — Open Graph card (placeholder — needs design polish)
- `public/CNAME` — custom domain for GitHub Pages
- `.github/workflows/deploy.yml` — Pages deploy on push to `main`

## Related

- Private app repo: `haakofli/viewbus` (source — not public)
- Update-check consumer: `src/services/updateCheck.ts` in the app repo
