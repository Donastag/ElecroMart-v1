import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Set base from env variable so deployments can serve from a custom domain or subpath.
      // If `VITE_BASE_URL` is not set, default to the production Railway domain when building
      // in production mode, otherwise use root '/'.
      base: env.VITE_BASE_URL || (mode === 'production' ? 'https://elecromart-v1-production.up.railway.app/' : '/'),
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
