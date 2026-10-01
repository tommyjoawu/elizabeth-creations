> **Histórico (30-09-2026).** La página ya usa las fotos y videos reales de Erika
> (`docs/material-erika/` → `scripts/procesar-material.sh` → `src/assets/img/` y
> `public/video/`). Las fotos de muestra de abajo se movieron a `docs/fotos-de-muestra/`
> y ya no se publican; este archivo queda como registro de sus licencias.

# Fotos de muestra — erika-landing

Fotos **provisorias** hasta que Erika entregue las suyas. Todas vienen de Unsplash o Pexels,
cuyas licencias permiten uso comercial **sin atribución obligatoria** (el crédito es opcional
pero se agradece; no se pueden revender las fotos tal cual ni usarlas para insinuar que el
fotógrafo o las personas avalan la marca). Cada foto se revisó a ojo: colorida, luminosa,
con pinta de hecha a mano, sin logos ni texto legible y sin caras como sujeto principal.

- Revisión rápida del set: [`assets-contact-sheet.png`](./assets-contact-sheet.png)
- Archivos: `src/assets/img/` — WebP calidad 78, sin metadatos, sin agrandar nunca.
  Hero en 960 y 1920 px de ancho; el resto en 800 y 1600 px.
- Conteo: 3 hero · 6 categorías · 4 proceso · 6 galería
  = 19 fotos, 38 archivos, **4.95 MB** en total.
- LQIP: WebP de 24 px de ancho, levemente desenfocado, en base64 listo para `background-image`
  o `src` inicial (escalarlo con `filter: blur()` en CSS para suavizarlo).
- Colores: el primero es el tono de base más frecuente; los otros dos, los acentos vivos
  más presentes (útiles para fondos de carga o para armonizar la paleta).

Uso sugerido:

```html
<img src="…/cat-fieltro-800.webp"
     srcset="…/cat-fieltro-800.webp 800w, …/cat-fieltro-1600.webp 1600w"
     sizes="(min-width: 64rem) 33vw, 100vw" width="800" height="1204"
     alt="…" loading="lazy" decoding="async">
```

## Fotos

| slug | rol | alt sugerido | colores | salidas (intrínseco) | fuente | autor | licencia | LQIP |
|---|---|---|---|---|---|---|---|---|
| `hero-papel-picado` | hero | Guirnaldas de papel picado en degradé (turquesa, amarillo, naranja, rojo y lila) colgadas en espiral del techo. | `#090202` `#a8302d` `#c5532a` | `hero-papel-picado-960.webp` 960×686 (138 KB)<br>`hero-papel-picado-1920.webp` 1920×1371 (330 KB) | [página](https://unsplash.com/photos/colorful-paper-decorations-hanging-in-a-spiral-pattern-r705X1QJpx0) | Kris Tian | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAABQBQCdASoYABEAPu1qsFAppiSiqAqpMB2JbACdMoR/UBLLOuo6107hEMJDRoTS1WPiOWAA/u6hOxUFu0UDi5FHfHVNxeg7kfs6/FTa/VAxGAbPxRwkcqVoZeSsOfPbpplefpQibsxPkeJHlCNuMxDrnb/hOp7qa90KE6mcBZcv8elEkWCHnoSKmGpJtSLfuAA=` |
| `hero-fieltro-colgante` | hero | Colgantes de fieltro hechos a mano: corazones, espirales y bolitas de colores ensartadas en hilos. | `#1c130f` `#a8242d` `#db3646` | `hero-fieltro-colgante-960.webp` 960×640 (43 KB)<br>`hero-fieltro-colgante-1920.webp` 1920×1280 (104 KB) | [página](https://www.pexels.com/photo/selective-focus-photography-of-assorted-color-hanging-decor-lot-764690/) | Rebecca Zaal | [Pexels](https://www.pexels.com/license/) | `data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAABQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JagCdMoADgnNUnrErkjMr3uyAAP4ve0xrmekHNbIJCn7UofvbUDDbCGDrSKwVVuwg/NjorlfmVqDXtrHNeWHxYtNPFoxF1qi3MdBH+EgvoAIvJXacPdT3qlE1Bs6vh/zxAlHgG3tLCOAA` |
| `hero-esferas-pintadas` | hero | Esferas pintadas a mano con puntos y flores de colores, colgando frente a un fondo desenfocado. | `#aea9a2` `#f09f27` `#af4930` | `hero-esferas-pintadas-960.webp` 960×640 (46 KB)<br>`hero-esferas-pintadas-1920.webp` 1920×1280 (167 KB) | [página](https://unsplash.com/photos/red-yellow-and-green-baubles-Qd4Xf4nLnc0) | Ruqya Khan | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAABwBACdASoYABAAPu1iqU2ppaOiMAgBMB2JbACdMoRwABw76kKXpgoNj39jgAD+fDaX1FhB8vqlgs9Kpt+E5SjTado7qE6DBF/lplQvYC+bNpff5+OLpWW/ztefEbHnZZcczuePNYz+Q7AYA419OWjP3250U4UQAAA=` |
| `cat-fieltro` | categoría | Caja de madera con adornos de fieltro cosidos a mano: árbol con perlitas, corazón y copo de nieve bordado. | `#3f1917` `#0d923c` `#15b960` | `cat-fieltro-800.webp` 800×1204 (76 KB)<br>`cat-fieltro-1600.webp` 1600×2409 (204 KB) | [página](https://unsplash.com/photos/red-and-white-christmas-tree-ornament-c3dF7P42JsY) | Andreea V | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRvwAAABXRUJQVlA4IPAAAABwBgCdASoYACQAPu1mqk6ppaQiKqwBMB2JbACxHvnyF8UAnREfrNpjclx+1hNfQEOpjkuBJuEj+gDsCWAA/owAJErcqu7dmzpNdBujMF8JopaZn4EGxxzn9vSTVpYSGzjg/yXlO/Fz57GiwGkdVNOCpui5MJQdTN7kMTVDUrHsqOrh2iFC6t98vRTLXQ/wy9Z7MnJ0wZdUWct5MMES5hmYbGeIFb4NOXX2hIp+Dv7R1vky9SKSWHedzczVsOneMT6KZ2QkQk/X1vXJ1OAHiPNLAQ6c9dLG4nuTyrgokz8raRbzRI47PKtp1RE/AAAAAAA=` |
| `cat-pintados-a-mano` | categoría | Adornos de masa pintados a mano (estrella, corazones, luna, casita, muñeco de nieve) junto a una vela encendida. | `#440f03` `#dd0f07` `#fabc05` | `cat-pintados-a-mano-800.webp` 800×685 (92 KB)<br>`cat-pintados-a-mano-1600.webp` 1600×1370 (254 KB) | [página](https://unsplash.com/photos/handmade-christmas-ornaments-and-lit-candle-on-table-zhjLZeUBS5Y) | Runa Teredesai | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRrgAAABXRUJQVlA4IKwAAACQBACdASoYABQAPu1urlIppiQiqAgBMB2JbACdMy/AbI5/hfngXrIGy0zWlgAA/u6e4j37ODWxp/XmiiE6aCBU1YDQSR1T3P8yXPftjFM8YYxOCroSQD/cjlpcTZZ0uG0llNbW9Mo5fIy/TnCMRKBtXP4Le8iNvexk07fKFsWBctLWziHRvN08wnduyzUGCajObQ9jY3Rux12Pr8cByDzA+zwLW24l6sT3gAAA` |
| `cat-papel` | categoría | Guirnalda de cactus de papel con florecitas rosadas sobre fondo amarillo. | `#cca621` `#c49f1e` `#e6bc2a` | `cat-papel-800.webp` 800×601 (19 KB)<br>`cat-papel-1600.webp` 1600×1201 (56 KB) | [página](https://www.pexels.com/photo/paper-cacti-on-a-string-9095629/) | Polina Kovaleva | [Pexels](https://www.pexels.com/license/) | `data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAADQBACdASoYABIAPuFeqk2opSQiMAwBEBwJbACxHtPrnRVnoAHG1Wie4QGhHLJIYAD+jDqiREqRV4VRuaE3Y3Oz49QFmzGcTF1+ei7f/hWvnD1LWJONTbf506ekuCPe4ztkIxT2ODQ9KAaWIpUCjGYkc+hN9XH3M3FEr3YgeE/gAO9k65O7vtskXb+Q466+2uAAAA==` |
| `cat-tejidos-crochet` | categoría | Mandala tejido a crochet en turquesa, rojo y naranja, colgado entre la vegetación de un jardín. | `#147583` `#189daf` `#911f07` | `cat-tejidos-crochet-800.webp` 800×533 (143 KB)<br>`cat-tejidos-crochet-1600.webp` 1600×1067 (416 KB) | [página](https://unsplash.com/photos/intricately-crocheted-mandala-hanging-outdoors-with-greenery-PmOMk6lVbGM) | Irakli Shubitidze | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACwAwCdASoYABAAPu1iqk2ppaQiMAgBMB2JbACdAA/QRqPSJ5UiAAD+huRTAwB1LTACwivUF4AOCFfDWwLa8IyPC0yaJoB0ZfXWnu8MOFZVwmr4AZf8x+wlpJob/0hQ0H82QIcsEAA=` |
| `cat-colgantes-moviles` | categoría | Colgante de aros tejidos con borlas y pompones de colores bajo un toldo a rayas. | `#afeee6` `#eb1f49` `#f66787` | `cat-colgantes-moviles-800.webp` 800×1200 (60 KB)<br>`cat-colgantes-moviles-1600.webp` 1600×2400 (182 KB) | [página](https://www.pexels.com/photo/colorful-handmade-hanging-decoration-outdoor-34428636/) | Sharath G. | [Pexels](https://www.pexels.com/license/) | `data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAACQBgCdASoYACQAPu1kp0+ppSMiMBVaqTAdiWwAnTLG9ze3cMEFL+4/eizg2yrIYasvVB9YLkFtsEXjiRjgAMLTsI456gzrIPTOsH81LA4NqYf/4XKaWmWMnFD2yJIWbP7iSi6WafvudStCU0icsff8ftGgj6d0N8pfs8ZJ7VAysr1rmT5xlIZ76RE4W5FbsNAPB34CKIz/Ko8V2nIU23cAk96D6krO1e7N3YvwDKaU1VyJCP4L1lhk9qrfA982qXMsCTMXqigMj6seQAA=` |
| `cat-navidad` | categoría | Esfera tejida en rojo y blanco colgada de un árbol de Navidad, con luces cálidas desenfocadas. | `#262014` `#f2424c` `#b08045` | `cat-navidad-800.webp` 800×574 (43 KB)<br>`cat-navidad-1600.webp` 1600×1148 (106 KB) | [página](https://unsplash.com/photos/white-and-red-knit-bauble-on-green-christmas-tree-KPT2ikcWHZY) | Koen Eijkelenboom | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAAAwBQCdASoYABEAPu1irFAppSQisBgIATAdiUATplBm/ASUU4W7tIIZUWGEE3rBAqE8AAD+2pRIejFaYDLAYOrp8iFYdbRxGrAN4YaY831X4pbrie8QwLlAs9msczRsYrRh9VcUN1kZSSl7lqiz9YfhB5Wbg/v8i2lpsVjqbzuvfOt1+669EUkFvWNxO8AA` |
| `proceso-manos-pintando` | proceso | Manos pintando con pincel un adorno navideño de madera; al lado, otros adornos con arbolitos y un muñeco de nieve. | `#cac2bc` `#a96c53` `#a04b33` | `proceso-manos-pintando-800.webp` 800×529 (39 KB)<br>`proceso-manos-pintando-1600.webp` 1600×1059 (109 KB) | [página](https://www.pexels.com/photo/a-person-making-christmas-decorations-6163742/) | Marko Klaric | [Pexels](https://www.pexels.com/license/) | `data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAABwBACdASoYABAAPu1iqk4ppaQiMAgBMB2JZgCdMoADP+AU+jCFV5EcjPaaAADygC/2j8PEty/4ZJJD728URsAoWZyD7FxfZdtP2XBxlYjzt7YilMpOCX8JJz2fSaoNrZWH+CulVobe+MJGhdhraX6t1146VSJFUziSAAAA` |
| `proceso-mesa-taller` | proceso | Mesa de taller con pinceles en una taza pintada a mano, frascos de pintura y piezas de cerámica por pintar. | `#392e29` `#a34c38` `#fcfdfe` | `proceso-mesa-taller-800.webp` 800×533 (47 KB)<br>`proceso-mesa-taller-1600.webp` 1600×1067 (114 KB) | [página](https://www.pexels.com/photo/artistic-ceramic-painting-workshop-setup-34512916/) | Elif Yıldız | [Pexels](https://www.pexels.com/license/) | `data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAABQBACdASoYABAAPu1iqU2ppaQiMAgBMB2JZQCnFCFxKleP4u6tai8nw3YAAM2m4aByLhSglOY6CV2RQDvGrBOK4jksNov4dNTMPPmaziaDUqn262LQqC2yiHbBndneUjrJC+Zr/X8LKuumKTNoVBY0uEWM58b6vfqSI2z64iUAAA==` |
| `proceso-textura-fieltro` | proceso | Primer plano de bolitas de fieltro de lana en naranja, azul, fucsia y amarillo. | `#da8735` `#eb521a` `#f3aa3b` | `proceso-textura-fieltro-800.webp` 800×533 (106 KB)<br>`proceso-textura-fieltro-1600.webp` 1600×1067 (422 KB) | [página](https://www.pexels.com/photo/colorful-wool-felt-balls-close-up-35698172/) | Valentin Ivantsov | [Pexels](https://www.pexels.com/license/) | `data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAADQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JbACdMoRwHaA2wADDACd+X+3yDZr+AADOFxI5kftEiOI3V4WCVW7XNWjK7+yFvQ2+181TVNIXLxVhKZLeJWBgi/s0pBvXeZsfhmrGdC9bZNK3CfBD4PZ+EbeN/vCVtjFX0eiz0BZpyNkeC1Ga0eHRfnSQ1UWdPuJhiJr9LGeyMdGsBUVBrofL6WjmiXuAAt3zYkYKGIsCaQAA` |
| `proceso-empaque-regalo` | proceso | Manos atando una cinta azul a un regalo envuelto en papel rojo con corazones. | `#0e1618` `#fa362a` `#b91019` | `proceso-empaque-regalo-800.webp` 800×533 (33 KB)<br>`proceso-empaque-regalo-1600.webp` 1600×1067 (81 KB) | [página](https://www.pexels.com/photo/close-up-of-a-man-wrapping-a-present-27176172/) | Helena Lopes | [Pexels](https://www.pexels.com/license/) | `data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAABwBACdASoYABAAPu1iqk4ppaQiMAgBMB2JbACdACIey+yA18RjalISrjQFAAD7BQmcA1j26zYFBpArOQXJBaL16760zCu7KNEMwu61pWWPG+1sHR3QImRg8/PYsCAmh59gARSgqxhJDJa4zBzp1FKi7QxtgXx3sPrncLNlupAAAA==` |
| `galeria-guirnalda-fieltro` | galería | Guirnalda de bolitas de fieltro de colores y un móvil con figuritas, a contraluz. | `#e9ddc4` `#b9101c` `#eaa70f` | `galeria-guirnalda-fieltro-800.webp` 800×1188 (48 KB)<br>`galeria-guirnalda-fieltro-1600.webp` 1600×2377 (408 KB) | [página](https://unsplash.com/photos/colorful-felt-balls-strung-together-with-hanging-decorations-llOX0Ck3CbQ) | Spencer Plouzek | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRgQBAABXRUJQVlA4IPgAAACwBgCdASoYACQAPu1wrVIppiQiqrgIATAdiWwAsR8cfgAHDI9y3wJHF1J9wohs2GnoofEpMrCg+ml24wZmwAD+8de9XyYApyycz5KR0FPab/UvfIGow7QCj5dU/3AC6SbvtgSftv5kU+KGeFmW6/XQMV3g1ZKu3wj/WaAnZOJD9pf1+XJrayt/NQcOODFqaZ9fKBq6pRqVerCmmWi3qKmgUmZ5f5wrjyN5+r4+JPxcj5Lp0BkUr3jMMR/L6RVhHJhWupe/lSoZNfZtgdSrEz0WB/iqs3XaMg26+h7mXJlSIGm06nE3r0Yufx2w7ZGA56QaHAQtldwAAA==` |
| `galeria-borlas-rosadas` | galería | Guirnalda de borlas de lana rosada colgada al aire libre. | `#a77a5d` `#ae363a` `#c25b58` | `galeria-borlas-rosadas-800.webp` 800×1067 (53 KB)<br>`galeria-borlas-rosadas-1600.webp` 1600×2133 (341 KB) | [página](https://unsplash.com/photos/pink-yarn-tassels-hanging-on-a-string-outdoors-cn6I_2kNfuE) | Joao Vitor Marcilio | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAACwBACdASoYACAAPu1gp02ppSOiMAgBMB2JZgCuHB00VCdVVAEE+Qudv/5zRYhYAPYZ2q0YCsZAHSiIvrG0p5KykOXYPLbsqQd4gx8lfHNUdSrmBrVnnbQCmCER1Iy06nyIBs0g37iKwIpSOMwRrTJaps87Zf+d0qlb151vrMxZ2TETeAYj2OlJ9vQTLuyn8D8V45zEnzVTlAnuXVwYgudEpRGUY7H60zxS4eXDl8vyaFKqiNxpbu5RcKaAf38O68Jvg+JrY0VmLs54AAA=` |
| `galeria-conos-pompones` | galería | Guirnalda de conos de helado de fieltro con pompones de lana de colores, sobre pared de madera. | `#433015` `#8d6736` `#af8a55` | `galeria-conos-pompones-800.webp` 800×530 (40 KB)<br>`galeria-conos-pompones-1600.webp` 1600×1061 (296 KB) | [página](https://unsplash.com/photos/a-garland-of-five-ice-cream-cone-decorations-S3bP9-1poiQ) | T (@tanyabarrow) | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAAAQBACdASoYABAAPu1kqU2ppaOiMAgBMB2JYgCdMoAC+4vpi3nu5dD9AAD+LcTX/jd5zMSB2/yWeTJUIe6l2gALkSpuLnmaZCbuwgr/Vm9J5gOTIgQuxV0YKbNU9ODb4LcO3AFyPhW18AAA` |
| `galeria-corazones-papel` | galería | Corazones de papel de colores colgando de un hilo rojo. | `#e5decc` `#9b7c2b` `#cf524f` | `galeria-corazones-papel-800.webp` 800×899 (17 KB)<br>`galeria-corazones-papel-1600.webp` 1600×1799 (46 KB) | [página](https://www.pexels.com/photo/a-colorful-paper-heart-hanging-from-a-string-17720449/) | B M Rauf | [Pexels](https://www.pexels.com/license/) | `data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAABQBQCdASoYABsAPu1iqlAppSOisBgIATAdiUAVHoFPy5w2wm1G5Qw8ICfQbcN2ff0boAAA/gIvSeHvsTvtPFJWWENo1I24o9GogRgPxSOvQxiHFF4UpFMbkOsLn8P/TiZjdqX7cIbZIOLL4oUfp/LdllfiHyutnQvDYWcU2+2h7YRMUDh9nJAr9nvXczc9M18If1Mdfb+zXAqD0+vl6AAA` |
| `galeria-mesa-festiva` | galería | Mesa navideña vista desde arriba: bastones de caramelo, piñas, naranjas secas, lucecitas y un regalo en papel kraft. | `#c59486` `#925947` `#c17953` | `galeria-mesa-festiva-800.webp` 800×533 (65 KB)<br>`galeria-mesa-festiva-1600.webp` 1600×1067 (219 KB) | [página](https://unsplash.com/photos/assorted-christmas-ornaments-7VOyZ0-iO0o) | JESHOOTS.COM | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAABQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JaACdMoR3ABpHAaEI6L7Z2GeAAP6DV8Kjc7r3DgZWFfFSs0cHQMErLUhgcJ6ls31T3SRoPpEFzhOrI92h6cQn8ybO6JRTH1TjUOp35X4HUTLYnloAAA==` |
| `galeria-pajaros-movil` | galería | Móvil de pajaritos de papel de colores colgando de un árbol, con fondo verde desenfocado. | `#395828` `#579110` `#0dacd5` | `galeria-pajaros-movil-800.webp` 800×528 (33 KB)<br>`galeria-pajaros-movil-1600.webp` 1600×1056 (77 KB) | [página](https://unsplash.com/photos/a-colorful-wind-chime-hanging-from-a-tree-wI81ZlNY2AY) | Juantelle Louw | [Unsplash](https://unsplash.com/license) | `data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAABQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JagCdMoMljCloEYJnGqXD7qjgAP1oGLP7qX0TifTV00E8v6wIWu1OyDV/n20mUhy/XWK/+MkXTWedxApiWMtZQO2zkkD9j/XAi+/DHNd4P8424z3RXjIigGr475SGAAA=` |

## Video

| archivo | detalle | fuente | autor | licencia |
|---|---|---|---|---|
| `public/video/taller-flor-papel.mp4` | 10 s, 1280×720, H.264 High, sin audio, CRF 28, faststart — 1.27 MB. Manos esponjando una flor de papel de seda blanca y naranja. Sirve en bucle (`autoplay muted loop playsinline`). | [página](https://www.pexels.com/video/people-making-flower-decoration-7605603/) | RDNE Stock project | [Pexels](https://www.pexels.com/license/) |
| `public/video/taller-flor-papel-poster.webp` | póster 1280×720 (31 KB), fotograma del segundo 1. Alt sugerido: "Manos esponjando una flor de papel de seda en blanco y naranja." | — | — | — |

## Notas y decisiones

- **`hero-fieltro-colgante`** está recortado: se quitó el 20 % izquierdo del original porque
  había un letrero desenfocado con texto. Queda en 3:2 con el sujeto a la derecha y bokeh a la
  izquierda para el titular.
- **Espacio para texto en el hero:** `hero-esferas-pintadas` (bokeh a la derecha) y
  `hero-fieltro-colgante` (bokeh a la izquierda) dejan aire; `hero-papel-picado` es la más
  impactante pero está llena de color de borde a borde: necesita un velo o una tarjeta detrás
  del texto para cumplir AA. `cat-papel` (cactus sobre amarillo liso) también funciona como
  hero con mucho espacio libre si se prefiere algo más limpio.
- **Proporciones:** `cat-fieltro`, `cat-colgantes-moviles` y `galeria-guirnalda-fieltro` son
  verticales 2:3; `galeria-borlas-rosadas` es 3:4; `galeria-corazones-papel` es casi
  cuadrada; el resto es apaisado (entre 3:2 y 7:6). Para la galería cuadrada, guirnalda,
  borlas, corazones y mesa festiva recortan bien centradas; `galeria-pajaros-movil` conviene
  anclarla a la derecha (`object-position: 70% 50%`) y `galeria-conos-pompones` pierde los
  conos de los extremos (con tres conos igual se lee bien).
- `proceso-mesa-taller` tiene una caja con impresión borrosa detrás de los pinceles; no se
  lee ninguna marca.
- Cultura visual: `hero-papel-picado` y `cat-papel` le dan un guiño latinoamericano; el resto
  es neutro. La temporada de Navidad está cubierta por `cat-navidad`, `cat-fieltro`,
  `cat-pintados-a-mano`, `proceso-manos-pintando` y `galeria-mesa-festiva`.
- **Huecos:** no hay una foto de manos **cosiendo fieltro** que fuera colorida y luminosa (las
  opciones eran grises o con máquina de coser), ni una mesa festiva realmente colorida (la
  elegida es cálida, en tonos madera y rojo). No hay macramé colorido convincente: los
  colgantes se cubren con `cat-colgantes-moviles` y `cat-tejidos-crochet`.
- Todo se reemplaza por las fotos reales de Erika: mismos slugs y anchos para no tocar el HTML.
