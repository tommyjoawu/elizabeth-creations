# Arma index.html y compositions/*.html del reel de Elizabeth Creations.
# Un solo lugar para lo que se repite en cada escena (fuentes, colores,
# polaroid, medallón, cortina de entrada); la composición y el movimiento de
# cada escena van escritos enteros abajo.
#   python3 generar.py && npx hyperframes check
import os, urllib.parse
R = os.path.dirname(os.path.abspath(__file__))
ROSETA = "data:image/svg+xml," + urllib.parse.quote(open(os.path.join(R, "assets/roseta.svg")).read())

COMUN = f'''
  @font-face {{ font-family: "Caprasimo"; src: url("assets/fuentes/caprasimo-latin.woff2") format("woff2"); font-display: block; }}
  @font-face {{ font-family: "Figtree"; src: url("assets/fuentes/figtree-latin-variable.woff2") format("woff2"); font-weight: 300 900; font-display: block; }}
  @font-face {{ font-family: "Shantell Sans"; src: url("assets/fuentes/shantell-sans-latin-variable.woff2") format("woff2"); font-weight: 300 800; font-display: block; }}
  #root {{ position: absolute; inset: 0; overflow: hidden; font-family: "Figtree", sans-serif; color: #1E1A3C; }}
  .escena {{ position: absolute; inset: 0; overflow: hidden; }}
  .grano {{ position: absolute; inset: 0; opacity: .3; mix-blend-mode: soft-light; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='r'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23r)'/%3E%3C/svg%3E"); }}
  .disp {{ font-family: "Caprasimo", Georgia, serif; font-weight: 400; letter-spacing: -.02em; }}
  .mano {{ font-family: "Shantell Sans", sans-serif; font-weight: 600; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  .renglon {{ display: block; overflow: hidden; padding-bottom: .16em; margin-bottom: -.1em; }}
  .renglon > span {{ display: block; }}
  .polaroid {{ position: absolute; background: #FFF9EF; padding: 22px 22px 92px; border-radius: 12px;
    box-shadow: 0 0 0 5px #1E1A3C, 16px 18px 0 #1E1A3C; }}
  .polaroid .foto {{ position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 4px; background: #E9E4EE; }}
  .polaroid img, .polaroid video {{ position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }}
  .polaroid .pie {{ position: absolute; left: 0; right: 0; bottom: 20px; text-align: center; font-family: "Shantell Sans", sans-serif; font-weight: 600; font-size: 42px; color: #1E1A3C; }}
  .cinta {{ position: absolute; z-index: 2; left: 50%; top: -28px; width: 200px; height: 56px; margin-left: -100px; background: rgba(255,197,61,.88);
    clip-path: polygon(0 12%, 5% 0, 30% 5%, 62% 0, 95% 6%, 100% 0, 97% 50%, 100% 100%, 70% 94%, 35% 100%, 4% 93%, 0 100%, 3% 50%); }}
  .med {{ position: absolute; transform-origin: 50% 0; }}
  .med .hilo {{ display: block; width: 4px; margin: 0 auto; background: #1E1A3C; }}
  .med .tapa {{ display: block; width: 30%; height: 30px; margin: 0 auto; border-radius: 10px 10px 4px 4px; background: #1E1A3C; }}
  .med .cuerpo {{ position: relative; width: 100%; aspect-ratio: 1; }}
  .med .cuerpo::before, .med .bola {{ -webkit-mask: url("{ROSETA}") center / 100% 100% no-repeat; mask: url("{ROSETA}") center / 100% 100% no-repeat; }}
  .med .cuerpo::before {{ content: ""; position: absolute; inset: 0; transform: translate(12px, 14px); background: #1E1A3C; }}
  .med .bola {{ position: relative; width: 100%; height: 100%; background: var(--tono); }}
  .med .bola img {{ position: absolute; left: 13%; top: 13%; width: 74%; height: 74%; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 5px #1E1A3C; }}
'''

def medallon(id_, x, y, tam, hilo, tono, foto, claro=False):
    color = "#FBF1E1" if claro else "#1E1A3C"
    return (f'<div class="med" id="{id_}" style="left:{x}px; top:{y}px; width:{tam}px; --tono:{tono}">'
            f'<i class="hilo" style="height:{hilo}px; background:{color}"></i><i class="tapa" style="background:{color}"></i>'
            f'<div class="cuerpo"><div class="bola"><img src="assets/img/{foto}.jpg" alt=""></div></div></div>')

def mecer(sel, t, amp=24, d=0.5):
    """Un adorno que cae y se mece hasta quedarse quieto: oscilación
    amortiguada desde el nudo (sine-wave-loop con amplitud que decae)."""
    return (f'tl.fromTo("{sel}", {{ rotation: {amp} }}, {{ rotation: {-amp*0.55:.1f}, duration: {d}, ease: "sine.inOut" }}, {t});\n'
            f'    tl.to("{sel}", {{ rotation: {amp*0.3:.1f}, duration: {d*0.9:.2f}, ease: "sine.inOut" }}, {t + d:.2f});\n'
            f'    tl.to("{sel}", {{ rotation: {-amp*0.14:.1f}, duration: {d*0.8:.2f}, ease: "sine.inOut" }}, {t + d*1.9:.2f});\n'
            f'    tl.to("{sel}", {{ rotation: 0, duration: {d*0.8:.2f}, ease: "sine.out" }}, {t + d*2.7:.2f});')

CORTINA = '''tl.fromTo(".escena", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "expo.out" }, 0);'''

def escena(nombre, fondo, css, cuerpo, js, cortina=True):
    html = f'''<!doctype html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body>
<template>
<style>
{COMUN}
  .escena {{ background: {fondo}; }}
{css}
</style>
<div id="root" data-composition-id="{nombre}" data-width="1080" data-height="1920">
  <div class="escena">
{cuerpo}
    <div class="grano"></div>
  </div>
</div>
<script>
  (function () {{
    const tl = gsap.timeline({{ paused: true }});
    {CORTINA if cortina else ""}
    {js}
    window.__timelines["{nombre}"] = tl;
  }})();
</script>
</template>
</body>
</html>
'''
    open(os.path.join(R, "compositions", f"{nombre}.html"), "w").write(html)
    print("✓", nombre)

WA = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
      '<path d="M3.5 20.5l1.3-4.6A8.5 8.5 0 1 1 8.2 19.3z"/><path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6.6 1 1.4 1.8 2.4 2.4.2.1.4.1.6 0l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.6.5-3-.2a9 9 0 0 1-3.9-3.9c-.7-1.4-.5-2.4-.2-3z"/></svg>')

# ── 1 · La marca: el cordel, tres piezas y el nombre ──────────────────────
escena("s1-intro", "#FBF1E1", '''
  .cordel { position: absolute; left: 0; top: 300px; width: 1080px; height: 260px; overflow: visible; }
  .logo { position: absolute; left: 340px; top: 900px; width: 400px; height: 400px; transform-origin: 50% 8%; }
  .nombre { position: absolute; left: 60px; right: 60px; top: 1270px; text-align: center; font-size: 168px; line-height: .86; }
  .bajada { position: absolute; left: 60px; right: 60px; top: 1640px; text-align: center; font-size: 54px; }
''', f'''
    <svg class="cordel" viewBox="0 0 1080 260" fill="none"><path id="s1-cuerda" d="M-20 30 Q540 330 1100 30" stroke="#1E1A3C" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
    {medallon("s1-m1", 60, 330, 280, 120, "#FFC53D", "adorno-arbol-verde")}
    {medallon("s1-m2", 400, 430, 280, 90, "#F48FB1", "adorno-estrella-amarilla")}
    {medallon("s1-m3", 740, 330, 280, 120, "#12A5A0", "adorno-galleta-jengibre")}
    <img class="logo" id="s1-logo" src="assets/sello-color.svg" alt="">
    <div class="nombre disp"><span class="renglon"><span id="s1-n1">Elizabeth</span></span><span class="renglon"><span id="s1-n2">Creations</span></span></div>
    <p class="bajada mano" id="s1-bajada">hecho a mano, con mucho amor</p>
''', f'''
    tl.fromTo("#s1-cuerda", {{ attr: {{ "stroke-dashoffset": 1 }} }}, {{ attr: {{ "stroke-dashoffset": 0 }}, duration: 0.7, ease: "power2.inOut" }}, 0);
    tl.fromTo(["#s1-m1", "#s1-m2", "#s1-m3"], {{ y: -700 }}, {{ y: 0, duration: 0.55, ease: "power3.out", stagger: 0.12 }}, 0.25);
    {mecer("#s1-m1", 0.8, 26)}
    {mecer("#s1-m2", 0.92, -22)}
    {mecer("#s1-m3", 1.04, 24)}
    tl.fromTo("#s1-logo", {{ scale: 0, rotation: -40 }}, {{ scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.8)" }}, 0.75);
    tl.fromTo("#s1-n1", {{ yPercent: 110 }}, {{ yPercent: 0, duration: 0.6, ease: "expo.out" }}, 1.0);
    tl.fromTo("#s1-n2", {{ yPercent: 110 }}, {{ yPercent: 0, duration: 0.6, ease: "expo.out" }}, 1.12);
    tl.fromTo("#s1-bajada", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }}, 1.45);
    tl.to("#s1-logo", {{ rotation: 4, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: 1 }}, 1.5);
''', cortina=False)

# ── 2 · El producto en movimiento: la varita de verdad girando ────────────
escena("s2-varita", "#CDB9F2", '''
  h1 { position: absolute; left: 70px; right: 70px; top: 270px; font-size: 118px; line-height: .92; }
  .p { left: 210px; top: 640px; width: 660px; height: 960px; }
''', '''
    <h1 class="disp"><span class="renglon"><span id="s2-l1">Adornos de fieltro</span></span><span class="renglon"><span id="s2-l2">cosidos a mano</span></span></h1>
    <div class="polaroid p" id="s2-pol"><span class="cinta"></span>
      <div class="foto"><video id="s2-video" class="clip" src="assets/video/varita-luna-gira.mp4" data-start="0" data-duration="4.6" muted playsinline></video></div>
      <p class="pie">varita mágica de luna</p></div>
''', '''
    tl.fromTo("#s2-l1", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.2);
    tl.fromTo("#s2-l2", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.32);
    tl.fromTo("#s2-pol", { y: 900, rotation: 8 }, { y: 0, rotation: -3, duration: 0.8, ease: "power4.out" }, 0.15);
    tl.to("#s2-pol", { scale: 1.035, duration: 3.4, ease: "sine.inOut" }, 1.0);
''')

# ── 3 · El origen: hecho a mano en La Chorrera ────────────────────────────
escena("s3-chorrera", "#FFC53D", '''
  h1 { position: absolute; left: 70px; right: 70px; top: 270px; font-size: 124px; line-height: .92; }
  .polaroid { width: 420px; height: 560px; padding: 18px 18px 78px; }
  .polaroid .pie { font-size: 36px; bottom: 16px; }
  #s3-a { left: 80px; top: 600px; } #s3-b { left: 580px; top: 640px; }
  #s3-c { left: 100px; top: 1150px; } #s3-d { left: 570px; top: 1120px; }
''', '''
    <h1 class="disp"><span class="renglon"><span id="s3-l1">Hecho a mano</span></span><span class="renglon"><span id="s3-l2">en La Chorrera</span></span></h1>
    <div class="polaroid" id="s3-a"><div class="foto"><img src="assets/img/pieza-sirenita.jpg" alt=""></div><p class="pie">sirenita</p></div>
    <div class="polaroid" id="s3-b"><div class="foto"><img src="assets/img/pieza-estrella-blanca.jpg" alt=""></div><p class="pie">estrella</p></div>
    <div class="polaroid" id="s3-c"><div class="foto"><img src="assets/img/pieza-pececito.jpg" alt=""></div><p class="pie">pececito</p></div>
    <div class="polaroid" id="s3-d"><div class="foto"><img src="assets/img/pieza-arbol-blanco.jpg" alt=""></div><p class="pie">arbolito de nieve</p></div>
''', '''
    tl.fromTo("#s3-l1", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.2);
    tl.fromTo("#s3-l2", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.32);
    // Las cuatro salen del centro, como cartas repartidas, y cada una cae
    // con su giro (center-outward-expansion).
    const giros = [-6, 5, 4, -5], desde = [[290, 420], [-210, 380], [270, -150], [-200, -120]];
    ["#s3-a", "#s3-b", "#s3-c", "#s3-d"].forEach((sel, i) => {
      tl.fromTo(sel, { x: desde[i][0], y: desde[i][1], rotation: 0, scale: 0.6 },
        { x: 0, y: 0, rotation: giros[i], scale: 1, duration: 0.7, ease: "power3.out" }, 0.3 + i * 0.1);
    });
''')

# ── 4 · La personalización: luna o estrella, y el color ───────────────────
escena("s4-escoges", "#F48FB1", '''
  h1 { position: absolute; left: 70px; right: 70px; top: 270px; font-size: 124px; line-height: .92; }
  .sub { position: absolute; left: 70px; top: 530px; font-size: 56px; font-weight: 800; }
  .p { left: 70px; top: 700px; width: 560px; height: 800px; }
  .op { position: absolute; left: 650px; width: 370px; background: #FFF9EF; border-radius: 40px; padding: 26px 30px; display: flex; align-items: center; gap: 22px;
    box-shadow: 0 0 0 5px #1E1A3C, 12px 14px 0 #1E1A3C; }
  .op svg, .op img { width: 92px; height: 92px; flex: none; }
  .op b { font-size: 54px; line-height: 1.1; }
  #s4-luna { top: 780px; } #s4-estrella { top: 1010px; }
  .gotas { position: absolute; left: 650px; top: 1260px; width: 380px; display: flex; flex-wrap: nowrap; gap: 14px; }
  .gotas i { width: 58px; height: 58px; border-radius: 99px; box-shadow: inset 0 0 0 5px #1E1A3C; outline: 4px dashed #1E1A3C; outline-offset: -13px; display: block; }
''', '''
    <h1 class="disp"><span class="renglon"><span id="s4-l1">¿Luna o</span></span><span class="renglon"><span id="s4-l2">estrella?</span></span></h1>
    <p class="sub" id="s4-sub">Tú escoges el color.</p>
    <div class="polaroid p" id="s4-pol"><span class="cinta" style="background: rgba(18,165,160,.82)"></span><div class="foto"><img src="assets/img/pieza-varita-luna.jpg" alt=""></div><p class="pie">su luna, su color</p></div>
    <div class="op" id="s4-luna"><svg viewBox="0 0 64 64"><path d="M41 8a24 24 0 1 0 15 38A20 20 0 0 1 41 8z" fill="#B79BE6" stroke="#1E1A3C" stroke-width="3" stroke-linejoin="round"/><path d="M38 13a19 19 0 1 0 12 30" fill="none" stroke="#1E1A3C" stroke-width="1.8" stroke-dasharray="3 3"/></svg><b class="disp">Luna</b></div>
    <div class="op" id="s4-estrella"><img src="assets/sello-color.svg" alt=""><b class="disp">Estrella</b></div>
    <div class="gotas"><i style="background:#B79BE6"></i><i style="background:#FFC53D"></i><i style="background:#12A5A0"></i><i style="background:#FFF9EF"></i><i style="background:#D3253C"></i></div>
''', '''
    tl.fromTo("#s4-l1", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.2);
    tl.fromTo("#s4-l2", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.32);
    tl.fromTo("#s4-pol", { x: -700, rotation: -12 }, { x: 0, rotation: -3, duration: 0.75, ease: "power4.out" }, 0.25);
    // Las dos fichas entran y se "aprietan" una vez, como un botón que se toca
    // (press-release-spring).
    tl.fromTo("#s4-luna", { x: 600 }, { x: 0, duration: 0.6, ease: "power3.out" }, 0.55);
    tl.fromTo("#s4-estrella", { x: 600 }, { x: 0, duration: 0.6, ease: "power3.out" }, 0.7);
    tl.to("#s4-luna", { scale: 0.92, duration: 0.12, ease: "power1.in", yoyo: true, repeat: 1 }, 1.5);
    tl.to("#s4-estrella", { scale: 0.92, duration: 0.12, ease: "power1.in", yoyo: true, repeat: 1 }, 1.9);
    tl.fromTo("#s4-sub", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.9);
    tl.fromTo(".gotas i", { scale: 0 }, { scale: 1, duration: 0.45, ease: "back.out(2.2)", stagger: 0.08 }, 1.1);
''')

# ── 5 · La urgencia: Navidad hasta el 15 de noviembre ─────────────────────
luces = "".join(f'<i class="luz" style="left:{40 + i*80}px; top:{int(250 + 150*4*((40+i*80)/1080)*(1-(40+i*80)/1080))}px; --c:{["#FFC53D","#F48FB1","#12A5A0","#F2711C"][i%4]}"></i>' for i in range(13))
escena("s5-navidad", "#1E1A3C", '''
  .cordel { position: absolute; left: 0; top: 230px; width: 1080px; height: 200px; overflow: visible; }
  .luz { position: absolute; width: 34px; height: 50px; margin-left: -17px; border-radius: 48% 48% 50% 50% / 40% 40% 60% 60%; background: var(--c);
    box-shadow: 0 0 26px 8px var(--c); display: block; }
  h1 { position: absolute; left: 70px; right: 70px; top: 560px; font-size: 150px; line-height: .9; color: #FBF1E1; }
  .sello { position: absolute; left: 110px; top: 980px; width: 860px; background: #D3253C; color: #FBF1E1; border-radius: 40px; padding: 40px 50px 50px; text-align: center;
    box-shadow: inset 0 0 0 7px #FBF1E1, inset 0 0 0 14px #D3253C, inset 0 0 0 18px rgba(251,241,225,.6), 16px 18px 0 #F2711C; }
  .sello small { display: block; font-size: 46px; line-height: 1.2; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .sello b { display: block; font-size: 120px; line-height: 1.12; margin-top: 18px; }
  .sub { position: absolute; left: 90px; right: 90px; top: 1560px; text-align: center; font-size: 46px; font-weight: 700; color: #FBF1E1; }
''', f'''
    <svg class="cordel" viewBox="0 0 1080 200" fill="none"><path d="M-20 10 Q540 330 1100 10" stroke="rgba(251,241,225,.55)" stroke-width="4"/></svg>
    {luces}
    <h1 class="disp"><span class="renglon"><span id="s5-l1">Pedidos de</span></span><span class="renglon"><span id="s5-l2" style="color:#FFC53D">Navidad</span></span></h1>
    <div class="sello" id="s5-sello"><small>hasta el</small><b class="disp">15 de noviembre</b></div>
    <p class="sub" id="s5-sub">Cada pieza se hace en 3 a 5 días.</p>
''', '''
    // Las luces se encienden una detrás de otra.
    tl.fromTo(".luz", { opacity: 0.15 }, { opacity: 1, duration: 0.18, ease: "steps(2)", stagger: 0.06 }, 0.2);
    tl.fromTo("#s5-l1", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.35);
    tl.fromTo("#s5-l2", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.47);
    // El sello cae de golpe y rebota una vez (kinetic-beat-slam).
    tl.fromTo("#s5-sello", { scale: 2.4, rotation: 14, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.35, ease: "power4.in" }, 1.0);
    tl.to("#s5-sello", { scale: 1.06, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, 1.35);
    tl.fromTo("#s5-sub", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.7);
''')

# ── 6 · Cómo se paga y dónde se entrega ───────────────────────────────────
escena("s6-pago", "#FBF1E1", '''
  h1 { position: absolute; left: 70px; right: 70px; top: 290px; font-size: 128px; line-height: .92; }
  .eti { position: absolute; left: 70px; right: 70px; border-radius: 48px; padding: 40px 48px; box-shadow: 0 0 0 5px #1E1A3C, 14px 16px 0 #1E1A3C; }
  .eti small { display: block; font-size: 40px; line-height: 1.2; font-weight: 800; }
  .eti b { display: block; margin-top: 16px; font-size: 72px; line-height: 1.1; }
  #s6-a { top: 640px; background: #12A5A0; }
  #s6-b { top: 940px; background: #FFC53D; rotate: 1.5deg; }
  #s6-c { top: 1240px; background: #F48FB1; rotate: -1deg; }
''', '''
    <h1 class="disp"><span class="renglon"><span id="s6-l1">Así de fácil</span></span></h1>
    <div class="eti" id="s6-a" data-layout-allow-overlap><small>Pagas por</small><b class="disp">Yappy o transferencia</b></div>
    <div class="eti" id="s6-b" data-layout-allow-overlap><small>La hago en</small><b class="disp">3 a 5 días</b></div>
    <div class="eti" id="s6-c" data-layout-allow-overlap><small>Te la entrego en</small><b class="disp">La Chorrera y Ciudad de Panamá</b></div>
''', '''
    tl.fromTo("#s6-l1", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.2);
    tl.fromTo("#s6-a", { x: -1200 }, { x: 0, duration: 0.6, ease: "power4.out" }, 0.35);
    tl.fromTo("#s6-b", { x: 1200 }, { x: 0, duration: 0.6, ease: "power4.out" }, 0.55);
    tl.fromTo("#s6-c", { x: -1200 }, { x: 0, duration: 0.6, ease: "power4.out" }, 0.75);
''')

# ── 7 · La acción: el sello, el nombre y el botón ─────────────────────────
escena("s7-cierre", "#D3253C", '''
  .logo { position: absolute; left: 330px; top: 330px; width: 420px; height: 420px; transform-origin: 50% 8%; }
  .nombre { position: absolute; left: 60px; right: 60px; top: 800px; text-align: center; font-size: 164px; line-height: .86; color: #FBF1E1; }
  .cta { position: absolute; left: 70px; right: 70px; top: 1180px; display: flex; align-items: center; justify-content: space-between; gap: 24px;
    padding: 18px 18px 18px 56px; border-radius: 999px; background: #FFC53D; color: #1E1A3C; font-size: 50px; font-weight: 800; white-space: nowrap;
    box-shadow: inset 0 0 0 5px #1E1A3C, 12px 14px 0 #1E1A3C; }
  .cta .isla { width: 120px; height: 120px; border-radius: 99px; display: grid; place-items: center; background: rgba(30,26,60,.14); flex: none; }
  .cta .isla svg { width: 64px; height: 64px; }
  .bajada { position: absolute; left: 60px; right: 60px; top: 1420px; text-align: center; font-size: 50px; color: #FBF1E1; }
''', f'''
    <img class="logo" id="s7-logo" src="assets/sello-crema-sobre-oscuro.svg" alt="">
    <div class="nombre disp"><span class="renglon"><span id="s7-n1">Elizabeth</span></span><span class="renglon"><span id="s7-n2">Creations</span></span></div>
    <div class="cta" id="s7-cta"><span>Haz tu pedido por WhatsApp</span><span class="isla">{WA}</span></div>
    <p class="bajada mano" id="s7-bajada">hecho a mano en La Chorrera</p>
''', '''
    tl.fromTo("#s7-logo", { y: -700, rotation: 22 }, { y: 0, rotation: 22, duration: 0.6, ease: "power3.out" }, 0.2);
    tl.to("#s7-logo", { rotation: -12, duration: 0.5, ease: "sine.inOut" }, 0.8);
    tl.to("#s7-logo", { rotation: 6, duration: 0.45, ease: "sine.inOut" }, 1.3);
    tl.to("#s7-logo", { rotation: 0, duration: 0.45, ease: "sine.out" }, 1.75);
    tl.fromTo("#s7-n1", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.5);
    tl.fromTo("#s7-n2", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.62);
    tl.fromTo("#s7-cta", { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.6)" }, 0.95);
    // El botón se "toca" dos veces, como invitando (press-release-spring).
    tl.to("#s7-cta", { scale: 0.95, duration: 0.1, ease: "power1.in", yoyo: true, repeat: 1 }, 1.9);
    tl.to("#s7-cta", { scale: 0.95, duration: 0.1, ease: "power1.in", yoyo: true, repeat: 1 }, 2.6);
    tl.fromTo("#s7-bajada", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 1.3);
''')

# ── index.html: las siete escenas en fila, cada una sobre la anterior ─────
ESCENAS = [("s1-intro", 0, 3.2), ("s2-varita", 3.0, 4.6), ("s3-chorrera", 7.4, 3.4), ("s4-escoges", 10.6, 3.4),
           ("s5-navidad", 13.8, 3.4), ("s6-pago", 17.0, 2.6), ("s7-cierre", 19.4, 3.6)]
hosts = "\n".join(f'''      <div id="{n}" data-composition-id="{n}" data-composition-src="compositions/{n}.html" data-start="{s}" data-duration="{d}" data-track-index="{i}" data-width="1080" data-height="1920"></div>''' for i, (n, s, d) in enumerate(ESCENAS))
open(os.path.join(R, "index.html"), "w").write(f'''<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #FBF1E1; }}
      #root {{ position: relative; width: 100%; height: 100%; }}
    </style>
  </head>
  <body>
    <!-- Reel de Elizabeth Creations: 7 escenas, 23 s. Ver BRIEF.md y STORYBOARD.md. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="23" data-width="1080" data-height="1920">
{hosts}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
''')
print("✓ index.html")
