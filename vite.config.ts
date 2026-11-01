import { fileURLToPath, URL } from 'node:url';
import { Readable } from 'node:stream';

import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { proxyApi } from './server/sessionProxy.ts';
export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      quoteStyle: 'single',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    tailwindcss(),
    react({ compiler: true }),
    {
      name: 'api-session-proxy',
      configureServer(server) {
        server.middlewares.use('/api', (req, res) => {
          void (async () => {
            try {
              const url = new URL(`/api${req.url ?? ''}`, `http://${req.headers.host}`);
              const headers = new Headers();
              for (const [name, value] of Object.entries(req.headers)) {
                if (Array.isArray(value)) value.forEach((item) => headers.append(name, item));
                else if (value !== undefined) headers.set(name, value);
              }
              const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
              const request = new Request(url, {
                method: req.method,
                headers,
                ...(hasBody ? { body: Readable.toWeb(req) as ReadableStream, duplex: 'half' } : {}),
              } as RequestInit);
              const response = await proxyApi(
                request,
                loadEnv(mode, process.cwd(), 'VITE_').VITE_API_URL,
              );
              res.statusCode = response.status;
              response.headers.forEach((value, name) => res.setHeader(name, value));
              res.end(Buffer.from(await response.arrayBuffer()));
            } catch {
              res.statusCode = 502;
              res.end('API proxy error');
            }
          })();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 7711,
  },
  preview: {
    port: 7711,
  },
}));
