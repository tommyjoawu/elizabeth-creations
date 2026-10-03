import { Controller } from "@hotwired/stimulus"

// La foto en grande (piezas/zoom).
//
// Cada foto que se agranda es un enlace a su archivo grande con
// `data-action="click->zoom#abrir"` (sin JavaScript, el enlace abre la foto
// sola). Con JavaScript se abre el <dialog> modal con una copia de la misma
// <picture> pero con `sizes="100vw"`: el navegador escoge solo el ancho más
// grande que le sirve, en AVIF o WebP, y lo que ya bajó para la tarjeta se
// ve al instante mientras llega el grande.
//
// · Las fotos del mismo `data-zoom-grupo` se recorren con las flechas, con
//   ← → del teclado o deslizando el dedo.
// · Un toque en la foto la agranda al doble y el lienzo se vuelve
//   desplazable (con el dedo, el trackpad o la rueda); otro toque la vuelve
//   a su tamaño. En el teléfono también se puede pellizcar.
// · Esc, ✕ o un toque en el fondo cierran; el foco vuelve a la foto tocada.
export default class extends Controller {
  static targets = ["dialogo", "lienzo", "pie", "cuenta", "anterior", "siguiente"]

  abrir(evento) {
    if (!this.hasDialogoTarget || typeof this.dialogoTarget.showModal !== "function") return
    // Con Ctrl/Cmd o la rueda del medio, el enlace se abre aparte, como
    // cualquier enlace.
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.button > 0) return
    evento.preventDefault()
    const enlace = evento.currentTarget
    const grupo = enlace.dataset.zoomGrupo
    this.fotos = grupo
      ? [...document.querySelectorAll(`[data-zoom-grupo="${CSS.escape(grupo)}"]`)]
      : [enlace]
    this.origen = enlace
    this.mostrar(this.fotos.indexOf(enlace))
    this.dialogoTarget.showModal()
    window.dispatchEvent(new CustomEvent("pagina:quieta", { detail: { quieta: true } }))
  }

  mostrar(indice) {
    const n = this.fotos.length
    this.indice = (indice + n) % n
    const enlace = this.fotos[this.indice]
    const original = enlace.querySelector("picture") || enlace.querySelector("img")
    const copia = original.cloneNode(true)
    copia.removeAttribute("class")
    for (const el of [copia, ...copia.querySelectorAll("source, img")]) {
      if (el.hasAttribute("sizes")) el.setAttribute("sizes", "100vw")
    }
    const img = copia.tagName === "IMG" ? copia : copia.querySelector("img")
    img.loading = "eager"
    img.decoding = "async"
    img.removeAttribute("fetchpriority")
    img.className = "e-zoom-dialogo__foto"
    img.draggable = false
    this.lienzoTarget.removeAttribute("data-ampliada")
    this.lienzoTarget.replaceChildren(copia)
    this.pieTarget.textContent = img.alt
    const varias = n > 1
    this.cuentaTarget.textContent = varias ? `${this.indice + 1} de ${n}` : ""
    this.anteriorTarget.hidden = !varias
    this.siguienteTarget.hidden = !varias
  }

  anterior() { this.mostrar(this.indice - 1) }
  siguiente() { this.mostrar(this.indice + 1) }

  cerrar() {
    if (this.dialogoTarget.open) this.dialogoTarget.close()
  }

  alCerrar() {
    this.lienzoTarget.replaceChildren()
    window.dispatchEvent(new CustomEvent("pagina:quieta", { detail: { quieta: false } }))
    this.origen?.focus({ preventScroll: true })
    this.origen = null
  }

  tecla(evento) {
    if (evento.key === "ArrowLeft" && this.fotos?.length > 1) { evento.preventDefault(); this.anterior() }
    if (evento.key === "ArrowRight" && this.fotos?.length > 1) { evento.preventDefault(); this.siguiente() }
  }

  // El fondo: el propio <dialog> o el lienzo alrededor de la foto.
  alTocarFondo(evento) {
    if (evento.target === this.dialogoTarget || evento.target === this.lienzoTarget) this.cerrar()
  }

  // ── El gesto sobre la foto: toque (agrandar) o deslizar (cambiar) ─────
  empezarGesto(evento) {
    this.gesto = { x: evento.clientX, y: evento.clientY, t: evento.timeStamp, id: evento.pointerId }
  }

  terminarGesto(evento) {
    const g = this.gesto
    this.gesto = null
    if (!g || g.id !== evento.pointerId || !evento.target.closest(".e-zoom-dialogo__foto")) return
    const dx = evento.clientX - g.x
    const dy = evento.clientY - g.y
    const ampliada = this.lienzoTarget.hasAttribute("data-ampliada")
    // Deslizar de lado, sin agrandar: la anterior o la siguiente.
    if (!ampliada && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && this.fotos.length > 1) {
      dx > 0 ? this.anterior() : this.siguiente()
      return
    }
    // Un toque (casi sin moverse): agrandar o volver.
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) this.alternarAmpliada(evento)
  }

  alternarAmpliada(evento) {
    const lienzo = this.lienzoTarget
    const img = lienzo.querySelector("img")
    if (lienzo.hasAttribute("data-ampliada")) {
      lienzo.removeAttribute("data-ampliada")
      lienzo.scrollTo(0, 0)
      return
    }
    // El punto tocado, en proporción de la foto: al agrandarla, ese mismo
    // punto queda en el centro.
    const caja = img.getBoundingClientRect()
    const px = (evento.clientX - caja.left) / caja.width
    const py = (evento.clientY - caja.top) / caja.height
    lienzo.setAttribute("data-ampliada", "")
    requestAnimationFrame(() => {
      lienzo.scrollTo({
        left: px * img.offsetWidth - lienzo.clientWidth / 2,
        top: py * img.offsetHeight - lienzo.clientHeight / 2
      })
    })
  }
}
