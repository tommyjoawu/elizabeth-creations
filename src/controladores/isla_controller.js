import { Controller } from "@hotwired/stimulus"

// La isla de navegación: se esconde al bajar y vuelve al subir.
//
// Al bajar se está leyendo, y la isla tapa la parte de arriba de lo que se
// lee. Al subir, casi siempre, se está buscando adónde ir: ahí tiene que
// estar. Nunca se esconde con el menú abierto ni con el foco adentro —un
// usuario de teclado no puede quedarse tabulando por enlaces invisibles—.
//
// El menú del celular es un <details> y abre sin este controlador. Lo que
// agrega acá: avisar a `suave` que frene la página de atrás, cerrarlo con
// Escape y cerrarlo al elegir un enlace.
export default class extends Controller {
  static targets = ["menu"]

  // Por debajo de esta altura la isla no se esconde nunca: en el hero no
  // tapa nada que haya que leer.
  static UMBRAL = 160

  connect() {
    this.ultimo = window.scrollY
    this.alScroll = () => {
      if (this.pendiente) return
      this.pendiente = true
      requestAnimationFrame(() => this.evaluar())
    }
    window.addEventListener("scroll", this.alScroll, { passive: true })

    this.alTecla = (evento) => {
      if (evento.key !== "Escape" || !this.menuAbierto) return
      this.menuTarget.open = false
      this.menuTarget.querySelector("summary")?.focus()
    }
    document.addEventListener("keydown", this.alTecla)
  }

  disconnect() {
    window.removeEventListener("scroll", this.alScroll)
    document.removeEventListener("keydown", this.alTecla)
    document.documentElement.classList.remove("e-menu-abierto")
    document.querySelectorAll("#principal, body > footer").forEach((el) => { el.inert = false })
  }

  evaluar() {
    this.pendiente = false
    const y = window.scrollY
    const delta = y - this.ultimo
    this.ultimo = y

    if (this.menuAbierto || this.element.contains(document.activeElement)) return this.mostrar()
    // Unos píxeles de margen: el scroll con inercia deja pasos de 1-2px
    // hacia atrás al frenar, y sin margen la isla parpadea.
    if (delta > 6 && y > this.constructor.UMBRAL) this.element.dataset.oculta = "true"
    else if (delta < -6 || y <= this.constructor.UMBRAL) this.mostrar()
  }

  mostrar() {
    delete this.element.dataset.oculta
  }

  alternar() {
    const abierto = this.menuAbierto
    document.documentElement.classList.toggle("e-menu-abierto", abierto)
    // El menú tapa la página entera, pero el Tab no lo sabe: sin esto, del
    // último enlace del menú el foco salta a <main>, que está debajo y no se
    // ve. `inert` saca del teclado y del lector de pantalla todo lo de atrás.
    document.querySelectorAll("#principal, body > footer").forEach((el) => { el.inert = abierto })
    this.dispatch("menu", { detail: { abierto }, prefix: "isla", target: window })
  }

  cerrar() {
    if (this.hasMenuTarget) this.menuTarget.open = false
  }

  get menuAbierto() {
    return this.hasMenuTarget && this.menuTarget.open
  }
}
