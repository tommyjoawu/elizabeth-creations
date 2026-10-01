import { Controller } from "@hotwired/stimulus"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// La costura: un solo hilo que cose la página de arriba abajo (traído de
// variantes/hilo/hilo.js).
//
// Arranca debajo de los botones del hero, baja por el MARGEN —nunca por
// encima del texto— y termina con un nudo junto al botón de WhatsApp del
// cierre. Mientras se baja, el hilo se va dibujando (un recorte que baja con
// el scroll, scrubbed) y la aguja va en su punta.
//
// El carril:
//   · En el celular, el margen de 16px de la izquierda, sin cruzar nunca.
//   · En pantallas anchas, el aire a cada lado del contenido; el hilo cambia
//     de lado entre capítulos (`data-costura="izq|der"` en cada sección),
//     cruzando en el aire que hay entre uno y otro.
//
// Pasa POR DETRÁS de la galería fijada (que va encima, ver costura.css): un
// hilo quieto sobre una sección que se queda fija se vería despegado.
//
// Sin JavaScript el <svg> está vacío y no ocupa nada. Con reduced-motion se
// dibuja entero desde el principio, sin aguja, con su nudo.
const NS = "http://www.w3.org/2000/svg"

export default class extends Controller {
  static targets = ["lienzo"]

  connect() {
    this.quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    this.armar()
    this.largo = 0
    this.actual = 0
    this.tabla = []
    this.construir()

    if (!this.quieto) {
      const proxy = { l: 0 }
      this.ir = gsap.quickTo(proxy, "l", { duration: 0.55, ease: "power3.out", onUpdate: () => this.pintar(proxy.l) })
      this.trigger = ScrollTrigger.create({
        trigger: this.element,
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => this.ir(this.objetivo())
      })
      this.ir(this.objetivo())
    }

    // Todo lo que cambia el alto (fotos que llegan, fuentes, la galería que
    // se fija, girar el teléfono) obliga a volver a medir. El hilo se rehace
    // en cada `refresh` de ScrollTrigger, que es cuando las demás escenas
    // también miden; el ResizeObserver sólo pide ese refresh.
    this.alRefrescar = () => this.construir()
    ScrollTrigger.addEventListener("refresh", this.alRefrescar)
    let espera
    this.observador = new ResizeObserver(() => {
      clearTimeout(espera)
      espera = setTimeout(() => ScrollTrigger.refresh(), 160)
    })
    this.observador.observe(this.element)
  }

  disconnect() {
    ScrollTrigger.removeEventListener("refresh", this.alRefrescar)
    this.observador?.disconnect()
    this.trigger?.kill()
    this.lienzoTarget.replaceChildren()
  }

  // ── La estructura del dibujo (una vez) ─────────────────────────────────
  armar() {
    const el = (tag, attrs) => {
      const n = document.createElementNS(NS, tag)
      for (const k in attrs) n.setAttribute(k, attrs[k])
      return n
    }
    // Lo dibujado se recorta con un rectángulo que baja hasta la punta: el
    // hilo SIEMPRE baja, así que "hasta tal altura" es "hasta tal largo".
    // Un recorte y no una máscara: la máscara se rasteriza, y en una página
    // de más de 16.000px Chrome dejaba de pintarla al final (el cierre).
    const defs = el("defs", {})
    this.recorte = el("clipPath", { id: "costura-recorte", clipPathUnits: "userSpaceOnUse" })
    this.revela = el("rect", { x: "-20", y: "0", width: "0", height: "0" })
    this.recorte.append(this.revela)
    defs.append(this.recorte)

    // La marca de tiza: por dónde va a pasar el hilo, apenas visible.
    this.tiza = el("path", { class: "e-costura__tiza" })
    // El hilo: un borde crema debajo (para que se lea sobre el rojo del
    // cierre) y las puntadas encima, las dos con el recorte que lo revela.
    this.borde = el("path", { class: "e-costura__borde", "clip-path": "url(#costura-recorte)" })
    this.puntada = el("path", { class: "e-costura__puntada", "clip-path": "url(#costura-recorte)" })
    this.nudo = el("circle", { class: "e-costura__nudo", r: "5" })
    // La aguja apunta hacia +x; el hilo sale de su ojo, en (0,0).
    this.aguja = el("g", { class: "e-costura__aguja" })
    this.aguja.innerHTML = `
      <path d="M-6 0 C -6 -3.2, -3 -3.6, 4 -2.4 L 44 -0.5 L 50 0 L 44 0.5 L 4 2.4 C -3 3.6, -6 3.2, -6 0 Z" fill="#D9D4DA" stroke="#4A4560" stroke-width="1.1"/>
      <ellipse cx="-1.4" cy="0" rx="3" ry="1.1" fill="#FFF9EF" stroke="#4A4560" stroke-width=".8"/>
      <path d="M8 -1.2 L 40 -0.4" stroke="#FFF9EF" stroke-width=".9" stroke-linecap="round" opacity=".85"/>`
    this.lienzoTarget.append(defs, this.tiza, this.borde, this.puntada, this.nudo, this.aguja)
  }

  // ── Por dónde pasa ─────────────────────────────────────────────────────
  puntos() {
    const raiz = this.element
    const caja = raiz.getBoundingClientRect()
    const W = raiz.clientWidth
    const celular = W < 640
    // El borde izquierdo del contenido: el contenedor mide como mucho 88rem
    // y tiene su padding. El hilo va a la mitad de ese aire.
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const padding = Math.min(Math.max(1 * rem, W * 0.04), 3 * rem)
    const aire = Math.max(0, (W - 88 * rem) / 2) + padding
    const xIzq = celular ? Math.max(6, aire * 0.5) : Math.max(14, aire * 0.5)
    const xDer = W - xIzq
    this.celular = celular

    const rel = (el) => {
      const r = el.getBoundingClientRect()
      return { top: r.top - caja.top, bottom: r.bottom - caja.top, left: r.left - caja.left, right: r.right - caja.left }
    }
    // Una sección fijada vive adentro de su `pin-spacer`: ése es el que
    // ocupa su lugar en la página.
    const lugar = (sec) => (sec.parentElement?.classList.contains("pin-spacer") ? sec.parentElement : sec)

    const P = []
    const inicio = raiz.querySelector("[data-costura-inicio]")
    const secciones = [...raiz.querySelectorAll("[data-costura]")]
    const ladoDe = (sec) => (celular || sec.dataset.costura !== "der" ? xIzq : xDer)

    if (inicio) {
      const r = rel(inicio)
      P.push({ x: ladoDe(secciones[0] ?? inicio), y: r.bottom + 28 })
    }
    secciones.forEach((sec) => {
      const s = rel(lugar(sec))
      const x = ladoDe(sec)
      const arriba = s.top + Math.min(80, (s.bottom - s.top) * 0.08)
      if (!P.length || arriba > P.at(-1).y + 30) P.push({ x, y: arriba })
      const abajo = s.bottom - Math.min(70, (s.bottom - s.top) * 0.06)
      if (abajo > P.at(-1).y + 30) P.push({ x, y: abajo })
    })

    // El final: con un nudo al costado del botón de WhatsApp del cierre,
    // llegando de lado para no cruzar el texto que está arriba.
    const fin = raiz.querySelector("[data-costura-fin]")
    if (fin) {
      const r = rel(fin)
      const cy = (r.top + r.bottom) / 2
      const x = P.at(-1)?.x ?? xIzq
      const izquierda = x < W / 2
      while (P.length > 1 && P.at(-1).y > cy - 90) P.pop()
      P.push({ x, y: cy - 90 })
      P.push({ x: izquierda ? r.left - 10 : r.right + 10, y: cy, fin: true })
    }

    // Siempre hacia abajo.
    for (let i = 1; i < P.length; i++) if (P[i].y < P[i - 1].y + 24) P[i].y = P[i - 1].y + 24

    // Los tramos largos y rectos llevan un vaivén suave, como la costura a
    // mano; en el celular, apenas, para no salirse del margen.
    const vaiven = celular ? 2.5 : 7
    const Q = [P[0]]
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], b = P[i]
      const dy = b.y - a.y
      if (a.x === b.x && dy > 420) {
        const n = Math.floor(dy / 260)
        for (let k = 1; k < n; k++) Q.push({ x: a.x + (k % 2 ? vaiven : -vaiven) * (a.x > W / 2 ? -1 : 1), y: a.y + (dy * k) / n })
      }
      Q.push(b)
    }
    return Q
  }

  trazado(P) {
    // Curvas con tangente vertical en cada punto: cruza de lado en S y nunca
    // se sale por los costados.
    let d = `M${P[0].x.toFixed(1)} ${P[0].y.toFixed(1)}`
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], b = P[i]
      if (b.fin) {
        // El último tramo entra de lado, hacia el botón.
        d += ` C${a.x.toFixed(1)} ${(a.y + (b.y - a.y) * 0.9).toFixed(1)} ${((a.x + b.x) / 2).toFixed(1)} ${b.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
        continue
      }
      const m = (b.y - a.y) * 0.5
      d += ` C${a.x.toFixed(1)} ${(a.y + m).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - m).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
    }
    return d
  }

  construir() {
    const W = this.element.clientWidth
    const H = this.element.scrollHeight
    const svg = this.lienzoTarget
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`)
    svg.setAttribute("width", W)
    svg.setAttribute("height", H)
    svg.style.height = `${H}px`
    this.revela.setAttribute("width", W + 40)

    const P = this.puntos()
    if (P.length < 2) return
    const d = this.trazado(P)
    for (const el of [this.tiza, this.borde, this.puntada]) el.setAttribute("d", d)
    this.largo = this.puntada.getTotalLength()
    const fin = P.at(-1)
    this.nudo.setAttribute("cx", fin.x)
    this.nudo.setAttribute("cy", fin.y)

    // Qué largo de hilo va a qué altura, cada 24 unidades: para que la punta
    // siga al scroll sin preguntarle al SVG en cada fotograma.
    this.tabla = []
    for (let l = 0; l <= this.largo; l += 24) this.tabla.push([l, this.puntada.getPointAtLength(l).y])
    this.tabla.push([this.largo, fin.y])

    this.pintar(this.quieto ? this.largo : Math.min(this.actual, this.largo))
    if (!this.quieto) this.ir?.(this.objetivo())
  }

  // ── Dibujar hasta un largo ─────────────────────────────────────────────
  pintar(l) {
    this.actual = l
    if (!this.largo) return
    const p = this.puntada.getPointAtLength(Math.max(l, 0.1))
    const terminado = l >= this.largo - 1
    // Hasta la punta (más el grosor del nudo cuando ya llegó al final).
    this.revela.setAttribute("height", (terminado ? p.y + 20 : p.y).toFixed(1))
    const q = this.puntada.getPointAtLength(Math.max(l - 6, 0))
    const ang = l < 6 ? 90 : Math.atan2(p.y - q.y, p.x - q.x) * 57.2958
    const escala = this.celular ? 0.85 : 1.25
    this.aguja.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${escala})`)
    const empezado = l > 2
    this.aguja.style.opacity = terminado || !empezado || this.quieto ? 0 : 1
    this.nudo.style.opacity = terminado ? 1 : 0
  }

  // La punta va a ~62% de la pantalla; al llegar abajo del todo, se cierra.
  objetivo() {
    const fondo = document.documentElement.scrollHeight - window.innerHeight
    if (window.scrollY >= fondo - 4) return this.largo
    const y = window.innerHeight * 0.62 - this.element.getBoundingClientRect().top
    return this.largoEn(y)
  }

  largoEn(y) {
    const t = this.tabla
    if (!t.length || y <= t[0][1]) return 0
    let lo = 0, hi = t.length - 1
    if (y >= t[hi][1]) return this.largo
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (t[mid][1] < y) lo = mid
      else hi = mid
    }
    const [l0, y0] = t[lo], [l1, y1] = t[hi]
    return l0 + (l1 - l0) * ((y - y0) / Math.max(1, y1 - y0))
  }
}
