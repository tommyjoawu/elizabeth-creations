// Los iconos PNG del sitio, a partir del sello (docs/logo/sello-color.svg):
//
//   public/apple-touch-icon.png    180×180  pantalla de inicio del iPhone
//   public/icono-192.png           192×192  Android (manifiesto)
//   public/icono-512.png           512×512  Android y el `logo` del JSON-LD
//   public/icono-maskable-512.png  512×512  Android con máscara (círculo,
//                                           gota…): el sello más chico, en
//                                           la zona segura del 80 %
//
// Todos sobre el papel crema y no transparentes: iOS rellena la
// transparencia de negro, y Google muestra el logo sobre blanco.
//
// Uso (Node 22): node scripts/iconos.mjs
// Puppeteer: el de catalyst-management, o PUPPETEER_PATH=…
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)
const puppeteer = require(process.env.PUPPETEER_PATH || "/home/tjoa/Catalyst/catalyst-management/node_modules/puppeteer")

const sello = readFileSync(join(raiz, "docs/logo/sello-color.svg"), "utf8")
const ICONOS = [
  // [archivo, lado, cuánto del lado ocupa el sello]
  ["apple-touch-icon.png", 180, 0.84],
  ["icono-192.png", 192, 0.86],
  ["icono-512.png", 512, 0.86],
  ["icono-maskable-512.png", 512, 0.66]
]

const navegador = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] })
const pagina = await navegador.newPage()
for (const [archivo, lado, escala] of ICONOS) {
  await pagina.setViewport({ width: lado, height: lado, deviceScaleFactor: 1 })
  await pagina.setContent(`<!doctype html><html><body style="margin:0;width:${lado}px;height:${lado}px;
    display:grid;place-items:center;background:#FBF1E1">
    <div style="width:${Math.round(lado * escala)}px;height:${Math.round(lado * escala)}px">${sello.replace("<svg ", '<svg width="100%" height="100%" ')}</div>
  </body></html>`)
  await pagina.screenshot({ path: join(raiz, "public", archivo), omitBackground: false })
  console.log(`public/${archivo}`)
}
await navegador.close()
