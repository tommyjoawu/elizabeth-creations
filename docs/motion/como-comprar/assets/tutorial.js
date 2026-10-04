// El movimiento del tutorial "Cómo pedir". Lo incrusta generar.py en
// index.html y cuadrado.html; la geometría sale de window.CFG (las capturas
// reales y el formato). Un solo timeline pausado y seek-safe: todo lo que
// depende del desplazamiento de la página se recalcula desde `st` en cada
// onUpdate, nunca desde el reloj.
window.construirTutorial = function () {
  const C = window.CFG, K = C.K, d = C.datos
  const W = C.W, H = C.H, S = C.S
  const VX = C.PX + C.BZ, VY = C.PY + C.BZ + 54 * S // origen de la vista de la página, en el mundo
  const $ = (s) => document.querySelector(s)
  const tl = gsap.timeline({ paused: true })
  const T = (t) => t * K

  function escalar(v) {
    v = Object.assign({}, v)
    if (v.keyframes) v.keyframes = v.keyframes.map((k) => Object.assign({}, k, { duration: (k.duration ?? 0.3) * K }))
    else v.duration = (v.duration ?? 0.5) * K
    return v
  }
  const to = (sel, v, t) => tl.to(sel, escalar(v), T(t))
  const set = (sel, v, t) => tl.set(sel, v, T(t))
  const fromTo = (sel, a, b, t) => tl.fromTo(sel, a, Object.assign(escalar(b), { immediateRender: false }), T(t))

  // ── El desplazamiento de la página (y lo que lo sigue) ──────────────────
  const st = { scroll: 0, pegado: 0, total: 15 }
  const rs = d["resumen-set"], rv = d["resumen-vacio"]
  const altoBarra = rs.h - 2 * rs.oy
  const pegadoTop = 844 - 12 - altoBarra - rs.oy // el resumen pegado abajo (bottom: .75rem)
  const elPagina = $("#pagina"), elCable = $("#cable"), elBarra = $("#barra")
  function pintar() {
    elPagina.style.top = -st.scroll + "px"
    elCable.style.top = (VY + S * (1550 - st.scroll) - 3) + "px"
    const natural = rs.y - st.scroll
    elBarra.style.top = (st.pegado > 0.5 ? Math.min(natural, pegadoTop) : natural) + "px"
  }
  const desplazar = (scroll, t, dur, ease = "power3.inOut") => to(st, { scroll, duration: dur, ease, onUpdate: pintar }, t)
  const pegar = (t) => to(st, { pegado: 1, duration: 0.01, onUpdate: pintar }, t)
  pintar()

  // ── La cámara ────────────────────────────────────────────────────────────
  function camTo(s, x, y, t, dur, ease = "power3.inOut") {
    to("#camara", { scale: s, x, y, duration: dur, ease }, t)
    to("#fondo", { x: x * 0.12, y: y * 0.12, scale: 1 + (s - 1) * 0.12, duration: dur, ease }, t)
  }
  // Encuadra una región de la vista (px CSS de la página en pantalla).
  function cam(r, fw, fh, foco, t, dur, ease) {
    const s = Math.min((W * fw) / (r.w * S), (H * fh) / (r.h * S))
    const cx = VX + S * (r.x + r.w / 2), cy = VY + S * (r.y + r.h / 2)
    camTo(s, foco[0] - s * cx, foco[1] - s * cy, t, dur, ease)
  }
  gsap.set("#camara", { transformOrigin: "0 0", x: 0, y: 0, scale: 1 })

  // ── El dedo ──────────────────────────────────────────────────────────────
  gsap.set("#dedo", { x: 200, y: 600, opacity: 0 })
  const dedoA = (x, y, t, dur = 0.45) => to("#dedo", { x, y: y + 54, duration: dur, ease: "power2.inOut" }, t)
  const dedoVer = (v, t) => to("#dedo", { opacity: v ? 1 : 0, duration: 0.2 }, t)
  function toque(t) {
    to("#dedo", { scale: 0.8, duration: 0.1, ease: "power2.in" }, t)
    to("#dedo", { scale: 1, duration: 0.3, ease: "back.out(3)" }, t + 0.1)
    fromTo("#dedo .onda", { scale: 0.6, opacity: 1 }, { scale: 2.4, opacity: 0, duration: 0.5, ease: "power2.out" }, t + 0.04)
  }

  // ── Las piezas que se mecen ──────────────────────────────────────────────
  function mecer(sel, t, amp, per = 0.42) {
    to(sel, { keyframes: [
      { rotation: amp, duration: per * 0.5, ease: "sine.out" },
      { rotation: -amp * 0.6, duration: per, ease: "sine.inOut" },
      { rotation: amp * 0.32, duration: per, ease: "sine.inOut" },
      { rotation: -amp * 0.14, duration: per * 0.9, ease: "sine.inOut" },
      { rotation: 0, duration: per * 0.8, ease: "sine.inOut" },
    ] }, t)
  }

  // ── La pastilla del paso ─────────────────────────────────────────────────
  const PASOS = ["Entra a elizabethcreation.com", "Escoge tu set o tu pieza", "Revisa tu pedido", "Envíalo por WhatsApp y listo"]
  const num = $("#paso .num"), txt = $("#paso .txt")
  PASOS.forEach((p, i) => {
    const n = document.createElement("span"); n.textContent = i + 1; num.appendChild(n)
    const s = document.createElement("span"); s.textContent = p; txt.appendChild(s)
  })
  const nums = [...num.children], txts = [...txt.children]
  if (C.paso.ancho) {
    gsap.set(txts, { autoAlpha: 1 })
    // Cuadrado: la pastilla tiene ancho fijo y el texto puede ir en dos renglones.
    const lh = parseFloat(getComputedStyle(txts[0]).lineHeight)
    txts.forEach((s) => { s.style.whiteSpace = "normal"; s.style.width = "100%"; s.style.lineHeight = lh * 0.82 + "px" })
    txt.style.height = Math.max(...txts.map((s) => s.offsetHeight)) + "px"
    txts.forEach((s) => { s.style.top = "50%"; s.style.marginTop = -s.offsetHeight / 2 + "px" })
    gsap.set(txts, { autoAlpha: 0 })
  } else {
    txt.style.width = Math.ceil(Math.max(...txts.map((s) => s.offsetWidth))) + 2 + "px"
  }
  gsap.set([...nums, ...txts], { yPercent: 120, autoAlpha: 0 })
  if (C.paso.left === null) gsap.set("#paso", { xPercent: -50 })
  function paso(i, t) {
    if (i === 0) {
      fromTo("#paso", { opacity: 0, scale: 0.7, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.8)" }, t)
    } else {
      to(nums[i - 1], { yPercent: -120, autoAlpha: 0, duration: 0.45, ease: "power3.in" }, t)
      to(txts[i - 1], { yPercent: -120, autoAlpha: 0, duration: 0.45, ease: "power3.in" }, t)
      to("#paso", { keyframes: [{ scale: 1.06, duration: 0.2, ease: "power2.out" }, { scale: 1, duration: 0.45, ease: "back.out(2)" }] }, t + 0.3)
    }
    to(nums[i], { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "back.out(1.6)" }, t + (i ? 0.35 : 0.15))
    to(txts[i], { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" }, t + (i ? 0.4 : 0.2))
    // El hilo rojo vuelve a coser la pastilla: cada paso queda cosido al anterior.
    fromTo("#paso .costura", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power2.inOut" }, t + 0.2)
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 0–3 s · El gancho: la estrella cae colgando de su lazo.
  // ═════════════════════════════════════════════════════════════════════════
  const g = C.gancho, gc = C.cierre
  const tam = g.estrella, hiloLen = g.estrellaY + g.hilo
  const cx0 = C.cierre.cx ?? W / 2
  const colgX = W / 2 - tam / 2
  const estTop = hiloLen - 0.08 * tam
  $("#colgante .hilo").style.height = hiloLen + "px"
  $("#estrella").style.top = estTop + "px"
  gsap.set("#estrella", { transformOrigin: "0 0" })
  gsap.set("#colgante", { x: colgX, y: -(hiloLen + tam + 40), rotation: 0 })
  to("#colgante", { y: 0, duration: 0.95, ease: "back.out(1.15)" }, 0.1)
  mecer("#colgante", 0.75, 13, 0.5)
  fromTo("#gancho .renglon", { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.14 * K }, 0.45)
  fromTo("#gancho-nota", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.2)

  // 3–4.3 s · La estrella se encoge y se vuelve el logo del teléfono que entra.
  gsap.set("#telefono", { y: H * 0.95, rotation: 7 })
  to("#telefono", { y: 0, rotation: 0, duration: 1.3, ease: "power3.inOut" }, 2.95)
  const logo = { x: VX + S * 20.2, y: VY + S * 20.2, s: (44 * S) / tam }
  to("#estrella", { x: logo.x - colgX, y: logo.y - estTop, scale: logo.s, duration: 1.3, ease: "power3.inOut" }, 2.9)
  to("#colgante .hilo", { scaleY: 0, duration: 0.7, ease: "power2.in" }, 2.9)
  to("#gancho", { y: -H * 0.18, scale: 0.6, opacity: 0, duration: 0.55, ease: "power3.in" }, 2.7)
  to("#gancho-nota", { opacity: 0, y: -40, duration: 0.4, ease: "power2.in" }, 2.65)
  set(["#gancho", "#gancho-nota"], { visibility: "hidden" }, 3.3)
  to("#estrella", { opacity: 0, duration: 0.15 }, 4.2) // debajo ya está el logo de la página: es el mismo

  // ═════════════════════════════════════════════════════════════════════════
  // 4.2–6.3 s · Paso 1: entra a elizabethcreation.com
  // ═════════════════════════════════════════════════════════════════════════
  paso(0, 4.0)
  const letras = $("#url .letras")
  const anchoUrl = letras.scrollWidth
  gsap.set(letras, { width: 0 })
  to(letras, { width: anchoUrl, duration: 1.0, ease: "steps(21)" }, 4.5)
  to("#url .cursor", { keyframes: [{ opacity: 0, duration: 0.01 }, { opacity: 0, duration: 0.25 }, { opacity: 1, duration: 0.01 }, { opacity: 1, duration: 0.25 },
    { opacity: 0, duration: 0.01 }, { opacity: 0, duration: 0.25 }, { opacity: 1, duration: 0.01 }, { opacity: 1, duration: 0.25 }, { opacity: 0, duration: 0.01 }] }, 5.55)
  // Las piezas del inicio se mecen un poquito: están colgadas.
  // (Son parte de la captura; la cámara respira en su lugar.)
  camTo(1.03, -(W * 0.03) / 2, -(H * 0.012), 4.3, 2.0, "sine.inOut")

  // 6.3–7.6 s · Paneo dentro de la pantalla hasta "Las piezas"; el cordel cruza el cuadro.
  camTo(1, 0, 0, 6.3, 1.3)
  desplazar(d.tira ? 1019 : 1019, 6.3, 1.3)
  gsap.set("#cable", { scaleX: (C.SW / W), opacity: 0 })
  to("#cable", { opacity: 1, duration: 0.15 }, 7.1)
  to("#cable", { scaleX: 1, duration: 0.8, ease: "power3.out" }, 7.2)

  // ═════════════════════════════════════════════════════════════════════════
  // 7.6–12 s · Paso 2: escoge tu set o tu pieza
  // ═════════════════════════════════════════════════════════════════════════
  paso(1, 7.6)
  gsap.set("#ovalo", { clipPath: "inset(0% 100% 0% 0%)" })
  to("#ovalo", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" }, 7.9)
  desplazar(1470, 8.9, 0.85)
  ;["#t0", "#t1", "#t2", "#t3", "#t4", "#t5"].forEach((s, i) => mecer(s, 9.2 + i * 0.05, i % 2 ? -4 : 4, 0.5))
  // El dedo desliza la tira y vuelve.
  dedoA(300, 430, 9.5, 0.01); dedoVer(1, 9.6)
  dedoA(60, 440, 9.95, 0.6)
  to("#tira", { x: -660, duration: 0.9, ease: "power2.out" }, 9.95)
  ;["#t0", "#t1", "#t2", "#t3", "#t4"].forEach((s) => mecer(s, 10.05, -7, 0.45))
  dedoA(90, 430, 10.75, 0.25)
  dedoA(330, 425, 11.0, 0.5)
  to("#tira", { x: 0, duration: 0.85, ease: "power2.out" }, 11.0)
  ;["#t0", "#t1", "#t2", "#t3"].forEach((s) => mecer(s, 11.1, 7, 0.45))
  dedoVer(0, 11.6)

  // 11.9–13 s · Push-in sobre Navidad clásica hasta llenar el cuadro.
  const t0 = C.tarjeta0
  const cardTop = d.tira.top + t0.y - 1470
  cam({ x: 0, y: cardTop - 8, w: 300, h: t0.h + 20 }, 0.9, C.fill || 0.74, C.foco, 11.9, 1.15)

  // ═════════════════════════════════════════════════════════════════════════
  // 13–16 s · "Seleccionar el set completo"
  // ═════════════════════════════════════════════════════════════════════════
  const bs = d.botonSet
  const boton = { x: d.tira.left + t0.x + bs.x + bs.w / 2, y: cardTop + bs.y + bs.h / 2 }
  dedoA(boton.x + 60, boton.y + 120, 12.9, 0.01); dedoVer(1, 12.95)
  dedoA(boton.x, boton.y, 13.05, 0.4)
  toque(13.5)
  // El botón se hunde (una calca del botón, recortada de la misma tarjeta).
  set("#hundido", { opacity: 1 }, 13.45)
  to("#hundido", { keyframes: [{ scale: 0.93, duration: 0.12, ease: "power2.in" }, { scale: 1, duration: 0.25, ease: "back.out(3)" }] }, 13.5)
  set("#hundido", { opacity: 0 }, 13.66)
  ;["#t0", "#t1", "#t2", "#t3"].forEach((s) => to(s + " .elegida", { opacity: 1, duration: 0.18 }, 13.62))
  // La puntada roja rodea la tarjeta y la estrella de "en tu pedido" se cose.
  to("#puntada", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power2.inOut" }, 13.75)
  fromTo("#check", { scale: 0, rotation: -40, opacity: 1 }, { scale: 1, rotation: -8, duration: 0.55, ease: "back.out(2.2)" }, 14.0)
  set("#tag15", { x: boton.x, y: boton.y - 70, xPercent: -50, yPercent: -50, scale: 0.4 }, 0)
  to("#tag15", { opacity: 1, scale: 1, y: boton.y - 92, duration: 0.5, ease: "back.out(2)" }, 14.3)
  mecer("#t0", 13.7, 2.5, 0.5)
  dedoVer(0, 14.6)

  // 16.2–17.4 s · La etiqueta del precio vuela a la barra del resumen.
  const barraTop = Math.min(rs.y - 1470, pegadoTop) + rs.oy
  const totalPos = { x: rs.ox + d.totalRect.x + d.totalRect.w / 2, y: barraTop + d.totalRect.y + d.totalRect.h / 2 }
  camTo(1, 0, 0, 16.2, 1.2)
  to("#tag15", { x: totalPos.x, y: totalPos.y, rotation: -6, duration: 1.0, ease: "power3.inOut" }, 16.2)
  to("#tag15", { scale: 0.45, opacity: 0, duration: 0.25, ease: "power2.in" }, 17.05)
  pegar(16.9)
  to("#barra", { opacity: 1, duration: 0.2 }, 17.0)
  to("#r-vacio", { opacity: 0, duration: 0.2 }, 17.0)
  gsap.set("#barra", { transformOrigin: "50% 50%" })
  to("#barra", { keyframes: [{ scale: 1.05, duration: 0.15, ease: "power2.out" }, { scale: 1, duration: 0.4, ease: "back.out(3)" }] }, 17.1)

  // ═════════════════════════════════════════════════════════════════════════
  // 17.5–23.6 s · Paso 3: una varita con su color, y de vuelta al pedido.
  // ═════════════════════════════════════════════════════════════════════════
  paso(2, 17.5)
  const r = d.rects
  const vA = Math.round(r.laForma.y - 72), vB = Math.round(r.ver.y + 70 - 844)
  desplazar(vA, 17.7, 1.1)
  to("#cable", { opacity: 0, duration: 0.3 }, 17.7)
  const est = { x: r.estrella.x + r.estrella.w / 2, y: r.estrella.y + r.estrella.h / 2 - vA }
  dedoA(est.x + 40, est.y + 200, 18.6, 0.01); dedoVer(1, 18.65)
  dedoA(est.x, est.y, 18.7, 0.4)
  toque(19.1)
  to("#v-formas", { opacity: 1, duration: 0.15 }, 19.18)
  const ros = { x: r.rosado.x + r.rosado.w / 2, y: r.rosado.y + r.rosado.h / 2 - vA }
  dedoA(ros.x, ros.y, 19.35, 0.4)
  toque(19.8)
  to("#v-colores", { opacity: 1, duration: 0.15 }, 19.88)
  set("#v-armado", { opacity: 1 }, 19.9)
  desplazar(vB, 20.15, 0.75)
  const agr = { x: r.agregar.x + r.agregar.w / 2, y: r.agregar.y + r.agregar.h / 2 - vB }
  dedoA(agr.x, agr.y, 20.45, 0.5)
  toque(21.0)
  to("#v-agregado", { opacity: 1, duration: 0.15 }, 21.08)
  set("#tag250", { x: agr.x + 40, y: agr.y - 50, xPercent: -50, yPercent: -50, scale: 0.4 }, 0)
  to("#tag250", { opacity: 1, scale: 1, y: agr.y - 72, duration: 0.45, ease: "back.out(2)" }, 21.15)
  const ver = { x: r.ver.x + r.ver.w / 2, y: r.ver.y + r.ver.h / 2 - vB }
  dedoA(ver.x, ver.y, 21.3, 0.4)
  toque(21.75)
  dedoVer(0, 22.0)
  // "Ver el pedido completo y enviarlo" lleva de vuelta a #temporada.
  desplazar(1019, 22.0, 1.05)
  const barraTop2 = pegadoTop + rs.oy
  const totalPos2 = { x: rs.ox + d.totalRect.x + d.totalRect.w / 2, y: barraTop2 + d.totalRect.y + d.totalRect.h / 2 }
  to("#tag250", { x: totalPos2.x, y: totalPos2.y, rotation: -6, duration: 0.9, ease: "power3.inOut" }, 22.45)
  to("#tag250", { scale: 0.45, opacity: 0, duration: 0.22, ease: "power2.in" }, 23.2)
  to("#b-varita", { opacity: 1, duration: 0.2 }, 23.3)
  to("#barra", { keyframes: [{ scale: 1.05, duration: 0.15, ease: "power2.out" }, { scale: 1, duration: 0.4, ease: "back.out(3)" }] }, 23.3)
  // El total cuenta de $15.00 a $17.50.
  const cont = $("#contador b")
  set("#contador", { x: 384 - 8, y: barraTop2 - 12, xPercent: -100, yPercent: -100, rotation: 3, transformOrigin: "100% 100%" }, 0)
  fromTo("#contador", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 23.15)
  to(st, { total: 17.5, duration: 0.7, ease: "power2.out", onUpdate: () => { cont.textContent = "$" + (Math.round(st.total * 100) / 100).toFixed(2) } }, 23.3)

  // 23.8–25 s · La barra se vuelve el foco; el dedo toca "Enviar".
  cam({ x: 6, y: barraTop2 - 70, w: 378, h: altoBarra + 90 }, 0.94, 0.4, C.focoBarra || [W / 2, H * 0.6], 23.8, 1.0)
  const env = { x: rs.ox + d.enviarRect.x + d.enviarRect.w / 2, y: barraTop2 + d.enviarRect.y + d.enviarRect.h / 2 }
  dedoA(env.x - 60, env.y + 90, 24.2, 0.01); dedoVer(1, 24.25)
  dedoA(env.x, env.y, 24.35, 0.4)
  toque(24.8)
  dedoVer(0, 25.1)

  // ═════════════════════════════════════════════════════════════════════════
  // 25–28.4 s · "Antes de enviar tu pedido": el abono, con resorte suave.
  // ═════════════════════════════════════════════════════════════════════════
  const cv = d.cajaViewport, ac = d["abono-caja"]
  gsap.set("#caja", { left: cv.x - ac.margen, top: cv.y - ac.margen, width: ac.w, height: ac.h })
  to("#velo", { opacity: 1, duration: 0.3 }, 25.05)
  fromTo("#caja", { opacity: 0, scale: 0.84, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.5)" }, 25.1)
  to("#contador", { opacity: 0, duration: 0.2 }, 25.05)
  cam({ x: cv.x, y: cv.y, w: cv.w, h: cv.h }, 0.88, C.fillCaja || 0.55, C.focoCaja || [W / 2, H * 0.47], 25.1, 1.0)
  if (C.nota.left == null) gsap.set("#nota", { xPercent: -50 })
  fromTo("#nota", { opacity: 0, scale: 0.85, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.8)" }, 25.9)
  const ent = { x: cv.x + d.entendidoRect.x + d.entendidoRect.w / 2, y: cv.y + d.entendidoRect.y + d.entendidoRect.h / 2 }
  dedoA(ent.x + 70, ent.y + 160, 27.4, 0.01); dedoVer(1, 27.45)
  dedoA(ent.x, ent.y, 27.55, 0.45)
  toque(28.05)
  to("#nota", { opacity: 0, y: 30, duration: 0.35, ease: "power2.in" }, 28.3)
  set("#nota", { visibility: "hidden" }, 28.7)
  dedoVer(0, 28.35)

  // ═════════════════════════════════════════════════════════════════════════
  // 28.4–33.6 s · La ventana se vuelve la burbuja de WhatsApp. Paso 4.
  // ═════════════════════════════════════════════════════════════════════════
  const texto = $("#texto")
  const bh = texto.offsetHeight, bw = 300
  const bx = 390 - 10 - bw, by = 112 + 44
  const sombraCaja = "0px 0px 0px 1.5px rgba(30,26,60,1), 7px 8px 0px 0px rgba(255,197,61,1), 7px 8px 0px 1.5px rgba(30,26,60,1)"
  const sombraBurbuja = "0px 1px 0px 0px rgba(11,20,26,0.16), 0px 1px 1px 0px rgba(11,20,26,0), 0px 1px 0px 0px rgba(11,20,26,0)"
  gsap.set("#burbuja", { left: cv.x, top: 54 + cv.y, width: cv.w, height: cv.h, borderRadius: 24, backgroundColor: "rgb(255,249,239)", boxShadow: sombraCaja })
  set("#burbuja", { opacity: 1 }, 28.4)
  to("#caja", { opacity: 0, duration: 0.25 }, 28.4)
  to("#burbuja", { left: bx, top: by, width: bw, height: bh, borderRadius: 12, backgroundColor: "rgb(217,253,211)", boxShadow: sombraBurbuja, duration: 1.15, ease: "power3.inOut" }, 28.5)
  to("#wa-fondo", { opacity: 1, duration: 0.6, ease: "power2.inOut" }, 28.55)
  gsap.set("#wa-cab", { y: -120 }); gsap.set("#wa-pie", { y: 80 })
  to("#wa-cab", { y: 0, duration: 0.7, ease: "power3.out" }, 29.0)
  to("#wa-pie", { y: 0, duration: 0.7, ease: "power3.out" }, 29.1)
  to("#wa-fecha", { opacity: 1, duration: 0.3 }, 29.5)
  set("#cromo", { visibility: "hidden" }, 29.7)
  cam({ x: bx - 4, y: by - 54 - 4, w: bw + 8, h: bh + 8 }, 0.86, C.fillChat || 0.6, C.focoChat || [W / 2, H * 0.53], 28.5, 1.3)
  paso(3, 29.6)
  const ps = [...texto.querySelectorAll("p")]
  ps.forEach((p, i) => fromTo(p, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 29.85 + i * 0.55))
  to("#texto .marca", { opacity: 1, duration: 0.3 }, 29.85 + ps.length * 0.55 + 0.1)

  // ═════════════════════════════════════════════════════════════════════════
  // 34–39 s · La cámara se aleja, el teléfono se inclina y la estrella vuelve.
  // ═════════════════════════════════════════════════════════════════════════
  const [cs, cxw, cyw] = gc.cam
  camTo(cs, cxw, cyw, 34.0, 1.8)
  gsap.set("#telefono", { transformOrigin: "50% 50%" })
  to("#telefono", { rotation: gc.giro, duration: 1.8, ease: "power3.inOut" }, 34.0)
  to("#paso", { opacity: 0, y: -30, duration: 0.45, ease: "power2.in" }, 34.0)
  set("#paso", { visibility: "hidden" }, 34.5)
  // La estrella vuelve a colgar, ahora del tamaño del cierre.
  const tamC = gc.estrella, hiloC = gc.hilo + 40
  const escC = tamC / tam
  const colgXC = cx0 - tam / 2
  set("#colgante", { x: colgXC, y: -(hiloC + tamC + 60), rotation: 0 }, 34.3)
  set("#colgante .hilo", { scaleY: hiloC / hiloLen }, 34.3)
  set("#estrella", { opacity: 1, scale: escC, x: (tam - tamC) / 2, y: hiloC - 0.08 * tamC - estTop }, 34.3)
  to("#colgante", { y: 0, duration: 0.95, ease: "back.out(1.2)" }, 34.5)
  mecer("#colgante", 35.0, 10, 0.45)
  if (gc.cx != null) gsap.set("#cierre", { left: gc.cx - gc.ancho / 2, width: gc.ancho })
  fromTo("#cierre .pide", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 35.3)
  fromTo("#cierre .web", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 35.45)
  fromTo("#cierre .ig", { opacity: 0, y: 24, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(2)" }, 35.7)
  // Quieto los últimos 2 s: el último cuadro es la portada.
  set("#cierre", { opacity: 1 }, C.DUR / K - 0.01)

  return tl
}
