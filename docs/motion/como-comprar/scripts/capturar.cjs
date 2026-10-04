// Capturas reales de elizabethcreation.com para el tutorial "Cómo pedir".
// 390×844 a deviceScaleFactor 3, una captura estática por estado; las
// tarjetas, la barra y la ventanita se recortan solas (fondo transparente)
// para animarlas como capas.
//   node scripts/capturar.cjs [url]     → assets/cap/*.png + assets/cap/datos.json
const path = require("path")
const fs = require("fs")
const puppeteer = require("/home/tjoa/Catalyst/catalyst-management/node_modules/puppeteer")

const SITIO = process.argv[2] || "https://elizabethcreation.com/"
const OUT = path.join(__dirname, "..", "assets", "cap")
const DPR = 3
fs.mkdirSync(OUT, { recursive: true })
const datos = {}
const espera = (ms) => new Promise((r) => setTimeout(r, ms))

// Sin movimiento: lo que se anima lo anima el video.
const QUIETO = `*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
  .e-letrero__mece,.e-pieza__mece,[data-galeria-target~=pendulo]{transform:none!important;rotate:none!important}
  .js .e-aparece{opacity:1!important;transform:none!important;filter:none!important}
  .e-galeria__tira{scroll-snap-type:none!important}`

async function decodificar(page) {
  await page.evaluate(async () => {
    for (const img of document.images) { img.loading = "eager"; img.decoding = "sync" }
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})))
    await document.fonts.ready
  })
}

// Recorta un elemento solo, con fondo transparente: todo lo demás se oculta
// (visibility) y el html/body quedan sin fondo.
async function capa(page, selector, nombre, margen = 14, opaco = false) {
  const el = await page.$(selector)
  if (!el) throw new Error("no está: " + selector)
  await el.evaluate((e) => {
    e.scrollIntoView({ block: "center" })
    const tira = e.closest(".e-galeria__tira")
    if (tira) { tira.scrollLeft = 0; const t = tira.getBoundingClientRect(), r = e.getBoundingClientRect()
      tira.scrollLeft = r.left - t.left - (t.width - r.width) / 2 }
  })
  await espera(250)
  if (!opaco) await page.evaluate((sel) => {
    const st = document.createElement("style")
    st.id = "solo-capa"
    st.textContent = `html,body{background:transparent!important} body *{visibility:hidden!important}
      .solo-esta,.solo-esta *{visibility:visible!important}
      .solo-esta .sr-only, .solo-esta [hidden]{visibility:hidden!important}`
    document.head.appendChild(st)
    document.querySelector(sel).classList.add("solo-esta")
  }, selector)
  await decodificar(page)
  const r = await el.boundingBox()
  if (process.env.DEPURAR) console.log(nombre, JSON.stringify(r), await page.evaluate(() => [document.querySelector(".e-galeria__tira").scrollLeft, scrollX, scrollY, innerWidth]))
  // El clip de Puppeteer va en coordenadas del documento, no de la ventana.
  const sc = await page.evaluate(() => ({ x: scrollX, y: scrollY }))
  r.x += sc.x; r.y += sc.y
  const clip = { x: Math.max(0, r.x - margen), y: Math.max(0, r.y - margen), width: r.width + margen * 2, height: r.height + margen * 2 }
  await page.screenshot({ path: path.join(OUT, nombre + ".png"), clip, omitBackground: !opaco, captureBeyondViewport: false })
  if (!opaco) await page.evaluate((sel) => {
    document.getElementById("solo-capa").remove()
    document.querySelector(sel).classList.remove("solo-esta")
  }, selector)
  datos[nombre] = { x: clip.x, y: clip.y, w: clip.width, h: clip.height, margen, ox: r.x - clip.x, oy: r.y - clip.y }
  console.log("capa", nombre, Math.round(clip.width), "×", Math.round(clip.height))
  return clip
}

;(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] })
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: DPR, isMobile: true, hasTouch: true })
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
  await page.evaluateOnNewDocument(() => { try { sessionStorage.clear() } catch {} })
  await page.goto(SITIO, { waitUntil: "networkidle2", timeout: 90000 })
  await page.addStyleTag({ content: QUIETO })
  // Recorrer toda la página para que se revelen las secciones y carguen las fotos.
  const alto = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < alto; y += 400) { await page.evaluate((y) => window.scrollTo(0, y), y); await espera(120) }
  await page.evaluate(() => window.scrollTo(0, 0))
  await espera(800)
  await decodificar(page)

  // 1 · El inicio, tal cual se ve al entrar.
  await page.screenshot({ path: path.join(OUT, "inicio.png") })
  // La isla de arriba (fija) aparte, para dejarla quieta mientras la página corre.
  await capa(page, "header", "isla", 0)
  await page.evaluate(() => window.scrollTo(0, 0))
  await espera(300)

  // 2 · El plano largo: del inicio al final de "Las piezas", sin lo que se
  // anima encima (la isla fija, las tarjetas de la tira, el resumen y la
  // píldora flotante van como capas).
  const temporada = await page.$eval("#temporada", (s) => ({ top: s.offsetTop, h: s.offsetHeight }))
  const tira = await page.$eval(".e-galeria__tira", (t) => { const r = t.getBoundingClientRect(); return { top: r.top + scrollY, left: r.left + scrollX, h: r.height } })
  datos.temporada = temporada
  datos.tira = tira
  datos.tarifa = await page.$eval(".e-galeria__tarifa", (t) => { const r = t.getBoundingClientRect(); return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height } })
  await page.addStyleTag({ content: "header,.e-pildora{visibility:hidden!important}" })
  await capa(page, ".e-resumen", "resumen-vacio", 16)
  await page.evaluate(() => window.scrollTo(0, 0))
  await espera(300)
  await page.addStyleTag({ content: ".e-galeria__tira > li, .e-galeria__tira > li *, .e-resumen__lugar, .e-resumen__lugar *{visibility:hidden!important}" })
  await page.screenshot({ path: path.join(OUT, "pagina.png"), clip: { x: 0, y: 0, width: 390, height: temporada.top + temporada.h }, captureBeyondViewport: true })
  // Las varitas, desde arriba de la sección hasta el botón "Agregar al pedido".
  const varitas = await page.evaluate(() => {
    const s = document.querySelector("#varitas"), b = document.querySelector('[data-action="varitas#agregar"]')
    return { top: s.offsetTop, fin: b.getBoundingClientRect().bottom + scrollY + 40 }
  })
  datos.varitas = varitas
  await page.screenshot({ path: path.join(OUT, "varitas.png"), clip: { x: 0, y: varitas.top, width: 390, height: varitas.fin - varitas.top }, captureBeyondViewport: true })
  await page.evaluate(() => { const ss = [...document.querySelectorAll("style")]; ss.at(-1).remove() })

  // Las tarjetas de la tira, cada una sola; su lugar en la tira (con la
  // tira al principio) para armarla de nuevo en el video.
  await page.$eval(".e-galeria__tira", (t) => { t.scrollLeft = 0 })
  const lis = await page.$$eval(".e-galeria__tira > li", (ls) => {
    const t = document.querySelector(".e-galeria__tira").getBoundingClientRect()
    return ls.map((l, i) => { l.dataset.cap = "t" + i; const r = l.getBoundingClientRect()
      return { i, cls: l.className, slug: l.querySelector(".e-pieza")?.dataset.slug || "", x: r.left - t.left, y: r.top - t.top, w: r.width, h: r.height } })
  })
  datos.tarjetas = lis
  for (const l of lis.slice(0, 6)) await capa(page, `[data-cap="t${l.i}"]`, `tarjeta-${l.i}`, 24)
  // El botón del set, dentro de su tarjeta.
  datos.botonSet = await page.$eval('[data-pedido-target~=botonSet][data-set="navidad-clasica"]', (b) => {
    const r = b.getBoundingClientRect(), c = b.closest("li").getBoundingClientRect()
    return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height } })

  // 3 · Navidad clásica: el set completo.
  await page.$eval('[data-pedido-target~=botonSet][data-set="navidad-clasica"]', (b) => b.click())
  await espera(500)
  for (const l of lis.slice(0, 4)) await capa(page, `[data-cap="t${l.i}"]`, `tarjeta-${l.i}-elegida`, 24)
  datos.resumen1 = await page.$eval(".e-resumen", (r) => r.innerText)
  await capa(page, ".e-resumen", "resumen-set", 16)

  // 4 · Una varita de estrella, rosada. Capas del "después", con su lugar
  // dentro de la sección.
  await page.$eval('[data-varitas-target~=forma][data-forma="estrella"]', (f) => f.click())
  await espera(300)
  const color = "Rosado"
  datos.color = color
  datos.colores = await page.$$eval("[data-varitas-target~=color]", (cs) => cs.map((c) => c.dataset.color))
  await page.$eval(`[data-varitas-target~=color][data-color="${color}"]`, (b) => b.click())
  await espera(400)
  await page.evaluate(() => {
    document.querySelector('[data-varitas-target~=forma][data-forma="estrella"]').closest("ul").id = "cap-formas"
    document.querySelector("[data-varitas-target~=color]").closest("ul").id = "cap-colores"
  })
  await capa(page, "#cap-formas", "varitas-formas", 16, true)
  await capa(page, "#cap-colores", "varitas-colores", 12, true)
  await capa(page, "[data-varitas-target~=armado]", "varitas-armado", 16, true)
  datos.rects = await page.evaluate(() => {
    const de = (sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height } }
    return {
      estrella: de('[data-varitas-target~=forma][data-forma="estrella"]'),
      rosado: de('[data-varitas-target~=color][data-color="Rosado"]'),
      agregar: de('[data-action="varitas#agregar"]'),
      laForma: de("#varitas h3"),
    }
  })
  datos.cuentaVarita = await page.$eval("[data-varitas-target~=cuenta]", (c) => c.innerText).catch(() => "")
  await page.$eval('[data-action="varitas#agregar"]', (b) => b.click())
  await espera(500)
  await capa(page, "[data-varitas-target~=armado]", "varitas-armado-agregado", 16, true)
  datos.rects.ver = await page.$eval(".e-armado__ver", (a) => { const r = a.getBoundingClientRect(); return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height } })
  datos.resumen2 = await page.$eval(".e-resumen", (r) => r.innerText)
  await capa(page, ".e-resumen", "resumen-varita", 16)

  // 5 · Enviar → la ventanita del abono.
  await page.$eval(".e-resumen", (r) => r.scrollIntoView({ block: "center" }))
  await espera(300)
  const enviar = await page.$("[data-pedido-target~=enviar]")
  datos.enlace = await enviar.evaluate((a) => a.href)
  datos.abonoAplica = await enviar.evaluate((a) => a.dataset.abonoAplica)
  datos.abonoMonto = await enviar.evaluate((a) => a.dataset.abonoMonto)
  datos.enviarRect = await enviar.evaluate((a) => { const r = a.getBoundingClientRect(); const s = document.querySelector(".e-resumen").getBoundingClientRect(); return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height } })
  datos.totalRect = await page.$eval("[data-pedido-target~=total]", (a) => { const r = a.getBoundingClientRect(); const s = document.querySelector(".e-resumen").getBoundingClientRect(); return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height } })
  datos.lugarSticky = await page.$eval(".e-resumen", (r) => { const b = r.getBoundingClientRect(); return { bottomGap: innerHeight - b.bottom } })
  await enviar.evaluate((a) => a.click())
  await espera(700)
  await page.screenshot({ path: path.join(OUT, "abono-pantalla.png") })
  datos.abonoTexto = await page.$eval(".e-aviso-abono__caja", (c) => c.innerText.replace(/\s+/g, " ").trim())
  datos.entendidoRect = await page.$eval("[data-abono-target~=seguir]", (a) => { const r = a.getBoundingClientRect(); const s = document.querySelector(".e-aviso-abono").getBoundingClientRect(); return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height } })
  const caja = await page.$eval(".e-aviso-abono", (c) => { const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height } })
  datos.cajaViewport = caja
  await page.addStyleTag({ content: "html,body{background:transparent!important} body > *:not(dialog){visibility:hidden!important} dialog::backdrop{background:transparent!important}" })
  const m = 16
  const sc = await page.evaluate(() => ({ x: scrollX, y: scrollY }))
  await page.screenshot({ path: path.join(OUT, "abono-caja.png"), omitBackground: true, captureBeyondViewport: false, clip: { x: caja.x - m + sc.x, y: caja.y - m + sc.y, width: caja.w + m * 2, height: caja.h + m * 2 } })
  datos["abono-caja"] = { w: caja.w + m * 2, h: caja.h + m * 2, margen: m }

  datos.mensaje = new globalThis.URL(datos.enlace).searchParams.get("text") || ""
  delete datos.enlace // lleva el número de WhatsApp: no hace falta guardarlo
  fs.writeFileSync(path.join(OUT, "datos.json"), JSON.stringify(datos, null, 1))
  console.log(datos.resumen1, "\n---\n", datos.resumen2, "\n---\n", datos.abonoTexto, "\n---\n", datos.mensaje)
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
