import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative assets work on GitHub Pages project subpaths as well as Vercel / Netlify.
export default defineConfig({ plugins: [react()], base: './' });
