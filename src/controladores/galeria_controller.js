import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// La galería colgada (traída de variantes/navidad/navidad.js).
//
// Dos cosas, las dos sólo con movimiento (`prefers-reduced-motion:
// no-preference`); sin eso la fila queda deslizable con el dedo, quieta:
//
//   1. La sección se fija y la pista avanza de lado mientras se baja la
//      página: el scroll vertical se vuelve el paseo por el cable. El largo
//      del fijado es lo que mide la pista de más, así que bajar un píxel es
//      avanzar un píxel.
//   2. Cada pieza es un péndulo con resorte y amortiguación (Euler
//      semi-implícito): al avanzar, las piezas se quedan atrás y se mecen, y
//      al frenar vuelven solas. La velocidad del scroll las empuja; nada se
//      anima con una duración fija, así que nada se pisa al cambiar de
//      sentido.
//
// Todo es `transform`. El ticker de GSAP sólo corre mientras algún péndulo se
// mueve: con la galería quieta no cuesta nada.
export default class extends Controller {
  static targets = ["fijo", "ventana", "pista", "pendulo"]

  connect() {
    this.mm = gsap.matchMedia()
    this.mm.add("(prefers-reduced-motion: no-preference)", () => {
      this.element.classList.add("e-galeria--fija")
      this.crearPendulos()

      // Las fotos de la fila son `lazy`, pero con la pista fuera de la
      // pantalla (a la derecha) el navegador no las pediría hasta que
      // entren, en pleno paseo. Se piden un poco antes de llegar.
      ScrollTrigger.create({
        trigger: this.element, start: "top bottom+=120%", once: true,
        // `decoding = "sync"` también: con `async`, Chrome deja para después
        // decodificar una foto que entra de lado en una capa que se mueve, y
        // por un instante se veía el fondo de color en vez de la pieza.
        onEnter: () => this.element.querySelectorAll(".e-galeria__tira img").forEach((img) => {
          img.loading = "eager"
          img.decoding = "sync"
        })
      })

      const recorrido = () => Math.max(0, this.pistaTarget.scrollWidth - document.documentElement.clientWidth)
      this.tween = gsap.to(this.pistaTarget, {
        x: () => -recorrido(),
        ease: "none",
        // Se fija la caja de adentro y no la sección: ScrollTrigger mete lo
        // fijado en un `pin-spacer`, y si moviera el elemento del
        // controlador, Stimulus lo vería salir y entrar del DOM y volvería a
        // conectarlo (y a fijarlo) sin fin.
        scrollTrigger: {
          trigger: this.fijoTarget,
          start: "top top",
          end: () => "+=" + recorrido(),
          pin: this.fijoTarget,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (st) => this.sentir(st.getVelocity())
        }
      })

      // Con el teclado, el foco puede caer en una pieza que todavía está
      // fuera de la pantalla, a la derecha: se baja la página hasta donde la
      // pista la muestra.
      this.alEnfocar = (evento) => this.mostrar(evento.target)
      this.element.addEventListener("focusin", this.alEnfocar)

      return () => {
        this.element.removeEventListener("focusin", this.alEnfocar)
        gsap.ticker.remove(this.paso)
        this.corriendo = false
        this.io?.disconnect()
        for (const p of this.pendulos ?? []) gsap.set(p.el, { clearProps: "transform" })
        this.element.classList.remove("e-galeria--fija")
      }
    })
  }

  disconnect() {
    this.mm?.revert()
  }

  mostrar(objetivo) {
    const st = this.tween?.scrollTrigger
    const pieza = objetivo.closest("li")
    if (!st || !pieza || !this.pistaTarget.contains(pieza)) return
    const recorrido = st.end - st.start
    if (recorrido <= 0) return
    const ancho = document.documentElement.clientWidth
    // La pieza centrada en la pantalla.
    const centro = pieza.offsetLeft + pieza.closest("ul").offsetLeft + pieza.offsetWidth / 2 - ancho / 2
    const avance = gsap.utils.clamp(0, recorrido, centro)
    window.scrollTo({ top: st.start + avance, behavior: "instant" })
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
      // Tope de ~15°: un scroll violento no da vuelta una pieza.
      p.th = gsap.utils.clamp(-0.26, 0.26, p.th + p.w * dt)
      p.set(p.th * 57.2958)
      activos++
    }
    if (!activos) {
      gsap.ticker.remove(this.paso)
      this.corriendo = false
    }
  }

  // La pista va hacia la izquierda al bajar: lo que cuelga se queda atrás,
  // con la base corrida a la derecha (giro negativo desde la pinza).
  sentir(velocidad) {
    if (!velocidad || !this.pendulos) return
    const dw = gsap.utils.clamp(-0.12, 0.12, velocidad * -0.0001)
    for (const p of this.pendulos) if (p.visible) this.empujar(p, dw)
  }
}
