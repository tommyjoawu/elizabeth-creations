import { Controller } from "@hotwired/stimulus"

// La ventanita "Antes de enviar tu pedido" (piezas/abono).
//
// Se cuelga de los tres "enviar" finales de la página con
// `data-action="…->abono#confirmar"`: el del resumen de las piezas (un
// enlace), el de la ficha de pedido (un formulario) y el "Pedir sólo esto" de
// las varitas (un enlace). En vez de abrir WhatsApp de una vez, abre la
// ventanita con el abono —el monto, si quien la llama lo dejó en
// `data-abono-monto`— y le pasa el mismo enlace a "Entendido, enviar por
// WhatsApp", que es un <a target="_blank"> de verdad: el navegador no
// bloquea lo que abre un toque.
//
// Si otro controlador ya canceló el evento (las varitas sin color), no hace
// nada. El foco lo atrapa el <dialog> modal; al cerrar vuelve al botón que
// lo abrió.
export default class extends Controller {
  static targets = ["dialogo", "monto", "seguir"]

  confirmar(evento) {
    if (evento.defaultPrevented || !this.hasDialogoTarget || typeof this.dialogoTarget.showModal !== "function") return
    const origen = evento.currentTarget
    const href = origen.tagName === "FORM" ? this.enlaceDe(origen) : origen.href
    if (!href) return
    evento.preventDefault()

    const monto = origen.dataset.abonoMonto
    this.montoTarget.textContent = monto ? ` (${monto})` : ""
    this.seguirTarget.href = href
    this.origen = origen.tagName === "FORM" ? origen.querySelector("[type=submit]") : origen
    this.dialogoTarget.showModal()
    // El foco va a la acción principal: es lo que casi todos quieren hacer.
    this.seguirTarget.focus()
    window.dispatchEvent(new CustomEvent("pagina:quieta", { detail: { quieta: true } }))
  }

  // El formulario de la ficha manda un solo campo, `text` (lo arma el
  // controlador `encargo`): es lo único que lee wa.me.
  enlaceDe(formulario) {
    const texto = new FormData(formulario).get("text")
    return `${formulario.action}?text=${encodeURIComponent(texto || "")}`
  }

  // "Entendido": el enlace sigue su camino (abre WhatsApp) y la ventanita se
  // cierra detrás.
  seguir() {
    setTimeout(() => this.cerrar(), 0)
  }

  cerrar() {
    if (this.dialogoTarget.open) this.dialogoTarget.close()
  }

  // Un toque en el fondo oscuro (el propio <dialog>, fuera de la caja) cierra.
  alTocarFondo(evento) {
    if (evento.target === this.dialogoTarget) this.cerrar()
  }

  alCerrar() {
    window.dispatchEvent(new CustomEvent("pagina:quieta", { detail: { quieta: false } }))
    this.origen?.focus({ preventScroll: true })
    this.origen = null
  }
}
