# Elizabeth Creations — Adornos de fieltro hechos a mano

Landing de una sola página para la marca de Erika, **Elizabeth Creations**:
adornos de fieltro cosidos a mano y decorados con bisutería en La Chorrera
(Panamá Oeste). Colorida, alegre y hecha a mano, con el pedido por WhatsApp
como camino principal. En español de Panamá, de tú.

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
| `marca.json` | nombre, ciudad, políticas (pago, abono, tiempos, entrega, fecha de Navidad), historia, mensajes de WhatsApp | **real**: Elizabeth Creations, La Chorrera, Yappy o transferencia (sin efectivo), abono del 30 % en **todos** los pedidos y sets (corregido por Erika el 01-10-2026: ya no es sólo "más de $20"), que una vez abonado no se devuelve, 3 a 5 días, entrega en La Chorrera y Ciudad de Panamá, Navidad hasta el 15 de noviembre. **Pendiente** (`pendiente`): número de WhatsApp (hoy +507 6000-0000), Instagram y correo. La `historia` es un **borrador** para que Erika lo revise. |
| `productos.json` | las piezas agrupadas en **sets** (Navidad clásica, Navidad nevada, Bajo el mar, Varitas, Guirnaldas) para la galería colgada y el pedido por sets; cada pieza con `precio` y cada set completo con el suyo. **Todos los sets son de 3 piezas, $15.00** (Erika, 01-10-2026), cada uno con la foto de sus tres piezas juntas: Navidad clásica (estrella brillante, arbolito verde, galleta de jengibre; por separado $18.00), Navidad nevada (arbolito de nieve, galleta de jengibre, estrella blanca; $18.00) y Bajo el mar (sirenita, pececito, cangrejito; $20.00). La galleta va en los dos sets de Navidad: está escrita dos veces y la copia lleva `repite` | **real** (fotos de Erika); nombres descriptivos hasta que ella mande los suyos. **Precios reales** (Erika, 01-10-2026, `docs/material-erika/2026-10-01/precios.md`): todo set completo $15.00, sirenita y cangrejito $7.00, el resto $6.00, varitas $2.50, guirnalda $5.00, guirnalda con nombre de $5.00 a $10.00 (`precioHasta`, +$2.50 por color: `colorExtra`). Las **guirnaldas no tienen foto** todavía (ranura "Foto muy pronto"). Si un precio vuelve a ser `null`, la pieza dice "Precio: por confirmar" y el total también |
| `varitas.json` | luna o estrella (cada una con su foto) + color + `precios` (unidad $2.50, docena $25.00, variada +$1.50 por varita = $43.00) | **real** (audio 3 y precios del 01-10-2026). Ella dijo "el color del papel" pero la luna se ve de fieltro: la página dice "el color" a secas hasta que lo aclare. Las muestras de color son ejemplos. |
| `colecciones.json` | Navidad, Bajo el mar, Varitas, Guirnaldas, Tarjeta con tu mensaje, con una línea de precios; Navidad y Bajo el mar con la foto de un set | **real**; la tarjeta personalizada y las guirnaldas **no tienen foto** (ranura punteada) |
| `taller.json` | los pasos de "Así nace cada pieza", cada uno con su video | **real**: los 5 videos de las manos de Erika haciendo una varita de estrella (01-10-2026): coser la bisutería, coser el borde, decorar, rellenar y poner el palito, ¡lista! |
| `encargo.json` | "Así haces tu pedido": pasos, piezas y campos de la ficha | **real** |
| `preguntas.json` | preguntas frecuentes | **real**, con los precios; queda 1 ranura: el **punto de entrega/mensajería** (en el audio no se entiende el nombre) |
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
vite/ayudantes.js           {{imagen}}, {{whatsapp}}, {{whatsappPieza}}, {{icono}}, {{palabras}}…
src/parciales/secciones/    una sección por archivo, en el orden de la página
src/parciales/piezas/       botón, enlace, isla, pie, píldora, confeti
src/estilos/main.css        tokens, fuentes y capítulos (colores de rol)
src/estilos/componentes.css botón, isla, menú, formularios, apariciones
src/estilos/secciones/      lo propio de cada sección
src/controladores/          Stimulus: revela, suave, isla, lectura, tendedero,
                            taller, encargo, pildora, video-fondo, carril,
                            galeria, pedido, costura, varitas
src/precios.js              formato "$6.00", total, "desde" y abono: lo usan
                            pedido, varitas y encargo
src/estilos/motivos.css     los motivos de fondo (ningún capítulo es liso)
src/estilos/costura.css     el hilo que cose la página
src/parciales/piezas/logo   el sello de estrella de fieltro (propuesta)
scripts/procesar-material.sh  fotos y videos de Erika → img/ y video/
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
  piezas" (traída de `variantes/navidad`: cable, pinzas de madera, la sección
  se fija y la fila avanza de lado; cada pieza se mece como un péndulo),
  el pedido por piezas y por sets (controlador `pedido`), el hilo con su
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
  se eligen las tres sueltas, se juntan solas en el set. La galleta está en
  los dos sets de Navidad: una galleta suelta cuenta para un solo set (gana
  la combinación que más ahorra; a igual ahorro, el set de más arriba), y
  dos sets de Navidad son dos galletas. Si a las sueltas les falta una pieza
  para un set, el resumen sugiere "Llévate el set completo por $15.00" con
  un botón; la guirnalda
  con nombre pide el nombre y un color adicional y deja el total en "desde";
  el abono (30 %) se muestra en dólares cuando el total es cerrado.
- **Varitas armables** (controlador `varitas`): forma con su foto, color,
  por unidad o por docena (variada: "$25.00 + 12 × $1.50 = $43.00"), y
  "Agregar al pedido" suma al mismo resumen de "Las piezas" (eventos
  `pedido:agregar`/`pedido:quitar`/`pedido:cambio` en `window`). La ficha de
  pedido (`encargo`) toma las piezas y precios de los mismos JSON.

### Reglas que no se rompen

- Nada de testimonios, cifras, premios ni precios inventados.
- Tuteo de Panamá, nunca voseo ("escríbeme", "pide", no "escribime", "pedí").
- El texto de párrafo es casi tinta (`--tenue` #3B3557), nunca gris claro.
- Todo funciona sin JavaScript: lo oculto para animar vive bajo `html.js`,
  el menú y las preguntas son `<details>`, el formulario manda a `wa.me`.
- `prefers-reduced-motion` apaga el vaivén, las luces, la inercia y las
  apariciones; la galería no se fija (queda la fila deslizable) y el hilo
  aparece entero, sin aguja; los videos no arrancan y queda su póster.
- Objetivos táctiles de 44–48px, campos a 16px, foco visible, 0 scroll
  horizontal a 360px.
