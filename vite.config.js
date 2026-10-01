import { resolve } from "node:path"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { plantillas, recursosEnEsquema } from "./vite/plantillas.js"
import { buscadores } from "./vite/buscadores.js"
import { hojaEnLinea } from "./vite/hoja-en-linea.js"

// Una sola página, estática. `index.html` es el armazón (head, isla, pie) y
// cada sección vive en su parcial, igual que en la portada v2 de
// ticket-qr-system: así una sección se rediseña sin tocar el resto.
export default defineConfig({
  plugins: [plantillas(), tailwindcss(), recursosEnEsquema(), hojaEnLinea(), buscadores()],
  build: {
    // Las fotos van con su `srcset` y se piden cuando hacen falta: incrustarlas
    // en base64 las volvería parte del HTML y del primer pintado.
    assetsInlineLimit: 0,
    // El polyfill de `modulepreload` es para navegadores de 2020: hoy sería
    // un pedido más en el primer pantallazo, para nadie.
    modulePreload: { polyfill: false },
    cssMinify: true,
    // Las variantes son propuestas paralelas para que Erika escoja; cada una
    // es su propia página y sale en dist/variantes/<nombre>/.
    rollupOptions: {
      input: {
        principal: resolve(import.meta.dirname, "index.html"),
        // La página de "no existe": GitHub Pages sirve el 404.html de la raíz
        // del sitio para cualquier dirección que no encuentre.
        noEncontrada: resolve(import.meta.dirname, "404.html"),
        navidad: resolve(import.meta.dirname, "variantes/navidad/index.html"),
        hilo: resolve(import.meta.dirname, "variantes/hilo/index.html"),
        pop: resolve(import.meta.dirname, "variantes/pop/index.html")
      }
    }
  }
})
