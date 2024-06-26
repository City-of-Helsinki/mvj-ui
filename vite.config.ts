import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // depending on your application, base can also be "/"
  
  root: "./",
  base: "./src",
  plugins: [
    react({ include: /\.(js|jsx|ts|tsx)$/, jsxRuntime: "automatic" }),
    viteTsconfigPaths()
  ],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000
  }
});
