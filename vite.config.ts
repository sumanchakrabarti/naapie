import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NAAPIE_']);
  const apiBaseUrl = env.NAAPIE_API_BASE_URL || 'https://graph.microsoft.com/v1.0';

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'NAAPIE_'],
    server: {
      proxy: {
        '/api-proxy': {
          target: apiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy/, ''),
          secure: false,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              // Capture ALL raw headers from upstream
              const allHeaders: Record<string, string> = {};
              const raw = proxyRes.rawHeaders;
              for (let i = 0; i < raw.length; i += 2) {
                allHeaders[raw[i]] = raw[i + 1];
              }
              proxyRes.headers['x-naapie-raw-headers'] = JSON.stringify(allHeaders);

              // Strip upstream CORS headers so the browser treats this
              // as a plain same-origin response and exposes all headers
              const keysToRemove = Object.keys(proxyRes.headers).filter(
                (k) => k.startsWith('access-control-'),
              );
              for (const k of keysToRemove) {
                delete proxyRes.headers[k];
              }
            });
          },
        },
      },
    },
  };
})
