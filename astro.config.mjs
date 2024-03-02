import node from '@astrojs/node';
import tailwind from "@astrojs/tailwind";
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'hybrid',

  server: {
    host: '0.0.0.0'
  },

  adapter: node({
    mode: 'standalone',
  }),

  integrations: [tailwind()],
});