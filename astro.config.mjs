// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://viewbus.app',
  vite: {
    plugins: [tailwindcss()]
  },

  // `/open` is a `viewbus://` hand-off target, not a page anyone should land
  // on from search. It's `noindex`, and submitting a noindex URL in the
  // sitemap is what Search Console flags as a coverage error.
  integrations: [sitemap({ filter: (page) => !page.startsWith('https://viewbus.app/open') })]
});