// Elizabeth Creations · "Hilo y puntada"
// Un solo hilo rojo cose la página: se dibuja con el scroll y una aguja va en
// su punta. Los títulos se cosen letra por letra, las fotos se pegan con cinta
// y "Cómo pedir" se cose paso por paso. Todo es transform, opacity o stroke.
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger)

const NS = "http://www.w3.org/2000/svg"
const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const WA = "https://wa.me/50760000000?text="

// ------------------------------------------------------------------
// Constructor de varitas: la forma y el color ya cambian con CSS (:has),
// aquí sólo se arma el mensaje de WhatsApp y el resumen en palabras.
// ------------------------------------------------------------------
function varitas() {
  const form = document.querySelector(".taller-varita__controles")
  if (!form) return
  const boton = document.querySelector("[data-varita-pedir]")
  const resumen = document.querySelector("[data-resumen]")
  const svg = document.querySelector(".varita")
  const mensajes = {
    luna: "¡Hola! Quiero una varita mágica con LUNA. El color que me gustaría es: ",
    estrella: "¡Hola! Quiero una varita mágica con ESTRELLA. El color que me gustaría es: "
  }
  const actualizar = (e) => {
    const forma = form.querySelector('input[name="forma"]:checked').value
    const color = form.querySelector('input[name="color"]:checked').value
    boton.href = WA + encodeURIComponent(mensajes[forma] + color)
    resumen.textContent = `${forma}, color ${color.toLowerCase()}`
    // Un saltito de la varita al cambiar: confirma que la pieza "escuchó".
    if (e && !quieto) {
      gsap.fromTo(svg, { rotation: -4, scale: 0.97 }, { rotation: 0, scale: 1, duration: 0.6, ease: "back.out(2.2)", transformOrigin: "50% 90%", overwrite: true })
    }
  }
  form.addEventListener("change", actualizar)
  actualizar()
}

// ------------------------------------------------------------------
// El hilo
// ------------------------------------------------------------------
function svgEl(tag, attrs) {
  const el = document.createElementNS(NS, tag)
  for (const k in attrs) el.setAttribute(k, attrs[k])
  return el
}

function hilo() {
  const mesa = document.querySelector(".mesa")
  const svg = document.querySelector(".hilo")
  if (!mesa || !svg) return

  // Estructura fija; sólo cambia la `d` cuando cambia el tamaño.
  const defs = svgEl("defs", {})
  const mascara = svgEl("mask", { id: "hilo-mascara", maskUnits: "userSpaceOnUse" })
  const revela = svgEl("path", { fill: "none", stroke: "#fff", "stroke-width": "14", "stroke-linecap": "round" })
  mascara.append(revela)
  defs.append(mascara)
  const tiza = svgEl("path", { class: "tiza" })
  const puntada = svgEl("path", { class: "puntada", mask: "url(#hilo-mascara)" })
  const nudo = svgEl("circle", { r: "5.5", fill: "var(--hilo)" })
  // La aguja apunta hacia +x; el hilo sale de su ojo, en (0,0).
  const aguja = svgEl("g", { class: "aguja" })
  aguja.innerHTML = `
    <path d="M-6 0 C -6 -3.2, -3 -3.6, 4 -2.4 L 44 -0.5 L 50 0 L 44 0.5 L 4 2.4 C -3 3.6, -6 3.2, -6 0 Z" fill="#C9C4C7" stroke="#5E585C" stroke-width="1.1"/>
    <ellipse cx="-1.4" cy="0" rx="3" ry="1.1" fill="#FBF4E6" stroke="#5E585C" stroke-width=".8"/>
    <path d="M8 -1.2 L 40 -0.4" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>`
  svg.append(defs, tiza, puntada, nudo, aguja)

  let largo = 0
  let tabla = []      // [largo, y] muestreados, para saber qué largo toca a qué altura
  let actual = 0
  let quick = null

  function puntos() {
    const caja = mesa.getBoundingClientRect()
    const W = mesa.clientWidth
    const ancho = document.querySelector(".ancho")
    const padding = parseFloat(getComputedStyle(ancho).paddingLeft)
    const contenido = Math.min(1180, W)
    const margen = (W - contenido) / 2
    // En el celular el hilo va en el margen de 24px; en pantallas grandes, en
    // el canal libre a cada lado del contenido.
    const xIzq = margen > 60 ? margen / 2 + 8 : Math.max(9, padding * 0.42)
    const xDer = W - xIzq
    const rel = (el) => {
      const r = el.getBoundingClientRect()
      return { top: r.top - caja.top, bottom: r.bottom - caja.top, left: r.left - caja.left, right: r.right - caja.left, cx: (r.left + r.right) / 2 - caja.left, cy: (r.top + r.bottom) / 2 - caja.top, h: r.height }
    }
    const P = []
    const secciones = [...mesa.querySelectorAll("[data-puntada]")]
    secciones.forEach((sec, i) => {
      const s = rel(sec)
      const x = sec.dataset.puntada === "der" ? xDer : xIzq
      const lado = x > W / 2 ? 1 : -1
      P.push({ x, y: s.top + Math.min(70, s.h * 0.08) })
      // El hilo se mete por detrás de la pieza principal (el "ojal") y vuelve.
      const ojal = sec.querySelector("[data-ojal]")
      const o = ojal && rel(ojal)
      // Sólo se mete si la pieza está de su lado: así nunca cruza un título.
      const deSuLado = o && (lado > 0 ? o.right > W * 0.5 : o.left < W * 0.5)
      if (deSuLado) {
        const yIn = o.top + o.h * 0.3
        const yOut = o.top + o.h * 0.7
        // entra hasta el centro del ojal desde su lado, sin cruzar el texto
        const hondo = Math.min(o.right - o.left, 260) * 0.45
        const xHondo = lado > 0 ? o.right - hondo : o.left + hondo
        P.push({ x, y: Math.max(yIn - 120, P.at(-1).y + 40) })
        P.push({ x: xHondo, y: (yIn + yOut) / 2 })
        P.push({ x, y: yOut + 120 })
      }
      const fin = s.bottom - Math.min(60, s.h * 0.06)
      if (fin > P.at(-1).y + 40) P.push({ x, y: fin })
      // Al final, el hilo termina en el botón de WhatsApp con un nudo.
      if (i === secciones.length - 1) {
        const b = mesa.querySelector("[data-fin]")
        if (b) {
          const r = rel(b)
          // Llega por el costado del botón, sin cruzar el texto del cierre.
          const cy = (r.top + r.bottom) / 2
          P.splice(P.length - 1, 1)
          P.push({ x, y: cy - 70 })
          P.push({ x: lado > 0 ? r.right - 4 : r.left + 4, y: cy, fin: true })
        }
      }
    })
    // Garantiza que siempre baje.
    for (let i = 1; i < P.length; i++) if (P[i].y < P[i - 1].y + 24) P[i].y = P[i - 1].y + 24
    // Tramos largos rectos: un vaivén suave, como la costura a mano.
    const Q = [P[0]]
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], b = P[i]
      const dy = b.y - a.y
      if (a.x === b.x && dy > 420) {
        const n = Math.floor(dy / 260)
        for (let k = 1; k < n; k++) Q.push({ x: a.x + (k % 2 ? 7 : -7) * (a.x > W / 2 ? -1 : 1), y: a.y + (dy * k) / n })
      }
      Q.push(b)
    }
    return Q
  }

  function trazado(P) {
    // Curvas con tangente vertical en cada punto: cruza de lado en S, nunca se
    // sale por los costados.
    let d = `M${P[0].x.toFixed(1)} ${P[0].y.toFixed(1)}`
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], b = P[i]
      const m = (b.y - a.y) * 0.5
      d += ` C${a.x.toFixed(1)} ${(a.y + m).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - m).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
    }
    return d
  }

  function pintar(l) {
    actual = l
    revela.setAttribute("stroke-dashoffset", (largo - l).toFixed(1))
    if (!largo) return
    const p = puntada.getPointAtLength(Math.max(l, 0.1))
    const q = puntada.getPointAtLength(Math.max(l - 6, 0))
    let ang = Math.atan2(p.y - q.y, p.x - q.x) * 57.2958
    if (l < 6) ang = 90
    aguja.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(1.4)`)
    const terminado = l >= largo - 1
    aguja.style.opacity = terminado ? 0 : 1
    nudo.style.opacity = terminado ? 1 : 0
  }

  function construir() {
    const W = mesa.clientWidth
    const H = mesa.scrollHeight
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`)
    svg.setAttribute("width", W)
    svg.setAttribute("height", H)
    svg.style.height = H + "px"
    mascara.setAttribute("width", W); mascara.setAttribute("height", H)
    mascara.setAttribute("x", 0); mascara.setAttribute("y", 0)
    const P = puntos()
    const d = trazado(P)
    for (const el of [revela, tiza, puntada]) el.setAttribute("d", d)
    largo = puntada.getTotalLength()
    revela.setAttribute("stroke-dasharray", `${largo.toFixed(1)} ${largo.toFixed(1)}`)
    const fin = P.at(-1)
    nudo.setAttribute("cx", fin.x); nudo.setAttribute("cy", fin.y)
    // Tabla largo→y cada 24 unidades.
    tabla = []
    for (let l = 0; l <= largo; l += 24) tabla.push([l, puntada.getPointAtLength(l).y])
    tabla.push([largo, fin.y])
    if (quieto) pintar(largo)
    else pintar(Math.min(actual, largo))
  }

  // Qué largo de hilo corresponde a una altura de la página (búsqueda binaria).
  function largoEn(y) {
    let lo = 0, hi = tabla.length - 1
    if (y <= tabla[0][1]) return 0
    if (y >= tabla[hi][1]) return largo
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (tabla[mid][1] < y) lo = mid; else hi = mid
    }
    const [l0, y0] = tabla[lo], [l1, y1] = tabla[hi]
    return l0 + (l1 - l0) * ((y - y0) / Math.max(1, y1 - y0))
  }

  construir()

  if (!quieto) {
    const proxy = { l: actual }
    quick = gsap.quickTo(proxy, "l", { duration: 0.55, ease: "power3.out", onUpdate: () => pintar(proxy.l) })
    const objetivo = () => {
      const top = mesa.getBoundingClientRect().top
      const fondo = document.documentElement.scrollHeight - window.innerHeight
      // La punta va a ~62% de la pantalla; al llegar abajo, se cierra el hilo.
      if (window.scrollY >= fondo - 4) return largo
      return largoEn(window.innerHeight * 0.62 - top)
    }
    ScrollTrigger.create({
      trigger: mesa, start: "top bottom", end: "bottom top",
      onUpdate: () => quick(objetivo()),
      onRefresh: () => quick(objetivo())
    })
    quick(objetivo())
  }

  // Si cambia el alto (fotos, fuentes, giro del teléfono), se vuelve a trazar.
  let espera
  const rehacer = () => { clearTimeout(espera); espera = setTimeout(() => { construir(); ScrollTrigger.refresh() }, 150) }
  new ResizeObserver(rehacer).observe(mesa)
  document.fonts?.ready.then(rehacer)
}

// ------------------------------------------------------------------
// Títulos cosidos letra por letra
// ------------------------------------------------------------------
function partirTitulo(h) {
  const texto = h.textContent.trim()
  h.setAttribute("aria-label", texto)
  h.textContent = ""
  const letras = []
  texto.split(" ").forEach((p, i, arr) => {
    const palabra = document.createElement("span")
    palabra.className = "palabra"
    palabra.setAttribute("aria-hidden", "true")
    for (const ch of p) {
      const s = document.createElement("span")
      s.className = "letra"
      s.textContent = ch
      palabra.append(s)
      letras.push(s)
    }
    h.append(palabra)
    if (i < arr.length - 1) h.append(" ")
  })
  return letras
}

function titulos() {
  document.querySelectorAll(".cosible").forEach((h) => {
    const letras = partirTitulo(h)
    const enPortada = !!h.closest(".portada")
    const tl = gsap.timeline({
      paused: !enPortada,
      delay: enPortada ? 0.15 : 0,
      scrollTrigger: enPortada ? undefined : { trigger: h, start: "top 86%", once: true }
    })
    // Cada letra entra como una puntada: baja un poco girada y se asienta.
    tl.fromTo(letras,
      { opacity: 0, yPercent: 40, rotation: () => gsap.utils.random(-14, 14) },
      { opacity: 1, yPercent: 0, rotation: 0, duration: 0.5, ease: "back.out(2)", stagger: Math.min(0.035, 0.9 / letras.length) })
      .fromTo(h, { "--corte": "100%" }, { "--corte": "0%", duration: 0.7, ease: "power2.inOut" }, "-=0.35")
  })
}

// ------------------------------------------------------------------
// Fotos pegadas con cinta: caen, se asientan con resorte y luego la cinta.
// ------------------------------------------------------------------
function polaroids() {
  const todas = gsap.utils.toArray(".polaroid, .nota-papel, .tarjetita, .kraft, .taller__video")
  todas.forEach((el) => gsap.set(el, { opacity: 0, y: -36, rotation: gsap.utils.random([-9, -6, 6, 9]), scale: 1.05 }))
  const cintas = gsap.utils.toArray(".cinta")
  gsap.set(cintas, { opacity: 0, scaleX: 0.4 })
  ScrollTrigger.batch(todas, {
    start: "top 90%",
    once: true,
    onEnter: (lote) => {
      gsap.to(lote, { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 0.9, ease: "elastic.out(1, 0.7)", stagger: 0.08 })
      const c = lote.flatMap((el) => [...el.querySelectorAll(".cinta")])
      gsap.to(c, { opacity: 0.88, scaleX: 1, duration: 0.3, ease: "power3.out", stagger: 0.08, delay: 0.35 })
    }
  })
}

// ------------------------------------------------------------------
// "Cómo pedir": cada paso se cose en orden.
// ------------------------------------------------------------------
function pasos() {
  const lista = document.querySelector(".pasos")
  if (!lista) return
  const items = [...lista.querySelectorAll(".paso")]
  const tl = gsap.timeline({ scrollTrigger: { trigger: lista, start: "top 75%", once: true } })
  // Los cuatro lados de la costura se revelan con clip-path, en sentido horario.
  const desde = ["inset(0 100% 0 0)", "inset(0 0 100% 0)", "inset(0 0 0 100%)", "inset(100% 0 0 0)"]
  items.forEach((paso, i) => {
    const lados = [...paso.querySelectorAll(".costura i")]
    const contenido = paso.querySelectorAll(".paso__num, h3, p")
    gsap.set(paso, { opacity: 0, y: -28, rotation: i % 2 ? 7 : -7 })
    lados.forEach((l, k) => gsap.set(l, { clipPath: desde[k] }))
    gsap.set(contenido, { opacity: 0, y: 8 })
    const t = i * 0.45
    tl.to(paso, { opacity: 1, y: 0, rotation: 0, duration: 0.7, ease: "back.out(1.7)" }, t)
    lados.forEach((l, k) => tl.to(l, { clipPath: "inset(0 0% 0% 0%)", duration: 0.16, ease: "none" }, t + 0.25 + k * 0.16))
    tl.to(contenido, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", stagger: 0.05 }, t + 0.35)
  })
}

// ------------------------------------------------------------------
function videos() {
  if (!quieto) return
  document.querySelectorAll("video[autoplay]").forEach((v) => { v.removeAttribute("autoplay"); v.pause(); v.controls = true })
}

function scrollSuave() {
  if (quieto) return
  const lenis = new Lenis({ lerp: 0.12 })
  lenis.on("scroll", ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href")
    const destino = id.length > 1 && document.querySelector(id)
    if (!destino) return
    e.preventDefault()
    lenis.scrollTo(destino, { offset: -70 })
  }))
}

varitas()
videos()
hilo()
if (!quieto) {
  scrollSuave()
  titulos()
  polaroids()
  pasos()
}
