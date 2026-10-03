import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"

// La galería colgada de "Las piezas": las flechas y el vaivén.
//
// La fila es un `overflow-x` nativo con `scroll-snap` (ver temporada.css):
// se desliza con el dedo, el trackpad, Mayús + rueda o las flechas del
// teclado, y el scroll de la página pasa de largo. Antes la sección se fijaba
// y bajar la página movía la fila; la gente intentaba ir a la derecha y se
// confundía (02-10-2026), así que ya no se secuestra ningún scroll. Esto sólo
// suma:
//
//   1. Los botones ← →: mueven la fila casi una pantalla, y se apagan
//      (`aria-disabled`, no `disabled`, para no perder el foco) en cada
//      punta.
//   2. El vaivén, sólo con movimiento (`prefers-reduced-motion:
//      no-preference`): cada pieza es un péndulo con resorte y amortiguación
//      (Euler semi-implícito). Al asomar llega colgando, y al deslizar la
//      fila se queda atrás y se mece con la velocidad del deslizamiento; al
//      frenar vuelve sola. Nada se anima con una duración fija, así que nada
//      se pisa al cambiar de sentido.
//
// Todo es `transform`. El ticker de GSAP sólo corre mientras algún péndulo se
// mueve: con la galería quieta no cuesta nada.
export default class extends Controller {
  static targets = ["tira", "flechas", "atras", "adelante", "pendulo"]

  connect() {
    if (!this.hasTiraTarget) return
    this.suave = window.matchMedia("(prefers-reduced-motion: no-preference)")
    if (this.hasFlechasTarget) this.flechasTarget.hidden = false
    this.actualizar()
    // Al cambiar el ancho (girar el teléfono, llegar las fotos) cambia
    // dónde está cada punta.
    this.medidor = new ResizeObserver(() => this.actualizar())
    this.medidor.observe(this.tiraTarget)

    if (this.suave.matches) this.crearPendulos()

    // Las fotos de la fila son `lazy`, y las que están a la derecha, fuera
    // de la fila visible, el navegador las pide recién al deslizar: se veía
    // el fondo de color un instante. Se piden todas cuando la sección se
    // acerca (son pocas y livianas).
    this.cerca = new IntersectionObserver((entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return
      this.tiraTarget.querySelectorAll("img[loading=lazy]").forEach((img) => { img.loading = "eager" })
      this.cerca.disconnect()
    }, { rootMargin: "100% 0px" })
    this.cerca.observe(this.element)
  }

  disconnect() {
    this.medidor?.disconnect()
    this.cerca?.disconnect()
    this.io?.disconnect()
    if (this.paso) gsap.ticker.remove(this.paso)
    this.corriendo = false
    for (const p of this.pendulos ?? []) gsap.set(p.el, { clearProps: "transform" })
  }

  // ── Las flechas ────────────────────────────────────────────────────────
  atras() { this.mover(-1) }
  adelante() { this.mover(1) }

  mover(sentido) {
    const tira = this.tiraTarget
    tira.scrollBy({ left: sentido * tira.clientWidth * 0.8, behavior: this.suave.matches ? "smooth" : "auto" })
  }

  actualizar() {
    if (!this.hasAtrasTarget) return
    const tira = this.tiraTarget
    const inicio = tira.scrollLeft <= 2
    const fin = tira.scrollLeft + tira.clientWidth >= tira.scrollWidth - 2
    this.atrasTarget.setAttribute("aria-disabled", String(inicio))
    this.adelanteTarget.setAttribute("aria-disabled", String(fin))
  }

  // Cada `scroll` de la fila: las flechas, y el empujón a los péndulos con
  // la velocidad del deslizamiento (px/s).
  alDeslizar(evento) {
    this.actualizar()
    if (!this.pendulos) return
    const ahora = evento.timeStamp
    const x = this.tiraTarget.scrollLeft
    if (this.ultimo && ahora > this.ultimo.t) {
      const velocidad = ((x - this.ultimo.x) / (ahora - this.ultimo.t)) * 1000
      this.sentir(velocidad)
    }
    this.ultimo = { x, t: ahora }
  }

  // ── Los péndulos ───────────────────────────────────────────────────────
  crearPendulos() {
    this.pendulos = this.penduloTargets.map((el, i) => ({
      el,
      th: 0,            // ángulo (rad)
      w: 0,             // velocidad angular
      visible: false,
      entro: false,
      signo: i % 2 ? 1 : -1,
      masa: el.classList.contains("e-letrero__mece") ? 4 : 3,
      k: 14 + (i % 3) * 1.5,   // rigidez: período de 1.5 a 1.7 s
      c: 2.2,                  // amortiguación
      set: gsap.quickSetter(el, "rotation", "deg")
    }))
    const porEl = new Map(this.pendulos.map((p) => [p.el, p]))
    this.io = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        const p = porEl.get(e.target)
        p.visible = e.isIntersecting
        // Al asomar por primera vez, un empujón chico: llega colgando.
        if (e.isIntersecting && !p.entro) {
          p.entro = true
          this.empujar(p, p.signo * (1.2 + (p.k % 1) * 0.6))
        }
      }
    })
    this.pendulos.forEach((p) => this.io.observe(p.el))
    this.paso = this.paso.bind(this)
  }

  empujar(p, dw) {
    p.w += dw / p.masa
    if (!this.corriendo) {
      this.corriendo = true
      gsap.ticker.add(this.paso)
    }
  }

  paso(_tiempo, dtMs) {
    const dt = Math.min(dtMs / 1000, 1 / 30)
    let activos = 0
    for (const p of this.pendulos) {
      if (Math.abs(p.th) < 0.0008 && Math.abs(p.w) < 0.002) {
        if (p.th !== 0) { p.th = 0; p.w = 0; p.set(0) }
        continue
      }
      p.w += (-p.k * Math.sin(p.th) - p.c * p.w) * dt
      // Tope de ~15°: un deslizamiento violento no da vuelta una pieza.
      p.th = gsap.utils.clamp(-0.26, 0.26, p.th + p.w * dt)
      p.set(p.th * 57.2958)
      activos++
    }
    if (!activos) {
      gsap.ticker.remove(this.paso)
      this.corriendo = false
    }
  }

  // La fila va hacia la izquierda al deslizar hacia adelante: lo que cuelga
  // se queda atrás, con la base corrida a la derecha (giro negativo desde la
  // pinza).
  sentir(velocidad) {
    if (!velocidad) return
    const dw = gsap.utils.clamp(-0.12, 0.12, velocidad * -0.0001)
    for (const p of this.pendulos) if (p.visible) this.empujar(p, dw)
  }
}
