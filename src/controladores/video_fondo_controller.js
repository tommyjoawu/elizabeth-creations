import { Controller } from "@hotwired/stimulus"

// Un video en bucle, detrás de su foto.
//
// El HTML no trae ningún <video>: trae la foto del póster y nada más. Este
// controlador CREA el elemento sólo cuando reproducirlo no le hace daño a
// nadie, y por eso el video no se descarga —ni un byte— en los casos en que no
// se va a ver. Un <video autoplay> escrito en la plantilla ya habría empezado
// a bajar megas antes de que ninguna condición se pudiera evaluar.
//
// Las razones para no reproducirlo, todas decididas por el navegador:
//
//   1. `prefers-reduced-motion`: un bucle perpetuo es exactamente lo que esa
//      preferencia pide que no pase.
//   2. Pantalla chica: en un celular el video es una píldora de 60px y se
//      paga con datos.
//   3. `Save-Data` o una conexión 2G declarada.
//   4. La pestaña oculta: se pausa y se reanuda al volver.
//
// Si algo falla —el navegador rechaza el autoplay, el archivo no llega— el
// elemento se quita y queda el póster, que ya estaba pintado.
export default class extends Controller {
  // `movil`: este video SÍ se reproduce en el celular. Sólo para los que son
  // el contenido de su sección y no un adorno: la varita girando (~0.7 MB) y
  // los pasos del taller, que son las manos de Erika haciendo la pieza
  // (~0.4–0.7 MB cada uno). Igual se piden sólo al entrar en pantalla.
  //
  // `soloActiva`: el video vive en una pila donde sólo una capa se ve a la
  // vez (el marco fijo del taller, que marca la suya con `data-activa`). Las
  // otras están en pantalla pero transparentes: sin esto, los cinco videos
  // del taller correrían juntos detrás del que se ve. Sólo corre el de la
  // capa activa, y el siguiente se crea recién cuando le toca.
  static values = { src: String, movil: Boolean, soloActiva: Boolean }

  connect() {
    if (!this.srcValue || !this.debeReproducir()) return
    if (!("IntersectionObserver" in window)) return this.crear()

    this.enPantalla = false
    this.observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        this.enPantalla = entrada.isIntersecting
        this.decidir()
      })
    }, { rootMargin: "50% 0px" })
    this.observador.observe(this.element)

    if (this.soloActivaValue) {
      this.vigia = new MutationObserver(() => this.decidir())
      this.vigia.observe(this.element, { attributes: true, attributeFilter: ["data-activa"] })
    }
  }

  decidir() {
    const toca = this.enPantalla && (!this.soloActivaValue || this.element.dataset.activa === "true")
    if (toca) this.video ? this.video.play().catch(() => {}) : this.crear()
    else this.video?.pause()
  }

  crear() {
    this.video = document.createElement("video")
    // `src` sin extensión ("/video/varita-luna-gira") = hay WebM y MP4: se
    // ofrece primero el WebM (VP9, más liviano) y el MP4 (H.264) para Safari
    // y el resto. Con extensión, ese archivo y nada más.
    // Vite no reescribe rutas dentro de data-*: con el sitio publicado en una
    // subcarpeta (GitHub Pages, /erika-landing/) se antepone la base a mano.
    const src = this.srcValue.startsWith("/")
      ? import.meta.env.BASE_URL.replace(/\/$/, "") + this.srcValue
      : this.srcValue
    if (/\.\w+$/.test(src)) {
      this.video.src = src
    } else {
      for (const [ext, tipo] of [["webm", "video/webm"], ["mp4", "video/mp4"]]) {
        const fuente = document.createElement("source")
        fuente.src = `${src}.${ext}`
        fuente.type = tipo
        this.video.appendChild(fuente)
      }
      // El error de una <source> no llega al <video>: si fallan las dos, se
      // entera la última.
      this.video.lastElementChild.addEventListener("error", () => this.quitar(), { once: true })
    }
    Object.assign(this.video, {
      muted: true,        // sin esto ningún navegador deja arrancar solo
      loop: true,
      playsInline: true,  // en iOS, si no, se abre a pantalla completa
      autoplay: true,
      preload: "auto"
    })
    this.video.setAttribute("aria-hidden", "true")
    this.video.setAttribute("tabindex", "-1")
    // Entra con un fundido sobre su póster: el corte seco entre la foto fija y
    // el primer fotograma se nota como un parpadeo.
    this.video.style.opacity = "0"
    this.video.style.transition = "opacity 900ms ease-out"
    this.video.addEventListener("playing", () => { this.video.style.opacity = "1" }, { once: true })
    this.video.addEventListener("error", () => this.quitar(), { once: true })

    this.element.appendChild(this.video)
    this.video.play().catch(() => this.quitar())

    this.alCambiarVisibilidad = () => {
      if (!this.video) return
      document.hidden ? this.video.pause() : this.decidir()
    }
    document.addEventListener("visibilitychange", this.alCambiarVisibilidad)
  }

  disconnect() {
    document.removeEventListener("visibilitychange", this.alCambiarVisibilidad)
    this.observador?.disconnect()
    this.vigia?.disconnect()
    this.quitar()
  }

  quitar() {
    if (!this.video) return
    this.video.pause()
    // Vaciar el `src` (y las <source>) y recargar aborta la descarga en curso.
    this.video.removeAttribute("src")
    this.video.replaceChildren()
    this.video.load()
    this.video.remove()
    this.video = null
  }

  debeReproducir() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
    if (!this.movilValue && window.matchMedia("(max-width: 767px)").matches) return false

    const conexion = navigator.connection
    if (conexion?.saveData) return false
    if (conexion?.effectiveType && /(^|-)2g$/.test(conexion.effectiveType)) return false

    return true
  }
}
