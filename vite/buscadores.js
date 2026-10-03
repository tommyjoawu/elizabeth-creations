// Los archivos para buscadores y asistentes: sitemap.xml, robots.txt,
// llms.txt y el manifiesto web.
//
// No viven en public/ porque llevan datos: la dirección del sitio
// (marca.url), la fecha de la última actualización, los precios y las
// preguntas. Escritos a mano, el primer cambio de precio o de dominio los
// dejaría mintiendo. Se arman de src/datos en cada build (y se sirven igual
// en `npm run dev`), y salen en la raíz de dist/, junto al index.html.
//
// Ojo con robots.txt: los buscadores sólo lo leen en la RAÍZ del dominio.
// Mientras el sitio viva en una subcarpeta (tommyjoawu.github.io/
// elizabeth-creations/) este archivo no lo lee nadie; las variantes y la
// galería se quedan fuera del índice por su <meta name="robots" noindex>.
// Con dominio propio empieza a funcionar solo.
import { datos } from "./plantillas.js"
import { hechos as calcularHechos, rellenar } from "./hechos.js"

function sitemap({ marca }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${marca.url}</loc>
    <lastmod>${marca.actualizado}</lastmod>
  </url>
</urlset>
`
}

function robots({ marca }) {
  return `# ${marca.nombre}: ${marca.url}
# Todo se puede rastrear (también los asistentes de IA). Las variantes de
# diseño y la galería de anuncios llevan <meta name="robots" content="noindex">.
User-agent: *
Allow: /

Sitemap: ${marca.url}sitemap.xml
`
}

const dinero = (v) => `$${Number(v).toFixed(2)}`

function llms(contexto) {
  const { marca, productos, varitas, encargo, preguntas, colecciones } = contexto
  const h = calcularHechos(contexto)
  const r = (texto, donde) => rellenar(texto, h, `llms.txt: ${donde}`)
  const falta = marca.pendiente || {}
  const renglones = []
  const linea = (texto = "") => renglones.push(texto)

  linea(`# ${marca.nombre}`)
  linea()
  linea(`> ${marca.nombre} hace adornos de fieltro cosidos a mano y decorados con bisutería en ${marca.ciudad}, ${marca.region} (Panamá). ` +
    `Los hace Erika, uno por uno. Se piden por WhatsApp, se pagan por ${marca.politicas.pagos} y se entregan en ${marca.politicas.entrega}. ` +
    `Pedidos de Navidad hasta el ${h.fechaNavidad}.`)
  linea()
  linea(`- Sitio: ${marca.url}`)
  linea(`- Actualizado: ${h.actualizado}`)
  linea(`- Precios en dólares (USD). Rango: ${h.rango}.`)
  linea()

  linea("## Sets de adornos de fieltro")
  linea()
  for (const set of productos.sets.filter((s) => typeof s.precio === "number")) {
    linea(`- Set ${set.nombre} (${set.piezas.length} piezas: ${set.piezas.map((p) => p.nombre.toLowerCase()).join(", ")}): ${dinero(set.precio)}`)
  }
  linea()

  linea("## Piezas sueltas")
  linea()
  const vistas = new Set()
  for (const set of productos.sets) {
    for (const p of set.piezas) {
      if (p.repite || vistas.has(p.slug) || p.personaliza) continue
      vistas.add(p.slug)
      if (typeof p.precio !== "number") continue
      const valor = typeof p.precioHasta === "number"
        ? `de ${dinero(p.precio)} a ${dinero(p.precioHasta)}${p.colorExtra ? ` (+${dinero(p.colorExtra)} por color adicional)` : ""}`
        : dinero(p.precio)
      linea(`- ${p.nombre} (${p.material.toLowerCase()}): ${valor}`)
    }
  }
  linea()

  linea("## Varitas mágicas de fieltro")
  linea()
  linea(`- Con luna o con estrella, del color que escojas, en un palito de madera con cintas: ${dinero(varitas.precios.unidad)} cada una.`)
  linea(`- Docena de un solo estilo y color: ${dinero(varitas.precios.docena)}.`)
  linea(`- Docena variada (mezcla de luna y estrella o de colores): ${h.docenaVariada} (${h.docena} + ${varitas.precios.porDocena} × ${h.variadaPorVarita}).`)
  linea()

  const tarjeta = colecciones.lista.find((c) => c.slug === "tarjetas")
  if (tarjeta) {
    linea("## También")
    linea()
    linea(`- ${tarjeta.nombre}: ${tarjeta.descripcion} Precio a consultar por WhatsApp.`)
    linea()
  }

  // Lo que Erika todavía está haciendo: se anuncia, sin precio.
  const pronto = productos.sets.filter((s) => s.proximamente).flatMap((s) => s.piezas)
  if (pronto.length) {
    linea("## Próximamente")
    linea()
    for (const p of pronto) linea(`- ${p.nombre}: muy pronto (todavía no se piden).`)
    linea()
  }

  linea("## Cómo pedir")
  linea()
  encargo.pasos.forEach((paso, i) => linea(`${i + 1}. ${paso.titulo} ${paso.texto}`))
  linea()

  linea("## Políticas")
  linea()
  linea(`- Pago: ${marca.politicas.pagos}. ${marca.politicas.sinEfectivo}`)
  linea(`- Abono: ${marca.politicas.abono}`)
  linea(`- Tiempo: ${marca.politicas.tiempo} por pieza.`)
  linea(`- Entrega: ${marca.politicas.entrega}, en un punto de entrega que se coordina por WhatsApp.`)
  linea(`- Navidad: pedidos hasta el ${h.fechaNavidad}.`)
  linea(`- Materiales: ${marca.politicas.materiales}.`)
  linea()

  linea("## Preguntas frecuentes")
  linea()
  for (const p of preguntas.lista) {
    linea(`### ${p.pregunta}`)
    linea()
    linea(r(p.respuesta, p.pregunta))
    linea()
  }

  linea("## Contacto")
  linea()
  linea(falta.whatsapp
    ? `- WhatsApp: desde los botones de ${marca.url} (cada uno manda el mensaje con la pieza escogida).`
    : `- WhatsApp: ${marca.whatsapp}`)
  if (!falta.instagram) linea(`- Instagram: https://www.instagram.com/${marca.instagram}/`)
  if (!falta.correo) linea(`- Correo: ${marca.correo}`)
  linea()
  return renglones.join("\n")
}

function manifiesto({ marca }) {
  return JSON.stringify({
    name: marca.nombre,
    short_name: marca.nombreCorto,
    description: marca.bajada,
    lang: "es-PA",
    start_url: "./",
    scope: "./",
    display: "browser",
    background_color: "#FBF1E1",
    theme_color: "#FBF1E1",
    icons: [
      { src: "icono-192.png", sizes: "192x192", type: "image/png" },
      { src: "icono-512.png", sizes: "512x512", type: "image/png" },
      { src: "icono-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  }, null, 2) + "\n"
}

const ARCHIVOS = {
  "sitemap.xml": { tipo: "application/xml; charset=utf-8", armar: sitemap },
  "robots.txt": { tipo: "text/plain; charset=utf-8", armar: robots },
  "llms.txt": { tipo: "text/markdown; charset=utf-8", armar: llms },
  "manifest.webmanifest": { tipo: "application/manifest+json; charset=utf-8", armar: manifiesto }
}

export function buscadores() {
  return {
    name: "erika-buscadores",

    generateBundle() {
      const contexto = datos()
      for (const [nombre, { armar }] of Object.entries(ARCHIVOS)) {
        this.emitFile({ type: "asset", fileName: nombre, source: armar(contexto) })
      }
    },

    configureServer(server) {
      server.middlewares.use((req, res, siguiente) => {
        const nombre = req.url?.split("?")[0].replace(/^\//, "")
        const archivo = ARCHIVOS[nombre]
        if (!archivo) return siguiente()
        res.setHeader("Content-Type", archivo.tipo)
        res.end(archivo.armar(datos()))
      })
    }
  }
}
