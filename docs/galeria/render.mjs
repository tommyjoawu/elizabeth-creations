// Exporta cada pieza de publicidad a PNG, al tamaño exacto de su
// <meta name="pieza" content="ANCHOxALTO">.
//
// Mismo método que /home/tjoa/Catalyst/abastra-contenido/render.mjs, con una
// diferencia pedida para este proyecto: una CARPETA por pieza, con su HTML
// fuente y su PNG juntos (docs/galeria/<pieza>/pieza.html → pieza.png).
// Al final avisa si alguna pieza falta en la galería index.html.
//
// Uso (Node 22):
//   node docs/galeria/render.mjs            todas
//   node docs/galeria/render.mjs feed-navidad   una
// Puppeteer: el de catalyst-management, o PUPPETEER_PATH=…
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { createRequire } from "node:module"

const raiz = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const puppeteer = require(process.env.PUPPETEER_PATH || "/home/tjoa/Catalyst/catalyst-management/node_modules/puppeteer")

const sola = process.argv[2]
const carpetas = readdirSync(raiz, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(raiz, d.name, "pieza.html")))
  .map((d) => d.name)
  .sort()

const navegador = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] })
const lista = []
for (const carpeta of carpetas) {
  const fuente = join(raiz, carpeta, "pieza.html")
  const html = readFileSync(fuente, "utf8")
  const [ancho, alto] = (html.match(/name="pieza" content="(\d+)x(\d+)"/) || [0, 1080, 1350]).slice(1).map(Number)
  const titulo = (html.match(/<title>([^<]*)<\/title>/) || [0, carpeta])[1]
  lista.push({ carpeta, titulo, tamano: `${ancho}x${alto}` })
  if (sola && sola !== carpeta) continue

  const pagina = await navegador.newPage()
  await pagina.setViewport({ width: ancho, height: alto, deviceScaleFactor: 1 })
  await pagina.goto(pathToFileURL(fuente).href, { waitUntil: "networkidle0" })
  await pagina.evaluate(() => document.fonts.ready)
  await pagina.screenshot({ path: join(raiz, carpeta, "pieza.png"), clip: { x: 0, y: 0, width: ancho, height: alto } })
  await pagina.close()
  console.log(`✓ ${carpeta}/pieza.png (${ancho}x${alto})`)
}
await navegador.close()

// La galería (index.html) ya no se genera aquí: ahora tiene visor, reels y
// las versiones de la landing, y se mantiene a mano. Si agregas una pieza,
// agrega su <button class="tarjeta"> en index.html.
const nuevas = lista.filter((i) => !readFileSync(join(raiz, "index.html"), "utf8").includes(`${i.carpeta}/pieza.png`))
if (nuevas.length) console.log(`! Faltan en la galería: ${nuevas.map((i) => i.carpeta).join(", ")}`)
