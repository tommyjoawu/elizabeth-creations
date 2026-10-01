import { Controller } from "@hotwired/stimulus"

// La píldora de WhatsApp del celular: visible sólo donde no sobra.
//
// Mira con un IntersectionObserver —nada de escuchar el scroll— los lugares
// donde ya hay otro camino a WhatsApp a la vista, y se esconde mientras
// alguno se vea:
//
//   · el hero, con su botón grande;
//   · los encargos: ahí el botón es "Enviar por WhatsApp" de la ficha, que
//     manda el mensaje armado, y la píldora mandaría uno genérico encima
//     del formulario;
//   · el cierre y el pie, que tienen los suyos.
export default class extends Controller {
  connect() {
    const zonas = ["#inicio", "#temporada", "#encargos", "#contacto", "body > footer"]
      .map((selector) => document.querySelector(selector))
      .filter(Boolean)
    if (zonas.length === 0 || !("IntersectionObserver" in window)) return

    this.visibles = new Set()
    this.observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => (e.isIntersecting ? this.visibles.add(e.target) : this.visibles.delete(e.target)))
      const sobra = this.visibles.size > 0
      this.element.dataset.pildoraOculta = String(sobra)
      // Escondida, no se enfoca con el teclado ni la lee un lector de
      // pantalla: un botón invisible en el orden de tabulación es una trampa.
      this.element.inert = sobra
    }, { threshold: 0.12 })
    zonas.forEach((zona) => this.observador.observe(zona))
  }

  disconnect() {
    this.observador?.disconnect()
  }
}
