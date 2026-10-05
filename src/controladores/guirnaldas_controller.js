import { Controller } from "@hotwired/stimulus"
import { dinero, totalDe, textoTotal, textoAbono, montoAbono, rellenarMensaje } from "../precios.js"

// La guirnalda de la sección "Guirnaldas": cuántas, con la cuenta a la vista.
//
// Sin este controlador la sección ya sirve: "Pedir por WhatsApp" abre el
// chat con la pieza nombrada. Esto agrega, igual que en las varitas:
//
//   · La cantidad (de 1 a MAXIMO) y la cuenta: "Guirnalda de cielo: $5.00",
//     "2 guirnaldas de cielo: 2 × $5.00 = $10.00".
//   · "Agregar al pedido" manda el renglón al resumen de "Las piezas"
//     (evento `pedido:agregar`; el controlador `pedido` es el dueño del
//     pedido). Con `grupo: "guirnaldas"`: las guirnaldas SÍ llevan abono
//     (Erika, 03-10-2026), y `abonoDe` (src/precios.js) sólo deja fuera las
//     varitas.
//   · "Pedir sólo esto" abre WhatsApp con la guirnalda sola, con su abono
//     del 30 % en el mensaje, y pasa antes por la ventanita del abono
//     (`abono#confirmar` lee `data-abono-aplica` y `data-abono-monto`).
//   · Lo que ya está en el pedido se lista aquí con su "Quitar"
//     (`pedido:cambio`).
const MAXIMO = 10

export default class extends Controller {
  static targets = ["cantidad", "cuenta", "solo", "armado", "sinJs", "enPedido", "lista"]
  static values = {
    precio: Number, nombre: String, numero: String, plantilla: String,
    abono: { type: Number, default: 30 }, nota: String
  }

  connect() {
    this.n = 1
    this.armadoTarget.hidden = false
    this.sinJsTarget.hidden = true
    this.componer()
    // "Las piezas" conectó antes y ya avisó: se le pregunta de nuevo.
    window.dispatchEvent(new CustomEvent("pedido:estado"))
  }

  menos() { this.n = Math.max(1, this.n - 1); this.componer() }
  mas() { this.n = Math.min(MAXIMO, this.n + 1); this.componer() }

  // El renglón tal como llega al pedido: { grupo, texto, precio, cuenta, cantidad }.
  renglon() {
    const precio = Math.round(this.precioValue * 100) * this.n / 100
    const nombre = this.nombreValue
    const plural = nombre.replace(/^Guirnalda/, "guirnaldas")
    return {
      grupo: "guirnaldas", cantidad: this.n, precio,
      texto: this.n === 1 ? nombre : `${this.n} ${plural}`,
      cuenta: this.n > 1 ? `${this.n} × ${dinero(this.precioValue)} = ${dinero(precio)}` : null
    }
  }

  componer() {
    this.cantidadTarget.textContent = String(this.n)
    const r = this.renglon()
    this.cuentaTarget.textContent = `${r.texto}: ${r.cuenta || dinero(r.precio)}`
    const total = totalDe([r])
    this.soloTarget.href = this.enlace(r, total)
    this.soloTarget.dataset.abonoAplica = "todo"
    this.soloTarget.dataset.abonoMonto = montoAbono(total, this.abonoValue) || ""
  }

  agregar() {
    window.dispatchEvent(new CustomEvent("pedido:agregar", { detail: this.renglon() }))
  }

  enlace(r, total) {
    const texto = rellenarMensaje(this.plantillaValue, {
      lista: `• ${r.texto} — ${r.cuenta || dinero(r.precio)}`,
      total: textoTotal(total),
      abono: textoAbono(total, this.abonoValue, { delCliente: true }),
      notaAbono: `${this.notaValue} `
    })
    return `${this.numeroValue}?text=${encodeURIComponent(texto)}`
  }

  // ── Lo que ya está en el pedido ────────────────────────────────────────
  alCambiarPedido(evento) {
    const mias = (evento.detail?.extras || []).filter((r) => r.grupo === "guirnaldas")
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
