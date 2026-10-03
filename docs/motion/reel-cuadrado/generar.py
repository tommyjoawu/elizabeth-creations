# Arma el recorte CUADRADO (1080x1080, 10 s, en bucle) para la landing.
# Copia la cabecera común del reel vertical (../reel-elizabeth/generar.py).
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
<div id="root" data-composition-id="{nombre}" data-width="1080" data-height="1080">
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

# ── A · La varita girando y lo que es ─────────────────────────────────────
escena("c1-varita", "#CDB9F2", '''
  h1 { position: absolute; left: 560px; right: 50px; top: 250px; font-size: 92px; line-height: .94; }
  .mini { position: absolute; left: 560px; top: 700px; font-size: 44px; }
  .p { left: 70px; top: 90px; width: 440px; height: 880px; padding: 18px 18px 78px; }
  .polaroid .pie { font-size: 36px; bottom: 16px; }
''', '''
    <div class="polaroid p" id="c1-pol"><span class="cinta"></span>
      <div class="foto"><video id="c1-video" class="clip" src="assets/video/varita-luna-gira.mp4" data-start="0" data-duration="3.6" muted playsinline></video></div>
      <p class="pie">varita de luna</p></div>
    <h1 class="disp"><span class="renglon"><span id="c1-l1">Adornos</span></span><span class="renglon"><span id="c1-l2">de fieltro</span></span><span class="renglon"><span id="c1-l3">cosidos</span></span><span class="renglon"><span id="c1-l4">a mano</span></span></h1>
    <p class="mini mano" id="c1-mini">con mucho amor</p>
''', '''
    tl.fromTo("#c1-pol", { y: 700, rotation: 6 }, { y: 0, rotation: -3, duration: 0.8, ease: "power4.out" }, 0.1);
    ["#c1-l1", "#c1-l2", "#c1-l3", "#c1-l4"].forEach((sel, i) =>
      tl.fromTo(sel, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.3 + i * 0.1));
    tl.fromTo("#c1-mini", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.9);
''', cortina=False)

# ── B · Hecho en Panamá ───────────────────────────────────────────────────
escena("c2-panama", "#FFC53D", '''
  h1 { position: absolute; left: 60px; right: 60px; top: 70px; font-size: 96px; line-height: .92; }
  .polaroid { width: 300px; height: 420px; padding: 14px 14px 64px; top: 450px; }
  .polaroid .pie { font-size: 30px; bottom: 14px; }
  #c2-a { left: 60px; } #c2-b { left: 390px; } #c2-c { left: 720px; }
''', '''
    <h1 class="disp"><span class="renglon"><span id="c2-l1">Hecho a mano</span></span><span class="renglon"><span id="c2-l2">en Panamá</span></span></h1>
    <div class="polaroid" id="c2-a"><div class="foto"><img src="assets/img/pieza-sirenita.jpg" alt=""></div><p class="pie">sirenita</p></div>
    <div class="polaroid" id="c2-b"><div class="foto"><img src="assets/img/pieza-arbol-verde.jpg" alt=""></div><p class="pie">arbolito</p></div>
    <div class="polaroid" id="c2-c"><div class="foto"><img src="assets/img/pieza-estrella-amarilla.jpg" alt=""></div><p class="pie">estrella</p></div>
''', '''
    tl.fromTo("#c2-l1", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.2);
    tl.fromTo("#c2-l2", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.32);
    const giros = [-5, 3, 6];
    ["#c2-a", "#c2-b", "#c2-c"].forEach((sel, i) =>
      tl.fromTo(sel, { y: 700, rotation: 0 }, { y: 0, rotation: giros[i], duration: 0.7, ease: "power3.out" }, 0.3 + i * 0.12));
''')

# ── C · El sello y la fecha (vuelve al principio sin corte de color) ──────
escena("c3-navidad", "#FBF1E1", '''
  .cordel { position: absolute; left: 0; top: 40px; width: 1080px; height: 200px; overflow: visible; }
  .logo { position: absolute; left: 70px; top: 470px; width: 300px; height: 300px; transform-origin: 50% 8%; }
  .nombre { position: absolute; left: 400px; right: 50px; top: 470px; font-size: 104px; line-height: .88; }
  .fecha { position: absolute; left: 70px; right: 70px; top: 850px; text-align: center; font-size: 52px; font-weight: 800; }
  .fecha b { color: #B21F33; }
''', f'''
    <svg class="cordel" viewBox="0 0 1080 200" fill="none"><path id="c3-cuerda" d="M-20 20 Q540 240 1100 20" stroke="#1E1A3C" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
    {medallon("c3-m1", 120, 60, 210, 70, "#FFC53D", "adorno-galleta-jengibre")}
    {medallon("c3-m2", 435, 120, 210, 40, "#F48FB1", "adorno-varita-luna")}
    {medallon("c3-m3", 750, 60, 210, 70, "#12A5A0", "adorno-pececito")}
    <img class="logo" id="c3-logo" src="assets/sello-color.svg" alt="">
    <div class="nombre disp"><span class="renglon"><span id="c3-n1">Elizabeth</span></span><span class="renglon"><span id="c3-n2">Creations</span></span></div>
    <p class="fecha" id="c3-fecha">Pedidos de Navidad hasta el <b>15 de noviembre</b></p>
''', f'''
    tl.fromTo("#c3-cuerda", {{ attr: {{ "stroke-dashoffset": 1 }} }}, {{ attr: {{ "stroke-dashoffset": 0 }}, duration: 0.6, ease: "power2.inOut" }}, 0.15);
    tl.fromTo(["#c3-m1", "#c3-m2", "#c3-m3"], {{ y: -500 }}, {{ y: 0, duration: 0.5, ease: "power3.out", stagger: 0.1 }}, 0.35);
    {mecer("#c3-m1", 0.85, 24)}
    {mecer("#c3-m2", 0.95, -20)}
    {mecer("#c3-m3", 1.05, 22)}
    tl.fromTo("#c3-logo", {{ scale: 0, rotation: -40 }}, {{ scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.8)" }}, 0.6);
    tl.fromTo("#c3-n1", {{ yPercent: 110 }}, {{ yPercent: 0, duration: 0.6, ease: "expo.out" }}, 0.8);
    tl.fromTo("#c3-n2", {{ yPercent: 110 }}, {{ yPercent: 0, duration: 0.6, ease: "expo.out" }}, 0.92);
    tl.fromTo("#c3-fecha", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }}, 1.3);
''')

ESCENAS = [("c1-varita", 0, 3.6), ("c2-panama", 3.4, 3.4), ("c3-navidad", 6.6, 3.6)]
hosts = "\n".join(f'''      <div id="{n}" data-composition-id="{n}" data-composition-src="compositions/{n}.html" data-start="{s}" data-duration="{d}" data-track-index="{i}" data-width="1080" data-height="1080"></div>''' for i, (n, s, d) in enumerate(ESCENAS))
open(os.path.join(R, "index.html"), "w").write(f'''<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1080px; height: 1080px; overflow: hidden; background: #FBF1E1; }}
      #root {{ position: relative; width: 100%; height: 100%; }}
    </style>
  </head>
  <body>
    <!-- Recorte cuadrado del reel de Elizabeth Creations, para la landing: 3 escenas, 10.2 s, en bucle. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="10.2" data-width="1080" data-height="1080">
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
