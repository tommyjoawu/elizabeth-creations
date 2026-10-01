import { Controller } from "@hotwired/stimulus"

// Aparición al entrar en pantalla.
//
// La animación y el estado oculto viven en el CSS (`.e-aparece`); acá sólo se
// marca `data-visible="true"` cuando el elemento asoma. El CSS esconde SÓLO
// bajo `html.js`, así que un navegador sin JavaScript ve la página entera,
// quieta.
//
// Va únicamente en lo que está por debajo del pliegue. Animar la entrada del
// titular no se ve mejor: se ve tarde.
export default class extends Controller {
  connect() {
    // Sin IntersectionObserver no hay animación, pero tampoco hay contenido
    // escondido: se revela y listo.
    if (!("IntersectionObserver" in window)) return this.mostrar()

    this.observador = new IntersectionObserver(
      (entradas) => entradas.forEach((entrada) => entrada.isIntersecting && this.mostrar()),
      // Un pelo antes del borde: el elemento termina de aparecer justo cuando
      // el ojo llega, en vez de empezar recién ahí.
      { rootMargin: "0px 0px -8% 0px" }
    )
    this.observador.observe(this.element)
  }

  disconnect() {
    this.observador?.disconnect()
  }

  // Una sola vez. Es una animación de entrada, no un efecto que deba repetirse
  // cada vez que se sube y se baja la página.
  mostrar() {
    this.element.dataset.visible = "true"
    this.observador?.disconnect()
  }
}
