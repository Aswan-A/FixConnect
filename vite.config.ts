import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";


export default defineConfig({
  server: {
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  plugins: [
      tailwindcss(), reactRouter(), tsconfigPaths(),

    {
      name: 'ignore-well-known',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/.well-known')) {
            res.statusCode = 204; // No Content
            return res.end();
          }
          next();
        });
      }
    }
  ]
});
