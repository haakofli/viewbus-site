# Site TODO

Public backlog for follow-up work on viewbus-site. Local/manual steps that the
agent can't do are tracked in `docs/todo.md` instead.

## Screenshots — need re-capturing (human)

The site shows static screenshots of the desktop app; there is no markup to
hand-edit. Two are currently the weak point of the feature carousel:

- [ ] `public/screenshots/feature-browse.png` — currently 555×1194, a tall
      sidebar strip. It renders ~600px tall next to a three-line paragraph, so
      the slide is badly unbalanced and it sets the height for every other
      slide in the track. Re-capture closer to 4:3 (sidebar plus some of the
      main pane), or crop the empty black below the tree.
- [ ] `public/screenshots/feature-operations.png` — two problems. It's a full
      3135×2050 window where the bottom ~40% is empty black, so at 512px
      display it reads as a black rectangle; and it's the only shot taken
      against `Manual Connections / sb-discordbot / test-queue` rather than the
      `Contoso / sb-shop-prod` demo tenant every other shot uses. Re-capture on
      the demo data, cropped to the content.
- [ ] Standardise capture resolution across the set. Current files range from
      904×592 to 3135×2050 and are all displayed at similar widths, so
      sharpness visibly varies between slides.
- [ ] Consider a mobile crop of `viewbus-main.png`. The hero is a 679 KB
      3135×2050 PNG delivered to a 325px-wide box on a phone: illegible, and
      it's the LCP element. A one-pane crop would earn its bytes.

## Content

- [ ] Regenerate `public/og.png` — the current card breaks the line as
      "MCP-" / "ready.", which ships in every social share. Also worth
      reconciling its headline ("The local-first Service Bus Explorer") with
      the site H1 ("The fastest way to debug your Azure Service Buses").
- [ ] Have a lawyer (or at least a careful read) over `/terms` before relying
      on it. It's a plain-language freeware licence covering grant,
      restrictions, no-warranty, liability, third-party services, and
      Norwegian governing law — written to be honest, not litigated.
- [ ] Short "About the author" blurb — currently a paragraph at the bottom of
      `/support`; give it a home of its own if it grows.

## SEO

- [ ] Submit the site to Google Search Console, verify via DNS TXT
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Add `AggregateRating` to the JSON-LD schema once there are real reviews / stars
- [ ] More comparison pages, now that `/service-bus-explorer-alternative` is
      linked from the nav rather than orphaned: "vs the Azure Portal" and
      "vs Microsoft's Azure MCP Server" are both real queries.

## Automation

- [ ] Scheduled rebuild so the home page's "Most requested" list refreshes —
      it's fetched from the GitHub search API at build time only.
- [ ] GitHub Action that regenerates `public/latest.json` from the latest release tag automatically, so cutting a release is one step instead of two
- [ ] Check — after the first real release — whether the GitHub Releases API (`/repos/.../releases/latest`) would let us drop the manual `latest.json` entirely. If yes, update the app's parser in `updateCheck.ts` to read GitHub's payload shape instead

## MS Store readiness (long-term)

- [ ] Acquire code-signing certificate (EV or SPC via Microsoft Partner Center) — required for MS Store acceptance and eliminates SmartScreen warnings on direct downloads
- [ ] Notarize the macOS build so the DMG stops needing a manual quarantine clear

## Analytics (optional, opt-in only)

- [ ] Evaluate privacy-respecting analytics: Plausible, Fathom, or self-hosted Umami. Only if we want to know which pages get traffic. Skip if "everything local" feels incompatible with even site analytics. Search Console needs no client-side script and is worth doing regardless.

## Repo settings (human)

- [ ] **Enable private vulnerability reporting** on `haakofli/viewbus-site`
      (Settings → Security → Reporting). `/support`,
      `/.well-known/security.txt`, and the privacy page all point at
      `…/security/advisories/new`, and that link 404s until it's switched on.

## Done

- [x] Real `public/og.png` (superseded by the line-break fix above)
- [x] Hero + per-feature screenshots captured
- [x] Real viewbus logo mark and favicon
