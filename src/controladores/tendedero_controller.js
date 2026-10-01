import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// El empujón del tendedero.
//
// El vaivén de siempre es CSS y no pasa por acá. Esto agrega lo que el CSS no
// sabe: la VELOCIDAD del scroll. Al bajar rápido los adornos se quedan atrás y
// se inclinan, y al frenar vuelven con un rebote elástico, como algo que
// cuelga de un hilo (la física de Charmling, docs/research.md §2).
//
// Se gira `.e-adorno__impulso`, la capa de afuera: la de adentro sigue con su
// animación de CSS, y las dos rotaciones se suman sin pisarse.
//
// Sólo sin `reduced-motion`. El scroll táctil también cuenta: en un teléfono
// es donde más se nota que la página responde al dedo.
export default class extends Controller {
  static targets = ["adorno"]

  connect() {
    this.mm = gsap.matchMedia()
    this.mm.add("(prefers-reduced-motion: no-preference)", () => {
      const capas = this.adornoTargets.map((adorno) => adorno.querySelector(".e-adorno__impulso"))
      // Cada adorno con su inercia: los de hilo largo se van más lejos. Los
      // pesos se leen ANTES de crear los tweens (que escriben estilos): leer
      // y escribir intercalados obliga a recalcular estilos una vez por
      // adorno.
      const pesos = this.adornoTargets.map((adorno) =>
        0.6 + parseFloat(getComputedStyle(adorno).getPropertyValue("--largo")) / 14)
      const hacia = capas.map((capa) =>
        gsap.quickTo(capa, "rotate", { duration: 0.9, ease: "elastic.out(1, 0.35)" }))

      // Mientras la sección esté en pantalla: sirve igual para el hero, que
      // arranca arriba de todo, y para el cordel del cierre.
      let reposo
      ScrollTrigger.create({
        trigger: this.element,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (st) => {
          // La velocidad en px/s, llevada a unos pocos grados y con tope: un
          // scroll violento no puede dar la vuelta a un adorno.
          const inclinacion = gsap.utils.clamp(-14, 14, st.getVelocity() / -160)
          hacia.forEach((ir, i) => ir(inclinacion * pesos[i]))
          clearTimeout(reposo)
          reposo = setTimeout(() => hacia.forEach((ir) => ir(0)), 90)
        }
      })

      return () => clearTimeout(reposo)
    })
  }

  disconnect() {
    this.mm?.revert()
  }
}
