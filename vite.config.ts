import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import fs from 'fs';
import path from 'path';

function getHttpsConfig() {
  const certDir = path.resolve(__dirname, '../certs');
  const certPath = path.join(certDir, 'dev-local.pem');
  const keyPath = path.join(certDir, 'dev-local-key.pem');

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }
  return undefined; 
}

export default defineConfig({
  server: {
    middlewareMode: false,
    fs: { strict: false },
    https: getHttpsConfig(),
    host: '0.0.0.0', 
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    {
      name: 'ignore-well-known',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/.well-known')) {
            res.statusCode = 204;
            return res.end();
          }
          next();
        });
      },
    },
  ],
});
