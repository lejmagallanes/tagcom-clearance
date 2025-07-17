import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env variables based on the current mode (e.g. development, production)
  return {
    base: mode === "development" ? "/" : "/tagcom-clearance/",
    plugins: [react()],
  };
});
