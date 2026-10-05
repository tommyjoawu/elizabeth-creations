// El corto de "Cómo pedir" para la página (corto/index.html, 4:5, ~15 s).
// Los mismos planos que tutorial.js, sin gancho ni cierre y sin el desvío de
// la varita: entra → escoge el set → revisa el pedido → la barra se vuelve
// la burbuja de WhatsApp. Al final WhatsApp se cierra hacia la derecha y deja
// ver la página otra vez arriba, con el paso 1: el último cuadro es el
// primero, y el bucle de la página no tiene costura.
// Un solo timeline pausado y seek-safe; el desplazamiento se pinta desde `st`.
window.construirTutorial = function () {
  const C = window.CFG, d = C.datos
  const W = C.W, H = C.H, S = C.S
  const VX = C.PX + C.BZ, VY = C.PY + C.BZ + 54 * S
  const $ = (s) => document.querySelector(s)
  const tl = gsap.timeline({ paused: true })

  const to = (sel, v, t) => tl.to(sel, Object.assign({ duration: 0.5 }, v), t)
  const set = (sel, v, t) => tl.set(sel, v, t)
  const fromTo = (sel, a, b, t) => tl.fromTo(sel, a, Object.assign({ duration: 0.5, immediateRender: false }, b), t)

  // ── El desplazamiento de la página ───────────────────────────────────────
  const st = { scroll: 0, pegado: 0 }
  const rs = d["resumen-set"]
  const altoBarra = rs.h - 2 * rs.oy
  const pegadoTop = 844 - 12 - altoBarra - rs.oy
  const elPagina = $("#pagina"), elBarra = $("#barra")
  function pintar() {
    elPagina.style.top = -st.scroll + "px"
    const natural = rs.y - st.scroll
    elBarra.style.top = (st.pegado > 0.5 ? Math.min(natural, pegadoTop) : natural) + "px"
  }
  const desplazar = (scroll, t, duration, ease = "power3.inOut") => to(st, { scroll, duration, ease, onUpdate: pintar }, t)
  pintar()

  // ── La cámara ────────────────────────────────────────────────────────────
  function camTo(s, x, y, t, duration, ease = "power3.inOut") {
    to("#camara", { scale: s, x, y, duration, ease }, t)
    to("#fondo", { x: x * 0.12, y: y * 0.12, scale: 1 + (s - 1) * 0.12, duration, ease }, t)
  }
  function cam(r, fw, fh, foco, t, duration, ease) {
    const s = Math.min((W * fw) / (r.w * S), (H * fh) / (r.h * S))
    const cx = VX + S * (r.x + r.w / 2), cy = VY + S * (r.y + r.h / 2)
    camTo(s, foco[0] - s * cx, foco[1] - s * cy, t, duration, ease)
  }
  gsap.set("#camara", { transformOrigin: "0 0", x: 0, y: 0, scale: 1 })

  // ── El dedo ──────────────────────────────────────────────────────────────
  gsap.set("#dedo", { x: 200, y: 600, opacity: 0 })
  const dedoA = (x, y, t, duration = 0.4) => to("#dedo", { x, y: y + 54, duration, ease: "power2.inOut" }, t)
  const dedoVer = (v, t) => to("#dedo", { opacity: v ? 1 : 0, duration: 0.2 }, t)
  function toque(t) {
    to("#dedo", { scale: 0.8, duration: 0.1, ease: "power2.in" }, t)
    to("#dedo", { scale: 1, duration: 0.3, ease: "back.out(3)" }, t + 0.1)
    fromTo("#dedo .onda", { scale: 0.6, opacity: 1 }, { scale: 2.4, opacity: 0, duration: 0.5, ease: "power2.out" }, t + 0.04)
  }
  function mecer(sel, t, amp, per = 0.42) {
    to(sel, { keyframes: [
      { rotation: amp, duration: per * 0.5, ease: "sine.out" },
      { rotation: -amp * 0.6, duration: per, ease: "sine.inOut" },
      { rotation: amp * 0.32, duration: per, ease: "sine.inOut" },
      { rotation: -amp * 0.14, duration: per * 0.9, ease: "sine.inOut" },
      { rotation: 0, duration: per * 0.8, ease: "sine.inOut" },
    ] }, t)
  }

  // ── La pastilla del paso: ya está en el paso 1 desde el primer cuadro ───
  const PASOS = ["Entra a elizabethcreation.com", "Escoge tu set o tu pieza", "Revisa tu pedido", "Envíalo por WhatsApp y listo"]
  const num = $("#paso .num"), txt = $("#paso .txt")
  PASOS.forEach((p, i) => {
    const n = document.createElement("span"); n.textContent = i + 1; num.appendChild(n)
    const s = document.createElement("span"); s.textContent = p; txt.appendChild(s)
  })
  const nums = [...num.children], txts = [...txt.children]
  txt.style.width = Math.ceil(Math.max(...txts.map((s) => s.offsetWidth))) + 2 + "px"
  gsap.set("#paso", { xPercent: -50, opacity: 1 })
  gsap.set("#paso .costura", { clipPath: "inset(0% 0% 0% 0%)" })
  gsap.set([...nums, ...txts], { yPercent: 120, autoAlpha: 0 })
  gsap.set([nums[0], txts[0]], { yPercent: 0, autoAlpha: 1 })
  function paso(a, b, t) {
    to([nums[a], txts[a]], { yPercent: -120, autoAlpha: 0, duration: 0.45, ease: "power3.in" }, t)
    to("#paso", { keyframes: [{ scale: 1.06, duration: 0.2, ease: "power2.out" }, { scale: 1, duration: 0.45, ease: "back.out(2)" }] }, t + 0.3)
    fromTo(nums[b], { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "back.out(1.6)" }, t + 0.35)
    fromTo(txts[b], { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" }, t + 0.4)
    fromTo("#paso .costura", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power2.inOut" }, t + 0.2)
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 0–1.6 s · Paso 1: se escribe la dirección.
  // ═════════════════════════════════════════════════════════════════════════
  const letras = $("#url .letras")
  const anchoUrl = letras.scrollWidth
  gsap.set(letras, { width: 0 })
  to(letras, { width: anchoUrl, duration: 0.95, ease: "steps(21)" }, 0.2)
  to("#url .cursor", { keyframes: [{ opacity: 0, duration: 0.01 }, { opacity: 0, duration: 0.22 }, { opacity: 1, duration: 0.01 }, { opacity: 1, duration: 0.22 }, { opacity: 0, duration: 0.01 }] }, 1.2)
  camTo(1.04, -(W * 0.04) / 2, -(H * 0.015), 0.1, 1.4, "sine.inOut")

  // 1.6–2.8 s · Paneo dentro de la pantalla hasta "Las piezas".
  camTo(1, 0, 0, 1.6, 1.2)
  desplazar(1019, 1.6, 1.2)

  // ═════════════════════════════════════════════════════════════════════════
  // 2.7–8.3 s · Paso 2: escoge tu set o tu pieza.
  // ═════════════════════════════════════════════════════════════════════════
  paso(0, 1, 2.7)
  gsap.set("#ovalo", { clipPath: "inset(0% 100% 0% 0%)" })
  to("#ovalo", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power2.inOut" }, 2.9)
  desplazar(1470, 3.5, 0.8)
  ;["#t0", "#t1", "#t2", "#t3", "#t4", "#t5"].forEach((s, i) => mecer(s, 3.8 + i * 0.05, i % 2 ? -4 : 4, 0.5))
  dedoA(300, 430, 4.1, 0.01); dedoVer(1, 4.15)
  dedoA(60, 440, 4.4, 0.55)
  to("#tira", { x: -660, duration: 0.8, ease: "power2.out" }, 4.4)
  ;["#t0", "#t1", "#t2", "#t3", "#t4"].forEach((s) => mecer(s, 4.5, -7, 0.42))
  dedoA(90, 430, 5.0, 0.2)
  dedoA(330, 425, 5.2, 0.45)
  to("#tira", { x: 0, duration: 0.75, ease: "power2.out" }, 5.2)
  ;["#t0", "#t1", "#t2", "#t3"].forEach((s) => mecer(s, 5.3, 7, 0.42))
  dedoVer(0, 5.75)

  // Push-in sobre Navidad clásica.
  const t0 = C.tarjeta0
  const cardTop = d.tira.top + t0.y - 1470
  cam({ x: 0, y: cardTop - 8, w: 300, h: t0.h + 20 }, 0.9, C.fill, C.foco, 5.8, 1.0)

  // "Seleccionar el set completo"
  const bs = d.botonSet
  const boton = { x: d.tira.left + t0.x + bs.x + bs.w / 2, y: cardTop + bs.y + bs.h / 2 }
  dedoA(boton.x + 60, boton.y + 120, 6.7, 0.01); dedoVer(1, 6.75)
  dedoA(boton.x, boton.y, 6.8, 0.4)
  toque(7.25)
  set("#hundido", { opacity: 1 }, 7.2)
  to("#hundido", { keyframes: [{ scale: 0.93, duration: 0.12, ease: "power2.in" }, { scale: 1, duration: 0.25, ease: "back.out(3)" }] }, 7.25)
  set("#hundido", { opacity: 0 }, 7.41)
  ;["#t0", "#t1", "#t2", "#t3"].forEach((s) => to(s + " .elegida", { opacity: 1, duration: 0.18 }, 7.37))
  to("#puntada", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" }, 7.45)
  fromTo("#check", { scale: 0, rotation: -40, opacity: 1 }, { scale: 1, rotation: -8, duration: 0.5, ease: "back.out(2.2)" }, 7.7)
  set("#tag15", { x: boton.x, y: boton.y - 70, xPercent: -50, yPercent: -50, scale: 0.4 }, 0)
  to("#tag15", { opacity: 1, scale: 1, y: boton.y - 92, duration: 0.5, ease: "back.out(2)" }, 7.9)
  mecer("#t0", 7.4, 2.5, 0.5)
  dedoVer(0, 8.2)

  // ═════════════════════════════════════════════════════════════════════════
  // 8.6–11.4 s · Paso 3: el precio vuela a la barra; revisa y toca "Enviar".
  // ═════════════════════════════════════════════════════════════════════════
  const barraTop = pegadoTop + rs.oy
  const totalPos = { x: rs.ox + d.totalRect.x + d.totalRect.w / 2, y: barraTop + d.totalRect.y + d.totalRect.h / 2 }
  camTo(1, 0, 0, 8.6, 1.0)
  to("#tag15", { x: totalPos.x, y: totalPos.y, rotation: -6, duration: 0.95, ease: "power3.inOut" }, 8.6)
  to("#tag15", { scale: 0.45, opacity: 0, duration: 0.22, ease: "power2.in" }, 9.4)
  to(st, { pegado: 1, duration: 0.01, onUpdate: pintar }, 9.25)
  to("#barra", { opacity: 1, duration: 0.2 }, 9.3)
  to("#r-vacio", { opacity: 0, duration: 0.2 }, 9.3)
  gsap.set("#barra", { transformOrigin: "50% 50%" })
  to("#barra", { keyframes: [{ scale: 1.05, duration: 0.15, ease: "power2.out" }, { scale: 1, duration: 0.4, ease: "back.out(3)" }] }, 9.45)
  paso(1, 2, 9.3)
  set("#contador", { x: 384 - 8, y: barraTop - 12, xPercent: -100, yPercent: -100, rotation: 3, transformOrigin: "100% 100%" }, 0)
  fromTo("#contador", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 9.55)

  cam({ x: 6, y: barraTop - 70, w: 378, h: altoBarra + 90 }, 0.94, 0.4, C.focoBarra, 10.0, 0.9)
  const env = { x: rs.ox + d.enviarRect.x + d.enviarRect.w / 2, y: barraTop + d.enviarRect.y + d.enviarRect.h / 2 }
  dedoA(env.x - 60, env.y + 90, 10.5, 0.01); dedoVer(1, 10.55)
  dedoA(env.x, env.y, 10.6, 0.4)
  toque(11.05)
  dedoVer(0, 11.35)

  // ═════════════════════════════════════════════════════════════════════════
  // 11.4–14.6 s · La barra se vuelve la burbuja de WhatsApp. Paso 4.
  // ═════════════════════════════════════════════════════════════════════════
  const texto = $("#texto")
  const bh = texto.offsetHeight, bw = 300
  const bx = 390 - 10 - bw, by = 112 + 44
  const sombraCaja = "0px 0px 0px 1.5px rgba(30,26,60,1), 7px 8px 0px 0px rgba(255,197,61,1), 7px 8px 0px 1.5px rgba(30,26,60,1)"
  const sombraBurbuja = "0px 1px 0px 0px rgba(11,20,26,0.16), 0px 1px 1px 0px rgba(11,20,26,0), 0px 1px 0px 0px rgba(11,20,26,0)"
  gsap.set("#burbuja", { left: rs.ox, top: 54 + barraTop, width: 390 - 2 * rs.ox, height: altoBarra, borderRadius: 18, backgroundColor: "rgb(255,249,239)", boxShadow: sombraCaja })
  to("#contador", { opacity: 0, duration: 0.2 }, 11.3)
  set("#burbuja", { opacity: 1 }, 11.4)
  to("#barra", { opacity: 0, duration: 0.2 }, 11.42)
  to("#burbuja", { left: bx, top: by, width: bw, height: bh, borderRadius: 12, backgroundColor: "rgb(217,253,211)", boxShadow: sombraBurbuja, duration: 1.05, ease: "power3.inOut" }, 11.45)
  to("#wa-fondo", { opacity: 1, duration: 0.55, ease: "power2.inOut" }, 11.5)
  gsap.set("#wa-cab", { y: -120 }); gsap.set("#wa-pie", { y: 80 })
  to("#wa-cab", { y: 0, duration: 0.65, ease: "power3.out" }, 11.85)
  to("#wa-pie", { y: 0, duration: 0.65, ease: "power3.out" }, 11.95)
  to("#wa-fecha", { opacity: 1, duration: 0.3 }, 12.25)
  set("#cromo", { visibility: "hidden" }, 12.3)
  cam({ x: bx - 4, y: by - 54 - 4, w: bw + 8, h: bh + 8 }, 0.8, C.fillChat, C.focoChat, 11.45, 1.2)
  paso(2, 3, 11.7)
  const ps = [...texto.querySelectorAll("p")]
  ps.forEach((p, i) => fromTo(p, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 12.4 + i * 0.32))
  const tMarca = 12.4 + ps.length * 0.32 + 0.1
  to("#texto .marca", { opacity: 1, duration: 0.3 }, tMarca)

  // ═════════════════════════════════════════════════════════════════════════
  // Vuelta al inicio: con el chat tapando la página, todo vuelve a su lugar;
  // WhatsApp se cierra hacia la derecha y aparece la página arriba, paso 1.
  // ═════════════════════════════════════════════════════════════════════════
  const R = C.DUR - 1.2
  const r0 = R - 0.1
  to(st, { scroll: 0, pegado: 0, duration: 0.01, onUpdate: pintar }, r0)
  set("#barra", { opacity: 0, scale: 1 }, r0)
  set("#r-vacio", { opacity: 1 }, r0)
  set(["#t0 .elegida", "#t1 .elegida", "#t2 .elegida", "#t3 .elegida"], { opacity: 0 }, r0)
  set("#puntada", { clipPath: "inset(0% 0% 100% 0%)" }, r0)
  set("#check", { opacity: 0 }, r0)
  set("#ovalo", { clipPath: "inset(0% 100% 0% 0%)" }, r0)
  set(letras, { width: 0 }, r0)
  set("#url .cursor", { opacity: 1 }, r0)
  set("#cromo", { visibility: "visible" }, r0)
  to("#chat", { xPercent: 100, duration: 0.85, ease: "power3.inOut" }, R)
  camTo(1, 0, 0, R, 0.95)
  paso(3, 0, R + 0.05)
  // Ya fuera de cuadro, el chat vuelve a su estado de partida (invisible).
  const r1 = R + 0.9
  set(["#wa-fondo", "#burbuja", "#wa-fecha", "#texto .marca", ...ps], { opacity: 0 }, r1)
  set("#wa-cab", { y: -120 }, r1)
  set("#wa-pie", { y: 80 }, r1)
  set("#chat", { xPercent: 0 }, r1 + 0.01)
  tl.set({}, {}, C.DUR)

  return tl
}
