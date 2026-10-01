#!/usr/bin/env python3
"""La letra de las notas a mano (Shantell Sans), recortada a lo que usa la página.

El "Bienvenidos a" del hero va en Shantell Sans: la fuente se pide en el
primer pantallazo y compite por la red con las fotos del tendedero. La de
@fontsource trae el eje de peso entero (300 a 800) y alternativas de números
(fracciones, tabulares) que la página no usa. Aquí se deja:

  · el peso de 400 a 600, que es lo único que se usa (400 en las etiquetas,
    500 en las notas, 600 en el saludo y las cejas): sigue siendo variable;
  · latín básico y Latin-1 (tildes, ñ, ¿, ¡, «, », ×, ·) más las comillas,
    rayas, puntos suspensivos, flechas y el signo menos;
  · las funciones tipográficas que se ven sin pedirlas (kern, liga, rlig,
    ccmp, locl, mark, mkmk).

Resultado: ~64 KB en vez de ~79 KB, misma letra. Si mañana una nota a mano
usa otro peso u otro signo, se agrega aquí y se vuelve a correr:

    python3 scripts/recortar-fuente-mano.py
"""
from io import BytesIO
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "node_modules/@fontsource-variable/shantell-sans/files/shantell-sans-latin-wght-normal.woff2"
DESTINO = RAIZ / "src/assets/fuentes/shantell-sans-latin-variable.woff2"

PESOS = (400, 600)
SIGNOS = (
    list(range(0x20, 0x7F))            # latín básico
    + list(range(0xA0, 0x100))         # Latin-1: tildes, ñ, ¿, ¡, «, », ×, ·
    + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026,  # – — ‘ ’ “ ” …
       0x2190, 0x2192, 0x2212]         # ← → −
)
FUNCIONES = ["kern", "liga", "rlig", "ccmp", "locl", "mark", "mkmk"]

# Se guarda y se vuelve a abrir entre un paso y otro: la fuente recién
# instanciada guarda tablas a medio armar que el recorte no sabe leer.
intermedio = BytesIO()
instancer.instantiateVariableFont(TTFont(ORIGEN), {"wght": PESOS}).save(intermedio)
intermedio.seek(0)
fuente = TTFont(intermedio)
opciones = subset.Options()
opciones.flavor = "woff2"
opciones.layout_features = FUNCIONES
recorte = subset.Subsetter(opciones)
recorte.populate(unicodes=SIGNOS)
recorte.subset(fuente)
fuente.flavor = "woff2"
fuente.save(DESTINO)
print(f"{DESTINO.relative_to(RAIZ)}: {DESTINO.stat().st_size / 1024:.1f} KB")
