# Arma las pieza.html de cada carpeta de docs/galeria/. Un solo lugar para
# lo que se repite (cabecera, icono de WhatsApp, firma, botón); la
# composición de cada pieza va escrita entera abajo. Después:
#   python3 docs/galeria/_fuente/generar.py && node docs/galeria/render.mjs
import os
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

WA = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
      '<path d="M3.5 20.5l1.3-4.6A8.5 8.5 0 1 1 8.2 19.3z"/><path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6.6 1 1.4 1.8 2.4 2.4.2.1.4.1.6 0l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.6.5-3-.2a9 9 0 0 1-3.9-3.9c-.7-1.4-.5-2.4-.2-3z"/></svg>')

def cta(texto="Haz tu pedido", clase=""):
    return f'<span class="cta {clase}">{texto}<span class="isla">{WA}</span></span>'

def lock(crema=False, sub="Hecho a mano en Panamá"):
    sello = "sello-crema.svg" if crema else "sello.svg"
    return f'<div class="lock"><img src="../marca/{sello}" alt=""><div><b>Elizabeth<br>Creations</b><span>{sub}</span></div></div>'

def pieza(carpeta, titulo, tamano, css, cuerpo, fondo=""):
    # fondo: un estampado de marca.css (bolitas, bombones, luces, estrellitas,
    # florecitas, confeti). Erika pidió que ningún fondo quede liso.
    w, h = tamano.split("x")
    html = f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<meta name="pieza" content="{tamano}">
<title>{titulo}</title>
<link rel="stylesheet" href="../marca/marca.css">
<style>
  .pieza {{ width: {w}px; height: {h}px; }}
{css}
</style>
</head>
<body>
<div class="pieza grano{" fondo-" + fondo if fondo else ""}">
{cuerpo}
</div>
</body>
</html>
'''
    os.makedirs(os.path.join(RAIZ, carpeta), exist_ok=True)
    open(os.path.join(RAIZ, carpeta, "pieza.html"), "w").write(html)
    print("✓", carpeta)

def img(nombre): return f"../marca/img/{nombre}.jpg"

# ── 1. Feed: Navidad cosida a mano ────────────────────────────────────────
pieza("feed-navidad", "Feed · Navidad cosida a mano", "1080x1350", '''
  .pieza { background: var(--anil); color: var(--crema); }
  h1 { position: absolute; left: 70px; top: 196px; width: 940px; font-family: var(--disp); font-weight: 400; font-size: 132px; line-height: .92; letter-spacing: -.02em; }
  h1 em { font-style: normal; color: var(--mango); }
  .p1 { left: 80px; top: 500px; width: 450px; height: 560px; rotate: -4deg; }
  .p2 { left: 540px; top: 560px; width: 410px; height: 510px; rotate: 5deg; }
  .polaroid figcaption { color: var(--anil); }
  .p1 .cinta { left: 175px; top: -22px; rotate: -5deg; }
  .p2 .cinta { left: 150px; top: -22px; rotate: 6deg; background: rgba(244,143,177,.9); }
  .polaroid { box-shadow: 0 0 0 4px var(--anil), 14px 16px 0 var(--papaya); }
  .sello-fecha { right: 50px; top: 440px; rotate: 8deg; z-index: 3; }
  .pie { position: absolute; left: 70px; right: 70px; bottom: 54px; display: flex; justify-content: space-between; align-items: center; }
''', f'''
  <h1>Navidad cosida <em>a mano</em></h1>
  <figure class="polaroid p1"><span class="cinta"></span><div class="foto"><img src="{img('pieza-arbol-verde')}" alt=""></div><figcaption>arbolito verde</figcaption></figure>
  <figure class="polaroid p2"><span class="cinta"></span><div class="foto"><img src="{img('pieza-galleta-jengibre')}" alt=""></div><figcaption>galleta de jengibre</figcaption></figure>
  <div class="sello-fecha"><small>Pedidos hasta el</small><b>15 de nov.</b></div>
  <div class="pie">{lock(crema=True)}{cta()}</div>
''', fondo="luces")

# ── 2. Feed: ¿Luna o estrella? ────────────────────────────────────────────
pieza("feed-varitas", "Feed · ¿Luna o estrella? Tú escoges", "1080x1350", '''
  .pieza { background: var(--lila); }
  h1 { position: absolute; left: 70px; top: 196px; width: 960px; font-family: var(--disp); font-weight: 400; font-size: 118px; line-height: .94; letter-spacing: -.02em; }
  .p1 { left: 80px; top: 470px; width: 520px; height: 620px; rotate: -3deg; }
  .p1 .cinta { left: 195px; top: -22px; rotate: -4deg; }
  .opciones { position: absolute; left: 670px; top: 520px; width: 350px; display: grid; gap: 26px; }
  .op { background: var(--papel); border-radius: 30px; padding: 22px 26px; display: flex; align-items: center; gap: 20px; box-shadow: 0 0 0 4px var(--anil), 9px 11px 0 var(--anil); }
  .op svg, .op img { width: 92px; height: 92px; flex: none; }
  .op b { font-family: var(--disp); font-weight: 400; font-size: 52px; line-height: 1; }
  .op.color { flex-direction: column; align-items: flex-start; gap: 14px; }
  .op.color b { font-size: 40px; }
  .gotas { display: flex; gap: 12px; }
  .gotas i { width: 46px; height: 46px; border-radius: 99px; box-shadow: inset 0 0 0 3px var(--anil); outline: 3px dashed var(--anil); outline-offset: -11px; }
  .pie { position: absolute; left: 70px; right: 70px; bottom: 54px; display: flex; justify-content: space-between; align-items: center; }
''', f'''
  <h1>¿Luna o estrella? Tú escoges.</h1>
  <figure class="polaroid p1"><span class="cinta"></span><div class="foto"><img src="{img('varita-luna-ventana')}" alt=""></div><figcaption>varita mágica de luna</figcaption></figure>
  <div class="opciones">
    <div class="op"><svg viewBox="0 0 64 64"><path d="M41 8a24 24 0 1 0 15 38A20 20 0 0 1 41 8z" fill="#B79BE6" stroke="#1E1A3C" stroke-width="3" stroke-linejoin="round"/><path d="M38 13a19 19 0 1 0 12 30" fill="none" stroke="#1E1A3C" stroke-width="1.8" stroke-dasharray="3 3"/></svg><b>Luna</b></div>
    <div class="op"><img src="../marca/sello.svg" alt=""><b>Estrella</b></div>
    <div class="op color"><b>+ el color que quieras</b><div class="gotas"><i style="background:#B79BE6"></i><i style="background:#F48FB1"></i><i style="background:#FFC53D"></i><i style="background:#12A5A0"></i><i style="background:#FFF9EF"></i></div></div>
  </div>
  <div class="pie">{lock()}{cta("Pide tu varita", "oscuro")}</div>
''', fondo="bolitas")

# ── 3. Feed: Envío a todo Panamá ──────────────────────────────────────────
pieza("feed-envio-panama", "Feed · Envío a todo Panamá", "1080x1350", '''
  .pieza { background: var(--mango); }
  h1 { position: absolute; left: 70px; top: 196px; width: 960px; font-family: var(--disp); font-weight: 400; font-size: 112px; line-height: .94; letter-spacing: -.02em; }
  .polaroid { padding: 14px 14px 58px; width: 280px; height: 340px; }
  .polaroid figcaption { font-size: 28px; bottom: 10px; }
  .a { left: 74px;  top: 440px; rotate: -5deg; } .b { left: 400px; top: 466px; rotate: 3deg; } .c { left: 726px; top: 436px; rotate: -2deg; }
  .d { left: 170px; top: 790px; rotate: 4deg; height: 320px; } .e { left: 510px; top: 800px; rotate: -4deg; height: 320px; }
  .nota { position: absolute; right: 60px; top: 880px; width: 210px; font-family: var(--mano); font-size: 38px; line-height: 1.1; rotate: -6deg; font-weight: 600; }
  .pie { position: absolute; left: 70px; right: 70px; bottom: 54px; display: flex; justify-content: space-between; align-items: center; }
''', f'''
  <h1>Envío a todo Panamá</h1>
  <figure class="polaroid a"><div class="foto"><img src="{img('adorno-sirenita')}" alt=""></div><figcaption>sirenita</figcaption></figure>
  <figure class="polaroid b"><div class="foto"><img src="{img('adorno-estrella-blanca')}" alt=""></div><figcaption>estrella</figcaption></figure>
  <figure class="polaroid c"><div class="foto"><img src="{img('adorno-cangrejito')}" alt=""></div><figcaption>cangrejito</figcaption></figure>
  <figure class="polaroid d"><div class="foto"><img src="{img('adorno-galleta-jengibre')}" alt=""></div><figcaption>galleta</figcaption></figure>
  <figure class="polaroid e"><div class="foto"><img src="{img('adorno-pececito')}" alt=""></div><figcaption>pececito</figcaption></figure>
  <p class="nota">fieltro, hilo y bisutería ✶</p>
  <div class="pie">{lock()}{cta("Haz tu pedido", "oscuro")}</div>
''', fondo="estrellitas")

# ── 4. Feed: Bajo el mar ──────────────────────────────────────────────────
# El tendedero de la landing: un cordel y tres medallones festoneados.
ROSETA = "radial-gradient(circle at 50% 50%, #000 0 64%, transparent 64.5%)"
def medallon(x, y, tam, hilo, tono, foto, giro):
    return f'''<div class="med" style="left:{x}px; top:{y}px; width:{tam}px; --tono:{tono}; rotate:{giro}deg">
      <i class="hilo" style="height:{hilo}px"></i><i class="tapa"></i>
      <div class="cuerpo"><div class="bola"><img src="{img(foto)}" alt=""></div></div></div>'''
MED_CSS = '''
  .cordel { position: absolute; left: 0; width: 100%; overflow: visible; }
  .med { position: absolute; transform-origin: 50% 0; margin-left: calc(var(--t, 0px) * -.5); }
  .med .hilo { display: block; width: 3px; margin: 0 auto; background: currentColor; }
  .med .tapa { display: block; width: 30%; height: 26px; margin: 0 auto; border-radius: 8px 8px 4px 4px; background: currentColor; }
  .med .cuerpo { position: relative; aspect-ratio: 1; }
  .med .cuerpo::before, .med .bola { -webkit-mask: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%22-1%20-1%202%202%22%3E%3Ccircle%20r%3D%220.82%22/%3E%3Ccircle%20cx%3D%220.800%22%20cy%3D%220.000%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.731%22%20cy%3D%220.325%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.535%22%20cy%3D%220.595%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.247%22%20cy%3D%220.761%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.084%22%20cy%3D%220.796%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.400%22%20cy%3D%220.693%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.647%22%20cy%3D%220.470%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.783%22%20cy%3D%220.166%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.783%22%20cy%3D%22-0.166%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.647%22%20cy%3D%22-0.470%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.400%22%20cy%3D%22-0.693%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.084%22%20cy%3D%22-0.796%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.247%22%20cy%3D%22-0.761%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.535%22%20cy%3D%22-0.595%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.731%22%20cy%3D%22-0.325%22%20r%3D%220.2%22/%3E%3C/svg%3E") center / 100% 100% no-repeat; mask: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%22-1%20-1%202%202%22%3E%3Ccircle%20r%3D%220.82%22/%3E%3Ccircle%20cx%3D%220.800%22%20cy%3D%220.000%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.731%22%20cy%3D%220.325%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.535%22%20cy%3D%220.595%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.247%22%20cy%3D%220.761%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.084%22%20cy%3D%220.796%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.400%22%20cy%3D%220.693%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.647%22%20cy%3D%220.470%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.783%22%20cy%3D%220.166%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.783%22%20cy%3D%22-0.166%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.647%22%20cy%3D%22-0.470%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.400%22%20cy%3D%22-0.693%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%22-0.084%22%20cy%3D%22-0.796%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.247%22%20cy%3D%22-0.761%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.535%22%20cy%3D%22-0.595%22%20r%3D%220.2%22/%3E%3Ccircle%20cx%3D%220.731%22%20cy%3D%22-0.325%22%20r%3D%220.2%22/%3E%3C/svg%3E") center / 100% 100% no-repeat; }
  .med .cuerpo::before { content: ""; position: absolute; inset: 0; translate: 10px 12px; background: var(--anil); }
  .med .bola { position: relative; width: 100%; height: 100%; background: var(--tono); }
  .med .bola img { position: absolute; inset: 13%; width: 74%; height: 74%; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 4px var(--anil); }
'''
pieza("feed-bajo-el-mar", "Feed · Bajo el mar, en fieltro", "1080x1350", MED_CSS + '''
  .pieza { background: var(--turquesa); color: var(--anil); }
  h1 { position: absolute; left: 70px; top: 196px; width: 820px; font-family: var(--disp); font-weight: 400; font-size: 124px; line-height: .92; letter-spacing: -.02em; }
  .cordel { top: 470px; height: 200px; color: var(--anil); }
  .sub { --placa: var(--turquesa); position: absolute; left: 70px; right: 70px; bottom: 210px; font-size: 40px; font-weight: 700; line-height: 1.25; }
  .pie { position: absolute; left: 70px; right: 70px; bottom: 54px; display: flex; justify-content: space-between; align-items: center; }
''', f'''
  <h1>Bajo el mar, en fieltro</h1>
  <svg class="cordel" viewBox="0 0 1080 200" fill="none" stroke="#1E1A3C" stroke-width="4"><path d="M-20 20 Q540 240 1100 20"/></svg>
  {medallon(40, 520, 320, 80, '#FFC53D', 'adorno-sirenita', -4)}
  {medallon(380, 590, 320, 70, '#F48FB1', 'adorno-pececito', 2)}
  {medallon(720, 520, 320, 80, '#F2711C', 'adorno-cangrejito', 5)}
  <p class="sub placa">Sirenita, pececito y cangrejito, con caritas bordadas y bisutería.</p>
  <div class="pie">{lock()}{cta("Haz tu pedido", "oscuro")}</div>
''', fondo="florecitas")

# ── 5. Story: Así haces tu pedido ─────────────────────────────────────────
pieza("story-como-pedir", "Story · Así haces tu pedido", "1080x1920", '''
  .pieza { background: var(--crema); }
  h1 { position: absolute; left: 70px; top: 230px; width: 620px; font-family: var(--disp); font-weight: 400; font-size: 118px; line-height: .94; letter-spacing: -.02em; }
  .p1 { right: 60px; top: 240px; width: 330px; height: 420px; padding: 14px 14px 58px; rotate: 6deg; }
  .p1 figcaption { font-size: 28px; bottom: 10px; }
  .p1 .cinta { left: 80px; top: -22px; rotate: 4deg; }
  ol { position: absolute; left: 70px; right: 70px; top: 720px; list-style: none; display: grid; gap: 26px; }
  li { display: flex; gap: 26px; align-items: flex-start; background: var(--papel); border-radius: 36px; padding: 26px 30px; box-shadow: 0 0 0 4px var(--anil), 8px 10px 0 var(--anil); }
  li .n { flex: none; width: 78px; height: 78px; border-radius: 99px; display: grid; place-items: center; font-family: var(--disp); font-size: 42px; background: var(--mango); box-shadow: 0 0 0 4px var(--anil); }
  li:nth-child(2) .n { background: var(--hibisco); } li:nth-child(3) .n { background: var(--turquesa); } li:nth-child(4) .n { background: var(--lila); }
  li b { display: block; font-family: var(--disp); font-weight: 400; font-size: 48px; line-height: 1.02; }
  li span { display: block; margin-top: 6px; font-size: 31px; line-height: 1.3; font-weight: 500; }
  .aviso { position: absolute; left: 70px; right: 70px; top: 1488px; background: var(--lila); color: var(--anil); box-shadow: 0 0 0 4px var(--anil), 8px 10px 0 var(--anil); border-radius: 36px; padding: 24px 32px; font-size: 32px; font-weight: 600; line-height: 1.3; }
  .aviso b { font-family: var(--disp); font-weight: 400; font-size: 44px; display: block; }
  .pie { position: absolute; left: 70px; right: 70px; bottom: 90px; display: flex; justify-content: center; }
''', f'''
  <h1>Así haces tu pedido</h1>
  <figure class="polaroid p1"><span class="cinta"></span><div class="foto"><img src="{img('pieza-varita-luna')}" alt=""></div><figcaption>luna lila</figcaption></figure>
  <ol>
    <li><i class="n">1</i><div><b>Escoges tu pieza</b><span>En las varitas: luna o estrella, y el color.</span></div></li>
    <li><i class="n">2</i><div><b>Separas con el 30 %</b><span>Por Yappy o transferencia, para cualquier pedido o set.</span></div></li>
    <li><i class="n">3</i><div><b>3 a 5 días</b><span>La coso y la decoro a mano, una por una.</span></div></li>
    <li><i class="n">4</i><div><b>Te la envío</b><span>A todo Panamá. El costo de envío te lo confirmo por WhatsApp según tu zona.</span></div></li>
  </ol>
  <div class="aviso"><b>¿Tienes dudas?</b>Escríbeme y te ayudo a escoger la forma y el color.</div>
  <div class="pie">{cta("Haz tu pedido por WhatsApp")}</div>
''', fondo="confeti")

# ── 6. Story: Pide antes del 15 de noviembre ──────────────────────────────
pieza("story-navidad", "Story · Pide antes del 15 de noviembre", "1080x1920", MED_CSS + '''
  .pieza { background: var(--anil); color: var(--crema); }
  .cordel { top: 250px; height: 240px; color: var(--crema); }
  /* los bombones se apagan detrás del titular para que se lea limpio */
  .pieza::before { -webkit-mask-image: linear-gradient(to bottom, #000 0 45%, rgba(0,0,0,.22) 49% 77%, #000 81%); mask-image: linear-gradient(to bottom, #000 0 45%, rgba(0,0,0,.22) 49% 77%, #000 81%); }
  h1 { position: absolute; left: 70px; right: 70px; top: 930px; font-family: var(--disp); font-weight: 400; font-size: 150px; line-height: .9; letter-spacing: -.02em; text-align: center; }
  h1 em { font-style: normal; color: var(--mango); }
  .sub { --placa: var(--anil); position: absolute; left: 90px; right: 90px; top: 1380px; text-align: center; font-size: 38px; font-weight: 600; line-height: 1.3; }
  .pie { position: absolute; left: 70px; right: 70px; bottom: 130px; display: flex; flex-direction: column; align-items: center; gap: 44px; }
''', f'''
  <svg class="cordel" viewBox="0 0 1080 240" fill="none" stroke="#FBF1E1" stroke-width="4"><path d="M-20 20 Q540 300 1100 20"/></svg>
  {medallon(10, 290, 300, 110, '#FFC53D', 'adorno-arbol-verde', -5)}
  {medallon(260, 380, 280, 120, '#F48FB1', 'adorno-galleta-jengibre', 3)}
  {medallon(520, 410, 300, 70, '#12A5A0', 'adorno-estrella-amarilla', -2)}
  {medallon(790, 350, 280, 110, '#F2711C', 'adorno-arbol-blanco', 4)}
  <h1>Pide antes del <em>15 de noviembre</em></h1>
  <p class="sub placa">Adornos de fieltro que coso a mano. Cada pieza me toma de 3 a 5 días.</p>
  <div class="pie">{cta("Haz tu pedido")}{lock(crema=True)}</div>
''', fondo="bombones")

# ── 7. Anatomía: la varita mágica ─────────────────────────────────────────
pieza("anatomia-varita", "Anatomía · La varita mágica", "1080x1350", '''
  .pieza { background: var(--crema); }
  .reticula { position: absolute; inset: 0; background-image: linear-gradient(rgba(30,26,60,.07) 2px, transparent 2px), linear-gradient(90deg, rgba(30,26,60,.07) 2px, transparent 2px); background-size: 60px 60px; }
  .cab { position: absolute; left: 64px; top: 196px; right: 64px; }
  .cab small { font-family: var(--mano); font-size: 34px; font-weight: 600; }
  .cab h1 { margin-top: 6px; font-family: var(--disp); font-weight: 400; font-size: 96px; line-height: 1; letter-spacing: -.02em; }
  .prod { position: absolute; left: 330px; top: 400px; width: 420px; height: 760px; border-radius: 36px; overflow: hidden; box-shadow: 0 0 0 4px var(--anil), 12px 14px 0 var(--lila-honda), 12px 14px 0 4px var(--anil); }
  .prod img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
  svg.lineas { position: absolute; inset: 0; width: 1080px; height: 1350px; }
  .et { position: absolute; width: 236px; }
  .et b { display: block; font-family: var(--disp); font-weight: 400; font-size: 38px; line-height: 1.02; }
  .et span { display: block; margin-top: 6px; font-size: 25px; line-height: 1.28; font-weight: 600; }
  .izq { left: 56px; text-align: left; } .der { right: 56px; text-align: right; }
  .pie { position: absolute; left: 64px; right: 64px; bottom: 44px; display: flex; justify-content: space-between; align-items: center; border-top: 3px solid rgba(30,26,60,.18); padding-top: 22px; }
  .pie .lock img { width: 70px; height: 70px; } .pie .lock b { font-size: 36px; } .pie .lock span { font-size: 22px; }
  .pie p { font-size: 28px; font-weight: 800; }
''', f'''
  <div class="reticula"></div>
  <div class="cab"><small>anatomía de una</small><h1>Varita mágica</h1></div>
  <div class="prod"><img src="{img('varita-luna-manta')}" alt=""></div>
  <svg class="lineas" viewBox="0 0 1080 1350" fill="none" stroke="#1E1A3C" stroke-width="3">
    <path d="M300 452 H380 L441 640"/><circle cx="441" cy="640" r="9" fill="#1E1A3C"/>
    <path d="M300 782 H400 L485 840"/><circle cx="485" cy="840" r="9" fill="#1E1A3C"/>
    <path d="M300 1032 H507"/><circle cx="507" cy="1032" r="9" fill="#1E1A3C"/>
    <path d="M780 452 H690 L583 557"/><circle cx="583" cy="557" r="9" fill="#1E1A3C"/>
    <path d="M780 702 H680 L598 786"/><circle cx="598" cy="786" r="9" fill="#1E1A3C"/>
    <path d="M780 952 H680 L519 758"/><circle cx="519" cy="758" r="9" fill="#1E1A3C"/>
  </svg>
  <div class="et izq" style="top: 430px"><b>Luna o estrella</b><span>Tú escoges la forma</span></div>
  <div class="et izq" style="top: 760px"><b>Cintas</b><span>Que vuelan cuando la mueven</span></div>
  <div class="et izq" style="top: 1010px"><b>Palito de madera</b><span>Para sostenerla con la mano</span></div>
  <div class="et der" style="top: 430px"><b>Bisutería</b><span>Perlitas y lentejuelas, como en la foto</span></div>
  <div class="et der" style="top: 680px"><b>Cosida a mano</b><span>La puntada se ve en el borde</span></div>
  <div class="et der" style="top: 930px"><b>El color que quieras</b><span>Lila, rosado, amarillo…</span></div>
  <div class="pie">{lock()}<p>Pídela por WhatsApp</p></div>
''')

# ── 8. Portada de revista ─────────────────────────────────────────────────
pieza("portada-navidad", "Portada · Navidad hecha a mano", "1080x1350", '''
  .pieza { background: var(--papel); --patron-opacidad: .75; }
  .foto { position: absolute; left: 0; right: 0; top: 430px; bottom: 0; }
  .foto img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 45%; }
  .velo { position: absolute; left: 0; right: 0; top: 430px; bottom: 0; background: linear-gradient(to bottom, rgba(30,26,60,0) 0, rgba(30,26,60,0) 38%, rgba(30,26,60,.88) 66%, rgba(30,26,60,.96) 100%); }
  .cabecera { position: absolute; left: 0; right: 0; top: 182px; text-align: center; font-family: var(--disp); font-weight: 400; font-size: 210px; line-height: .8; letter-spacing: -.035em; color: var(--mola); }
  .num { position: absolute; left: 60px; right: 60px; top: 368px; display: flex; justify-content: space-between; font-size: 26px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; border-top: 3px solid var(--anil); border-bottom: 3px solid var(--anil); padding: 10px 0; background: var(--papel); }
  .titular { position: absolute; left: 60px; right: 60px; bottom: 190px; color: var(--crema); }
  .titular h1 { font-family: var(--disp); font-weight: 400; font-size: 126px; line-height: .9; letter-spacing: -.02em; }
  .titular h1 em { font-style: normal; color: var(--mango); }
  .titular p { margin-top: 18px; font-size: 38px; font-weight: 700; }
  .lineas { position: absolute; left: 60px; right: 60px; bottom: 60px; display: flex; gap: 22px; }
  .lineas span { flex: 1; color: var(--crema); font-size: 25px; font-weight: 700; line-height: 1.25; border-top: 3px solid var(--mango); padding-top: 12px; }
  .sello-fecha { right: 50px; top: 470px; rotate: 9deg; }
  .sello-fecha b { font-size: 56px; }
''', f'''
  <div class="foto"><img src="{img('coleccion-fieltro')}" alt=""></div>
  <div class="velo"></div>
  <div class="cabecera">Elizabeth</div>
  <div class="num"><span>Edición de Navidad</span><span>Envío a todo Panamá</span></div>
  <div class="sello-fecha"><small>Pedidos hasta el</small><b>15 de nov.</b></div>
  <div class="titular"><h1>Navidad <em>hecha a mano</em></h1><p>Pedidos hasta el 15 de noviembre</p></div>
  <div class="lineas"><span>Varitas: luna o estrella</span><span>Bajo el mar, en fieltro</span><span>Yappy o transferencia</span></div>
''', fondo="bombones")

# ── 9. Imagen para compartir (og.jpg de la landing) ───────────────────────
pieza("og-landing", "OG · Imagen para compartir la página", "1200x630", '''
  .pieza { background: var(--crema); }
  h1 { position: absolute; left: 64px; top: 150px; width: 600px; font-family: var(--disp); font-weight: 400; font-size: 82px; line-height: .95; letter-spacing: -.02em; }
  p.s { --placa: var(--crema); position: absolute; left: 64px; top: 420px; width: 560px; font-size: 28px; font-weight: 700; line-height: 1.3; }
  .lock { position: absolute; left: 64px; top: 46px; } .lock img { width: 70px; height: 70px; } .lock b { font-size: 34px; } .lock span { font-size: 21px; }
  .polaroid { padding: 12px 12px 50px; width: 250px; height: 320px; }
  .polaroid figcaption { font-size: 24px; bottom: 8px; }
  .a { left: 660px; top: 90px; rotate: -6deg; } .b { left: 900px; top: 150px; rotate: 5deg; } .c { left: 760px; top: 290px; rotate: -1deg; z-index: 2; }
''', f'''
  {lock()}
  <h1>Adornos de fieltro cosidos a mano</h1>
  <p class="s placa">Envío a todo Panamá. Pedidos de Navidad hasta el 15 de noviembre.</p>
  <figure class="polaroid a"><div class="foto"><img src="{img('adorno-arbol-verde')}" alt=""></div><figcaption>arbolito</figcaption></figure>
  <figure class="polaroid b"><div class="foto"><img src="{img('adorno-sirenita')}" alt=""></div><figcaption>sirenita</figcaption></figure>
  <figure class="polaroid c"><div class="foto"><img src="{img('adorno-varita-luna')}" alt=""></div><figcaption>varita</figcaption></figure>
''', fondo="confeti")

# ── 10. Propuesta de logo ─────────────────────────────────────────────────
pieza("propuesta-logo", "Logo · Propuesta para Elizabeth Creations", "1080x1080", '''
  .pieza { background: var(--crema); }
  .cab { position: absolute; left: 64px; top: 56px; font-family: var(--mano); font-size: 32px; font-weight: 600; }
  .grande { position: absolute; left: 64px; top: 140px; display: flex; align-items: center; gap: 36px; }
  .grande img { width: 300px; height: 300px; }
  .grande b { font-family: var(--disp); font-weight: 400; font-size: 118px; line-height: .86; letter-spacing: -.02em; display: block; }
  .grande span { font-family: var(--mano); font-size: 40px; font-weight: 500; display: block; margin-top: 14px; }
  .fila { position: absolute; left: 64px; right: 64px; top: 560px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
  .fila div { aspect-ratio: 1; border-radius: 32px; display: grid; place-items: center; box-shadow: 0 0 0 3px var(--anil); }
  .fila img { width: 70%; }
  .nota { position: absolute; left: 64px; right: 64px; bottom: 60px; font-size: 27px; line-height: 1.4; font-weight: 500; }
  .nota b { font-weight: 800; }
''', '''
  <p class="cab">propuesta de logo · para revisar con Erika</p>
  <div class="grande"><img src="../../logo/sello-color.svg" alt=""><div><b>Elizabeth<br>Creations</b><span>Hecho a mano en Panamá</span></div></div>
  <div class="fila">
    <div style="background:#FFF9EF"><img src="../../logo/sello-color.svg" alt=""></div>
    <div style="background:#1E1A3C"><img src="../../logo/sello-crema-sobre-oscuro.svg" alt=""></div>
    <div style="background:#CDB9F2"><img src="../../logo/sello-lila.svg" alt=""></div>
    <div style="background:#FFF9EF"><img src="../../logo/sello-una-tinta.svg" alt="" style="color:#1E1A3C"></div>
  </div>
  <p class="nota"><b>La idea:</b> su estrella de fieltro, inflada, con la puntada a mano en el borde, tres piedritas de bisutería y el lazo del que cuelga. Funciona a color, sobre oscuro, en lila y en una sola tinta (sello de goma o etiqueta).</p>
''')
