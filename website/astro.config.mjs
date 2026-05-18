import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://helgesverre.github.io",
  base: "/gh-astro-discovery",
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  outDir: "../docs",
});
