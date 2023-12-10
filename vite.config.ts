import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  // server: { https: true },
  // plugins: [react(), mkcert()],
  plugins: [react()],
  base: '',
  assetsInclude: ['**/*.glb', '**/*.hdr']
});