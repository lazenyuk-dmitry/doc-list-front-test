import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/doc-list-front-test",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~components": fileURLToPath(
        new URL("./src/components/", import.meta.url)
      ),
      "~fonts": fileURLToPath(new URL("./src/assets/fonts", import.meta.url)),
      "~styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      "~icons": fileURLToPath(new URL("./src/assets/icons", import.meta.url)),
      "~constants": fileURLToPath(new URL("./src/constants", import.meta.url)),
      "~helpers": fileURLToPath(new URL("./src/helpers", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "~styles/_variables.scss";`,
      },
    },
  },
});
