import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Los pasos del taller y su marco fijo.
//
// El marco ya es `sticky` en CSS; acá sólo se decide QUÉ paso se está
// leyendo —el que cruza la mitad de la pantalla— y se le avisa al marco:
// cambia la foto y el color de su capa. Sin JavaScript no hay marco, y cada
// paso lleva su foto debajo (ver taller.css).
//
// Sólo desde 1024px, que es donde existe el marco. Con `reduced-motion` la
// foto cambia igual —es información, no adorno—, sólo que sin fundido (el
// CSS ya apaga las transiciones).
export default class extends Controller {
  static targets = ["marco", "foto", "paso"]

  connect() {
    this.mm = gsap.matchMedia()
    this.mm.add("(min-width: 1024px)", () => {
      this.pasoTargets.forEach((paso, i) => {
        ScrollTrigger.create({
          trigger: paso,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (st) => st.isActive && this.activar(i)
        })
      })
      this.activar(0)
    })
  }

  disconnect() {
    this.mm?.revert()
  }

  activar(indice) {
    if (indice === this.actual) return
    this.actual = indice
    this.fotoTargets.forEach((foto, i) => { foto.dataset.activa = String(i === indice) })
    this.pasoTargets.forEach((paso, i) => { paso.dataset.activo = String(i === indice) })
    this.marcoTarget.style.setProperty("--tono-paso", this.pasoTargets[indice].dataset.tono)
  }
}
