import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  // Load env variables based on the current mode (e.g. development, production)
  return {
    base: "/tagcom-clearance/",
    plugins: [react()],
  };
});
