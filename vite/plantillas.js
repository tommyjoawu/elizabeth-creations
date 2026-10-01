// El plugin que arma `index.html` a partir de los parciales y los datos.
//
// Handlebars y no un `@include` casero: las piezas se repiten con datos
// distintos —un botón con su texto, una tarjeta por producto— y eso pide
// parámetros y bucles, no pegar archivos. Los datos del negocio viven en
// `src/datos/*.json`: cambiar el nombre de la tienda, el WhatsApp o un
// producto es editar un JSON, nunca el HTML.
//
// Corre con `order: "pre"`: Vite recibe el HTML ya armado y recién ahí
// resuelve las rutas de `src`/`srcset`, así que las fotos de los parciales
// salen con su hash en el build como si estuvieran escritas en index.html.
import fs from "node:fs"
import path from "node:path"
import Handlebars from "handlebars"
import { ayudantes } from "./ayudantes.js"

const RAIZ = path.resolve(import.meta.dirname, "..")
const PARCIALES = path.join(RAIZ, "src/parciales")
const DATOS = path.join(RAIZ, "src/datos")

function archivos(dir, extension) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { recursive: true })
    .filter((nombre) => nombre.endsWith(extension))
    .map((nombre) => path.join(dir, nombre))
}

// Un motor nuevo en cada pasada: en desarrollo los parciales cambian a cada
// rato, y un registro global se quedaría con la versión vieja del que se borró.
function motor() {
  const hb = Handlebars.create()
  ayudantes(hb)

  // `secciones/obertura.html` se llama como `{{> secciones/obertura}}`.
  for (const archivo of archivos(PARCIALES, ".html")) {
    const nombre = path.relative(PARCIALES, archivo).replace(/\\/g, "/").replace(/\.html$/, "")
    hb.registerPartial(nombre, fs.readFileSync(archivo, "utf8"))
  }
  return hb
}

// `marca.json` queda en `{{marca.nombre}}`, `productos.json` en
// `{{#each productos}}`, y así con cada archivo de la carpeta.
function datos() {
  return Object.fromEntries(archivos(DATOS, ".json").map((archivo) => [
    path.basename(archivo, ".json"),
    JSON.parse(fs.readFileSync(archivo, "utf8"))
  ]))
}

export function plantillas() {
  return {
    name: "erika-plantillas",

    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const contexto = datos()
        // Sin `strict`: las piezas tienen parámetros opcionales (`variante`,
        // `clase`) y en modo estricto un parámetro no pasado es un error.
        return motor().compile(html)({ ...contexto, anio: new Date().getFullYear() })
      }
    },

    // Los parciales y los JSON no son módulos: Vite no sabe que index.html
    // depende de ellos. Al cambiar uno, se recarga la página entera.
    configureServer(server) {
      server.watcher.add([PARCIALES, DATOS])
      const recargar = (archivo) => {
        if (archivo.startsWith(PARCIALES) || archivo.startsWith(DATOS)) {
          server.ws.send({ type: "full-reload" })
        }
      }
      server.watcher.on("change", recargar)
      server.watcher.on("add", recargar)
      server.watcher.on("unlink", recargar)
    }
  }
}
