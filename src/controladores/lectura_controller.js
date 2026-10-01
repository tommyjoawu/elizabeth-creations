import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"

// La frase que se lee sola: cada palabra arranca apagada y se enciende a
// medida que el scroll la alcanza, como si alguien la estuviera leyendo en
// voz alta al ritmo en que se baja la página.
//
// El estado apagado lo pone ESTE controlador, no el CSS. La frase está por
// debajo del pliegue, así que el bundle siempre llega antes que el lector; y
// si no llega —o si hay `reduced-motion`— la frase queda entera y legible, en
// vez de quedar a medio encender para siempre.
export default class extends Controller {
  connect() {
    this.mm = gsap.matchMedia()
    this.mm.add("(prefers-reduced-motion: no-preference)", () => {
      const palabras = this.element.querySelectorAll(".e-palabra")
      const pastillas = this.element.querySelectorAll(".e-pastilla")
      // Termina de encenderse con el CENTRO de la frase a 60% de la pantalla:
      // antes de que llegue a la zona donde se lee, ya está entera.
      const lectura = { trigger: this.element, start: "top 85%", end: "center 60%", scrub: 0.5 }

      // 0.25 y no menos: apagada, la palabra tiene que seguir siendo una
      // palabra —se ve la frase entera, sólo que por encender—.
      gsap.fromTo(palabras, { opacity: 0.25 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: lectura })

      // Las píldoras de foto crecen desde su centro, un poco antes que las
      // palabras que las rodean.
      gsap.fromTo(pastillas, { scale: 0.3, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, ease: "none", stagger: 0.4, scrollTrigger: lectura })
    })
  }

  disconnect() {
    this.mm?.revert()
  }
}
