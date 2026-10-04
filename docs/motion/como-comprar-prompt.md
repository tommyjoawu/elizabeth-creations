# Prompt · Motion "Cómo pedir en elizabethcreation.com"

## Objetivo
Un video tutorial corto, vertical y sin cortes, que muestre a una clienta cómo hacer un pedido en https://elizabethcreation.com desde el celular. Tiene que sentirse como **una sola toma continua**: la cámara viaja por la página y por el teléfono, y cada paso se encadena con el siguiente mediante transiciones limpias (zoom de cámara, paneo, morph o match cut de elementos compartidos). Nada de fundidos a negro, cortes secos ni barridos genéricos.

## Formato
- HyperFrames (Node 22). Composición principal **1080×1920, 30 fps, 32–40 s**, sin audio (Erika le pone música al subirlo a Instagram).
- Además, una versión **1080×1080** de 20–25 s con los mismos planos, para el feed o para incrustar en la página.
- Render con `--no-browser-gpu`. Para elementos ocultos por CSS, usar `gsap.fromTo()` y no `from()`.
- Salida: `docs/motion/como-comprar/` (proyecto) y `docs/motion/como-comprar-9x16.mp4` / `como-comprar-1x1.mp4` + poster.

## Material: capturas reales, nunca inventadas
Capturar con Puppeteer la página publicada (o `vite preview` del build) a **390×844, deviceScaleFactor 3**, una captura estática por estado. No grabar el scroll.
1. El inicio: "Bienvenidos a Elizabeth Creations".
2. "Las piezas": la galería colgada con las tarjetas de los sets y el precio "Set de 3: $15.00 · Individual: desde $6.00".
3. La tarjeta del set **Navidad clásica** antes y después de tocar "Seleccionar el set completo".
4. Una pieza suelta agregada, por ejemplo la **Guirnalda** nueva o una varita con su color.
5. La barra de resumen abajo: "N piezas · Total".
6. La ventana "Antes de enviar tu pedido", con el abono del 30 % de los sets, piezas y guirnaldas.
7. El mensaje de WhatsApp ya armado. Se recrea como pantalla de chat con el texto real que genera la página; es un mockup, no se abre WhatsApp de verdad.

Las capturas se recortan por elemento (tarjeta, botón, barra, modal) para poder animarlas como capas y no solo como pantallazos planos.

## Historia y ritmo, sin cortes
| t | Plano | Transición al siguiente |
|---|---|---|
| 0–3 s | Gancho: la estrella del logo cae colgando de su lazo y aparece "¿Cómo pido mi adorno?" (≤6 palabras, legible en miniatura). | La estrella se encoge y se convierte en el favicon/logo dentro de un teléfono que entra en cuadro. |
| 3–7 s | Teléfono con el inicio de la página. Paso **1 · Entra a elizabethcreation.com**. | Paneo vertical dentro de la pantalla hasta "Las piezas"; el cable de la galería se estira y cruza el cuadro. |
| 7–13 s | Galería: las tarjetas se mecen, el dedo desliza a la derecha. Paso **2 · Escoge tu set o tu pieza**. | Push-in de cámara sobre la tarjeta Navidad clásica hasta llenar el cuadro. |
| 13–18 s | Toque en "Seleccionar el set completo": el botón se hunde, la estrella de check se cose con un trazo punteado y aparece "+ $15.00". | La etiqueta del precio vuela (match) hasta la barra de resumen, que sube desde abajo. |
| 18–22 s | Opcional: agrega una varita y escoge el color en los círculos de color; el total se actualiza contando de $15.00 a $17.50. Paso **3 · Revisa tu pedido**. | Zoom out; la barra se vuelve el foco y el dedo toca "Enviar". |
| 22–27 s | La ventana del abono aparece con resorte suave. Texto: "30 % de abono en sets, piezas y guirnaldas · las varitas no llevan". Toque en "Entendido". | La ventana se transforma (morph) en la burbuja del chat de WhatsApp. |
| 27–33 s | El chat con el mensaje armado se escribe línea por línea. Paso **4 · Envíalo por WhatsApp y listo**. | La cámara se aleja, el teléfono se inclina y la estrella del logo vuelve a colgar. |
| 33–38 s | Cierre: logo + "Pide en elizabethcreation.com" + "@elizabeth_creationspty". Se queda quieto 2 s. | Fin. Que el último cuadro también funcione como portada. |

## Dirección visual
- **Paleta de la marca:**
  - Tinta `#1E1A3C`
  - Crema `#FBF1E1`
  - Mango `#FFC53D`
  - Lila `#CDB9F2`
  - Rosa `#F48FB1`
  - Turquesa `#12A5A0`
  - Rojo `#D3253C`
- **Fondo:** nunca liso. Bolitas o florecitas blancas suaves, como pidió Erika.
- **Tipografía:**
  - Caprasimo para los títulos de cada paso.
  - Figtree para el texto.
  - Shantell Sans para las notas a mano.
  - Todas autoalojadas desde `node_modules/@fontsource*`.
- **Recursos de la marca:** un hilo punteado rojo (el de la página) acompaña el recorrido y "cose" cada paso al siguiente. El número del paso va en una pastilla crema cosida.
- **El dedo:** un círculo suave con un "tap ripple". No usar un cursor de mouse.
- **Movimiento:** easing orgánico (`power3.inOut`, resortes suaves en los toques), cámara con un leve parallax entre el teléfono y el fondo, y las piezas colgadas meciéndose.
- **Zona segura:** los ~180 px de arriba sin texto clave (barra de anuncio de IG) y nada importante en los ~250 px de abajo (UI de reels).
- **Idioma:** español con tuteo; Erika habla en primera persona si hay texto de ella. No mencionar Panamá ni La Chorrera.

## Datos reales que deben salir bien
- Sets de 3 piezas: $15.00. Piezas individuales: desde $6.00. Varitas: $2.50 (sin abono). Guirnalda: $5.00.
- Abono: 30 % solo en sets, piezas individuales y guirnaldas; no reembolsable.
- Pago por Yappy o transferencia. Envío a todo el país.
- No inventar el número de WhatsApp. Si sale el chat, mostrar "Elizabeth Creations" como contacto, sin número.

## Verificación
- Pasar `hyperframes check` sin errores.
- Revisar una hoja de contactos de cuadros cada 2 s y mirarla de verdad: ¿se nota algún corte? ¿se lee cada paso en el teléfono? ¿los precios coinciden con la página?
- Ver la portada a ~130 px: el gancho debe leerse.
