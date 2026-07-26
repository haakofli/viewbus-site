import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const entries = (await getCollection("changelog")).sort(
    (a, b) =>
      b.data.publishedAt.localeCompare(a.data.publishedAt) ||
      b.data.version.localeCompare(a.data.version, undefined, { numeric: true }),
  );

  return rss({
    title: "viewbus changelog",
    description:
      "Every viewbus release — a free Azure Service Bus desktop app for Windows and macOS.",
    site: context.site!,
    items: entries.map((entry) => ({
      title: `viewbus ${entry.data.version}`,
      description: entry.data.summary,
      link: `/changelog/${entry.data.version}/`,
      pubDate: new Date(`${entry.data.publishedAt}T12:00:00Z`),
    })),
  });
}
