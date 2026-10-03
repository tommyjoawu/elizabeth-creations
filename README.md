# Elizabeth Creations — Adornos de fieltro hechos a mano

Landing de una sola página para la marca de Erika, **Elizabeth Creations**:
adornos de fieltro cosidos a mano y decorados con bisutería en Panamá, con
envío a todo el país. Colorida, alegre y hecha a mano, con el pedido por
WhatsApp como camino principal. En español de Panamá, de tú, y Erika habla
siempre en primera persona ("hago", "te confirmo", "escríbeme").

**Ronda del 02-10-2026** (notas de Tommy tras la reunión con Erika): sin La
Chorrera en ningún lado (el negocio se presenta para todo Panamá), envío a
todo el país (el costo, según la zona, por WhatsApp), la historia de Erika
como sección propia, la galería de "Las piezas" ya no se fija (se desliza de
lado, con flechas), fotos que se agrandan al tocarlas, una sola voz (Erika en
primera persona), precios sin ahorros ("Set de 3: $15.00 · Individual: $6.00
c/u"), el abono dicho con calma en una ventanita al enviar el pedido, seis
preguntas cortas, "fieltro" sólo donde importa (titular, título, descripción,
una pregunta y el pie) y un vistazo al taller (dos pasos, no los cinco).

Nació como hermana de la portada v2 de `ticket-qr-system`: copia su manera de
trabajar (capítulos con colores de rol, fuentes autoalojadas, todo funciona
sin JavaScript, movimiento que respeta `prefers-reduced-motion`, un parcial
por sección y comentarios que explican el porqué), no su contenido.

## Arrancar

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # sitio estático en dist/
npm run preview   # sirve dist/ para revisarlo
```

`dist/` es HTML, CSS, JS e imágenes con hash: se sube tal cual a cualquier
hosting estático (Netlify, Cloudflare Pages, GitHub Pages, un bucket).

## Qué está real y qué falta

Todo lo del negocio vive en `src/datos/*.json`. Ninguna plantilla tiene
datos escritos a mano. Los datos reales salen de las notas de voz de Erika
del 29-09-2026 (`docs/material-erika/transcripcion-audios-2026-09-29.txt`).

| Archivo | Qué hay | Estado |
|---|---|---|
| `marca.json` | nombre, `lugar` (Panamá), políticas (pago, abono, tiempos, envío, fecha de Navidad), mensajes de WhatsApp | **real**: Elizabeth Creations, Panamá (sin ciudad desde el 02-10-2026), Yappy o transferencia (sin efectivo), abono del 30 % sólo en los sets, las piezas individuales y las guirnaldas —**no en las varitas** (03-10-2026)—, no reembolsable (dicho con calma: ventanita al enviar y "¿Cómo se paga?"), 3 a 5 días, envío a todo Panamá, Navidad hasta el 15 de noviembre. **Pendiente** (`pendiente`): número de WhatsApp (hoy +507 6000-0000), Instagram y correo; el **costo y la manera del envío** (la página dice "te lo confirmo por WhatsApp según tu zona"). |
| `historia.json` | la historia de Erika (sección `historia`): antetítulo, título, tres párrafos, su frase, el cierre, la firma y la foto (el póster de sus manos en la mesa) | **real** (`borrador: false`, 03-10-2026): el texto de Erika con sus palabras y sus emojis (su hija Elizabeth Love, 2023, el fieltro), seguido de dos párrafos del borrador que ella pidió dejar. Fotos nuevas pendientes de Erika. |
| `productos.json` | las piezas agrupadas en **sets** (Navidad clásica, Navidad nevada, Bajo el mar, Varitas, Guirnaldas) para la galería colgada y el pedido por sets; cada pieza con `precio` y cada set completo con el suyo. **Todos los sets son de 3 piezas, $15.00** (Erika, 01-10-2026), cada uno con la foto de sus tres piezas juntas: Navidad clásica (estrella brillante, arbolito verde, galleta de jengibre; por separado $18.00), Navidad nevada (arbolito de nieve, galleta de jengibre, estrella blanca; $18.00) y Bajo el mar (sirenita, pececito, cangrejito; $20.00). La galleta va en los dos sets de Navidad: está escrita dos veces y la copia lleva `repite` | **real** (fotos de Erika); nombres descriptivos hasta que ella mande los suyos. **Precios reales** (Erika, 01-10-2026, `docs/material-erika/2026-10-01/precios.md`): todo set completo $15.00, sirenita y cangrejito $7.00, el resto $6.00, varitas $2.50, guirnalda $5.00, guirnalda con nombre de $5.00 a $10.00 (`precioHasta`, +$2.50 por color: `colorExtra`). Las **guirnaldas no tienen foto** todavía (ranura "Foto muy pronto"). Si un precio vuelve a ser `null`, la pieza dice "Precio: por confirmar" y el total también |
| `varitas.json` | luna o estrella (cada una con su foto) + color + `precios` (unidad $2.50, docena $25.00, variada +$1.50 por varita = $43.00) | **real** (audio 3 y precios del 01-10-2026). Ella dijo "el color del papel" pero la luna se ve de fieltro: la página dice "el color" a secas hasta que lo aclare. Las muestras de color son ejemplos. |
| `colecciones.json` | Navidad, Bajo el mar, Varitas, Guirnaldas, Tarjeta con tu mensaje, con una línea de precios; Navidad y Bajo el mar con la foto de un set | **real**; la tarjeta personalizada y las guirnaldas **no tienen foto** (ranura punteada) |
| `taller.json` | los pasos de "Así nace cada pieza", cada uno con su video | **real**: de los 5 videos de las manos de Erika haciendo una varita de estrella (01-10-2026) se ven **dos** ("Puntada a puntada" y "¡Lista!"): un vistazo, no el proceso entero (02-10-2026). Los otros tres quedan en `_guardados`, sin dibujarse ni pedirse; sus archivos siguen en `public/video/`. |
| `encargo.json` | "Así haces tu pedido": pasos, piezas y campos de la ficha | **real** |
| `preguntas.json` | preguntas frecuentes | **real**: seis, cortas (cómo pido, cuánto cuesta, cómo pago y el abono, cuánto tarda, envíos, Navidad); queda 1 ranura: **cómo envía y cuánto cuesta el envío** |
| `pared.json` | la pared de fotos + el reel cuadrado | **real**; la baldosa de Instagram dice "muy pronto" |
| `tendedero.json`, `cierre.json` | los adornos que cuelgan | ajustado, con las piezas de Erika |

Lo que falta confirmar se ve en la página como una ranura punteada ("Falta
que Erika lo confirme"): es a propósito, para que no pase por contenido real.
Cuando llegue un dato pendiente, se escribe y se pone su `pendiente` en
`false` (en `marca.json`) o se borra (en los demás).

**Logo:** `src/parciales/piezas/logo.html` es una **propuesta**: su estrella
de fieltro con la puntada a mano, tres piedritas y el lazo. Variantes sueltas
en `docs/logo/` y lámina para mostrársela en `docs/galeria/propuesta-logo/`.

**Fotos y videos:** los originales de WhatsApp están en `docs/material-erika/`.
`bash scripts/procesar-material.sh` los recorta, les sube un poco la luz, les
pone nombre (`pieza-…`, `adorno-…`, `varita-…`, `set-…`) y los deja en
`src/assets/img/` en dos anchos y tres formatos (AVIF, WebP y JPEG; el
ayudante `{{imagen}}` arma el `<picture>`), y los videos en `public/video/`
como bucles mudos MP4 + WebM con su póster. Los de producto van "ida y
vuelta" (`bucle`); los del taller, de corrido (`recto`: unas manos que cosen
hacia atrás se ven falsas), con un póster escogido por paso. La tanda del
01-10-2026 vive en `docs/material-erika/2026-10-01/` y las fotos de los sets
en `docs/material-erika/2026-10-01-sets/` (`set-bajo-el-mar`, girada -90°;
`set-navidad-nevada`, `set-navidad-clasica` y `set-navidad-clasica-cerca`,
recortadas apaisadas en 600 y 960; `bash scripts/procesar-material.sh sets`
rehace sólo esas). Para una foto nueva se agrega una línea `exportar` al
script.

**Publicidad:** `docs/galeria/` (una carpeta por pieza con su `pieza.html`
y su `pieza.png`; galería en `docs/galeria/index.html`). Se regenera con
`python3 docs/galeria/_fuente/generar.py && node docs/galeria/render.mjs`.
La pieza `og-landing` es la `public/og.jpg`.

**Video:** `docs/motion/reel-elizabeth/` (HyperFrames, vertical 1080×1920,
23 s) y `docs/motion/reel-cuadrado/` (1080×1080, 10 s, el que va en la pared
como `public/video/reel-cuadrado.*`). Renders en `docs/motion/*.mp4`. Con
Node 22: `python3 generar.py && npx hyperframes check && npx hyperframes render --no-browser-gpu`.

## Cómo está armado

```
index.html                  el armazón: <head>, isla, secciones, pie
vite/plantillas.js          Handlebars: une parciales + datos en index.html
vite/ayudantes.js           {{imagen}}, {{whatsapp}}, {{whatsappPieza}}, {{icono}}, {{palabras}},
                            {{rellenar}}, {{fechaLarga}}, {{esquema}}…
vite/hechos.js              precios y fechas de los JSON listos para citar: llena las
                            llaves {set}, {fechaNavidad}… de la descripción y las preguntas
vite/esquema.js             el JSON-LD (@graph: WebSite, LocalBusiness, WebPage,
                            OfferCatalog con cada Product, MerchantReturnPolicy, FAQPage)
vite/buscadores.js          sitemap.xml, robots.txt, llms.txt y manifest.webmanifest,
                            armados de src/datos en cada build (y servidos en dev)
vite/hoja-en-linea.js       la hoja de index.html va en un <style> (un viaje menos)
404.html                    la página de "no existe" (GitHub Pages la sirve sola)
src/parciales/secciones/    una sección por archivo, en el orden de la página
src/parciales/piezas/       botón, enlace, isla, pie, píldora, confeti
src/estilos/main.css        tokens, fuentes y capítulos (colores de rol)
src/estilos/componentes.css botón, isla, menú, formularios, apariciones
src/estilos/secciones/      lo propio de cada sección
src/main.js                 casi nada: pide src/aplicacion.js DESPUÉS del primer pintado
src/aplicacion.js           Stimulus + GSAP; las escenas de scroll se registran una por tarea
src/controladores/          Stimulus: revela, suave, isla, lectura, tendedero,
                            taller, encargo, pildora, video-fondo, carril,
                            galeria, pedido, costura, varitas, zoom, abono
src/precios.js              formato "$6.00", total, "desde" y abono: lo usan
                            pedido, varitas y encargo
src/estilos/motivos.css     los motivos de fondo (ningún capítulo es liso)
src/estilos/costura.css     el hilo que cose la página
src/parciales/piezas/logo   el sello de estrella de fieltro (propuesta)
scripts/procesar-material.sh  fotos y videos de Erika → img/ y video/
scripts/iconos.mjs          docs/logo/sello-color.svg → public/apple-touch-icon.png e iconos
scripts/recortar-fuente-mano.py  Shantell Sans recortada a lo que usa la página
docs/                       brief, investigación, material de Erika, logo,
                            publicidad, motion, fotos de muestra viejas
```

### El sistema

- **Paleta "mola caribe"** (docs/research.md §3): papel crema `#FBF1E1`, tinta
  añil `#1E1A3C`, y mango, papaya, mola, turquesa, hibisco, selva y el lila
  de la varita (`.e-lila`, `#CDB9F2`) en bloques. Cada sección es un capítulo con UN color protagonista
  (`.e-papel`, `.e-noche`, `.e-mango`, `.e-turquesa`, `.e-mola`…) que define
  los colores de rol; los contrastes están medidos en `main.css`.
- **Tipografía**: Caprasimo (titulares, sólo ≥ 32px), Figtree (texto) y
  Shantell Sans para una o dos notas a mano. Autoalojadas y precargadas.
- **Escenas**: el tendedero del hero (adornos grandes que se mecen; al
  tocarlos el papel se tiñe de su color) bajo el nombre "Bienvenidos a
  Elizabeth Creations", las lucecitas de Navidad, la galería colgada de "Las
  piezas" (traída de `variantes/navidad`: cable, pinzas de madera y una fila
  que se desliza de lado sola —dedo, trackpad, teclado o flechas ← →— sin
  fijar la sección; cada pieza se mece como un péndulo al deslizarla),
  el pedido por piezas y por sets (controlador `pedido`), la historia de
  Erika (capítulo hibisco, con su frase grande y la polaroid de sus manos), la
  foto en grande al tocar un set o una pieza (`zoom`, un `<dialog>`), la
  ventanita del abono antes de enviar un pedido (`abono`), el hilo con su
  aguja que se dibuja con el scroll por el margen y termina en el WhatsApp
  del cierre (traído de `variantes/hilo`), la frase que se enciende al leerla, el marco fijo del taller,
  los banderines de papel picado, las polaroids de la varita (que caen y se
  asientan al entrar), las fichas Luna/Estrella, la ficha de pedido que arma
  el mensaje de WhatsApp, la pared con cinta (con el reel en bucle) y el
  adorno que falta del cierre.

- **Motivos**: ningún fondo es liso (pedido de Erika). Cada capítulo lleva
  uno chiquito y suave: florecitas en el hero, bastoncitos y caramelos en la
  noche de las piezas, bolitas blancas en el lila, puntadas en el taller,
  florecitas en la arena, florecitas y estrellitas en el mango, corazones en
  la pared, estrellitas en el turquesa y nieve en el rojo del cierre.
- **Pedido por sets**: sin JavaScript cada pieza y cada set tienen su enlace
  a WhatsApp con el mensaje escrito (`mensajePieza`, `mensajeSet`). Con
  JavaScript se eligen piezas o el set completo y el resumen manda una sola
  lista (`mensajePedido`) con la cuenta: todos los sets son de 3 piezas y un
  set es UN renglón a $15.00 con sus tres piezas nombradas (no la suma); si
  se eligen las tres sueltas, se juntan solas en el set, sin decir nada de
  ahorros. La galleta está en los dos sets de Navidad: una galleta suelta
  cuenta para un solo set, y dos sets de Navidad son dos galletas. Al tocar
  "Enviar", la ventanita del abono dice el 30 % en dólares (si el total es
  cerrado) y "Entendido, enviar por WhatsApp" abre el chat.
- **Varitas armables** (controlador `varitas`): forma con su foto, color,
  por unidad o por docena (variada: "$25.00 + 12 × $1.50 = $43.00"), y
  "Agregar al pedido" suma al mismo resumen de "Las piezas" (eventos
  `pedido:agregar`/`pedido:quitar`/`pedido:cambio` en `window`). La ficha de
  pedido (`encargo`) toma las piezas y precios de los mismos JSON.

### Buscadores y asistentes (SEO, AEO, GEO)

- **Una sola dirección**: `marca.url` (hoy GitHub Pages). De ahí salen el
  canonical, Open Graph, el JSON-LD, sitemap.xml, robots.txt, llms.txt y el
  manifiesto. Con dominio propio se cambia sólo eso (y el `--base` del
  workflow).
- `marca.actualizado` (AAAA-MM-DD) va al pie, al sitemap y al JSON-LD:
  cambiarlo al publicar precios o políticas nuevas.
- `marca.verificacion.google` / `.bing`: el `content` de Search Console y de
  Bing Webmaster; vacíos no se publican.
- Lo pendiente de `marca.pendiente` nunca va al JSON-LD; al ponerlo en
  `false`, aparecen solos `telephone`, `email` y `sameAs`.
- Las notas internas (ranuras "Falta que Erika…", "número por confirmar")
  sólo se ven en `npm run dev`; el build publicado dice "Foto muy pronto".
  `BORRADOR=1 npm run build` arma una copia de revisión con las notas.
- Las variantes y la galería llevan `noindex`. Mediciones de Lighthouse
  (antes y después) en `docs/lighthouse/`.

### Reglas que no se rompen

- Nada de testimonios, cifras, premios ni precios inventados.
- Tuteo de Panamá, nunca voseo ("escríbeme", "pide", no "escribime", "pedí").
- El texto de párrafo es casi tinta (`--tenue` #3B3557), nunca gris claro.
- Todo funciona sin JavaScript: lo oculto para animar vive bajo `html.js`,
  el menú y las preguntas son `<details>`, el formulario manda a `wa.me`.
- `prefers-reduced-motion` apaga el vaivén, las luces, la inercia y las
  apariciones; las flechas de la galería mueven la fila sin animar y el hilo
  aparece entero, sin aguja; los videos no arrancan y queda su póster.
- Objetivos táctiles de 44–48px, campos a 16px, foco visible, 0 scroll
  horizontal a 360px.
