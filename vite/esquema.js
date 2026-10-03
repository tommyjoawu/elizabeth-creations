// El JSON-LD de la página: un solo @graph armado con los JSON de src/datos.
//
// Nada se escribe dos veces: el negocio sale de marca.json, los productos y
// sus precios de productos.json y varitas.json, y las preguntas de
// preguntas.json (las mismas que se ven en la página, con las mismas
// llaves rellenas). Lo que todavía es de marcador en marca.json —el número
// de WhatsApp, el Instagram, el correo— NO se declara: a Google y a los
// asistentes de IA les llegaría como dato real del negocio. Cuando Erika los
// mande y su `pendiente` pase a `false`, aparecen solos (telephone, email,
// sameAs).
//
// Las fotos de los productos se escriben como `%RECURSO:src/assets/img/…%`:
// en el build, el plugin `recursosEnEsquema` (vite/plantillas.js) las
// cambia por la URL absoluta del archivo con su hash. Vite no reescribe
// rutas dentro de un <script>, y un JSON-LD necesita URLs completas.
//
// Notas para quien lo toque:
//   · `LocalBusiness` y no `Store`: Erika no tiene local abierto al público.
//     Sin calle, sin `geo` y sin horario: no existen, y no se inventan.
//   · Las piezas se hacen por encargo: `availability` es MadeToOrder.
//   · El abono no se devuelve: la política de devolución es
//     MerchantReturnNotPermitted.
//   · Nada de AggregateRating ni Review: no hay reseñas reales que citar.
import { rellenar } from "./hechos.js"

const ESQUEMA = "https://schema.org"

export function esquema(root, { fotoMayor }) {
  const { marca, productos, varitas, preguntas, hechos } = root
  const url = marca.url
  const id = (ancla) => `${url}#${ancla}`
  const falta = marca.pendiente || {}
  const recurso = (ruta) => `%RECURSO:${ruta}%`
  const foto = (slug) => {
    const ruta = slug && fotoMayor(slug)
    return ruta ? recurso(ruta) : undefined
  }
  const precio = (v) => Number(v).toFixed(2)

  const politica = {
    "@type": "MerchantReturnPolicy",
    "@id": id("devoluciones"),
    applicableCountry: marca.pais,
    returnPolicyCategory: `${ESQUEMA}/MerchantReturnNotPermitted`
  }

  const oferta = (valor, extra = {}) => ({
    "@type": "Offer",
    price: precio(valor),
    priceCurrency: "USD",
    availability: `${ESQUEMA}/MadeToOrder`,
    itemCondition: `${ESQUEMA}/NewCondition`,
    url: id("temporada"),
    seller: { "@id": id("negocio") },
    hasMerchantReturnPolicy: { "@id": id("devoluciones") },
    ...extra
  })

  const marcaComercial = { "@type": "Brand", name: marca.nombre }
  const producto = ({ slug, nombre, descripcion, material, imagen, ofertas, extra = {} }) => ({
    "@type": "Product",
    "@id": id(`producto-${slug}`),
    name: nombre,
    ...(descripcion && { description: descripcion }),
    ...(imagen && { image: imagen }),
    ...(material && { material }),
    brand: marcaComercial,
    offers: ofertas,
    ...extra
  })

  // Cada pieza UNA vez (la galleta de jengibre está en dos sets; la copia
  // lleva `repite`), y cada set con su precio.
  const piezas = []
  const vistas = new Set()
  for (const set of productos.sets) {
    for (const pieza of set.piezas) {
      if (pieza.repite || vistas.has(pieza.slug)) continue
      vistas.add(pieza.slug)
      if (typeof pieza.precio !== "number") continue
      const esVarita = pieza.personaliza === "varitas"
      let ofertas
      if (typeof pieza.precioHasta === "number") {
        // La guirnalda con nombre: un rango, según el largo del nombre y los
        // colores.
        ofertas = {
          "@type": "AggregateOffer",
          lowPrice: precio(pieza.precio),
          highPrice: precio(pieza.precioHasta),
          priceCurrency: "USD",
          offerCount: 1,
          availability: `${ESQUEMA}/MadeToOrder`,
          seller: { "@id": id("negocio") }
        }
      } else if (esVarita) {
        // La varita sola y la docena de un solo estilo y color.
        ofertas = [
          oferta(pieza.precio),
          oferta(varitas.precios.docena, {
            name: `Docena de varitas (${varitas.precios.porDocena} unidades, un solo estilo y color)`,
            eligibleQuantity: { "@type": "QuantitativeValue", value: varitas.precios.porDocena }
          })
        ]
      } else {
        ofertas = oferta(pieza.precio)
      }
      piezas.push(producto({
        slug: pieza.slug,
        nombre: pieza.nombre,
        descripcion: `${pieza.material}. Pieza cosida a mano en ${marca.lugar}.`,
        // `material` es de qué está hecha (el texto de la tarjeta dice el color
        // y los detalles, que no son un material).
        material: "Fieltro y bisutería",
        imagen: foto(pieza.foto),
        ofertas,
        extra: { category: esVarita ? "Varitas mágicas" : set.precio ? "Adornos navideños de fieltro" : "Guirnaldas" }
      }))
    }
  }

  const sets = productos.sets.filter((s) => typeof s.precio === "number").map((set) => producto({
    slug: `set-${set.slug}`,
    nombre: `Set ${set.nombre}: ${set.piezas.length} adornos hechos a mano`,
    descripcion: `${set.piezas.map((p) => p.nombre).join(", ")}. ${set.descripcion}`,
    imagen: foto(set.foto),
    ofertas: oferta(set.precio),
    extra: {
      category: "Adornos navideños de fieltro",
      isRelatedTo: set.piezas.map((p) => ({ "@id": id(`producto-${p.slug}`) }))
    }
  }))

  const negocio = {
    "@type": "LocalBusiness",
    "@id": id("negocio"),
    name: marca.nombre,
    url,
    description: rellenar(marca.descripcion, hechos, "marca.descripcion"),
    slogan: marca.bajada,
    logo: { "@type": "ImageObject", url: `${url}icono-512.png`, width: 512, height: 512 },
    image: [`${url}og.jpg`, ...[...productos.sets.map((s) => foto(s.foto))].filter(Boolean)],
    // Sólo el país: desde el 02-10-2026 el negocio se presenta para todo
    // Panamá y envía a todo el país (sin ciudad ni provincia que declarar).
    address: { "@type": "PostalAddress", addressCountry: marca.pais },
    areaServed: { "@type": "Country", name: marca.lugar },
    paymentAccepted: marca.politicas.pagos.replace(/ o /, ", "),
    currenciesAccepted: "USD",
    ...(hechos.rango && { priceRange: hechos.rango }),
    knowsLanguage: "es",
    hasMerchantReturnPolicy: { "@id": id("devoluciones") },
    hasOfferCatalog: { "@id": id("catalogo") },
    // Lo pendiente no se publica (ver arriba).
    ...(!falta.whatsapp && { telephone: String(marca.whatsapp).replace(/[^\d+]/g, "") }),
    ...(!falta.correo && { email: marca.correo }),
    ...(!falta.instagram && { sameAs: [`https://www.instagram.com/${marca.instagram}/`] })
  }

  const catalogo = {
    "@type": "OfferCatalog",
    "@id": id("catalogo"),
    name: `Adornos hechos a mano de ${marca.nombre}`,
    numberOfItems: sets.length + piezas.length,
    itemListElement: [...sets, ...piezas].map((item, i) => ({ "@type": "ListItem", position: i + 1, item }))
  }

  const sitio = {
    "@type": "WebSite",
    "@id": id("sitio"),
    url,
    name: marca.nombre,
    inLanguage: "es-PA",
    publisher: { "@id": id("negocio") }
  }

  const pagina = {
    "@type": "WebPage",
    "@id": id("pagina"),
    url,
    name: marca.titulo,
    description: rellenar(marca.descripcion, hechos, "marca.descripcion"),
    inLanguage: "es-PA",
    isPartOf: { "@id": id("sitio") },
    about: { "@id": id("negocio") },
    primaryImageOfPage: { "@type": "ImageObject", url: `${url}og.jpg`, width: 1200, height: 630 },
    ...(marca.actualizado && { dateModified: marca.actualizado }),
    mainEntity: { "@id": id("catalogo") }
  }

  // Sólo las preguntas que se ven en la página (son las mismas, del mismo
  // JSON) y sólo su respuesta: la ranura de "pendiente" no es contenido.
  const faq = {
    "@type": "FAQPage",
    "@id": id("preguntas"),
    url: id("preguntas"),
    inLanguage: "es-PA",
    isPartOf: { "@id": id("pagina") },
    mainEntity: preguntas.lista.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: rellenar(p.respuesta, hechos, `preguntas: ${p.pregunta}`) }
    }))
  }

  return { "@context": ESQUEMA, "@graph": [sitio, negocio, pagina, catalogo, politica, faq] }
}
