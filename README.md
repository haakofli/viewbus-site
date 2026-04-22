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

1. In the private viewbus repo, bump version in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`. Run `cargo test && pnpm test && cargo clippy --workspace`.
2. Build the installer: `pnpm tauri build` → output at `src-tauri/target/release/bundle/nsis/ViewBus_X.Y.Z_x64-setup.exe`.
3. Create a GitHub Release on this repo:
   `gh release create vX.Y.Z "<installer-path>" --title "ViewBus X.Y.Z" --notes "..." --repo haakofli/viewbus-site`
4. Update `public/latest.json` with the new version + notes + release URL + ISO-8601 `publishedAt`.
5. Add `src/content/changelog/X.Y.Z.md` with a new entry (copy the frontmatter shape from `0.1.0.md`).
6. Commit and push — CI deploys automatically.

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
