import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages phục vụ bản HTML này cho đường dẫn con.
// HTTP status của lần truy cập trực tiếp vẫn là 404 trên GitHub Pages.
function githubPagesFallback() {
  let outputDirectory;
  return {
    name: "ocvoivoii-github-pages-fallback",
    apply: "build",
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await copyFile(
        resolve(outputDirectory, "index.html"),
        resolve(outputDirectory, "404.html"),
      );
    },
  };
}
export default defineConfig({
  base: "/ocvoivoii/",
  plugins: [react(), tailwindcss(), githubPagesFallback()],
});
