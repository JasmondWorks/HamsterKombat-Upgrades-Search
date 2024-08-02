import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base:
      mode === "production"
        ? "https://hamsterkombat-upgrades-search-5.onrender.com"
        : "/",
    define: {
      __DEV__: mode === "development",
      __PROD__: mode === "production",
    },
    build: {
      outDir: "dist",
      sourcemap: mode === "development",
    },
    server: {
      port: 3200,
    },
  };
});
