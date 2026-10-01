// Elizabeth Creations · "Juguetería pop"
//
// Todo lo de aquí es adorno: el HTML ya trae el contenido completo y la CSS
// lo deja en su sitio. Con `prefers-reduced-motion` no se arranca nada que
// mueva cosas por la pantalla (ni Lenis, ni la caída, ni las pegatinas).
//
// Regla de la casa: sólo transform y opacity, cada bucle con su
// requestAnimationFrame y quieto cuando no se ve.

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import "lenis/dist/lenis.css"

gsap.registerPlugin(ScrollTrigger)

const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches
const punteroFino = matchMedia("(hover: hover) and (pointer: fine)").matches
const limitar = (v, a, b) => Math.min(b, Math.max(a, v))

if (!reducido) {
  scrollSuave()
  tituloQueRebota()
  vitrina()
  pegatinas()
  if (punteroFino) {
    inclinar()
    imanes()
  }
}
cinta()
videos()

// ── Lenis, sincronizado con el reloj de GSAP ────────────────────────────────
function scrollSuave() {
  const lenis = new Lenis({ autoRaf: false, anchors: { offset: -72 }, lerp: 0.12 })
  lenis.on("scroll", ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

// ── "Hecho a mano": cada letra cae y rebota, una tras otra ──────────────────
function tituloQueRebota() {
  const letras = gsap.utils.toArray(".kin .l")
  gsap.fromTo(letras,
    { yPercent: -170, rotation: () => gsap.utils.random(-50, 50), autoAlpha: 0 },
    { yPercent: 0, rotation: 0, autoAlpha: 1, duration: 1.15, ease: "elastic.out(1, 0.42)",
      stagger: 0.055, delay: 0.15, clearProps: "transform" })
  gsap.fromTo(".vitrina__texto > :not(.titulo)",
    { y: 24, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.7, ease: "power4.out", stagger: 0.08, delay: 0.55, clearProps: "transform" })
}

// ── La vitrina: adornos con física de resorte ───────────────────────────────
// Cada adorno tiene su sitio en CSS; aquí sólo vive su desplazamiento (x, y)
// y su giro (r) respecto de ese sitio. Tres modos:
//   cae      gravedad + rebote contra su "piso" (y = 0) al entrar
//   resorte  vuelve a su sitio con un resorte subamortiguado (el vaivén)
//   mano     sigue al dedo 1:1, con elástico en los bordes de la vitrina
function vitrina() {
  const escenario = document.querySelector("[data-escenario]")
  if (!escenario) return
  const vitrinaEl = escenario.closest(".vitrina")

  const G = 3200          // gravedad, px/s²
  const REBOTE = 0.42     // cuánto conserva en cada bote
  const K = 120, C = 12   // resorte de posición (amortiguamiento ≈ 0.55)
  const KR = 170, CR = 10 // resorte del giro

  const juguetes = [...escenario.querySelectorAll(".juguete")].map((el) => ({
    el, x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0,
    modo: "espera", espera: 0, objetivoR: 0, historial: [],
  }))

  let visible = false, corriendo = false, ultimo = 0

  const pintar = (j) => {
    j.el.style.transform = `translate3d(${j.x.toFixed(2)}px, ${j.y.toFixed(2)}px, 0) rotate(${j.r.toFixed(2)}deg)`
  }

  // Antes de caer, cada uno espera arriba, fuera de la vitrina (que recorta).
  const subir = () => {
    const arriba = vitrinaEl.getBoundingClientRect().top
    juguetes.forEach((j, i) => {
      const caja = j.el.getBoundingClientRect()
      j.y = -(caja.bottom - arriba) - 40 - Math.random() * 160
      j.x = gsap.utils.random(-30, 30)
      j.r = gsap.utils.random(-40, 40)
      j.espera = 0.35 + 0.09 * i + Math.random() * 0.12
      j.modo = "espera"
      pintar(j)
    })
  }
  subir()

  function paso(ahora) {
    const dt = Math.min(0.032, (ahora - ultimo) / 1000 || 0.016)
    ultimo = ahora
    let activos = 0

    for (const j of juguetes) {
      if (j.modo === "espera") {
        if (!caidaIniciada) { activos++; continue }
        j.espera -= dt
        if (j.espera <= 0) j.modo = "cae"
        activos++
        continue
      }
      if (j.modo === "cae") {
        j.vy += G * dt
        j.y += j.vy * dt
        j.x += (0 - j.x) * Math.min(1, dt * 6)
        if (j.y >= 0) {
          j.y = 0
          j.vy = -j.vy * REBOTE
          j.vr += gsap.utils.random(-260, 260)
          if (Math.abs(j.vy) < 120) { j.modo = "resorte"; j.vy = 0 }
        }
        j.vr += (-KR * j.r - CR * j.vr) * dt
        j.r += j.vr * dt
        pintar(j); activos++
        continue
      }
      if (j.modo === "mano") {
        const objetivo = limitar(j.vx * 0.022, -32, 32)
        j.vr += (-KR * (j.r - objetivo) - CR * j.vr) * dt
        j.r += j.vr * dt
        pintar(j); activos++
        continue
      }
      if (j.modo === "resorte") {
        const ax = -K * j.x - C * j.vx
        const ay = -K * j.y - C * j.vy
        j.vx += ax * dt; j.vy += ay * dt
        j.x += j.vx * dt; j.y += j.vy * dt
        // El giro siente la aceleración lateral: se mece como colgado.
        j.vr += (-KR * j.r - CR * j.vr - ax * 0.018) * dt
        j.r += j.vr * dt
        const quieto = Math.abs(j.x) + Math.abs(j.y) < 0.3 && Math.abs(j.vx) + Math.abs(j.vy) < 4 &&
          Math.abs(j.r) < 0.15 && Math.abs(j.vr) < 2
        if (quieto) { j.x = j.y = j.r = j.vx = j.vy = j.vr = 0; j.modo = "quieto" }
        else activos++
        pintar(j)
      }
    }

    if (activos && (visible || juguetes.some((j) => j.modo === "mano"))) {
      requestAnimationFrame(paso)
    } else {
      corriendo = false
    }
  }

  const arrancar = () => {
    if (corriendo) return
    corriendo = true
    ultimo = performance.now()
    requestAnimationFrame(paso)
  }

  let caidaIniciada = false
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible && !caidaIniciada && e.intersectionRatio >= 0.2) caidaIniciada = true
    if (visible) arrancar()
  }, { threshold: [0, 0.2, 0.5] }).observe(escenario)

  // Elástico en los bordes: cuanto más lejos, menos te sigue.
  const elastico = (exceso, dim) => (exceso * dim * 0.55) / (dim + 0.55 * Math.abs(exceso))
  const dentro = (v, min, max, dim) =>
    v < min ? min - elastico(min - v, dim) : v > max ? max + elastico(v - max, dim) : v

  for (const j of juguetes) {
    let inicio = null
    j.el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return
      e.preventDefault()
      j.el.setPointerCapture(e.pointerId)
      // Al agarrarlo en pleno vuelo se parte del valor que se ve, no del destino.
      if (j.modo === "espera" || j.modo === "cae") { j.vy = 0 }
      j.modo = "mano"
      j.el.classList.add("is-agarrado")
      juguetes.forEach((o) => { o.el.style.zIndex = o === j ? "10" : "" })
      const caja = j.el.getBoundingClientRect()
      const v = vitrinaEl.getBoundingClientRect()
      const ancho = j.el.offsetWidth, alto = j.el.offsetHeight
      const sitioX = caja.left + caja.width / 2 - ancho / 2 - j.x
      const sitioY = caja.top + caja.height / 2 - alto / 2 - j.y
      inicio = {
        px: e.clientX, py: e.clientY, x: j.x, y: j.y, t: performance.now(), lejos: 0,
        minX: v.left - sitioX, maxX: v.right - sitioX - ancho,
        minY: v.top - sitioY, maxY: v.bottom - sitioY - alto,
        ancho: v.width, alto: v.height,
      }
      j.vx = j.vy = 0
      j.historial = [{ x: e.clientX, y: e.clientY, t: e.timeStamp }]
      arrancar()
    })
    j.el.addEventListener("pointermove", (e) => {
      if (!inicio || j.modo !== "mano") return
      const dx = e.clientX - inicio.px, dy = e.clientY - inicio.py
      inicio.lejos = Math.max(inicio.lejos, Math.hypot(dx, dy))
      j.x = dentro(inicio.x + dx, inicio.minX, inicio.maxX, inicio.ancho)
      j.y = dentro(inicio.y + dy, inicio.minY, inicio.maxY, inicio.alto)
      j.historial.push({ x: e.clientX, y: e.clientY, t: e.timeStamp })
      while (j.historial.length > 2 && e.timeStamp - j.historial[0].t > 90) j.historial.shift()
      const a = j.historial[0], b = j.historial.at(-1), s = Math.max(0.008, (b.t - a.t) / 1000)
      j.vx = (b.x - a.x) / s
      j.vy = (b.y - a.y) / s
      pintar(j)
    })
    const soltar = () => {
      if (!inicio) return
      const toque = inicio.lejos < 6 && performance.now() - inicio.t < 350
      inicio = null
      j.el.classList.remove("is-agarrado")
      j.modo = "resorte"
      if (toque) {
        // Un toque: un saltito en su sitio.
        j.vy = -720
        j.vr += j.r > 0 ? -280 : 280
      } else {
        j.vx = limitar(j.vx, -3200, 3200)
        j.vy = limitar(j.vy, -3200, 3200)
      }
      arrancar()
    }
    j.el.addEventListener("pointerup", soltar)
    j.el.addEventListener("pointercancel", soltar)
    j.el.addEventListener("lostpointercapture", soltar)
  }
}

// ── La cinta: se detiene cuando no se ve ────────────────────────────────────
function cinta() {
  const el = document.querySelector("[data-cinta]")
  if (!el || reducido) return
  new IntersectionObserver(([e]) => el.classList.toggle("is-quieta", !e.isIntersecting)).observe(el)
}

// ── Baldosas que se inclinan hacia el puntero ───────────────────────────────
// Escribe `transform` a mano (y no con GSAP) porque la cara ya usa la
// propiedad `translate` de CSS para levantarse: así las dos se suman.
function inclinar() {
  for (const baldosa of document.querySelectorAll("[data-tilt]")) {
    const cara = baldosa.querySelector(".baldosa__cara")
    let rx = 0, ry = 0, ox = 0, oy = 0, raf = 0
    const MAX = 9
    const bucle = () => {
      rx += (ox - rx) * 0.14
      ry += (oy - ry) * 0.14
      cara.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      if (Math.abs(ox - rx) + Math.abs(oy - ry) > 0.02) raf = requestAnimationFrame(bucle)
      else { raf = 0; if (!ox && !oy) cara.style.transform = "" }
    }
    const pedir = () => { if (!raf) raf = requestAnimationFrame(bucle) }
    baldosa.addEventListener("pointermove", (e) => {
      const c = baldosa.getBoundingClientRect()
      const px = (e.clientX - c.left) / c.width - 0.5
      const py = (e.clientY - c.top) / c.height - 0.5
      oy = px * MAX * 2
      ox = -py * MAX * 2
      pedir()
    })
    baldosa.addEventListener("pointerleave", () => { ox = oy = 0; pedir() })
  }
}

// ── Botones de WhatsApp con imán ────────────────────────────────────────────
function imanes() {
  for (const boton of document.querySelectorAll("[data-iman]")) {
    const dentro = boton.querySelector(".boton__dentro")
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, vx = 0, vy = 0
    // Resorte con un poco de rebote: el botón "se suelta" del cursor.
    const bucle = () => {
      vx += ((tx - x) * 0.18 - vx * 0.32)
      vy += ((ty - y) * 0.18 - vy * 0.32)
      x += vx; y += vy
      boton.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      if (dentro) dentro.style.transform = `translate3d(${(x * 0.35).toFixed(2)}px, ${(y * 0.35).toFixed(2)}px, 0)`
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > 0.05) raf = requestAnimationFrame(bucle)
      else raf = 0
    }
    const pedir = () => { if (!raf) raf = requestAnimationFrame(bucle) }
    window.addEventListener("pointermove", (e) => {
      const c = boton.getBoundingClientRect()
      const cx = c.left + c.width / 2 - x, cy = c.top + c.height / 2 - y
      const dx = e.clientX - cx, dy = e.clientY - cy
      const radio = Math.max(c.width, c.height) * 0.9
      const cerca = Math.hypot(dx, dy) < radio
      const nx = cerca ? dx * 0.32 : 0, ny = cerca ? dy * 0.32 : 0
      if (nx !== tx || ny !== ty) { tx = nx; ty = ny; pedir() }
    }, { passive: true })
  }
}

// ── Las reglas: pegatinas que se estampan al bajar (scrub) ──────────────────
// La CSS deja cada pegatina en su sitio con su giro (`rotate`); aquí se suma
// un transform que va de "en el aire, grande y torcida" a "pegada".
function pegatinas() {
  const salida = (p) => { // back.out: se pasa un poquito y se asienta
    const s = 2.2, q = p - 1
    return q * q * ((s + 1) * q + s) + 1
  }
  for (const el of document.querySelectorAll("[data-sticker]")) {
    const cuentas = [...el.querySelectorAll("[data-cuenta]")].map((n) => ({
      n, desde: +n.dataset.desde, hasta: +n.dataset.hasta,
    }))
    const giro = gsap.utils.random(14, 26) * (Math.random() < 0.5 ? -1 : 1)
    const pintar = (p) => {
      const e = salida(p)
      const escala = 1 + (1 - e) * 0.9
      el.style.transform = `translate3d(0, ${((1 - e) * -70).toFixed(1)}px, 0) rotate(${((1 - e) * giro).toFixed(2)}deg) scale(${escala.toFixed(3)})`
      el.style.opacity = Math.min(1, p * 3).toFixed(3)
      const c = Math.min(1, p * 1.15)
      for (const k of cuentas) k.n.textContent = Math.round(k.desde + (k.hasta - k.desde) * c)
    }
    pintar(0)
    ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      end: "top 52%",
      scrub: 0.5,
      onUpdate: (self) => pintar(self.progress),
      onRefresh: (self) => pintar(self.progress),
    })
  }
}

// ── Videos: sólo corren mientras se ven ─────────────────────────────────────
function videos() {
  const lista = document.querySelectorAll("video[data-bucle]")
  if (reducido) return
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      const v = e.target
      if (e.isIntersecting) {
        if (v.preload === "none") v.preload = "auto"
        v.play().catch(() => {})
      } else v.pause()
    }
  }, { threshold: 0.35 })
  lista.forEach((v) => io.observe(v))
}
