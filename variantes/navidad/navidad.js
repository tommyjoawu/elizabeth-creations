// Elizabeth Creations · "Noche de Navidad"
//
// El guion del scroll, de arriba abajo:
//   1. Obertura fijada: las lucecitas se encienden foco por foco y los
//      adornos (fotos reales en bolas doradas) caen y se cuelgan en el árbol
//      de fieltro; al final se prende la estrella.
//   2. Taller: los adornos del cordel se mecen al entrar (un péndulo con
//      amortiguación) y con la velocidad del scroll.
//   3. Cuenta regresiva fijada: una tira de días corre hasta el 15 de
//      noviembre y el número baja con el scroll.
//   4. Galería fijada que avanza de lado: las piezas cuelgan de un cable y
//      se mecen con el movimiento.
//   5. Nieve y lentejuelas en canvas, sólo mientras su sección se ve.
//
// Con prefers-reduced-motion no hay html.anim: nada se fija, nada se mece,
// la nieve se pinta una vez quieta y el video se queda en su póster.
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger)

const raiz = document.documentElement
const anim = raiz.classList.contains("anim")
const $ = (s, el = document) => el.querySelector(s)
const $$ = (s, el = document) => [...el.querySelectorAll(s)]

/* ------------------------------------------------------------------ */
/* Péndulos: rotación con resorte y amortiguación (Euler semi-implícito) */
/* ------------------------------------------------------------------ */
const pendulos = new Map()
let corriendo = false

function crearPendulos() {
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      const p = pendulos.get(e.target)
      p.visible = e.isIntersecting
      if (e.isIntersecting && p.entra && !p.entro) {
        p.entro = true
        empujar(p, (p.signo) * (1.6 + Math.random() * 0.8))
      }
    }
  }, { rootMargin: "0px 0px -10% 0px" })

  $$("[data-pendulo]").forEach((el, i) => {
    const pesada = el.classList.contains("pieza__mece")
    const p = {
      el, th: 0, w: 0, visible: false, entro: false,
      entra: el.hasAttribute("data-entra"),
      galeria: pesada,
      signo: i % 2 ? 1 : -1,
      masa: pesada ? 3 : 1,
      k: pesada ? 14 : 18 + Math.random() * 8,  // rigidez: período ~1.3–1.7 s
      c: pesada ? 2.2 : 1.5,                    // amortiguación
      set: gsap.quickSetter(el, "rotation", "deg")
    }
    pendulos.set(el, p)
    io.observe(el)
  })
}

function empujar(p, dw) {
  p.w += dw / p.masa
  if (!corriendo) { corriendo = true; gsap.ticker.add(paso) }
}

function paso(_t, dtMs) {
  const dt = Math.min(dtMs / 1000, 1 / 30)
  let activos = 0
  for (const p of pendulos.values()) {
    if (Math.abs(p.th) < 0.0008 && Math.abs(p.w) < 0.002) {
      if (p.th !== 0) { p.th = 0; p.w = 0; p.set(0) }
      continue
    }
    p.w += (-p.k * Math.sin(p.th) - p.c * p.w) * dt
    p.th = gsap.utils.clamp(-0.45, 0.45, p.th + p.w * dt)
    p.set(p.th * 57.2958)
    activos++
  }
  if (!activos) { gsap.ticker.remove(paso); corriendo = false }
}

// La velocidad del scroll empuja los que se ven: los del cordel alternan
// sentido; las piezas de la galería se quedan atrás todas para el mismo lado.
function sentirScroll(v) {
  if (!v) return
  for (const p of pendulos.values()) {
    if (!p.visible) continue
    const dw = gsap.utils.clamp(-0.12, 0.12, v * 0.006)
    empujar(p, p.galeria ? dw : dw * p.signo)
  }
}

/* ------------------------------------------------------------------ */
/* Nieve y lentejuelas                                                */
/* ------------------------------------------------------------------ */
const LENTEJUELAS = ["#F4C95D", "#EE7F86", "#C9AEF2", "#4CC7BA", "#FFF1D6"]

function nieve(canvas) {
  const ctx = canvas.getContext("2d")
  let w = 0, h = 0, parts = [], vivo = false, ultimo = 0, t = 0

  const nueva = (y) => {
    const brillo = Math.random() < 0.28
    return {
      x: Math.random() * w,
      y: y ?? -6,
      r: brillo ? 1.4 + Math.random() * 1.6 : 0.6 + Math.random() * 1.7,
      vy: brillo ? 10 + Math.random() * 14 : 12 + Math.random() * 26,
      amp: 6 + Math.random() * 14,
      fase: Math.random() * 6.28,
      brillo,
      color: brillo ? LENTEJUELAS[(Math.random() * LENTEJUELAS.length) | 0] : "#FFF6E8",
      a: 0.45 + Math.random() * 0.45
    }
  }

  const medir = () => {
    const r = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    w = r.width; h = r.height
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const n = Math.min(140, Math.round((w * h) / 8500))
    parts = Array.from({ length: n }, () => nueva(Math.random() * h))
    pintar(0)
  }

  const pintar = (dt) => {
    t += dt
    ctx.clearRect(0, 0, w, h)
    for (const p of parts) {
      p.y += p.vy * dt
      p.x += Math.sin(t * 0.7 + p.fase) * p.amp * dt
      if (p.y > h + 6) Object.assign(p, nueva(-6))
      ctx.globalAlpha = p.brillo ? 0.3 + 0.65 * Math.abs(Math.sin(t * 1.6 + p.fase)) : p.a
      ctx.fillStyle = p.color
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill()
    }
  }

  const cuadro = (ahora) => {
    if (!vivo) return
    const dt = Math.min((ahora - (ultimo || ahora)) / 1000, 0.05)
    ultimo = ahora
    pintar(dt)
    requestAnimationFrame(cuadro)
  }
  const arrancar = () => { if (vivo || !anim || document.hidden) return; vivo = true; ultimo = 0; requestAnimationFrame(cuadro) }
  const parar = () => { vivo = false }

  new ResizeObserver(medir).observe(canvas)
  if (!anim) return
  let visible = false
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? arrancar() : parar() }).observe(canvas)
  document.addEventListener("visibilitychange", () => (document.hidden ? parar() : visible && arrancar()))
}

/* ------------------------------------------------------------------ */
/* Cuenta regresiva                                                   */
/* ------------------------------------------------------------------ */
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

function cuenta() {
  const sec = $(".cuenta"), reloj = $("[data-reloj]")
  const num = $("[data-num]", reloj), fecha = $("[data-fecha]", reloj), unidad = $("[data-unidad]", reloj)
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const fin = new Date(hoy.getFullYear(), 10, 15)
  const dias = Math.round((fin - hoy) / 864e5)
  if (dias < 0) return   // ya cerró: queda el texto fijo

  $("[data-hoy]", reloj).textContent = dias === 0
    ? "Hoy es el último día para pedir."
    : `Hoy faltan ${dias} días para el 15 de noviembre.`
  const pintar = (i) => {
    const quedan = dias - i
    num.textContent = String(quedan)
    unidad.textContent = quedan === 1 ? "día" : "días"
    if (i === 0) fecha.textContent = "hoy"
    else {
      const d = new Date(hoy); d.setDate(d.getDate() + i)
      fecha.textContent = `el ${d.getDate()} de ${MESES[d.getMonth()]}`
    }
    reloj.classList.toggle("reloj--fin", quedan === 0)
  }
  pintar(0)
  reloj.hidden = false
  if (!anim || dias < 3) return

  const cal = $("[data-calendario]"), tira = $("[data-tira]", cal)
  const frag = document.createDocumentFragment()
  for (let i = 0; i <= dias; i++) {
    const d = new Date(hoy); d.setDate(d.getDate() + i)
    const li = document.createElement("li")
    li.className = "dia" + (i === dias ? " dia--fin" : "") + (d.getDay() === 0 ? " dia--domingo" : "")
    li.innerHTML = `<b>${d.getDate()}</b><small>${i === 0 ? "hoy" : MESES[d.getMonth()]}</small>`
    frag.append(li)
  }
  tira.append(frag)
  cal.hidden = false
  const dias$ = tira.children
  const centro = (i) => cal.clientWidth / 2 - (dias$[i].offsetLeft + dias$[i].offsetWidth / 2)
  let ult = 0

  gsap.fromTo(tira, { x: () => centro(0) }, {
    x: () => centro(dias),
    ease: "none",
    scrollTrigger: {
      trigger: sec, start: "top top", end: "+=150%", pin: true, scrub: 0.5, invalidateOnRefresh: true,
      onUpdate(self) {
        const i = Math.round(self.progress * dias)
        if (i !== ult) { ult = i; pintar(i) }
      }
    }
  })
  gsap.fromTo(".reloj__num", { scale: 1 }, {
    scale: 1.08, ease: "none",
    scrollTrigger: { trigger: sec, start: "top top", end: "+=150%", scrub: 0.5 }
  })
}

/* ------------------------------------------------------------------ */
/* Escenas                                                            */
/* ------------------------------------------------------------------ */
function obertura() {
  const sec = $(".obertura")
  // Entrada del titular al cargar: una sola vez, corta.
  gsap.fromTo([".obertura .nota", ".titular", ".obertura__bajada", ".obertura .acciones"],
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: 0.1 })

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: sec, start: "top top", end: "+=170%", pin: true, scrub: 0.6,
      onUpdate: (self) => sec.classList.toggle("encendida", self.progress > 0.5)
    }
  })
  tl.to(".obertura__pista", { opacity: 0, duration: 0.3 }, 0)
  $$(".luces .foco").forEach((f, i) => {
    tl.to($$(".foco__luz, .foco__halo", f), { opacity: 1, duration: 0.22 }, 0.15 + i * 0.11)
  })
  tl.to(".obertura__calor", { opacity: 1, duration: 1.9, ease: "none" }, 0.15)

  $$(".arbol__adornos .adorno").forEach((a, i) => {
    const mece = $("[data-pendulo]", a)
    tl.fromTo(a, { y: () => -window.innerHeight * 0.75, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.55, ease: "power3.out",
      onComplete: () => { const p = pendulos.get(mece); p && empujar(p, (i % 2 ? 1 : -1) * 2.4) }
    }, 1.1 + i * 0.3)
  })
  tl.to(".arbol__halo", { opacity: 1, duration: 0.5 }, 3.3)
  tl.fromTo(".arbol__estrella", { scale: 0.86, svgOrigin: "200 42" }, { scale: 1, svgOrigin: "200 42", duration: 0.5, ease: "back.out(2)" }, 3.3)
  tl.to({}, { duration: 0.4 })   // un respiro con todo encendido antes de soltar

  new IntersectionObserver(([e]) => sec.classList.toggle("fuera", !e.isIntersecting)).observe(sec)
}

function galeria() {
  const sec = $(".galeria"), tira = $("[data-tira-galeria]")
  ScrollTrigger.create({
    trigger: sec, start: "top bottom+=150%", once: true,
    onEnter: () => $$("img", sec).forEach((img) => { img.loading = "eager" })
  })
  const recorrido = () => Math.max(0, tira.scrollWidth - document.documentElement.clientWidth)
  gsap.to(tira, {
    x: () => -recorrido(),
    ease: "none",
    scrollTrigger: {
      trigger: sec, start: "top top", end: () => "+=" + recorrido(), pin: true, scrub: 0.6,
      invalidateOnRefresh: true
    }
  })
}

function revelar(selector) {
  $$(selector).forEach((el) => {
    gsap.fromTo(el, { y: 28, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    })
  })
}

function video() {
  const v = $("[data-video]")
  if (!v || !anim) return
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}) } else v.pause()
  }, { threshold: 0.2 }).observe(v)
}

/* ------------------------------------------------------------------ */
$$("[data-nieve]").forEach(nieve)
video()

if (anim) {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 })
  lenis.on("scroll", (e) => { ScrollTrigger.update(); sentirScroll(e.velocity) })
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  ScrollTrigger.config({ ignoreMobileResize: true })

  document.addEventListener("click", (ev) => {
    const a = ev.target.closest('a[href^="#"]')
    if (!a) return
    const destino = a.getAttribute("href") === "#arriba" ? 0 : $(a.getAttribute("href"))
    if (destino === null) return
    ev.preventDefault()
    lenis.scrollTo(destino, { offset: destino === 0 ? 0 : -parseFloat(getComputedStyle(raiz).fontSize) * 4 })
  })

  crearPendulos()
  // En el orden de la página, para que cada fijado sume su espacio al siguiente.
  obertura()
  revelar(".taller .titulo-seccion, .taller__columnas > *")
  cuenta()
  galeria()
  revelar(".varitas__texto > *, .tarjeta > *, .pedir .titulo-seccion, .paso, .etiqueta, .preguntas .titulo-seccion, .cierre__cuerpo > *")

  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  window.addEventListener("load", () => ScrollTrigger.refresh())
} else {
  cuenta()
}
