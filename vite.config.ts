import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import babel from "vite-plugin-babel";
import babelPluginModuleResolver from "babel-plugin-module-resolver";

export default defineConfig({
  // depending on your application, base can also be "/"
  
  base: "/",
  plugins: [
    react(),
    // react({ include: /\.(js|jsx|ts|tsx)$/, jsxRuntime: "automatic" }),
    viteTsconfigPaths()
    // babel()
  ],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000
  }
});
