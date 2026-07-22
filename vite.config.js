import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    mkcert(), // Industry standard: Generates locally trusted SSL certs
  ],
  server: {
    https: true,
    port: 5173,
    strictPort: true, // Guarantees app stays on port 5173 for CORS alignment
  },
});