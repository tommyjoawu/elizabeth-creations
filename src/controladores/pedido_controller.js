import { Controller } from "@hotwired/stimulus"
import { dinero, totalDe, textoTotal, textoAbono } from "../precios.js"

// El pedido por piezas y por sets (Erika, 01-10-2026: "debe haber una opción
// para pedir los sets de una vez").
//
// Sin este controlador la galería ya sirve: cada pieza tiene su "Pedir sólo
// esta por WhatsApp" y cada set su "Pedir el set completo", con el mensaje
// escrito en el HTML. Esto agrega lo que un enlace no puede: juntar varias
// piezas en UN mensaje.
//
//   · Aparece "Agregar al pedido" en cada pieza (un botón con
//     `aria-pressed`, que es lo que es: un interruptor).
//   · El enlace del set deja de abrir WhatsApp y pasa a agregar el set
//     entero; tocarlo con el set en el pedido lo quita.
//   · El resumen dice cuántas piezas van, el total y el abono, y arma el
//     enlace con la lista. Los precios son los de Erika (01-10-2026):
//       - todos los sets son de 3 piezas y un set completo se cobra como
//         set ($15.00), en un solo renglón, no como la suma de sus piezas —
//         da igual si se tocó "Seleccionar el set completo" o se marcaron
//         sus tres piezas una por una (entonces se juntan solas en el set);
//       - si a unas piezas sueltas les falta UNA para ser un set y el set
//         sale más barato que comprarla aparte, se sugiere el set completo
//         (la "pista", con su botón);
//       - la guirnalda con nombre es un rango (de $5.00 a $10.00): el total
//         dice "desde" y el abono se calcula cuando Erika confirme;
//       - si algún precio fuera null, "por confirmar" (ver src/precios.js).
//   · Lo que se arma en OTRA sección (las varitas: forma, color, unidad o
//     docena) llega con el evento `pedido:agregar` en `window` y se quita
//     con `pedido:quitar`. Cada cambio se avisa con `pedido:cambio`, para
//     que esa sección muestre lo suyo que ya está en el pedido.
//
// El estado son dos listas: `sets` (los sets completos del pedido) y
// `elegidas` (las piezas SUELTAS, cada una una vez). La galleta de jengibre
// está en los dos sets de Navidad, así que una pieza puede ser de más de un
// set: por eso un set no se deduce de las piezas al pintar, sino que se
// guarda. Cuando las sueltas completan uno o más sets, `juntar()` las pasa
// a sets: una misma galleta suelta cuenta para UN set, nunca para dos, y si
// alcanza para varios gana la combinación que más le ahorra a la clienta (a
// igual ahorro, el set que va primero en productos.json).
//
// La selección se guarda en `sessionStorage` sólo como comodidad: si se
// recarga la página no se pierde. Si el navegador no deja guardar, se sigue
// igual.
const CLAVE = "elizabeth-pedido"

export default class extends Controller {
  static targets = ["pieza", "botonSet", "lugar", "resumen", "cuenta", "total", "lista", "pista", "abono",
                    "vaciar", "enviar", "personal"]
  static values = { numero: String, plantilla: String, abono: { type: Number, default: 30 } }

  connect() {
    this.catalogo = this.leerSets()
    const guardado = this.leer()
    this.sets = new Set(guardado.sets)
    this.elegidas = new Set(guardado.piezas)
    this.extras = guardado.extras        // [{ id, texto, precio, desde, cantidad, grupo }]
    this.personales = guardado.personales // { slug: { nombre, colorExtra } }

    for (const pieza of this.piezaTargets) {
      const boton = pieza.querySelector(".e-agregar:not(.e-agregar--ir)")
      if (boton) boton.hidden = false
    }
    for (const boton of this.botonSetTargets) {
      // Deja de ser un enlace a WhatsApp: ahora es un interruptor del set.
      boton.setAttribute("role", "button")
      boton.setAttribute("aria-pressed", "false")
      boton.removeAttribute("target")
    }
    // Los campos del nombre de la guirnalda, con lo que se había escrito.
    for (const caja of this.personalTargets) {
      caja.hidden = false
      const datos = this.personales[caja.dataset.slug] || {}
      const nombre = caja.querySelector('[data-pedido-campo="nombre"]')
      const extra = caja.querySelector('[data-pedido-campo="colorExtra"]')
      if (nombre) nombre.value = datos.nombre || ""
      if (extra) extra.checked = Boolean(datos.colorExtra)
    }
    this.lugarTarget.hidden = false
    this.element.setAttribute("data-pedido-listo", "")
    this.juntar()
    this.pintar(false)
  }

  // Los sets que se piden completos, leídos de sus botones: nombre, precio
  // y piezas, en el orden de productos.json.
  leerSets() {
    return this.botonSetTargets.map((b, orden) => ({
      slug: b.dataset.set,
      nombre: b.dataset.setNombre,
      precio: parseFloat(b.dataset.precioSet),
      piezas: b.dataset.piezas.split(" ").filter(Boolean),
      orden
    }))
  }

  setDe(slug) {
    return this.catalogo.find((s) => s.slug === slug)
  }

  // "Agregar" en una tarjeta. Si la tarjeta es de un set que está en el
  // pedido, quitarla deshace el set: las otras dos quedan sueltas. (Si esa
  // pieza además estaba suelta —una segunda galleta—, sólo se quita esa.)
  alternar(evento) {
    const pieza = evento.currentTarget.closest(".e-pieza")
    const slug = pieza.dataset.slug
    const set = this.setDe(pieza.dataset.set)
    if (set && this.sets.has(set.slug)) {
      if (this.elegidas.has(slug)) {
        this.elegidas.delete(slug)
      } else {
        this.sets.delete(set.slug)
        for (const otra of set.piezas) if (otra !== slug) this.elegidas.add(otra)
      }
    } else if (this.elegidas.has(slug)) {
      this.elegidas.delete(slug)
    } else {
      this.elegidas.add(slug)
    }
    this.juntar()
    this.pintar(true)
  }

  set(evento) {
    evento.preventDefault()
    const slug = evento.currentTarget.dataset.set
    this.sets.has(slug) ? this.sets.delete(slug) : this.agregarSet(slug)
    this.pintar(true)
  }

  // El set entero entra al pedido; sus piezas que ya estaban sueltas pasan
  // a ser parte de él (quien toca "el set completo" quiere el set, no el
  // set más dos repetidas).
  agregarSet(slug) {
    const set = this.setDe(slug)
    if (!set) return
    this.sets.add(slug)
    for (const p of set.piezas) this.elegidas.delete(p)
    this.juntar()
  }

  // El botón de la pista: "Cambiar al set".
  completarSet(evento) {
    this.agregarSet(evento.currentTarget.dataset.set)
    this.pintar(true)
  }

  // Las sueltas que completan un set se juntan en el set. Se prueban todas
  // las combinaciones de sets completables (son pocos: 2^3) que no usen la
  // misma pieza dos veces, y gana la que más ahorra; a igual ahorro, la que
  // aparece primero (máscara menor = sets de más arriba). Determinista: el
  // mismo pedido siempre da el mismo resultado.
  juntar() {
    const posibles = this.catalogo.filter((s) =>
      Number.isFinite(s.precio) && !this.sets.has(s.slug) && s.piezas.every((p) => this.elegidas.has(p)))
    if (posibles.length === 0) return
    let mejor = null
    for (let mascara = 1; mascara < 1 << posibles.length; mascara++) {
      const escogidos = posibles.filter((_, i) => mascara & (1 << i))
      const usadas = escogidos.flatMap((s) => s.piezas)
      if (new Set(usadas).size !== usadas.length) continue
      const ahorro = escogidos.reduce((suma, s) => suma + this.ahorroDe(s), 0)
      if (!mejor || ahorro > mejor.ahorro) mejor = { escogidos, ahorro }
    }
    for (const s of mejor.escogidos) {
      this.sets.add(s.slug)
      for (const p of s.piezas) this.elegidas.delete(p)
    }
  }

  // Lo que se ahorra con el set frente a sus piezas sueltas, en centavos.
  ahorroDe(set) {
    const suma = totalDe(set.piezas.map((p) => this.renglonPieza(this.tarjeta(p))))
    return suma.falta ? 0 : Math.round(suma.monto * 100) - Math.round(set.precio * 100)
  }

  // El nombre (o el color adicional) de la guirnalda. Escribir un nombre
  // agrega la pieza al pedido: nadie escribe el nombre de algo que no quiere.
  personalizar(evento) {
    const caja = evento.currentTarget.closest("[data-pedido-target~='personal']")
    const slug = caja.dataset.slug
    const nombre = caja.querySelector('[data-pedido-campo="nombre"]')?.value.trim() || ""
    const colorExtra = Boolean(caja.querySelector('[data-pedido-campo="colorExtra"]')?.checked)
    this.personales[slug] = { nombre, colorExtra }
    if (nombre || colorExtra) this.elegidas.add(slug)
    this.pintar(false)
  }

  // La tarjeta de una varita lleva a su sección: se avisa qué forma era.
  irAVaritas(evento) {
    window.dispatchEvent(new CustomEvent("varitas:forma", { detail: { forma: evento.currentTarget.dataset.forma } }))
  }

  // Un renglón armado en otra sección (las varitas).
  agregar(evento) {
    const r = evento.detail
    if (!r?.texto) return
    this.extras.push({ ...r, id: r.id || `extra-${Date.now()}-${this.extras.length}` })
    this.pintar(true)
  }

  // Otra sección que conectó después pregunta qué hay: se le vuelve a avisar.
  avisar() {
    window.dispatchEvent(new CustomEvent("pedido:cambio", { detail: { extras: this.extras } }))
  }

  quitar(evento) {
    this.extras = this.extras.filter((r) => r.id !== evento.detail?.id)
    this.pintar(true)
  }

  vaciar() {
    this.sets.clear()
    this.elegidas.clear()
    this.extras = []
    this.pintar(true)
  }

  // ── Los renglones del pedido ───────────────────────────────────────────
  // Cada set completo es UN renglón; después las sueltas, una por pieza, y
  // al final lo que llegó de otras secciones.
  renglones() {
    const renglones = []
    for (const set of this.catalogo) {
      if (!this.sets.has(set.slug)) continue
      const nombres = set.piezas.map((p) => this.tarjeta(p)?.dataset.nombre || p)
      renglones.push({
        // Corto en el resumen; en el mensaje, con sus piezas, para que
        // Erika sepa qué set es sin abrir la página.
        texto: `Set ${set.nombre} (${set.piezas.length} piezas)`,
        textoLargo: `Set ${set.nombre} completo (${set.piezas.length} piezas: ${nombres.join(", ")})`,
        precio: set.precio, desde: false, cantidad: set.piezas.length
      })
    }
    for (const p of this.sueltas()) renglones.push(this.renglonPieza(p))
    return [...renglones, ...this.extras]
  }

  // Las tarjetas de las piezas sueltas, una por pieza (la galleta tiene dos
  // tarjetas), en el orden de la galería.
  sueltas() {
    const vistas = new Set()
    return this.piezaTargets.filter((p) => {
      if (!this.elegidas.has(p.dataset.slug) || vistas.has(p.dataset.slug)) return false
      vistas.add(p.dataset.slug)
      return true
    })
  }

  // La primera tarjeta de una pieza: de ahí salen su nombre y su precio.
  tarjeta(slug) {
    return this.piezaTargets.find((p) => p.dataset.slug === slug)
  }

  renglonPieza(p) {
    const precio = parseFloat(p.dataset.precio)
    const hasta = parseFloat(p.dataset.precioHasta)
    const datos = this.personales[p.dataset.slug] || {}
    const extra = datos.colorExtra ? parseFloat(p.dataset.colorExtra) : 0
    const partes = [p.dataset.nombre]
    if (p.querySelector("[data-pedido-target~='personal']")) {
      partes[0] += datos.nombre ? ` «${datos.nombre}»` : " (el nombre te lo digo por aquí)"
    }
    if (datos.colorExtra) partes.push("con un color adicional")
    const rango = Number.isFinite(hasta)
      ? `de ${dinero(precio)} a ${dinero(hasta)}${extra ? `, más ${dinero(extra)} del color adicional` : ""}`
      : null
    return {
      texto: partes.join(", "),
      precio: Number.isFinite(precio) ? (Math.round(precio * 100) + Math.round((extra || 0) * 100)) / 100 : null,
      desde: Number.isFinite(hasta),
      rango,
      cantidad: 1
    }
  }

  // ── Lo que se ve ───────────────────────────────────────────────────────
  pintar(conLatido) {
    // Una tarjeta está en el pedido si su set está entero en el pedido o si
    // su pieza va suelta.
    for (const pieza of this.piezaTargets) {
      const si = this.sets.has(pieza.dataset.set) || this.elegidas.has(pieza.dataset.slug)
      pieza.toggleAttribute("data-elegida", si)
      const boton = pieza.querySelector(".e-agregar:not(.e-agregar--ir)")
      if (!boton) continue
      boton.setAttribute("aria-pressed", String(si))
      boton.querySelector("[data-texto]").textContent = si ? "En tu pedido" : "Agregar"
      boton.querySelector("[data-mas]").hidden = si
    }

    for (const boton of this.botonSetTargets) {
      const completo = this.sets.has(boton.dataset.set)
      boton.setAttribute("aria-pressed", String(completo))
      boton.querySelector("[data-texto]").textContent = completo ? "Quitar el set del pedido" : "Seleccionar el set completo"
      boton.closest(".e-letrero")?.toggleAttribute("data-completo", completo)
    }

    const renglones = this.renglones()
    const n = renglones.reduce((suma, r) => suma + (r.cantidad || 1), 0)
    const vacio = renglones.length === 0
    const total = totalDe(renglones)

    this.resumenTarget.dataset.vacio = String(vacio)
    if (vacio) this.cuentaTarget.textContent = "Tu pedido está vacío"
    else this.cuentaTarget.innerHTML = `<span class="e-resumen__pre">Tu pedido: </span>${n} ${n === 1 ? "pieza" : "piezas"}`
    this.totalTarget.textContent = vacio ? "" : `Total: ${textoTotal(total)}`
    this.listaTarget.textContent = vacio
      ? "Toca «Agregar al pedido» en cada pieza, o «Seleccionar el set completo»."
      : renglones.map((r) => `${r.texto} — ${this.precioRenglon(r)}`).join(" · ")
    this.abonoTarget.hidden = vacio
    this.abonoTarget.textContent = vacio ? "" : `${textoAbono(total, this.abonoValue)}.`
    this.pintarPista()
    this.vaciarTarget.hidden = vacio
    this.enviarTarget.hidden = vacio
    if (!vacio) this.enviarTarget.href = this.enlace(renglones, total)

    this.guardar()
    this.avisar()
    if (conLatido) this.latir()
  }

  // El set al que le falta UNA pieza para estar completo, si el set sale
  // más barato que comprar esa pieza aparte. La primera que aplique, y nada
  // más: dos a la vez ya es un sermón. Con 2 de 3 piezas de $6.00 ($12.00),
  // el set cuesta $15.00: la tercera sale en $3.00 en vez de $6.00.
  pintarPista() {
    for (const set of this.catalogo) {
      if (!Number.isFinite(set.precio) || this.sets.has(set.slug)) continue
      const tiene = set.piezas.filter((p) => this.elegidas.has(p))
      const faltan = set.piezas.filter((p) => !this.elegidas.has(p))
      if (tiene.length === 0 || faltan.length !== 1) continue
      const suma = totalDe(tiene.map((p) => this.renglonPieza(this.tarjeta(p))))
      const aparte = totalDe(faltan.map((p) => this.renglonPieza(this.tarjeta(p))))
      if (suma.falta || aparte.falta) continue
      const mas = (Math.round(set.precio * 100) - Math.round(suma.monto * 100)) / 100
      if (mas >= aparte.monto) continue
      const falta = this.tarjeta(faltan[0])?.dataset.nombre.toLowerCase() || faltan[0]
      this.pistaTarget.innerHTML = ""
      // Dos largos: el teléfono sólo tiene un renglón para esto.
      const texto = document.createElement("span")
      texto.className = "e-resumen__pista-largo"
      texto.textContent = `Llévate el set ${set.nombre} completo por ${dinero(set.precio)}: la pieza que falta (${falta}) te sale en ${dinero(mas)}.`
      const corto = document.createElement("span")
      corto.className = "e-resumen__pista-corto"
      corto.setAttribute("aria-hidden", "true")
      corto.textContent = `Set completo: ${dinero(set.precio)} (+${dinero(mas)})`
      const boton = document.createElement("button")
      boton.type = "button"
      boton.className = "e-resumen__pista-boton"
      boton.dataset.action = "pedido#completarSet"
      boton.dataset.set = set.slug
      boton.textContent = "Cambiar al set"
      this.pistaTarget.append(texto, corto, " ", boton)
      this.pistaTarget.hidden = false
      return
    }
    this.pistaTarget.hidden = true
    this.pistaTarget.textContent = ""
  }

  precioRenglon(r) {
    if (!Number.isFinite(r.precio)) return "precio por confirmar"
    if (r.cuenta) return r.cuenta
    if (r.desde) return `desde ${dinero(r.precio)}${r.rango ? ` (${r.rango})` : ""}`
    return dinero(r.precio)
  }

  latir() {
    const r = this.resumenTarget
    r.removeAttribute("data-latido")
    // Forzar el reflow para que la animación vuelva a empezar si se toca
    // dos veces seguidas.
    void r.offsetWidth
    r.setAttribute("data-latido", "")
  }

  // ── El mensaje ─────────────────────────────────────────────────────────
  // Un renglón por cosa, con su precio y, si hay multiplicación, la cuenta
  // entera ("3 × $2.50 = $7.50"): así Erika no tiene que sacarla.
  enlace(renglones, total) {
    const lista = renglones.map((r) =>
      `• ${r.textoLargo || r.texto} — ${this.precioRenglon(r)}`)
    // Cada renglón de la plantilla se recorta: Handlebars indenta los
    // parciales, y la sangría del HTML se colaba en el mensaje.
    const plantilla = this.plantillaValue.split("\n").map((r) => r.trim()).join("\n")
    const texto = plantilla
      .replaceAll("{lista}", lista.join("\n"))
      .replaceAll("{total}", textoTotal(total))
      .replaceAll("{abono}", textoAbono(total, this.abonoValue, { delCliente: true }))
    return `${this.numeroValue}?text=${encodeURIComponent(texto)}`
  }

  // ── Recordar la selección (comodidad, nunca imprescindible) ────────────
  leer() {
    const vacio = { sets: [], piezas: [], extras: [], personales: {} }
    try {
      const guardado = JSON.parse(sessionStorage.getItem(CLAVE) || "null")
      if (!guardado || typeof guardado !== "object" || Array.isArray(guardado)) return vacio
      const validos = new Set(this.piezaTargets.map((p) => p.dataset.slug))
      const sets = new Set(this.catalogo.map((s) => s.slug))
      return {
        sets: Array.isArray(guardado.sets) ? guardado.sets.filter((s) => sets.has(s)) : [],
        piezas: Array.isArray(guardado.piezas) ? guardado.piezas.filter((s) => validos.has(s)) : [],
        extras: Array.isArray(guardado.extras) ? guardado.extras.filter((r) => r && typeof r.texto === "string") : [],
        personales: guardado.personales && typeof guardado.personales === "object" ? guardado.personales : {}
      }
    } catch {
      return vacio
    }
  }

  guardar() {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify({
        sets: [...this.sets], piezas: [...this.elegidas], extras: this.extras, personales: this.personales
      }))
    } catch { /* sin almacenamiento, sin recuerdo */ }
  }
}
