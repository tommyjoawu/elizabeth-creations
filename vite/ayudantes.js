// Los ayudantes de las plantillas: lo que en la portada v2 era
// `portada_v2_helper.rb`. Son piezas de un renglón que se usan en medio de
// otras etiquetas —un enlace de WhatsApp dentro de una tarjeta, una frase
// partida en palabras dentro de un titular—, donde un parcial entero ensucia
// más de lo que ordena.
import fs from "node:fs"
import path from "node:path"
import { esquema } from "./esquema.js"
import { fechaLarga, rellenar } from "./hechos.js"

const RAIZ = path.resolve(import.meta.dirname, "..")
const IMAGENES = path.join(RAIZ, "src/assets/img")

// ── Las fotos ────────────────────────────────────────────────────────────
// Cada foto existe en dos o tres anchos (`slug-800.webp`, `slug-1600.webp`).
// El `srcset` se arma leyendo la carpeta, no a mano: si mañana se agrega un
// ancho, ninguna plantilla cambia.
function anchosDe(slug) {
  if (!fs.existsSync(IMAGENES)) return []
  const patron = new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d+)\\.webp$`)
  return fs.readdirSync(IMAGENES)
    .map((archivo) => archivo.match(patron))
    .filter(Boolean)
    .map((m) => ({ ancho: Number(m[1]), archivo: m[0] }))
    .sort((a, b) => a.ancho - b.ancho)
}

// El alto y el ancho REALES del archivo, leídos de su cabecera WebP. Van en
// la <img> para que el navegador reserve el hueco antes de que llegue la foto
// y la página no salte al cargar (CLS).
function medidasWebp(archivo) {
  const b = fs.readFileSync(archivo)
  const tipo = b.toString("ascii", 12, 16)
  if (tipo === "VP8X") return { ancho: 1 + b.readUIntLE(24, 3), alto: 1 + b.readUIntLE(27, 3) }
  if (tipo === "VP8L") {
    const bits = b.readUInt32LE(21)
    return { ancho: 1 + (bits & 0x3fff), alto: 1 + ((bits >> 14) & 0x3fff) }
  }
  if (tipo === "VP8 ") return { ancho: b.readUInt16LE(26) & 0x3fff, alto: b.readUInt16LE(28) & 0x3fff }
  return null
}

// La foto más grande de un slug, en JPEG si existe (la que se puede citar
// en el JSON-LD: todo buscador entiende JPEG), como ruta desde la raíz del
// proyecto. `null` si no hay foto.
export function fotoMayor(slug) {
  const anchos = anchosDe(slug)
  if (!anchos.length) return null
  const mayor = anchos[anchos.length - 1].archivo
  const jpg = mayor.replace(/\.webp$/, ".jpg")
  return `src/assets/img/${fs.existsSync(path.join(IMAGENES, jpg)) ? jpg : mayor}`
}

const escapar = (texto) => String(texto ?? "")
  .replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

// ── Los iconos ───────────────────────────────────────────────────────────
// Trazo fino y redondeado, a mano, y nunca los glifos de la fuente ni una
// librería entera por cinco dibujos. Todos decorativos: el texto de al lado
// (o un `aria-label` en el enlace) dice lo que hacen.
const TRAZOS = {
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  whatsapp: '<path d="M3.5 20.5l1.3-4.6A8.5 8.5 0 1 1 8.2 19.3z"/><path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6.6 1 1.4 1.8 2.4 2.4.2.1.4.1.6 0l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.6.5-3-.2a9 9 0 0 1-3.9-3.9c-.7-1.4-.5-2.4-.2-3z"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor"/>',
  correo: '<rect x="3" y="5.5" width="18" height="13" rx="3"/><path d="M4 7.5l8 5.5 8-5.5"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  estrella: '<path d="M12 3.5l2.3 5.3 5.7.5-4.3 3.8 1.3 5.6L12 15.8l-5 2.9 1.3-5.6L4 9.3l5.7-.5z"/>',
  flor: '<circle cx="12" cy="12" r="2.4"/><path d="M12 9.6c-1.6-2.6-1.3-5.6 0-6.6 1.3 1 1.6 4 0 6.6zM12 14.4c1.6 2.6 1.3 5.6 0 6.6-1.3-1-1.6-4 0-6.6zM9.6 12c-2.6 1.6-5.6 1.3-6.6 0 1-1.3 4-1.6 6.6 0zM14.4 12c2.6-1.6 5.6-1.3 6.6 0-1 1.3-4 1.6-6.6 0z"/>',
  corazon: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.3 15.3L20 20M10.5 7.8v5.4M7.8 10.5h5.4"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>'
}

export function ayudantes(hb) {
  const seguro = (html) => new hb.SafeString(html)

  // {{icono "whatsapp" clase="size-5"}}
  hb.registerHelper("icono", (nombre, opciones) => {
    const trazo = TRAZOS[nombre]
    if (!trazo) throw new Error(`Icono desconocido: ${nombre}`)
    const clase = opciones.hash.clase || "size-4"
    return seguro(`<svg class="${escapar(clase)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
      `stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${trazo}</svg>`)
  })

  // {{whatsapp "Hola Erika, quiero pedir…"}} → https://wa.me/507…?text=…
  //
  // El número sale de marca.json sin nada que no sea cifra: wa.me no acepta
  // ni el `+` ni guiones, y un número mal armado abre un chat con nadie.
  //
  // Sin mensaje, `(whatsapp)`, usa el saludo de marca.json. En ese caso
  // Handlebars pasa el objeto de opciones como ÚNICO argumento: por eso se
  // toma siempre el último.
  hb.registerHelper("whatsapp", function (...argumentos) {
    const opciones = argumentos.at(-1)
    const mensaje = argumentos.length > 1 ? argumentos[0] : null
    const numero = String(opciones.data.root.marca.whatsapp).replace(/\D/g, "")
    const texto = typeof mensaje === "string" && mensaje ? mensaje : opciones.data.root.marca.mensajeWhatsapp
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
  })

  // {{whatsappBase}} → https://wa.me/507…, sin mensaje: el `action` del
  // formulario de encargos, que manda el suyo en el campo `text`.
  hb.registerHelper("whatsappBase", (opciones) =>
    `https://wa.me/${String(opciones.data.root.marca.whatsapp).replace(/\D/g, "")}`)

  // (whatsappPieza "Esfera tejida") → el enlace con el mensaje de esa pieza,
  // armado con la plantilla `mensajePieza` de marca.json. Con `plantilla=
  // "mensajeColeccion"` usa la de las colecciones. Así Erika recibe el
  // mensaje ya diciendo QUÉ vio, y no tiene que preguntar.
  hb.registerHelper("whatsappPieza", function (pieza, opciones) {
    const marca = opciones.data.root.marca
    const plantilla = marca[opciones.hash.plantilla || "mensajePieza"]
    const numero = String(marca.whatsapp).replace(/\D/g, "")
    const texto = plantilla.replaceAll("{pieza}", pieza)
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
  })

  // {{#each (rango 13)}} → 0, 1, … 12: para las piezas que se repiten sin
  // datos propios, como las lucecitas.
  hb.registerHelper("rango", (n) => Array.from({ length: Number(n) }, (_, i) => i))

  // {{telefono marca.whatsapp}} → +50760000000, para `tel:`. Se quita todo
  // menos cifras y el `+`: sin el `+`, el número marca a otro país.
  hb.registerHelper("telefono", (numero) => String(numero).replace(/[^\d+]/g, ""))

  // {{imagen "cat-fieltro" alt="…" sizes="…" clase="…" prioridad=true}}
  //
  // `prioridad` es sólo para la foto del primer pantallazo (el LCP): se pide
  // antes que nada y sin `lazy`. Todas las demás esperan a acercarse.
  hb.registerHelper("imagen", (slug, opciones) => seguro(imagen(slug, opciones.hash)))

  // {{pastilla "proceso-textura-fieltro"}} → la foto del tamaño de una
  // palabra, metida en una frase. Decorativa: la frase se lee igual sin ella.
  hb.registerHelper("pastilla", (slug) =>
    seguro(`<span class="e-pastilla" aria-hidden="true">${imagen(slug, { sizes: "8rem" })}</span>`))

  function imagen(slug, hash) {
    // `carga="eager"`: fotos del primer pantallazo que no son el LCP (los
    // adornos del hero). Se piden ya, pero sin robarle prioridad al titular.
    const { alt = "", sizes = "100vw", clase = "", prioridad = false, carga = "lazy" } = hash
    const anchos = anchosDe(slug)
    if (anchos.length === 0) throw new Error(`No hay foto para "${slug}" en src/assets/img`)

    const ruta = (archivo) => `/src/assets/img/${archivo}`
    const mayor = anchos[anchos.length - 1]
    const medidas = medidasWebp(path.join(IMAGENES, mayor.archivo))

    // Los hermanos de cada WebP: `slug-600.avif` y `slug-600.jpg`, si existen
    // (los arma scripts/procesar-material.sh). Con AVIF hay <picture>: el
    // navegador toma el primero que entiende —AVIF pesa ~40% menos que WebP—
    // y el JPEG queda de `src` para el que no entiende ninguno.
    const hermano = (a, ext) => a.archivo.replace(/\.webp$/, `.${ext}`)
    const existe = (ext) => anchos.every((a) => fs.existsSync(path.join(IMAGENES, hermano(a, ext))))
    const srcset = (ext) => anchos.map((a) => `${ruta(ext ? hermano(a, ext) : a.archivo)} ${a.ancho}w`).join(", ")
    const conAvif = existe("avif")
    const conJpg = existe("jpg")

    // El `src` es el ancho más chico: es lo que baja un navegador que no
    // entiende `srcset`, y el más grande sería un castigo.
    const atributos = [
      `src="${ruta(conJpg ? hermano(anchos[0], "jpg") : anchos[0].archivo)}"`,
      `srcset="${conJpg ? srcset("jpg") : srcset()}"`,
      `sizes="${escapar(sizes)}"`,
      `alt="${escapar(alt)}"`,
      medidas && `width="${medidas.ancho}" height="${medidas.alto}"`,
      prioridad ? 'fetchpriority="high" loading="eager"' : `loading="${carga === "eager" ? "eager" : "lazy"}"`,
      'decoding="async"',
      clase && `class="${escapar(clase)}"`
    ].filter(Boolean)
    const img = `<img ${atributos.join(" ")}>`
    if (!conAvif && !conJpg) return img
    // `display: contents`: el <picture> no arma caja propia, así que toda la
    // hoja que apunta a `… img` (posición absoluta, object-fit) sigue igual.
    const fuentes = [
      conAvif && `<source type="image/avif" srcset="${srcset("avif")}" sizes="${escapar(sizes)}">`,
      `<source type="image/webp" srcset="${srcset()}" sizes="${escapar(sizes)}">`
    ].filter(Boolean).join("")
    return `<picture class="contents">${fuentes}${img}</picture>`
  }

  // {{palabras "Una frase que se enciende" clase="…"}}
  //
  // Una frase partida en palabras, para la lectura que se enciende con el
  // scroll. Los espacios quedan FUERA de los <span>: dentro, el navegador no
  // puede cortar el renglón entre dos palabras y la frase desborda en un
  // teléfono. Un lector de pantalla la lee de corrido.
  hb.registerHelper("palabras", (texto, opciones) => {
    const clase = ["e-palabra", opciones.hash.clase].filter(Boolean).join(" ")
    return seguro(String(texto).split(/(\s+)/).map((trozo) =>
      /^\s*$/.test(trozo) ? trozo : `<span class="${escapar(clase)}">${escapar(trozo)}</span>`
    ).join(""))
  })

  // {{esquema}} → el JSON-LD de la página (vite/esquema.js), armado con los
  // JSON de src/datos y nada más, en un solo renglón (con sangría eran
  // varios KB más de HTML; para leerlo, cualquier validador lo formatea).
  // `</` va escapado para que un texto de datos no pueda cerrar el <script>.
  hb.registerHelper("esquema", (opciones) =>
    seguro(JSON.stringify(esquema(opciones.data.root, { fotoMayor })).replace(/</g, "\\u003c")))

  // {{rellenar this.respuesta}} → el texto con sus llaves llenas con los
  // precios y fechas de los JSON (vite/hechos.js): "cuesta {set}" → "cuesta
  // $15.00". Lo usan la descripción de los buscadores y las preguntas.
  hb.registerHelper("rellenar", (texto, opciones) => rellenar(texto, opciones.data.root.hechos, "plantilla"))

  // {{fechaLarga "2026-11-15"}} → "15 de noviembre de 2026".
  hb.registerHelper("fechaLarga", (iso) => fechaLarga(iso))

  // {{#if (pendiente "instagram")}} → si ese dato de marca.json todavía es
  // de marcador. Así una plantilla decide si muestra el enlace o el "muy pronto".
  hb.registerHelper("pendiente", (clave, opciones) => Boolean(opciones.data.root.marca.pendiente?.[clave]))

  // `(or glifo "flecha")`: el primer valor que no esté vacío. El último
  // argumento de un ayudante es siempre el objeto de opciones de Handlebars.
  hb.registerHelper("or", (...valores) => valores.slice(0, -1).find(Boolean))
  // `(and @root.borrador this.pendiente)`: verdadero si todos lo son.
  hb.registerHelper("and", (...valores) => valores.slice(0, -1).every(Boolean))
  // {{cortable "@erika.hechoamano"}} → deja cortar el renglón sólo después
  // de un punto: en una baldosa angosta el usuario se partía en
  // "@erika.hechoaman / o", y así se parte en "@erika. / hechoamano".
  hb.registerHelper("cortable", (texto) =>
    seguro(escapar(texto).replaceAll(".", ".<wbr>")))

  // {{precio this.precio}} → "$8.50", o nada si todavía es null. La plantilla
  // decide qué dibujar cuando falta (la ranura "por confirmar"): así el día
  // que Erika mande el número basta con escribirlo en productos.json.
  hb.registerHelper("precio", (valor) =>
    typeof valor === "number" && Number.isFinite(valor) ? `$${valor.toFixed(2)}` : "")

  // (whatsappSet set) → el enlace que pide un set COMPLETO, con la plantilla
  // `mensajeSet` de marca.json: el nombre del set, cuántas piezas y cuáles.
  // Es el camino sin JavaScript del botón "Pedir el set completo"; con
  // JavaScript el controlador `pedido` arma el mismo mensaje desde la
  // selección.
  hb.registerHelper("whatsappSet", function (set, opciones) {
    const marca = opciones.data.root.marca
    const numero = String(marca.whatsapp).replace(/\D/g, "")
    const texto = marca.mensajeSet
      .replaceAll("{set}", set.nombre)
      .replaceAll("{cantidad}", String(set.piezas.length))
      .replaceAll("{lista}", set.piezas.map((p) => p.nombre).join(", "))
      .replaceAll("{precio}", typeof set.precio === "number" ? `$${set.precio.toFixed(2)}` : "")
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
  })

  // (individual set.piezas) → el precio de una pieza del set: "$6.00 c/u"
  // si todas cuestan lo mismo, "desde $6.00" si no (Bajo el mar: la sirenita
  // y el cangrejito son de $7.00). Sin sumas ni ahorros (02-10-2026: "no
  // mencionar el ahorro").
  hb.registerHelper("individual", (piezas) => {
    const precios = piezas.map((p) => p.precio).filter((v) => typeof v === "number")
    if (precios.length === 0) return "por confirmar"
    const menor = Math.min(...precios)
    return precios.every((v) => v === menor) ? `$${menor.toFixed(2)} c/u` : `desde $${menor.toFixed(2)}`
  })

  // {{fotoGrande "set-bajo-el-mar"}} → la foto más grande de un slug (en
  // JPEG si existe), para el enlace de "ver en grande". Vite no reescribe el
  // `href` de un <a>: va marcada `%RUTA:…%` y el plugin `recursosEnEsquema`
  // (vite/plantillas.js) la cambia por el archivo publicado, con su hash.
  // Sale en el build porque el mismo archivo está en el `srcset` de la foto.
  hb.registerHelper("fotoGrande", (slug) => {
    const ruta = fotoMayor(slug)
    if (!ruta) throw new Error(`No hay foto para "${slug}" en src/assets/img`)
    return `%RUTA:${ruta}%`
  })

  // (docenaVariada varitas.precios) → $25.00 + 12 × $1.50: la cuenta de la
  // tarifa sale de los mismos números que la escriben.
  hb.registerHelper("docenaVariada", (p) =>
    (Math.round(p.docena * 100) + p.porDocena * Math.round(p.variadaPorVarita * 100)) / 100)

  // (pieza "guirnalda") → la pieza de productos.json con ese slug, para una
  // sección que cuenta UNA pieza (las guirnaldas) sin copiar su nombre, su
  // precio ni su foto en la plantilla.
  hb.registerHelper("pieza", (slug, opciones) =>
    opciones.data.root.productos.sets.flatMap((s) => s.piezas).find((p) => p.slug === slug))

  hb.registerHelper("mayor", (a, b) => Number(a) > Number(b))
  hb.registerHelper("concat", (...partes) => partes.slice(0, -1).join(""))
  hb.registerHelper("eq", (a, b) => a === b)
  hb.registerHelper("suma", (a, b) => Number(a) + Number(b))
}
