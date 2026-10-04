// La marca de agua de las fotos de producto: el sello de estrella y
// "Elizabeth / Creations" en Caprasimo, en crema con un borde añil fino.
//
//   scripts/marca-de-agua/marca-<ancho>.png   una por ancho exportado
//
// Por qué así (el mismo proceso que el catálogo de Abastra,
// sistema-abastra/app/models/inventory_product.rb):
//   · La página nunca sirve la foto limpia de una pieza: sirve copias
//     achicadas con la marca quemada abajo a la derecha. El `zoom` abre la
//     más grande, así que esa también la lleva y no queda ninguna limpia.
//   · Un PNG de píxeles fijos por cada ancho exportado, que ocupa SIEMPRE el
//     26 % del ancho de la foto: si se estampara el mismo PNG en la de 600 y
//     en la de 1200, en una sería el doble de grande que en la otra.
//   · Crema con borde y sombra añil: las fotos de Erika son casi todas sobre
//     pared o cobija blanca (ahí lee el borde) y algunas tienen fondo oscuro
//     (ahí lee la crema). Al 55 % de opacidad, como la de Abastra (alfa
//     máximo 141/255): se ve quién la hizo sin taparle la pieza.
//   · Monocroma, sin las piedritas de color: una marca de agua en amarillo,
//     rojo y turquesa compite con el fieltro, que es lo que se vende.
//
// Uso (Node 22): node scripts/marca-de-agua.mjs
// Después: bash scripts/procesar-material.sh productos
import { readFileSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)
const puppeteer = require(process.env.PUPPETEER_PATH || "/home/tjoa/Catalyst/catalyst-management/node_modules/puppeteer")

// Los anchos que exporta procesar-material.sh para las fotos de producto
// (piezas y escenas en 600 y 1200, sets en 600 y 960).
const ANCHOS = [600, 960, 1200]
const PROPORCION = 0.26
const OPACIDAD = 0.55

const fuente = readFileSync(join(raiz, "src/assets/fuentes/caprasimo-latin.woff2")).toString("base64")
const salida = join(raiz, "scripts/marca-de-agua")
mkdirSync(salida, { recursive: true })

const CREMA = "#FFF9EF"
const TINTA = "#1E1A3C"
// El sello de src/parciales/piezas/logo.html, en una sola tinta clara: la
// estrella inflada, la puntada por dentro y el lazo.
const estrella = `<svg viewBox="0 0 100 100" fill="none" style="height:100%;overflow:visible">
  <path d="M50 22 C 41 4, 59 4, 50 22" stroke="${TINTA}" stroke-width="7" stroke-linecap="round"/>
  <path d="M50 22 C 41 4, 59 4, 50 22" stroke="${CREMA}" stroke-width="3.4" stroke-linecap="round"/>
  <polygon points="50,20 61.2,40.6 86.1,44.3 68.1,61.9 72.3,86.7 50,75 27.7,86.7 31.9,61.9 13.9,44.3 38.8,40.6"
           fill="${TINTA}" stroke="${TINTA}" stroke-width="16" stroke-linejoin="round"/>
  <polygon points="50,20 61.2,40.6 86.1,44.3 68.1,61.9 72.3,86.7 50,75 27.7,86.7 31.9,61.9 13.9,44.3 38.8,40.6"
           fill="${CREMA}" stroke="${CREMA}" stroke-width="10" stroke-linejoin="round"/>
  <polygon points="50,30.6 58,45 76,47.6 63,60.2 66.1,78.1 50,69.7 33.9,78.1 37,60.2 24,47.6 42,45"
           stroke="${TINTA}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="3.6 3.4"/>
</svg>`

const navegador = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] })
const pagina = await navegador.newPage()
for (const ancho of ANCHOS) {
  const w = Math.round(ancho * PROPORCION)
  // Todo se mide en `em`: se dibuja a 10 px, se mide y se ajusta el `em`
  // para que la marca entera mida justo `w`. La de 1200 es la de 600 al
  // doble, no otro dibujo.
  await pagina.setViewport({ width: w * 3, height: w, deviceScaleFactor: 1 })
  await pagina.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: Caprasimo; src: url(data:font/woff2;base64,${fuente}) format("woff2"); }
    html, body { margin: 0; background: transparent; }
    #marca {
      display: inline-flex; align-items: center; gap: 0.35em;
      padding: 0.12em;
      font-size: 10px;
      opacity: ${OPACIDAD};
      filter: drop-shadow(0 0 0.06em rgb(30 26 60 / 0.55));
    }
    #marca .sello { height: 3.3em; flex: none; }
    #marca p {
      margin: 0; font-family: Caprasimo; font-size: 1.62em; line-height: 0.98;
      color: ${CREMA};
      -webkit-text-stroke: 0.09em ${TINTA}; paint-order: stroke fill;
    }
  </style></head><body><div id="marca"><span class="sello">${estrella}</span><p>Elizabeth<br>Creations</p></div></body></html>`)
  await pagina.evaluate(() => document.fonts.ready)
  await pagina.evaluate((w) => {
    const marca = document.getElementById("marca")
    marca.style.fontSize = `${(10 * w) / marca.getBoundingClientRect().width}px`
  }, w)
  const marca = await pagina.$("#marca")
  const archivo = join(salida, `marca-${ancho}.png`)
  await marca.screenshot({ path: archivo, omitBackground: true })
  console.log(`  ✓ marca-${ancho}.png (${w} px de ancho)`)
}
await navegador.close()
