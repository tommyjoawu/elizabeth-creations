import { Controller } from "@hotwired/stimulus"
import { dinero, totalDe, textoTotal, textoAbono } from "../precios.js"

// La varita armable: forma, color y cuántas, con la cuenta a la vista.
//
// Sin este controlador la sección ya sirve: cada forma es un enlace a
// WhatsApp con su mensaje, la docena tiene el suyo y la tarifa está escrita.
// Esto agrega:
//
//   · Las fichas Luna/Estrella dejan de abrir WhatsApp y pasan a escoger
//     (`aria-pressed`, como el botón del set en "Las piezas"); las muestras
//     de color se encienden y se escoge una.
//   · Por unidad (con su contador) o por docena; la docena puede ir
//     variada, y entonces la cuenta se escribe entera:
//     "$25.00 + 12 × $1.50 = $43.00". Variada no pide forma ni color: la
//     mezcla se conversa por WhatsApp.
//   · "Agregar al pedido" manda el renglón al resumen de "Las piezas"
//     (evento `pedido:agregar` en `window`; el controlador `pedido` es el
//     dueño del pedido). "Pedir sólo esto" abre WhatsApp con la varita sola.
//   · Lo que ya está en el pedido se lista aquí con su "Quitar": se entera
//     por `pedido:cambio`.
//
// Los precios llegan de varitas.json (values), y el formato de src/precios.js.
const MAXIMO = 11 // de 12 en adelante, la docena sale más barata

export default class extends Controller {
  static targets = ["forma", "color", "modo", "cantidad", "variada", "soloUnidad", "soloDocena",
                    "cuenta", "aviso", "solo", "armado", "sinJs", "enPedido", "lista"]
  static values = {
    unidad: Number, docena: Number, porDocena: Number, variada: Number,
    abono: Number, numero: String, plantilla: String
  }

  connect() {
    this.forma = "luna"
    this.color = null
    this.n = 1
    for (const ficha of this.formaTargets) {
      ficha.setAttribute("role", "button")
      ficha.removeAttribute("target")
      ficha.setAttribute("aria-label", `Varita con ${ficha.dataset.nombre}`)
      const accion = ficha.querySelector("[data-texto]")
      if (accion) accion.textContent = "Escoger"
    }
    for (const muestra of this.colorTargets) muestra.disabled = false
    this.armadoTarget.hidden = false
    this.sinJsTarget.hidden = true
    this.componer()
    // "Las piezas" conectó antes y ya avisó: se le pregunta de nuevo.
    window.dispatchEvent(new CustomEvent("pedido:estado"))
  }

  // ── Las decisiones ─────────────────────────────────────────────────────
  escogerForma(evento) {
    evento.preventDefault()
    this.forma = evento.currentTarget.dataset.forma
    this.componer()
  }

  // Desde la tarjeta de una varita en "Las piezas": llega con su forma.
  desdeGaleria(evento) {
    if (evento.detail?.forma) this.forma = evento.detail.forma
    this.componer()
  }

  escogerColor(evento) {
    const color = evento.currentTarget.dataset.color
    this.color = this.color === color ? null : color
    this.componer()
  }

  menos() { this.n = Math.max(1, this.n - 1); this.componer() }
  mas() { this.n = Math.min(MAXIMO, this.n + 1); this.componer() }

  get modo() { return this.modoTargets.find((r) => r.checked)?.value || "unidad" }
  get esVariada() { return this.modo === "docena" && this.variadaTarget.checked }

  // ── La cuenta ──────────────────────────────────────────────────────────
  // El renglón tal como llega al pedido: { texto, precio, cuenta, cantidad }.
  renglon() {
    const forma = this.forma === "estrella" ? "estrella" : "luna"
    const color = this.color ? `, color ${this.color.toLowerCase()}` : ""
    if (this.modo === "docena") {
      if (this.esVariada) {
        const precio = (Math.round(this.docenaValue * 100) + this.porDocenaValue * Math.round(this.variadaValue * 100)) / 100
        return {
          grupo: "varitas", cantidad: this.porDocenaValue, precio,
          texto: `Docena de varitas mágicas variada (la mezcla te la digo por aquí)`,
          cuenta: `${dinero(this.docenaValue)} + ${this.porDocenaValue} × ${dinero(this.variadaValue)} = ${dinero(precio)}`
        }
      }
      return {
        grupo: "varitas", cantidad: this.porDocenaValue, precio: this.docenaValue,
        texto: `Docena de varitas mágicas de ${forma}${color} (${this.porDocenaValue}, un solo estilo y color)`
      }
    }
    const precio = Math.round(this.unidadValue * 100) * this.n / 100
    return {
      grupo: "varitas", cantidad: this.n, precio,
      texto: `${this.n} ${this.n === 1 ? "varita mágica" : "varitas mágicas"} de ${forma}${color}`,
      cuenta: this.n > 1 ? `${this.n} × ${dinero(this.unidadValue)} = ${dinero(precio)}` : null
    }
  }

  componer() {
    for (const ficha of this.formaTargets) {
      ficha.setAttribute("aria-pressed", String(!this.esVariada && ficha.dataset.forma === this.forma))
    }
    for (const muestra of this.colorTargets) {
      muestra.setAttribute("aria-pressed", String(!this.esVariada && muestra.dataset.color === this.color))
    }
    const docena = this.modo === "docena"
    this.soloUnidadTarget.hidden = docena
    this.soloDocenaTarget.hidden = !docena
    this.cantidadTarget.textContent = String(this.n)
    this.element.toggleAttribute("data-variada", this.esVariada)

    const r = this.renglon()
    this.cuentaTarget.textContent = `${r.texto[0].toUpperCase()}${r.texto.slice(1)}: ${r.cuenta || dinero(r.precio)}`
    if (this.color || this.esVariada) this.avisoTarget.hidden = true
    this.soloTarget.href = this.enlace(r)
  }

  // Sin color no hay varita (salvo la docena variada): se avisa en vez de
  // apagar el botón, que es más difícil de entender.
  falta() {
    if (this.color || this.esVariada) return false
    this.avisoTarget.textContent = "Escoge un color arriba (o dime otro por WhatsApp)."
    this.avisoTarget.hidden = false
    this.colorTargets[0]?.focus()
    return true
  }

  agregar() {
    if (this.falta()) return
    window.dispatchEvent(new CustomEvent("pedido:agregar", { detail: this.renglon() }))
  }

  pedirSolo(evento) {
    if (this.falta()) evento.preventDefault()
  }

  enlace(r) {
    const total = totalDe([r])
    const plantilla = this.plantillaValue.split("\n").map((x) => x.trim()).join("\n")
    const texto = plantilla
      .replaceAll("{lista}", `• ${r.texto} — ${r.cuenta || dinero(r.precio)}`)
      .replaceAll("{total}", textoTotal(total))
      .replaceAll("{abono}", textoAbono(total, this.abonoValue, { delCliente: true }))
    return `${this.numeroValue}?text=${encodeURIComponent(texto)}`
  }

  // ── Lo que ya está en el pedido ────────────────────────────────────────
  alCambiarPedido(evento) {
    const mias = (evento.detail?.extras || []).filter((r) => r.grupo === "varitas")
    this.enPedidoTarget.hidden = mias.length === 0
    this.listaTarget.replaceChildren(...mias.map((r) => {
      const li = document.createElement("li")
      li.className = "e-armado__renglon"
      const texto = document.createElement("span")
      texto.textContent = `${r.texto} — ${r.cuenta || dinero(r.precio)}`
      const quitar = document.createElement("button")
      quitar.type = "button"
      quitar.className = "e-armado__quitar"
      quitar.textContent = "Quitar"
      quitar.setAttribute("aria-label", `Quitar: ${r.texto}`)
      quitar.addEventListener("click", () =>
        window.dispatchEvent(new CustomEvent("pedido:quitar", { detail: { id: r.id } })))
      li.append(texto, quitar)
      return li
    }))
  }
}
