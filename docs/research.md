# Investigación: tiendas de adornos hechos a mano

Fecha: 2026-09-22. Método: búsquedas y scrapes con Firecrawl (más WebSearch para
descubrir fuentes). Capturas de 1920×1080 del primer pantallazo en
`docs/research/*.png`: las miré una por una, así que el juicio visual sale de
ahí y no sólo del texto. Varias marcas tapan su hero con un pop-up de
descuento, y eso también es un hallazgo (ver antipatrones).

---

## 1. Resumen: 7 conclusiones

1. **El color va en la foto y en bloques planos, no en la interfaz.** Oh Happy
   Day, Meri Meri, Ban.do y Mola Sasa se ven alegres porque fotografían el
   producto sobre un **fondo liso saturado** (rosa, menta, naranja, terciopelo
   rojo). La interfaz se queda en papel y tinta. Las marcas baratas hacen lo
   contrario: UI arcoíris y fotos grises.
2. **Lo "premium alegre" es color en bloques + un borde de tinta.** Fishwife
   usa fondo crema, píldoras con borde de tinta de 1–1.5 px, CTA amarillo
   mantequilla con texto de tinta y secciones enteras de un solo color (cielo,
   menta, cobalto). Tony's hace lo mismo con un azul plano y un solo botón
   amarillo. Un color protagonista por sección, nunca cinco.
3. **Lo "hecho a mano" se cuenta con detalles de oficio, no con adjetivos.**
   Onora nombra la técnica (*pastillaje*) y tiene "Historias" en el menú.
   Someone Somewhere firma cada etiqueta con el nombre de la artesana. Arhoj
   llena el hero con docenas de piezas distintas ("ninguna igual" sin decirlo).
   Tony's pone notas manuscritas con flechas que señalan el detalle.
4. **Los adornos cuelgan: esa es la escena propia.** Charmling (nominado en
   Awwwards, 11-sep-2026) cuelga dijes de cordones con física de péndulo, y
   hasta los ítems del menú cuelgan de alfileres. Ningún competidor de adornos
   lo explota. Es la metáfora natural de Erika: un **tendedero de adornos** que
   se mece.
5. **En Panamá/LatAm, WhatsApp no es un extra: es la caja registradora.**
   Onora (premium) y todos los sitios panameños revisados tienen WhatsApp. El
   flujo real de Manos del Istmo es: link `wa.me` con mensaje prellenado →
   pago por Yappy/ACH → comprobante por WhatsApp → envío (Uno Express) o
   retiro. Taller del Pesebre ofrece "abono y apartado" y "Personalizamos lo
   que desees". El FAQ tiene que responder **pago, envío, tiempos, apartado y
   personalización**. Las respuestas las confirma Erika, no se inventan.
6. **Lo personalizado vende.** Susan Alexandra pone "Make Your Own" en el menú
   principal, Artesanos de Panamá y Casa Nochipa tienen "Productos/Proyectos
   personalizados" en la barra, y en Etsy los adornos de fieltro más
   recomendados son de iniciales o bordados personalizados. Los encargos
   merecen una sección propia y un formulario que arme el mensaje de WhatsApp.
7. **La plantilla de IA ya tiene cara, y hay que esquivarla.** Antetítulo con
   letras espaciadas "TALLER · PAÍS", titular serif con una palabra en cursiva
   de color, tarjeta flotante sobre la foto, blobs difuminados, emojis como
   íconos, tarjetas 01/02/03 iguales y burbuja verde de WhatsApp. Todo eso sale
   en Encarga Artesanía (Lovable), Un Suspiro Navideño (Vercel) y Manos del
   Istmo.

---

## 2. Referencias

Categorías: **B1** = tiendas populares de adornos, decoración y artesanía
(incluye LatAm). **B2** = sitios lúdicos y coloridos con nivel de agencia.
**B3** = vendedores que se apoyan en WhatsApp o Instagram.

| # | Nombre | URL | Cat. | Qué robar (concreto) | Captura |
|---|---|---|---|---|---|
| 1 | Meri Meri | https://merimeri.com | B1 | **Hero con la escena en uso**: panales, bola disco y hongos de papel colgando del techo con niños jugando. El producto aparece vivido, no aislado. **Fila de categorías justo bajo el hero** como entrada rápida. Evitar: el carrusel y la barra de promo. | `merimeri.png` |
| 2 | Oh Happy Day | https://ohhappyday.com | B1 | **El color está en la fotografía**, sobre fondos lisos rosa y menta, mientras la UI queda en blanco y negro. Wordmark serif gordo y blando. Un **globo amarillo "Party Shop." hace de sticker-CTA**. Es un referente del DIY festivo (su barra muestra 515K en Instagram). | `ohhappyday.png` |
| 3 | Ban.do | https://www.bando.com | B1 | **Dirección de arte de artesanía popular**: el titular está bordado en punto de cruz dentro de un marco de encaje, una **franja de estrellas de quilt** sirve de separador y hay un set monocromo (todo terciopelo rojo) con productos multicolor. Es color en bloques de libro. Evitar: el apilado de banners de descuento. | `bando.png` |
| 4 | Studio Arhoj | https://arhoj.com | B1 | **Hero con docenas de piezas hechas a mano, todas distintas**, que dice "ninguna es igual" sin texto. Productos con **nombre propio** (*chug mug*, *slurp cup*), microcopy con humor (kaomoji) y una página "Hands At Work" para el proceso. | `arhoj.png` |
| 5 | Susan Alexandra | https://susanalexandra.com | B1/B2 | **Menú de pestañas-sticker recortadas a mano**, cada una con su color y su rotación, bajo un **borde ondulado**. Wordmark rotulado a mano. **"Make Your Own" en el menú principal**. La ayuda es un **sticker-mascota ("Ask Pigeon!")** y no una burbuja genérica. Evitar: el pop-up y la sobrecarga maximalista. | `susanalexandra.png` |
| 6 | Onora | https://onoracasa.com | B1/B3 | Colaboraciones con artesanos mexicanos (LatAm premium). **"Historias" en el menú**, **nombra la técnica** (pastillaje) y a quien la hace, y titula colecciones en serif con **cursiva de acento** ("COLECCIÓN *Arrieta*", "UNA VIDA *hecha a mano*"). Tiene **WhatsApp aunque sea premium**, porque en LatAm se espera. Su tono oscuro y sobrio no nos sirve. | `onora.png` |
| 7 | Mola Sasa | https://molasasa.com/es | B1 | Accesorios hechos por mujeres gunadule (técnica mola, patrimonio también de Panamá). **Paleta mola** (rojo, naranja, negro y rosa) con **contornos concéntricos desplazados**. **Receta de foto**: producto sobre fondo naranja liso con frutas de utilería. Evitar: el pop-up. Ojo: inspirarse en el color y la técnica sin copiar motivos gunadule. | `molasasa.png` |
| 8 | Someone Somewhere | https://someonesomewhere.mx | B1 | Empresa social mexicana. "**Hecho por alguien, en algún lugar**" y "**cada etiqueta viene firmada por el artesano**". Esa trazabilidad como relato inspira la **etiqueta firmada por Erika**. La ejecución visual es genérica (video con velo gris). | `someonesomewhere.png` |
| 9 | Fishwife | https://eatfishwife.com | B2 | **La receta de "alegre pero caro"**: base crema, **menú de píldoras con borde de tinta**, **CTA amarillo mantequilla con texto y borde de tinta**, secciones de color plano (cielo, menta, pie cobalto), serif blanda en titulares y un **medallón ilustrado que se encaja en una línea divisoria**. Evitar: el pop-up de "descuento misterioso". | `fishwife.png`, `fishwife-scroll.png` |
| 10 | Tony's Chocolonely | https://tonyschocolonely.com | B2 | **Bloque azul a sangre con un solo botón amarillo**. **Notas manuscritas con flechas** que señalan detalles del producto ("fully customizable wrapper"), ideal para señalar puntadas, pinceladas o el cordel. **Palabra gigante de color como título de sección** ("CHOCO SHOP"). | `tonys.png` |
| 11 | Ghia | https://drinkghia.com | B2 | Marca con diseño celebrado. Contenedores con **silueta no rectangular** (forma de bombilla o cerradura), traducibles a un **marco con forma de adorno** para tarjetas y CTA. Contraste burdeos y rosa, serif condensada. (Sólo se vio el pop-up.) | `ghia.png` |
| 12 | Charmling | https://charmling.app | B2 | Nominado en Awwwards (11-sep-2026). **Dijes colgando de cordones con física de péndulo**, **menú que cuelga de un hilo con alfileres**, "tap one for its story" y la voz honesta de una sola persona ("made by one person, in Pennsylvania"). Es **el modelo directo del tendedero de adornos**. Su paleta oscura no nos sirve. | `charmling.png` |
| 13 | Dusen Dusen | https://dusendusen.com | B2 | Marca de textiles de patrones. **Contenedores con forma de mancha irregular**, rayas, un riel vertical de color para la navegación y copy con humor ("We eat cookies…"). Evitar: el pop-up más el banner de cookies apilados. | `dusendusen.png` |
| 14 | Manos del Istmo | https://manosdelistmo.com | B3 | Panamá (Mercado de Panamá Viejo). **El flujo local real**: `wa.me/507…?text=Hola, me gustaría saber más información`, sección "How to buy" (Yappy/ACH → comprobante por WhatsApp → confirmación → Uno Express o retiro). Sirve para las preguntas del FAQ. Visualmente es **el catálogo de señales de plantilla de IA** (ver §7). | `manosdelistmo.png` |
| 15 | Artesanos de Panamá | https://artesanosdepanama.com | B3 | "**Productos Personalizados**" en el menú, **banda naranja con patrón mola** como identidad local y WhatsApp en la barra superior. Evitar: el velo gris sobre la foto (mata el color de la cerámica) y Poppins centrada sobre la imagen. | `artesanospanama.png` |
| 16 | Taller del Pesebre | https://www.tallerdelpesebre.com | B3 | Nacimientos hechos a mano en Chiriquí. Muestra **conductas navideñas locales**: "**abono y apartado**", "**Personalizamos lo que desees**" y el motivo de guirnalda de luces. Evitar: más de 4 tipografías, clip-art dorado y la burbuja verde genérica. | `tallerpesebre.png` |
| 17 | Miró Christmas | https://mirochristmas.com | B3 | Decoración navideña en Panamá. "**¿Cómo comprar?**" como ítem del menú: sin carrito, el camino de compra debe estar escrito. Evitar: foto de stock con bokeh, velo oscuro y el claim "Hace 25 años" (nosotros no inventamos cifras). | `mirochristmas.png` |

**Contraejemplos capturados** (se analizan en §7): `anti-lovable.png` (Encarga
Artesanía, hecho con Lovable), `anti-vercel.png` (Un Suspiro Navideño, en
Vercel), `casanochipa.png` (Casa Nochipa, con dos pop-ups, banner de cookies y
pestaña lateral) y `sassandbelle.png` (Sass & Belle, cuyo pop-up tapa todo;
lo que sí vale es el estilismo de producto sobre rayas pastel).

**Qué adornos hechos a mano se recomiendan en Etsy** (según WebSearch, que
resume las guías de Etsy): galletas de fieltro con chispas, hongos de fieltro,
corazones bordados "para árboles coloridos", iniciales bordadas y bombillas de
fieltro bordadas. **Iniciales y nombres** aparecen una y otra vez, y eso
confirma que los encargos personalizados deben tener peso propio.

---

## 3. Color

### Qué se lee "alegre + artesanal + premium" y qué "barato o infantil"

| Premium alegre (lo que vimos en 1–13) | Barato o infantil (lo que vimos en 14–17 y en los contraejemplos) |
|---|---|
| Base de **papel cálido** (crema, nunca `#fff`) y **tinta que no es negro** (café tostado o añil). | Blanco puro con gris frío, o degradados pastel difuminados. |
| Acentos con **pinta de pigmento**: cempasúchil, chile, bugambilia, laguna, cobalto de talavera. Saturados pero un poco terrosos, con luminosidad y croma parecidos. | Primarios RGB (`#FF0000` y `#00FF00` navideños), neón y degradados arcoíris. |
| **Un color protagonista por sección**, en bloques planos y grandes (Fishwife, Tony's, Ban.do). | Cada elemento de otro color, con cinco colores en una misma tarjeta. |
| El color vive en **el fondo de la foto** (fondo liso saturado + producto). | Fotos lavadas con velo gris u oscuro para que se lea el texto. |
| **Borde de tinta de 1–1.5 px** en píldoras y botones (aire de impreso o serigrafía). | Glassmorphism, sombras negras, brillos y botones degradados con halo. |
| Patrón **artesanal** como franja divisoria (quilt de Ban.do, mola de Artesanos de Panamá). | Clip-art de copos, velas o siluetas doradas. |

**La trampa de los tonos medios.** El rosa, el rojo y el verde azulado
saturados **reprueban AA tanto con texto oscuro como con texto claro** si no se
ajustan. Por eso abajo cada acento está calibrado (se oscureció apenas la
luminosidad en HSL) y viene con su regla de texto.

### Paleta A: "Taller de papel" (papel picado, talavera, bugambilia)

Más cálida y mexicana-folk. Los acentos intermedios llevan texto **papel**.

| Token | Hex | Uso |
|---|---|---|
| `papel` | `#FFF6E9` | fondo principal |
| `kraft` | `#F6E3C6` | fondo alterno y etiquetas |
| `tinta` | `#2B1A12` | texto, bordes y foco |
| `cempasuchil` | `#F5A623` | **CTA principal** (texto tinta) y bloques |
| `bugambilia` | `#D32970` | bloques y titulares (texto papel) |
| `chile` | `#CD3C25` | bloques, Navidad y titulares (texto papel) |
| `laguna` | `#117F74` | bloques y enlaces (texto papel) |
| `cobalto` | `#2B45C8` | bloques y enlaces (texto papel, AAA) |

| fondo \ texto | tinta | papel | acento como texto sobre `papel` |
|---|---|---|---|
| papel `#FFF6E9` | **15.57 AAA** | — | — |
| kraft `#F6E3C6` | **13.28 AAA** | 1.17 NO | (acentos < 4.5: sobre kraft sólo tinta) |
| tinta `#2B1A12` | — | **15.57 AAA** | — |
| cempasúchil `#F5A623` | **8.23 AAA** | 1.89 NO | 1.89 NO |
| bugambilia `#D32970` | 3.43 sólo grande | **4.54 AA** | **4.54 AA** |
| chile `#CD3C25` | 3.39 sólo grande | **4.59 AA** | **4.59 AA** |
| laguna `#117F74` | 3.42 sólo grande | **4.55 AA** | **4.55 AA** |
| cobalto `#2B45C8` | 2.21 NO | **7.03 AAA** | **7.03 AAA** |

### Paleta B: "Mola caribe" (mola guna, fruta, mar) ⟵ **recomendada**

Es más panameña: el rojo, el naranja y la tinta oscura de la mola, el turquesa
del Caribe, el mango, la papaya y el hibisco. Su ventaja práctica es que la
**tinta añil es tan oscura que da AA incluso sobre los tonos medios
brillantes** (mango, papaya, turquesa, hibisco), así que caben botones y
etiquetas de color con texto oscuro legible.

| Token | Hex | Uso |
|---|---|---|
| `crema` | `#FBF1E1` | fondo principal |
| `arena` | `#F3DFC1` | fondo alterno y etiquetas |
| `anil` | `#1E1A3C` | texto, bordes, foco y sección nocturna de Navidad |
| `mango` | `#FFC53D` | **CTA principal WhatsApp** (texto añil + borde añil) |
| `papaya` | `#F2711C` | bloques y stickers (texto añil) |
| `mola` | `#D3253C` | bloques y titulares grandes (texto crema) |
| `turquesa` | `#12A5A0` | bloques y fondos de foto (texto añil) |
| `hibisco` | `#F48FB1` | bloques y fondos de foto (texto añil) |
| `selva` | `#2B7148` | acento navideño y enlaces (texto crema) |

| fondo \ texto | añil | crema | acento como texto sobre `crema` |
|---|---|---|---|
| crema `#FBF1E1` | **14.80 AAA** | — | — |
| arena `#F3DFC1` | **12.72 AAA** | 1.16 NO | (sobre arena sólo añil) |
| añil `#1E1A3C` | — | **14.80 AAA** | — |
| mango `#FFC53D` | **10.49 AAA** | 1.41 NO | 1.41 NO |
| papaya `#F2711C` | **5.64 AA** | 2.62 NO | 2.62 NO |
| mola `#D3253C` | 3.23 sólo grande | **4.58 AA** | **4.58 AA** |
| turquesa `#12A5A0` | **5.45 AA** | 2.71 NO | 2.71 NO |
| hibisco `#F48FB1` | **7.42 AAA** | 1.99 NO | 1.99 NO |
| selva `#2B7148` | 2.81 NO | **5.28 AA** | **5.28 AA** |

**Reglas que salen de las tablas:**
- Texto normal: sólo tinta/añil sobre base, o base sobre tinta/añil. El texto
  de acento sólo va sobre la base principal (papel o crema), nunca sobre kraft
  o arena.
- CTA WhatsApp: **mango + texto añil + borde añil de 1.5 px** en B (10.49 AAA)
  o **cempasúchil + tinta** en A (8.23 AAA).
- **El verde de WhatsApp no sirve para texto**: `#25D366` con blanco da 1.98 y
  sobre papel 1.85 (ni siquiera los 3:1 de un ícono). Si se quiere el verde
  reconocible, que sea `#075E54` con texto blanco (7.67), o se usa sólo el
  glifo en tinta/añil dentro del botón de marca.
- Foco visible: anillo añil o tinta de 3 px con desfase (≥ 12:1 sobre las
  bases). Dentro de la sección añil el anillo es mango (10.49).
- Proporción de uso: ~70 % base, ~20 % tinta, ~10 % color, y cada sección
  elige **un** acento protagonista. La excepción es el hero de "Temporada", que
  puede ir "empapado" (fondo entero de un color).
- Nota cultural: la mola es patrimonio guna. Se toma **la paleta y la idea de
  capas recortadas** (contornos concéntricos) y no motivos tradicionales
  concretos.

---

## 4. Tipografía

Descartadas a propósito las que salen en la lista de reflejos de la skill
`impeccable` (Fraunces, Instrument, Syne, DM, Outfit, Plus Jakarta, Inter…):
son las que delatan un sitio hecho por IA. Las cuatro de abajo son **OFL 1.1**,
están en Google Fonts y **Fontsource** (autoalojables vía npm) y cubren el
español completo (¡ ¿ ñ á) en el subset `latin`. Los pesos de woff2 están
medidos en jsDelivr.

### Combinación 1: "Rótulo cálido" ⟵ **recomendada**
- **Display: Caprasimo**. Serif gorda y blanda de los 70 por **Omnibus-Type
  (Buenos Aires)**. Se lee a rótulo pintado, a etiqueta de dulcería, a
  "alegre". **No es variable** (sólo 400, que en display basta). Latin: ~21 KB.
  `@fontsource/caprasimo`.
- **Texto: Figtree**. Grotesca geométrica amable y muy legible. **Variable**
  (wght 300–900, con itálica). Latin wght: ~20 KB.
  `@fontsource-variable/figtree`.
- **Acento opcional: Shantell Sans**, trazo de marcador manuscrito, sólo para
  1–3 notas con flecha tipo Tony's. **Variable** con ejes wght 300–800, ital,
  **BNCE (rebote)**, **INFM (informalidad)** y SPAC. El eje de rebote se puede
  animar con `font-variation-settings` (y apagar con reduced-motion). Latin
  wght: ~79 KB (el archivo con todos los ejes pesa ~174 KB), así que se carga
  diferido y no se precarga.
- Reglas: Caprasimo sólo ≥ 32 px, interletrado −0.01/−0.02 em, en tinta o
  crema, **sin contorno ni sombra** (con eso sería infantil). Figtree para el
  texto a 18 px, 400/500, con 60–70 caracteres por línea. Se precarga
  Caprasimo (titular del hero) y Figtree wght.

### Combinación 2: "Grotesca de taller" (más contemporánea y editorial)
- **Display: Bricolage Grotesque**. Grotesca con trampas de tinta y
  personalidad que crece con el tamaño óptico. **Variable**: opsz 12–96, wdth
  75–100, wght 200–800 (sin itálica). Latin wght: ~41 KB (opsz ~77 KB).
  Usarla a opsz 96, wght 700–800 y wdth 85–90 en titulares.
  `@fontsource-variable/bricolage-grotesque`.
- **Texto: Alegreya**. Serif caligráfica de **Huerta Tipográfica
  (Argentina)**, con un ritmo de pluma que suma a "hecho a mano". **Variable**
  wght 400–900, con itálica variable. Latin: ~43 KB + ~44 KB la itálica.
  Cuerpo a 19–20 px porque su altura de x es chica.
  `@fontsource-variable/alegreya`.

Si Caprasimo resulta demasiado retro para Erika, las alternativas con licencia
libre son **Young Serif** (estática, 400) y, en Fontshare, **Gambarino**. Ojo:
Fontshare usa la licencia ITF FFL, gratis para uso comercial pero no OFL.

---

## 5. Estructura de la página (el AIDA del brief, ajustado)

Cambios sobre el brief: (a) **la temporada sube al segundo lugar**, porque
estamos a 3 meses de Navidad y las tiendas vistas ponen producto justo después
del hero (Meri Meri, Fishwife, Ban.do); (b) **las colecciones se parten en dos**:
una fila de accesos en el hero (patrón Meri Meri) y el catálogo completo más
abajo; (c) **el proceso va entre los dos bloques de producto**, porque sin
precios el valor se construye antes de pedir el encargo. La temporada se
cambia con un flag en el archivo de datos (`temporada: "navidad" | null`).

| # | Sección | AIDA | Escena propia (funciona sin JS y respeta reduced-motion) |
|---|---|---|---|
| 1 | **Hero + fila de colecciones** | Atención | **"El tendedero"**: un cordel en SVG cruza el hero con 5–7 adornos reales recortados (AVIF/WebP con transparencia), cada uno colgado de un hilo de distinto largo. Mecido en CSS (`transform-origin: 50% 0`, duraciones de 3–5 s desfasadas) sólo bajo `prefers-reduced-motion: no-preference`. Con JS (Stimulus + GSAP) la velocidad del scroll y el puntero dan un empujón con resorte, al estilo Charmling. **Cambio de color sin JS**: `.hero:has(.adorno:hover, .adorno:focus-visible)` cambia `--fondo-hero` al color de ese adorno, y como cada adorno es un enlace a su pieza también funciona con teclado. Sin JS: adornos quietos, cada uno con su rotación fija. Debajo va una fila de **pestañas-sticker** (Susan Alexandra) hacia las colecciones. Titular en CSS puro. CTA: "Pedir por WhatsApp" + "Ver adornos". |
| 2 | **Temporada: Navidad** (piezas destacadas) | Interés → Deseo | **"Etiquetas colgantes"**: cada pieza es una etiqueta de kraft con ojal y cordel, con la foto sobre un fondo liso de color propio, el nombre en display, material y técnica, y el CTA "Pedir por WhatsApp" con el nombre de la pieza en el mensaje. Al pasar el mouse o enfocar, la etiqueta gira 2–3° desde el ojal. **Cambio a noche**: el fondo pasa de crema a añil al entrar (ScrollTrigger, o `animation-timeline: view()` como mejora). Sin JS la sección ya es añil. |
| 3 | **Hecho a mano: el taller y quién es Erika** | Confianza | **"La mesa de trabajo"**: foto fija a la izquierda (manos y mesa) que cambia entre etapas (boceto → pintar o coser → secar → empacar) mientras los pasos avanzan a la derecha. Hay 1–3 **notas manuscritas con flecha** (Shantell Sans) sobre detalles reales y una **firma de Erika** que se dibuja con `stroke-dashoffset`. Sin JS: lista vertical con una foto por paso. Reduced-motion: cambios instantáneos y firma ya dibujada. |
| 4 | **Colecciones de todo el año** | Interés | **"Banderines"**: cada colección (esferas, móviles, guirnaldas, fieltro, cerámica, papel) es un banderín de papel picado (máscara SVG con recortes) de su color, colgado de un cordel. Al pasar el mouse o enfocar, el banderín ondea con un keyframe de skew. Debajo, la galería de la colección elegida con `:target` en CSS, sin JS. Si no hay tantas colecciones, pestañas-sticker. |
| 5 | **Encargos personalizados** | Deseo | **"La ficha del taller"**: una comanda de papel rayado con 3–4 campos ("¿Para quién o para qué ocasión?", "Colores que te gustan", "¿Para cuándo?", "Nombre o iniciales"). **Funciona sin JS**: `<form action="https://wa.me/50760000000" method="get">` con un `<textarea name="text">`, porque wa.me acepta `?text=`. Con JS, Stimulus arma un mensaje ordenado a partir de los campos y muestra una **vista previa como burbuja de chat** en colores de marca. Al lado, los 3 pasos del encargo (el texto lo confirma Erika) y el enlace alternativo por correo. |
| 6 | **Del taller a tu casa: Instagram** | Prueba social sin testimonios | **"La pared del taller"**: un mosaico (`grid-auto-flow: dense`, tamaños variados) de fotos locales con cinta washi o alfileres y **rotaciones fijas desde los datos** (no aleatorias en JS). Al pasar el mouse la foto se endereza. La última tile es el CTA "@erika.hechoamano". **Sin widget embebido**: es lento, rastrea y se rompe. |
| 7 | **Preguntas frecuentes** | Objeciones | `<details>` nativo con un marcador "+" dibujado como **puntada** (trazo punteado) y apertura suave con `interpolate-size: allow-keywords` como mejora progresiva. Preguntas sacadas de B3: pago (¿Yappy, ACH, efectivo?), envíos (¿a todo Panamá?, ¿retiro?), tiempos de un encargo, apartado o abono, cuidado y guardado del adorno, si cada pieza varía. **Las respuestas quedan marcadas `[confirmar con Erika]`.** |
| 8 | **Cierre + contacto + pie** | Acción | **"El último adorno"**: vuelve el cordel del hero con un gancho vacío y el texto "¿Cuál falta en tu casa?", más el CTA grande de WhatsApp y los secundarios de Instagram y correo. Con JS el último adorno "cae" en su gancho una sola vez; sin JS ya está colgado. |

**CTA persistente**: en lugar de la burbuja verde genérica, una **píldora de
marca** (mango + añil + glifo de WhatsApp) fija abajo sólo en móvil. Aparece
después del hero y se esconde cuando el CTA de cierre está en pantalla. Mide
≥ 48 px de alto y no tapa el foco. Cada pieza lleva su enlace
`wa.me/…?text=` propio con el nombre del producto.

**Recurso gráfico transversal**: contornos concéntricos desplazados (la
"capa recortada" de la mola) en 2–3 colores, para marcos de foto y
separadores, alternados con una franja de banderines como separador festivo.

---

## 6. Patrones de copy en español (LatAm, tuteo)

No afirman nada del negocio. Donde hay algo que confirmar, va marcado.

1. **Titular del hero**: "Adornos hechos a mano para colgar alegría."
2. Alternativa: "Color, hilo y paciencia. Pieza por pieza."
3. **Bajada**: "Esferas pintadas, guirnaldas, móviles y figuras de fieltro, hechos uno a uno en el taller de Erika."
4. **CTA principal**: "Pedir por WhatsApp". **Secundario**: "Ver adornos".
5. **CTA por pieza**: "Quiero este". El enlace abre WhatsApp con: *"¡Hola, Erika! Vi el adorno «Esfera Nochebuena» en tu página y me gustaría pedirlo. ¿Me cuentas cómo?"*
6. **Temporada**: "La Navidad se arma con tiempo. Pide tus adornos antes de que se llene la mesa."
7. **Colecciones**: "Para colgar, para regalar, para quedarse."
8. **Proceso**: "Así nace un adorno" / "Del boceto a tu arbolito."
9. **Pieza única**: "Ninguno sale igual. Esa es la gracia." (Si se usa, añadir en microcopy: "Cada pieza puede variar un poquito de la foto" `[confirmar]`.)
10. **Encargos**: "¿Lo imaginas con tus colores? Cuéntame tu idea y lo hacemos a tu medida."
11. **Campos de la ficha**: "¿Para quién es?" · "Colores que te gustan" · "¿Para cuándo lo necesitas?" · "Nombre o iniciales (si quieres)".
12. **Microcopy del envío**: "Se abre WhatsApp con tu mensaje listo. Solo tienes que enviarlo."
13. **Instagram**: "Lo más nuevo sale primero en Instagram." / "Mira lo que hay hoy en la mesa de trabajo."
14. **FAQ, intro**: "Antes de escribirme, quizá esto te ayuda."
15. **Cierre**: "¿Cuál falta en tu casa?" / "¿Te enamoraste de alguno? Escríbeme y lo conversamos."

Vocabulario local útil: *adornos, esferas, arbolito, nacimiento, encargo,
apartar, abono, Yappy*. "Escríbeme al WhatsApp" suena natural en Panamá.
**Evitar**: "Descubre", "Sumérgete", "Eleva tu hogar", "experiencia única",
"calidad premium", "hecho con amor 💕", "✨", el voseo y los españolismos
("coger", "vosotros", "mola" en el sentido de "está chévere", que además en
Panamá significa otra cosa).

---

## 7. Antipatrones: qué hace que esto se vea barato o hecho por IA

**Señales de plantilla de IA** (`anti-lovable.png`, `anti-vercel.png` y
`manosdelistmo.png` las muestran casi todas juntas):
- Antetítulo en mayúsculas espaciadas con punto medio ("TALLER DE ENCARGOS · ESPAÑA", "PANAMA · AUTHENTIC CRAFTS") dentro de una píldora.
- Titular serif con **una palabra en cursiva de color** ("artesanal *personalizada*", "Tradition you *can touch.*").
- Tarjeta flotante encima de la foto ("HOY EN EL TALLER"), círculos decorativos detrás, blobs difuminados y puntitos de partículas.
- **Emojis como íconos** (📦 🏺 💳 🎀 💎 🌿) y píldora con ✨.
- Tres tarjetas iguales "01 / 02 / 03" en tres columnas, y viñetas de confianza tipo "· Respuesta en 24–48h".
- Botón degradado rosa con resplandor, más el botón secundario con contorno debajo.
- Marquesina infinita de beneficios con emojis.
- Hero sin producto real (un ícono geométrico en su lugar).

**Señales de tienda barata o infantil:**
- **Pop-ups de descuento al cargar** (Sass & Belle, Mola Sasa, Fishwife, Ghia, Dusen Dusen y Casa Nochipa, que pone dos, más cookies y pestaña lateral). Tapan el primer pantallazo. No tenemos descuentos, así que **cero pop-ups**.
- **Velo gris u oscuro sobre la foto** para que se lea el texto (Artesanos de Panamá, Casa Nochipa, Miró): mata el color, que es justo lo que vendemos. El texto va en bloques de color al lado de la foto.
- **Burbuja verde genérica de WhatsApp** en la esquina (Onora, Manos del Istmo, Taller del Pesebre). Se reemplaza por el CTA de marca.
- Fotos de stock con bokeh (Miró). Clip-art dorado de velas, copos o siluetas (Taller del Pesebre).
- 4 o más tipografías, script para el texto de lectura y texto justificado (Taller del Pesebre).
- Rojo y verde navideño puros, degradados arcoíris, fondos pastel sobre pastel con texto de bajo contraste.
- Tipos redondos "tiernos" (Nunito, Baloo, Fredoka), texto con sombra o contorno, brillos y confeti de Lottie al cargar.
- Carrusel de hero (Meri Meri, Miró). Cifras o sellos inventados ("Hace 25 años", "+500 clientes").
- Widget de Instagram embebido (lento, rastrea, se rompe). Mejor fotos locales + enlace.
- Barras de promo apiladas (Ban.do, Mola Sasa). No hay promos, así que tampoco barras.

---

## 8. Capturas (`docs/research/`)

`merimeri.png` · `ohhappyday.png` · `bando.png` · `arhoj.png` ·
`susanalexandra.png` · `onora.png` · `molasasa.png` · `someonesomewhere.png` ·
`fishwife.png` · `fishwife-scroll.png` · `tonys.png` · `ghia.png` ·
`charmling.png` · `dusendusen.png` · `manosdelistmo.png` ·
`artesanospanama.png` · `tallerpesebre.png` · `mirochristmas.png` ·
contraejemplos: `anti-lovable.png` · `anti-vercel.png` · `casanochipa.png` ·
`sassandbelle.png`.

## 9. Fuentes

Sitios capturados: las URLs de la tabla de §2 más
[encargo-crea-tu-arte.lovable.app](https://encargo-crea-tu-arte.lovable.app/),
[tienda-marina.vercel.app](https://tienda-marina.vercel.app/) y
[casanochipa.com](https://casanochipa.com/).
Awwwards: [Charmling](https://www.awwwards.com/sites/charmling),
[Colorful](https://www.awwwards.com/websites/colorful/),
[E-commerce](https://www.awwwards.com/websites/e-commerce/).
Etsy (adornos de fieltro): [Felt Ornaments](https://www.etsy.com/market/felt_ornaments),
[Handmade Felt Ornaments Best Seller](https://www.etsy.com/market/handmade_felt_ornaments_best_seller).
Mola Sasa: [Instagram](https://www.instagram.com/mola_sasa/),
[Fashionkind](https://www.fashionkind.com/blogs/brands/mola-sasa).
Fuentes tipográficas: API de Fontsource (`api.fontsource.org/v1/fonts/*`,
`/v1/variable/*`) y jsDelivr (pesos de woff2).
Contrastes: fórmula de luminancia relativa de WCAG 2.x, calculados con un
script de Python.
