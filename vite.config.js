import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages sirve el sitio en https://<usuario>.github.io/<repo>/
// Por eso el `base` debe coincidir EXACTAMENTE con el nombre del repositorio.
// Si algún día usas un dominio propio o el repo <usuario>.github.io, cambia esto a '/'.
const REPO_NAME = 'Portafolio'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
