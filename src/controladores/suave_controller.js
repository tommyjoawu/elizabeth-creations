import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// El scroll con inercia.
//
// Lenis no reemplaza el scroll del navegador: lo interpola. La página sigue
// desplazándose de verdad —`position: sticky`, las anclas y el buscador del
// navegador funcionan igual— y lo único que cambia es que la rueda del ratón
// llega con peso en vez de a saltos de cien píxeles.
//
// Se apaga en dos casos, y los decide el navegador:
//
//   1. `prefers-reduced-motion`. La inercia es exactamente el movimiento que
//      esa preferencia pide que no haya.
//   2. Puntero grueso (un dedo). El scroll táctil del sistema ya tiene
//      inercia, y encima de él una segunda se siente como arrastrar algo
//      mojado.
//
// Lenis se pide aparte (`import()`) y sólo cuando corresponde: en un
// teléfono no se usa nunca, y bajarlo y compilarlo igual era casi la mitad
// del JavaScript de la página.
export default class extends Controller {
  async connect() {
    if (!this.corresponde()) return

    const { default: Lenis } = await import("lenis")
    // Pudo desconectarse mientras llegaba el módulo.
    if (!this.element.isConnected || this.lenis) return
    this.lenis = new Lenis({
      duration: 1.1,
      // Salida exponencial: arranca a la velocidad de la rueda y frena largo.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true
    })

    // Un solo reloj para las dos cosas. Si Lenis y ScrollTrigger corrieran
    // cada uno con su requestAnimationFrame, las escenas irían un fotograma
    // detrás del scroll y temblarían.
    this.lenis.on("scroll", ScrollTrigger.update)
    this.alTic = (tiempo) => this.lenis.raf(tiempo * 1000)
    gsap.ticker.add(this.alTic)
    gsap.ticker.lagSmoothing(0)

    // Con el menú del celular abierto la página de atrás no tiene que moverse.
    this.alMenu = (evento) => (evento.detail.abierto ? this.lenis.stop() : this.lenis.start())
    window.addEventListener("isla:menu", this.alMenu)
  }

  disconnect() {
    window.removeEventListener("isla:menu", this.alMenu)
    if (this.alTic) gsap.ticker.remove(this.alTic)
    this.lenis?.destroy()
    this.lenis = null
  }

  corresponde() {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
           window.matchMedia("(pointer: fine)").matches
  }
}
