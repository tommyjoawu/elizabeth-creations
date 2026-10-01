import { Controller } from "@hotwired/stimulus"

// Los carriles del celular (las etiquetas de Navidad y los banderines): una
// fila que se desliza con el dedo.
//
// Con el teclado el navegador NO la desliza sola: al tabular, el foco cae en
// un botón que asoma 30px por el borde y queda ahí, casi fuera de la
// pantalla. Esto trae al frente la pieza que recibe el foco. Sólo cuando la
// fila de verdad se desliza: en escritorio es una grilla y no hay nada que
// mover.
export default class extends Controller {
  enfocar(evento) {
    if (this.element.scrollWidth <= this.element.clientWidth) return
    const pieza = evento.target.closest("li")
    if (!pieza) return

    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    pieza.scrollIntoView({ inline: "start", block: "nearest", behavior: suave ? "smooth" : "auto" })
  }
}
