# Arma index.html (vertical 1080×1920) y cuadrado.html (1080×1080) del
# tutorial "Cómo pedir en elizabethcreation.com". Un solo plano continuo: la
# cámara (#camara) viaja por un mundo donde vive el teléfono; dentro del
# teléfono, la página real (capturas de scripts/capturar.cjs) se desplaza y
# sus piezas se animan como capas. Nada de cortes.
#   node scripts/capturar.cjs && python3 generar.py && npx hyperframes check
import json, os

R = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(R, "assets/cap/datos.json")))
SELLO = open(os.path.join(R, "assets/sello-color.svg")).read().replace('<svg ', '<svg class="sello" ', 1)

# El mensaje de WhatsApp, tal cual lo arma la página, en párrafos.
mensaje = D["mensaje"].split("\n")

FORMATOS = {
    "index.html": dict(
        W=1080, H=1920, K=1.0, DUR=39.0,
        # teléfono (mundo = lienzo con la cámara en reposo)
        PX=249, PY=330, PW=582, BZ=14,
        foco=[540, 985], fillChat=0.5, focoChat=[540, 1150],
        paso=dict(top=192, left=None, ancho=None, fs=44),
        nota=dict(top=1440, fs=42),
        gancho=dict(estrella=380, estrellaY=170, hilo=150, textoTop=930, fs=168),
        cierre=dict(estrella=300, hilo=110, textoTop=560, fs=74, cam=[0.72, 151, 842], giro=-7),
    ),
    "cuadrado.html": dict(
        W=1080, H=1080, K=0.64, DUR=25.0,
        PX=610, PY=66, PW=420, BZ=12,
        foco=[620, 590], focoBarra=[600, 650], focoCaja=[640, 520], focoChat=[640, 760], fillChat=0.56, fillCaja=0.7,
        paso=dict(top=70, left=56, ancho=500, fs=34),
        nota=dict(top=850, fs=30, left=40, ancho=470),
        gancho=dict(estrella=250, estrellaY=40, hilo=60, textoTop=470, fs=118),
        cierre=dict(estrella=170, hilo=40, textoTop=330, fs=46, cam=[0.62, 262, 620], giro=-8, cx=330, ancho=600),
    ),
}

CSS = r'''
@font-face { font-family: "Caprasimo"; src: url("assets/fuentes/caprasimo-latin.woff2") format("woff2"); font-display: block; }
@font-face { font-family: "Figtree"; src: url("assets/fuentes/figtree-latin-variable.woff2") format("woff2"); font-weight: 300 900; font-display: block; }
@font-face { font-family: "Shantell Sans"; src: url("assets/fuentes/shantell-sans-latin-variable.woff2") format("woff2"); font-weight: 300 800; font-display: block; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { margin: 0; width: __W__px; height: __H__px; overflow: hidden; background: #F7E7CF; }
#root { position: relative; width: 100%; height: 100%; overflow: hidden; font-family: "Figtree", sans-serif; color: #1E1A3C; }
#escena { position: absolute; inset: 0; overflow: hidden; }
.disp { font-family: "Caprasimo", Georgia, serif; font-weight: 400; letter-spacing: -0.01em; }
.mano { font-family: "Shantell Sans", sans-serif; font-weight: 600; }

/* Fondo: crema con bolitas y florecitas blancas, nunca liso. */
#fondo { position: absolute; left: -20%; top: -20%; width: 140%; height: 140%; background-color: #F7E7CF;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cg fill='%23FFFFFF' fill-opacity='.9'%3E%3Cg transform='translate(48 52)'%3E%3Ccircle cx='0' cy='-9' r='7'/%3E%3Ccircle cx='8.6' cy='-2.8' r='7'/%3E%3Ccircle cx='5.3' cy='7.3' r='7'/%3E%3Ccircle cx='-5.3' cy='7.3' r='7'/%3E%3Ccircle cx='-8.6' cy='-2.8' r='7'/%3E%3C/g%3E%3Cg transform='translate(160 150) scale(.7)'%3E%3Ccircle cx='0' cy='-9' r='7'/%3E%3Ccircle cx='8.6' cy='-2.8' r='7'/%3E%3Ccircle cx='5.3' cy='7.3' r='7'/%3E%3Ccircle cx='-5.3' cy='7.3' r='7'/%3E%3Ccircle cx='-8.6' cy='-2.8' r='7'/%3E%3C/g%3E%3Ccircle cx='140' cy='40' r='6'/%3E%3Ccircle cx='60' cy='170' r='5'/%3E%3Ccircle cx='200' cy='96' r='4'/%3E%3Ccircle cx='110' cy='110' r='3.5'/%3E%3C/g%3E%3Cg fill='%23FFC53D'%3E%3Ccircle cx='48' cy='52' r='3.4'/%3E%3Ccircle cx='160' cy='150' r='2.6'/%3E%3C/g%3E%3C/svg%3E"),
    radial-gradient(circle, rgba(255,255,255,.75) 3px, transparent 3.6px);
  background-size: 220px 220px, 56px 56px; background-position: 0 0, 18px 30px; }

#camara { position: absolute; left: 0; top: 0; width: __W__px; height: __H__px; transform-origin: 0 0; }
#cable { position: absolute; left: 0; width: __W__px; height: 6px; top: 0; background: #A29A9F; border-radius: 3px; transform-origin: 50% 50%; opacity: 0; }

/* El teléfono */
#telefono { position: absolute; left: __PX__px; top: __PY__px; width: __PW__px; height: __PH__px; border-radius: __RAD__px; background: #1E1A3C;
  box-shadow: 0 0 0 3px #1E1A3C, 22px 26px 0 #D3253C, 22px 26px 0 3px #1E1A3C; transform-origin: 50% 50%; }
#pantalla { position: absolute; left: __BZ__px; top: __BZ__px; width: __SW__px; height: __SH__px; border-radius: __RADI__px; overflow: hidden; background: #FBF1E1; }
#lienzo { position: absolute; left: 0; top: 0; width: 390px; height: 898px; transform: scale(__S__); transform-origin: 0 0; }
#cromo { position: absolute; left: 0; top: 0; width: 390px; height: 54px; background: #FBF1E1; border-bottom: 1px solid rgba(30,26,60,.12); }
#cromo .hora { position: absolute; left: 22px; top: 6px; font-size: 11px; font-weight: 700; }
#cromo .bat { position: absolute; right: 22px; top: 8px; width: 20px; height: 9px; border: 1.5px solid #1E1A3C; border-radius: 3px; }
#cromo .bat::after { content: ""; position: absolute; left: 1.5px; top: 1.5px; width: 11px; height: 3px; background: #1E1A3C; border-radius: 1px; }
#url { position: absolute; left: 16px; right: 16px; top: 22px; height: 26px; border-radius: 13px; background: #EFE0C6; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 600; color: #1E1A3C; }
#url .candado { width: 9px; height: 8px; border-radius: 2px; background: #1E1A3C; position: relative; top: 1px; }
#url .candado::before { content: ""; position: absolute; left: 1.5px; top: -5px; width: 6px; height: 6px; border: 1.5px solid #1E1A3C; border-bottom: 0; border-radius: 4px 4px 0 0; box-sizing: border-box; }
#url .letras { display: block; white-space: nowrap; overflow: hidden; width: 0; }
#url .cursor { width: 1.5px; height: 14px; background: #D3253C; }

#vista { position: absolute; left: 0; top: 54px; width: 390px; height: 844px; overflow: hidden; background: #CDB9F2; }
#pagina { position: absolute; left: 0; top: 0; width: 390px; height: __PAGALTO__px; }
#pagina > img, .capa { position: absolute; display: block; }
#tira { position: absolute; left: 0; width: 2000px; height: 720px; }
.colgada { position: absolute; }
.colgada img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: block; }
#isla { position: absolute; left: 0; top: 0; width: 390px; height: 72px; }

/* Lo que se le dibuja encima a la página */
.ovalo { position: absolute; overflow: visible; }
.ovalo path, .puntada path, .puntada rect { fill: none; stroke: #D3253C; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 0.1 9; }
.puntada { position: absolute; overflow: visible; }
.etiqueta { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 8px; padding: 6px 14px 6px 10px; border-radius: 10px; background: #FFC53D; color: #1E1A3C;
  box-shadow: 0 0 0 2px #1E1A3C, 4px 5px 0 #1E1A3C; font-size: 26px; white-space: nowrap; opacity: 0; }
.etiqueta i { width: 9px; height: 9px; border-radius: 50%; background: #FBF1E1; box-shadow: 0 0 0 2px #1E1A3C; }
#contador { position: absolute; left: 0; top: 0; padding: 6px 12px 7px; border-radius: 12px; background: #FBF1E1; box-shadow: 0 0 0 2px #1E1A3C, 4px 5px 0 #D3253C; opacity: 0; white-space: nowrap; }
#contador small { display: block; font-family: "Shantell Sans", sans-serif; font-weight: 600; font-size: 12px; color: #D3253C; }
#contador b { font-family: "Caprasimo", serif; font-weight: 400; font-size: 30px; line-height: 1; }
.check { position: absolute; width: 74px; height: 74px; overflow: visible; }
#puntada { clip-path: inset(0% 0% 100% 0%); }
#puntada rect { stroke-width: 4; stroke-dasharray: 0.1 10; }
#gancho .renglon, #gancho-nota, #cierre .pide, #cierre .web, #cierre .ig { opacity: 0; }
#cierre .web, #cierre .pide { white-space: nowrap; }

/* El dedo: un círculo suave con su onda */
#dedo { position: absolute; left: -23px; top: -23px; width: 46px; height: 46px; opacity: 0; }
#dedo .yema { position: absolute; inset: 0; border-radius: 50%; background: rgba(255,255,255,.45); box-shadow: inset 0 0 0 3px rgba(30,26,60,.55), 0 8px 18px rgba(30,26,60,.28); }
#dedo .onda { position: absolute; inset: -4px; border-radius: 50%; border: 3px solid #FFC53D; opacity: 0; }

/* La ventanita del abono */
#velo { position: absolute; inset: 0; background: rgba(30,26,60,.55); opacity: 0; }
#caja { opacity: 0; transform-origin: 50% 50%; }

/* WhatsApp (maqueta) */
#chat { position: absolute; left: 0; top: 0; width: 390px; height: 898px; pointer-events: none; }
#wa-fondo { position: absolute; inset: 0; background-color: #EFE7DD; opacity: 0;
  background-image: radial-gradient(circle, rgba(30,26,60,.07) 1.6px, transparent 2px), radial-gradient(circle, rgba(18,165,160,.08) 2.4px, transparent 3px);
  background-size: 26px 26px, 61px 61px; background-position: 0 0, 13px 20px; }
#wa-cab { position: absolute; left: 0; top: 0; width: 390px; height: 112px; background: #0B6E5F; color: #fff; }
#wa-cab .hora { position: absolute; left: 22px; top: 6px; font-size: 11px; font-weight: 700; }
#wa-cab .atras { position: absolute; left: 12px; top: 70px; width: 12px; height: 12px; border-left: 2.5px solid #fff; border-bottom: 2.5px solid #fff; transform: rotate(45deg); }
#wa-cab .avatar { position: absolute; left: 34px; top: 56px; width: 42px; height: 42px; border-radius: 50%; background: #FBF1E1; display: grid; place-items: center; }
#wa-cab .avatar svg { width: 34px; height: 34px; }
#wa-cab .nombre { position: absolute; left: 86px; top: 62px; font-size: 17px; font-weight: 700; }
#wa-cab .sub { position: absolute; left: 86px; top: 83px; font-size: 12px; }
#wa-pie { position: absolute; left: 0; bottom: 0; width: 390px; height: 64px; display: flex; align-items: center; gap: 8px; padding: 0 10px 8px; }
#wa-pie .campo { flex: 1; height: 44px; border-radius: 22px; background: #fff; box-shadow: 0 1px 1px rgba(0,0,0,.12); padding: 0 18px; display: flex; align-items: center; color: #5F5B69; font-size: 15px; }
#wa-pie .enviar { width: 44px; height: 44px; border-radius: 50%; background: #0B6E5F; display: grid; place-items: center; }
#wa-pie .enviar i { width: 0; height: 0; border-left: 15px solid #fff; border-top: 9px solid transparent; border-bottom: 9px solid transparent; margin-left: 4px; }
#wa-fecha { position: absolute; left: 50%; top: 124px; width: 64px; margin-left: -32px; text-align: center; padding: 4px 0; border-radius: 8px; background: #FFFFFF; font-size: 11px; font-weight: 600; color: #54656F; box-shadow: 0 1px 1px rgba(0,0,0,.1); opacity: 0; }
#burbuja { position: absolute; left: 0; top: 0; width: 100px; height: 100px; border-radius: 24px; background: #FFF9EF; opacity: 0;
  box-shadow: 0 0 0 1.5px #1E1A3C, 7px 8px 0 #FFC53D, 7px 8px 0 1.5px #1E1A3C; overflow: hidden; }
#texto { position: absolute; left: 0; top: 0; width: 300px; padding: 9px 11px 22px; font-size: 14.2px; line-height: 1.36; color: #111B21; }
#texto p { opacity: 0; }
#texto p + p { margin-top: 3px; }
#texto p.aire { margin-top: 12px; }
#texto .marca { position: absolute; right: 9px; bottom: 6px; font-size: 10.5px; color: #3F4D55; display: flex; gap: 4px; align-items: center; opacity: 0; }
#texto .marca b { color: #0B6290; font-weight: 800; letter-spacing: -3px; font-size: 12px; }

/* La estrella que cuelga (gancho y cierre) */
#colgante { position: absolute; left: 0; top: 0; transform-origin: 50% 0; }
#colgante .hilo { position: absolute; left: 50%; top: 0; width: 0; border-left: 6px dotted #D3253C; transform-origin: 50% 0; }
#estrella { position: absolute; left: 0; transform-origin: 50% 9%; }
#estrella .sello { display: block; width: 100%; height: 100%; }

/* Textos sobre la cámara */
.titular { position: absolute; left: 0; width: 100%; text-align: center; color: #1E1A3C; line-height: 0.98; }
.titular .rojo { color: #D3253C; }
.renglon { display: block; }
#gancho-nota { position: absolute; left: 0; width: 100%; text-align: center; font-size: __NOTAFS__px; color: #D3253C; }

#paso { position: absolute; display: flex; align-items: center; gap: 18px; padding: 14px 30px 14px 14px; border-radius: 999px; background: #FBF1E1;
  box-shadow: 0 0 0 3px #1E1A3C, 8px 9px 0 #1E1A3C; opacity: 0; transform-origin: 50% 50%; }
#paso .num { position: relative; overflow: hidden; flex: none; width: __NUM__px; height: __NUM__px; border-radius: 50%; background: #D3253C; color: #FBF1E1; display: grid; place-items: center; font-size: __NUMFS__px; line-height: 1; }
#paso .num span { position: absolute; inset: 0; display: grid; place-items: center; padding-bottom: 4px; }
#paso .txt { position: relative; overflow: hidden; height: __TXTH__px; flex: 1; }
#paso .txt span { position: absolute; left: 0; top: 0; white-space: nowrap; font-weight: 800; font-size: __PASOFS__px; line-height: __TXTH__px; letter-spacing: -0.01em; }
#paso .costura { position: absolute; inset: 6px; border-radius: 999px; border: 3px dashed #D3253C; opacity: .85; clip-path: inset(0 100% 0 0); }

#nota { position: absolute; left: 50%; padding: 18px 30px 20px; border-radius: 26px; background: #FBF1E1; text-align: center; opacity: 0;
  box-shadow: 0 0 0 3px #1E1A3C, 8px 9px 0 #FFC53D, 8px 9px 0 3px #1E1A3C; }
#nota .l1 { display: block; white-space: __NOWRAP__; font-size: __NOTA1__px; line-height: 1.12; }
#nota .l2 { display: block; margin-top: 6px; font-size: __NOTA2__px; color: #D3253C; }

#cierre { position: absolute; left: 0; width: 100%; text-align: center; }
#cierre .pide { display: block; font-size: __C1__px; color: #D3253C; }
#cierre .web { display: block; font-size: __C2__px; line-height: 1.05; margin-top: 6px; }
#cierre .ig { display: inline-block; margin-top: 26px; padding: 12px 30px 14px; border-radius: 999px; background: #1E1A3C; color: #FBF1E1; font-weight: 800; font-size: __C3__px; box-shadow: 6px 7px 0 #FFC53D; }
'''


def pagina_html():
    t = D["tira"]
    partes = []
    partes.append('<img src="assets/cap/pagina.png" alt="" style="left:0;top:0;width:390px;height:%.2fpx">' % (D["temporada"]["top"] + D["temporada"]["h"]))
    v = D["varitas"]
    partes.append('<img src="assets/cap/varitas.png" alt="" style="left:0;top:%.2fpx;width:390px;height:%.2fpx">' % (v["top"], v["fin"] - v["top"]))

    def capa(nombre, id_, extra=""):
        c = D[nombre]
        return ('<img class="capa" id="%s" src="assets/cap/%s.png" alt="" style="left:%.2fpx;top:%.2fpx;width:%.2fpx;height:%.2fpx;%s">'
                % (id_, nombre, c["x"], c["y"], c["w"], c["h"], extra))

    # Las tarjetas que cuelgan del cordel: cada una en su lugar de la tira.
    tarj = []
    for l in D["tarjetas"][:6]:
        c = D["tarjeta-%d" % l["i"]]
        x = t["left"] + l["x"] - c["ox"]
        y = l["y"] - c["oy"]
        ox, oy = c["ox"] + l["w"] / 2, c["oy"] + 4  # la pinza: arriba al centro
        imgs = '<img src="assets/cap/tarjeta-%d.png" alt="" class="antes">' % l["i"]
        if os.path.exists(os.path.join(R, "assets/cap/tarjeta-%d-elegida.png" % l["i"])):
            imgs += '<img src="assets/cap/tarjeta-%d-elegida.png" alt="" class="elegida" style="opacity:0">' % l["i"]
        if l["i"] == 0:
            b = D["botonSet"]
            bx, by = c["ox"] + b["x"], c["oy"] + b["y"]
            imgs += ('<div id="hundido" style="position:absolute;left:%.2fpx;top:%.2fpx;width:%.2fpx;height:%.2fpx;border-radius:999px;opacity:0;'
                     'background:url(assets/cap/tarjeta-0.png) -%.2fpx -%.2fpx / %.2fpx %.2fpx no-repeat;transform-origin:50%% 50%%"></div>'
                     % (bx, by, b["w"], b["h"], bx, by, c["w"], c["h"]))
            imgs += ('<svg class="puntada" id="puntada" style="left:%.2fpx;top:%.2fpx" width="%.2f" height="%.2f"><rect x="2" y="2" width="%.2f" height="%.2f" rx="24"/></svg>'
                     % (c["ox"] - 12, c["oy"] - 12, l["w"] + 24, l["h"] + 24, l["w"] + 20, l["h"] + 20))
            imgs += ('<svg class="check" id="check" viewBox="0 0 100 100" style="left:%.2fpx;top:%.2fpx;opacity:0">'
                     '<polygon points="50,6 63,36 95,39 70,61 78,93 50,76 22,93 30,61 5,39 37,36" fill="#FFC53D" stroke="#1E1A3C" stroke-width="6" stroke-linejoin="round"/>'
                     '<polygon points="50,20 59,41 81,43 64,58 69,80 50,68 31,80 36,58 19,43 41,41" fill="none" stroke="#D3253C" stroke-width="3" stroke-dasharray="0.1 6" stroke-linecap="round"/>'
                     '<path d="M35 52 L46 63 L67 40" fill="none" stroke="#1E1A3C" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                     % (c["ox"] + l["w"] - 52, c["oy"] + 250))
        tarj.append('<div class="colgada" id="t%d" style="left:%.2fpx;top:%.2fpx;width:%.2fpx;height:%.2fpx;transform-origin:%.2fpx %.2fpx">%s</div>'
                    % (l["i"], x, y, c["w"], c["h"], ox, oy, imgs))
    partes.append('<div id="tira" data-layout-allow-overflow style="top:%.2fpx">%s</div>' % (t["top"], "".join(tarj)))

    # El óvalo cosido alrededor de los precios de "Las piezas".
    ta = D["tarifa"]
    partes.append('<svg class="ovalo" id="ovalo" style="left:%.1fpx;top:%.1fpx" width="%.1f" height="%.1f" viewBox="0 0 %.1f %.1f">'
                  '<path pathLength="1" d="M %.1f %.1f C %.1f %.1f, %.1f %.1f, %.1f %.1f C %.1f %.1f, %.1f %.1f, %.1f %.1f"/></svg>'
                  % (ta["x"] - 14, ta["y"] - 16, ta["w"] + 28, ta["h"] + 32, ta["w"] + 28, ta["h"] + 32,
                     (ta["w"] + 28) * 0.5, 3,
                     ta["w"] + 34, 0, ta["w"] + 34, ta["h"] + 34, (ta["w"] + 28) * 0.5, ta["h"] + 29,
                     -8, ta["h"] + 34, -6, -2, (ta["w"] + 28) * 0.55, 5))
    # Las varitas: lo que cambia al tocar.
    partes.append(capa("varitas-formas", "v-formas", "opacity:0"))
    partes.append(capa("varitas-colores", "v-colores", "opacity:0"))
    partes.append(capa("varitas-armado", "v-armado", "opacity:0"))
    partes.append(capa("varitas-armado-agregado", "v-agregado", "opacity:0"))
    # El resumen vacío, en su lugar debajo de la tira.
    partes.append(capa("resumen-vacio", "r-vacio"))
    return "\n        ".join(partes)


def css_de(F):
    W, H = F["W"], F["H"]
    S = (F["PW"] - 2 * F["BZ"]) / 390
    SW, SH = 390 * S, 898 * S
    PH = SH + 2 * F["BZ"]
    css = CSS.replace('url("assets/', 'url("')  # la hoja vive en assets/
    pf = F["paso"]["fs"]
    reemplazos = {
        "__W__": W, "__H__": H, "__PX__": F["PX"], "__PY__": F["PY"], "__PW__": F["PW"], "__PH__": "%.2f" % PH,
        "__BZ__": F["BZ"], "__SW__": "%.2f" % SW, "__SH__": "%.2f" % SH, "__S__": "%.5f" % S,
        "__RAD__": round(F["PW"] * 0.11), "__RADI__": round(F["PW"] * 0.11 - F["BZ"]),
        "__NUM__": round(pf * 1.75), "__NUMFS__": round(pf * 1.05), "__PASOFS__": pf, "__TXTH__": round(pf * 1.3),
        "__NOTAFS__": round(F["gancho"]["fs"] * 0.3),
        "__PAGALTO__": "%.0f" % D["varitas"]["fin"], "__NOTA1__": F["nota"]["fs"], "__NOWRAP__": "normal" if F["nota"].get("left") is not None else "nowrap", "__NOTA2__": round(F["nota"]["fs"] * 0.92),
        "__C1__": round(F["cierre"]["fs"] * 0.62), "__C2__": F["cierre"]["fs"], "__C3__": round(F["cierre"]["fs"] * 0.55),
    }
    for k, v in reemplazos.items():
        css = css.replace(k, str(v))
    return css


def html(nombre, F, base):
    W, H, K = F["W"], F["H"], F["K"]
    S = (F["PW"] - 2 * F["BZ"]) / 390
    SW, SH = 390 * S, 898 * S
    PH = SH + 2 * F["BZ"]

    g, c = F["gancho"], F["cierre"]
    textos = "".join('<p%s data-layout-allow-overlap data-layout-allow-occlusion>%s</p>' % (' class="aire"' if (i > 0 and mensaje[i - 1] == "") else "", p)
                     for i, p in enumerate(mensaje) if p != "")
    # Datos para el JS (geometría capturada + formato).
    cfg = dict(F, S=S, PH=PH, SW=SW, SH=SH, datos={k: D[k] for k in [
        "tira", "tarifa", "varitas", "rects", "botonSet", "totalRect", "enviarRect", "entendidoRect",
        "cajaViewport", "resumen-set", "resumen-vacio", "tarjeta-0", "abono-caja"]},
        tarjeta0=D["tarjetas"][0])

    paso_estilo = ("left:50%%;top:%dpx" % F["paso"]["top"]) if F["paso"]["left"] is None else \
        ("left:%dpx;top:%dpx;width:%dpx" % (F["paso"]["left"], F["paso"]["top"], F["paso"]["ancho"]))

    return f'''<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <title>Cómo pedir en elizabethcreation.com</title>
    <script src="assets/gsap.min.js"></script>
    <link rel="stylesheet" href="assets/{base}.css" />
  </head>
  <body>
    <!-- Tutorial "Cómo pedir" de Elizabeth Creations: una sola toma, sin cortes. Generado por generar.py. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="{F["DUR"]}" data-width="{W}" data-height="{H}">
      <div id="fondo"></div>
      <div id="camara">
        <div id="cable"></div>
        <div id="telefono">
          <div id="pantalla">
            <div id="lienzo">
              <div id="cromo" data-layout-allow-overlap data-layout-allow-occlusion><span class="hora" data-layout-allow-overlap data-layout-allow-occlusion>9:41</span><span class="bat"></span>
                <div id="url"><span class="candado"></span><span class="letras">elizabethcreation.com</span><span class="cursor"></span></div></div>
              <div id="vista">
                <div id="pagina" data-layout-allow-overflow>
        {pagina_html()}
                </div>
                <div id="barra" style="position:absolute;left:0;top:0;width:390px;height:{D["resumen-set"]["h"]:.2f}px;opacity:0">
                  <img src="assets/cap/resumen-set.png" alt="" id="b-set" style="position:absolute;left:0;top:0;width:390px">
                  <img src="assets/cap/resumen-varita.png" alt="" id="b-varita" style="position:absolute;left:0;top:0;width:390px;opacity:0">
                </div>
                <img id="isla" src="assets/cap/isla.png" alt="">
                <div class="etiqueta disp" id="tag15"><i></i>+ $15.00</div>
                <div class="etiqueta disp" id="tag250"><i></i>+ $2.50</div>
                <div id="contador" data-layout-allow-overlap><small data-layout-allow-overlap data-layout-allow-occlusion>Total</small><b data-layout-allow-overlap data-layout-allow-occlusion>$15.00</b></div>
                <div id="velo"></div>
                <img id="caja" class="capa" src="assets/cap/abono-caja.png" alt="">
              </div>
              <div id="chat" data-layout-allow-overlap data-layout-allow-occlusion>
                <div id="wa-fondo"></div>
                <div id="wa-fecha">Hoy</div>
                <div id="burbuja"><div id="texto">{textos}<span class="marca" data-layout-allow-overlap data-layout-allow-occlusion>9:42 <b>✓✓</b></span></div></div>
                <div id="wa-cab"><span class="hora" data-layout-allow-overlap data-layout-allow-occlusion>9:42</span><i class="atras"></i><span class="avatar">{SELLO}</span>
                  <span class="nombre" data-layout-allow-overlap data-layout-allow-occlusion>Elizabeth Creations</span><span class="sub" data-layout-allow-overlap data-layout-allow-occlusion>Cuenta de empresa</span></div>
                <div id="wa-pie"><span class="campo" data-layout-allow-overlap data-layout-allow-occlusion>Mensaje</span><span class="enviar"><i></i></span></div>
              </div>
              <div id="dedo"><div class="onda"></div><div class="yema"></div></div>
            </div>
          </div>
        </div>
      </div>

      <div id="colgante" style="width:{g["estrella"]}px"><i class="hilo"></i><div id="estrella" style="width:{g["estrella"]}px;height:{g["estrella"]}px">{SELLO}</div></div>
      <h1 class="titular disp" id="gancho" style="top:{g["textoTop"]}px;font-size:{g["fs"]}px"><span class="renglon">¿Cómo pido</span><span class="renglon">mi <span class="rojo">adorno</span>?</span></h1>
      <p id="gancho-nota" class="mano" style="top:{g["textoTop"] + g["fs"] * 2.15:.0f}px">en 4 pasos, desde tu celular</p>

      <div id="paso" data-layout-allow-overlap data-layout-allow-occlusion style="{paso_estilo}"><i class="costura"></i><span class="num disp"></span><span class="txt"></span></div>
      <div id="nota" class="mano" style="top:{F["nota"]["top"]}px{(";left:%dpx;width:%dpx" % (F["nota"]["left"], F["nota"]["ancho"])) if F["nota"].get("left") is not None else ""}"><span class="l1">30 % de abono en sets, piezas y guirnaldas</span><span class="l2">· las varitas no llevan ·</span></div>

      <div id="cierre" style="top:{c["textoTop"]}px"><span class="pide mano">Pide en</span><span class="web disp">elizabethcreation.com</span><span class="ig">@elizabeth_creationspty</span></div>
    </div>
    <script>
    window.CFG = {json.dumps(cfg)};
    </script>
    <script src="assets/tutorial.js"></script>
    <script>
      // Se arma cuando cargan las fuentes (mide textos) y sólo entonces se registra.
      document.fonts.ready.then(() => {{ window.__timelines["main"] = window.construirTutorial(); }});
    </script>
  </body>
</html>
'''


for nombre, F in FORMATOS.items():
    # Cada formato es su propio proyecto (un solo index.html por proyecto);
    # el cuadrado vive en cuadrado/ y comparte assets/ por enlace.
    carpeta = R if nombre == "index.html" else os.path.join(R, "cuadrado")
    base = "vertical" if nombre == "index.html" else "cuadrado"
    os.makedirs(carpeta, exist_ok=True)
    open(os.path.join(carpeta, "index.html"), "w").write(html(nombre, F, base))
    open(os.path.join(R, "assets", base + ".css"), "w").write(css_de(F))
    if carpeta != R:
        enlace = os.path.join(carpeta, "assets")
        if not os.path.exists(enlace):
            os.symlink("../assets", enlace)
    print("escrito", carpeta, base)
