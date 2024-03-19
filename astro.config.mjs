import node from '@astrojs/node';
import tailwind from "@astrojs/tailwind";
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  server: {
    host: '0.0.0.0'
  },
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [icon(), tailwind(), react()]
});