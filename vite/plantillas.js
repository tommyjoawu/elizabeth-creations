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
import { hechos } from "./hechos.js"

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
export function datos() {
  return Object.fromEntries(archivos(DATOS, ".json").map((archivo) => [
    path.basename(archivo, ".json"),
    JSON.parse(fs.readFileSync(archivo, "utf8"))
  ]))
}

export function plantillas() {
  // `borrador`: las notas internas ("Falta que Erika lo confirme…", el
  // "número por confirmar") se ven en `npm run dev`, que es donde se revisa
  // qué falta; en el build publicado no salen nunca: la ranura dice sólo
  // "Foto muy pronto" y la respuesta, lo que ya se puede decir. Para armar
  // un build de revisión con las notas: `BORRADOR=1 npm run build`.
  let borrador = true
  let base = "/"
  return {
    name: "erika-plantillas",

    configResolved(config) {
      borrador = config.command === "serve" || process.env.BORRADOR === "1"
      base = config.base
    },

    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const contexto = datos()
        // Sin `strict`: las piezas tienen parámetros opcionales (`variante`,
        // `clase`) y en modo estricto un parámetro no pasado es un error.
        return motor().compile(html)({
          ...contexto,
          hechos: hechos(contexto),
          borrador,
          base,
          anio: new Date().getFullYear()
        })
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

// Las fotos del JSON-LD (`%RECURSO:src/assets/img/…%`, ver vite/esquema.js)
// pasan a su URL publicada: la dirección del sitio (marca.url) + el archivo
// con su hash. Las de los enlaces "ver en grande" (`%RUTA:…%`, ayudante
// `fotoGrande`) pasan a la ruta del archivo dentro del sitio (`base` +
// archivo): así también sirven en `vite preview` y en cualquier subcarpeta.
// En desarrollo, las dos van a la ruta que sirve Vite.
export function recursosEnEsquema() {
  let base = "/"
  return {
    name: "erika-recursos-en-esquema",
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!html.includes("%RECURSO:") && !html.includes("%RUTA:")) return html
        const url = datos().marca.url
        const publicado = (ruta) => {
          const archivo = Object.values(ctx.bundle).find((salida) =>
            salida.type === "asset" && (salida.originalFileNames || []).some((original) => original.replace(/\\/g, "/").endsWith(ruta)))
          if (!archivo) throw new Error(`La página cita ${ruta}, pero no salió en el build (¿la foto se usa en la página?)`)
          return archivo.fileName
        }
        return html
          .replace(/%RECURSO:([^%"]+)%/g, (_, ruta) => (ctx.bundle ? url + publicado(ruta) : `/${ruta}`))
          .replace(/%RUTA:([^%"]+)%/g, (_, ruta) => (ctx.bundle ? base + publicado(ruta) : `/${ruta}`))
      }
    }
  }
}
