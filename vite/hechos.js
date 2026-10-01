// Los hechos del negocio, sacados de los JSON y listos para citar.
//
// Los precios viven en productos.json y varitas.json, y las fechas y las
// políticas en marca.json. Cada lugar que los repite en una FRASE —la
// descripción de los buscadores, las respuestas de las preguntas, el JSON-LD,
// llms.txt— los toma de aquí, con llaves: "sets de 3 por {setCorto}". Así un
// precio se cambia en un solo JSON y la página entera lo dice igual.
//
// Lo que no tiene número (un precio en null) no inventa nada: la llave queda
// escrita tal cual y el build avisa.

const dinero = (v) => `$${Number(v).toFixed(2)}`
// "$15" y no "$15.00" en las frases cortas (la descripción de Google); "$2.50"
// sigue con sus centavos.
const corto = (v) => (Number.isInteger(Number(v)) ? `$${Number(v)}` : dinero(v))

// "2026-11-15" → "15 de noviembre de 2026". En UTC: la fecha es un día del
// calendario, no un instante, y en Panamá (UTC−5) medianoche UTC todavía es
// el día anterior.
export function fechaLarga(iso, { conAnio = true } = {}) {
  if (!iso) return ""
  const opciones = { day: "numeric", month: "long", timeZone: "UTC", ...(conAnio && { year: "numeric" }) }
  return new Intl.DateTimeFormat("es-PA", opciones).format(new Date(`${iso}T00:00:00Z`))
}

const numeros = (lista) => lista.filter((v) => typeof v === "number" && Number.isFinite(v))

export function hechos(datos) {
  const { marca, productos, varitas } = datos
  const sets = productos.sets
  const conPrecio = sets.filter((s) => typeof s.precio === "number")
  // Los adornos: las piezas de los sets que se venden como set (las varitas
  // y las guirnaldas tienen su propia línea de precios).
  const adornos = conPrecio.flatMap((s) => s.piezas)
  const guirnaldas = sets.find((s) => s.slug === "guirnaldas")?.piezas ?? []
  const guirnalda = guirnaldas.find((p) => !p.pideNombre)
  const conNombre = guirnaldas.find((p) => p.pideNombre)
  const p = varitas.precios
  const variada = (Math.round(p.docena * 100) + p.porDocena * Math.round(p.variadaPorVarita * 100)) / 100

  const preciosSet = numeros(conPrecio.map((s) => s.precio))
  const preciosAdorno = numeros(adornos.map((a) => a.precio))
  const todos = numeros([
    ...preciosSet,
    ...sets.flatMap((s) => s.piezas.flatMap((pz) => [pz.precio, pz.precioHasta])),
    p.unidad
  ])

  return {
    nombre: marca.nombre,
    ciudad: marca.ciudad,
    region: marca.region,
    url: marca.url,
    pagos: marca.politicas.pagos,
    tiempo: marca.politicas.tiempo,
    entrega: marca.politicas.entrega,
    abono: `${marca.politicas.abonoPorcentaje} %`,
    fechaNavidad: fechaLarga(marca.politicas.fechaNavidadIso),
    fechaNavidadCorta: marca.politicas.fechaNavidad,
    actualizado: fechaLarga(marca.actualizado),

    // Todos los sets cuestan lo mismo hoy; si un día no, "desde".
    set: preciosSet.length ? dinero(Math.min(...preciosSet)) : null,
    setCorto: preciosSet.length ? corto(Math.min(...preciosSet)) : null,
    piezasPorSet: conPrecio[0]?.piezas.length ?? null,
    adornoDesde: preciosAdorno.length ? dinero(Math.min(...preciosAdorno)) : null,
    adornoHasta: preciosAdorno.length ? dinero(Math.max(...preciosAdorno)) : null,
    varita: dinero(p.unidad),
    varitaCorto: corto(p.unidad),
    docena: dinero(p.docena),
    docenaVariada: dinero(variada),
    variadaPorVarita: dinero(p.variadaPorVarita),
    guirnalda: guirnalda && typeof guirnalda.precio === "number" ? dinero(guirnalda.precio) : null,
    guirnaldaNombreDesde: conNombre && typeof conNombre.precio === "number" ? dinero(conNombre.precio) : null,
    guirnaldaNombreHasta: conNombre && typeof conNombre.precioHasta === "number" ? dinero(conNombre.precioHasta) : null,
    colorExtra: conNombre && typeof conNombre.colorExtra === "number" ? dinero(conNombre.colorExtra) : null,

    // "$2.50–$15.00": el priceRange del JSON-LD.
    rango: todos.length ? `${dinero(Math.min(...todos))}–${dinero(Math.max(...todos))}` : null
  }
}

// "sets de 3 por {setCorto}" → "sets de 3 por $15". Una llave que no existe
// (o cuyo valor falta) queda como está y se avisa: es preferible ver "{set}"
// en la vista previa a publicar un precio equivocado.
export function rellenar(texto, valores, donde = "") {
  return String(texto ?? "").replace(/\{(\w+)\}/g, (llave, nombre) => {
    const valor = valores[nombre]
    if (valor === null || valor === undefined || valor === "") {
      console.warn(`[hechos] ${donde}: no hay valor para ${llave}`)
      return llave
    }
    return String(valor)
  })
}
