import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { env } from "process";

export default defineConfig(() => {
  // Load env variables based on the current mode (e.g. development, production)
  return {
    base: env.VITE_ROUTE_APP_NAME,
    plugins: [react()],
  };
});
