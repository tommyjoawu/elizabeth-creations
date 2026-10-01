# Dirección visual — Erika, adornos hechos a mano (salida de Stitch)

Proyecto de Stitch: **`13718935288271484939`** ("Erika — Adornos hechos a mano")
Design system de Stitch: `assets/2850861935147440725` ("Erika Taller — Folk Color")

Las capturas y el HTML de Stitch son **sólo referencia**. El HTML usa el CDN de Tailwind,
fotos generadas por IA y textos inventados: no se copia tal cual (ver "Qué NO copiar").

## Archivos

| Archivo | Pantalla (id de Stitch) | Qué es |
|---|---|---|
| `01-desktop.png/.html` | `65b044dc747c4b0e945dafa34e333d3c` | Página completa a 1440, **versión refinada** (sin eyebrows, bordes orgánicos, tarjetas colgantes, bento de Navidad) |
| `01-desktop-v1.png/.html` | `0696b9ee60f04332b14f608e9638e124` | Primera pasada a 1440 (más genérica; se guarda para comparar) |
| `02-mobile.png/.html` | `e5df1229ab4a4f14ac2d701953e24953` | Móvil a 390: header, hero, colecciones, taller |
| `03-hero-var-a.png/.html` | `19393108af71462facc21f5e09ed9e15` | **Hero A (recomendado)**: bloques de color + adornos colgando de hilos |
| `03-hero-var-a-v1.png/.html` | `c89e929cc96746bda4a835be8ef5bf30` | Hero A antes de corregir (collage de fotos amontonado) |
| `04-hero-var-b.png/.html` | `39245d0f87074f7d8328a0ee262628ad` | Hero B: crema editorial con stickers recortados |
| `04-hero-var-b-v1.png/.html` | `ba68cd12cb1d46ddb72ea85aad31d1e5` | Hero B antes de corregir (stickers rotos y tapando el titular) |
| `assets/hero-adornos-colgantes.jpg` | — | Foto de ambiente (IA) de la versión móvil: adornos de fieltro y madera colgados sobre pared crema. Es la mejor referencia de "cómo se debe ver la foto real" |
| `assets/adorno-*.jpg` | — | Adornos sueltos (IA) generados por Stitch: corazón y estrella de fieltro, esfera pintada. Sirven como marcadores de recorte |

Nota: en `01-desktop*.png` las webfonts no cargaron al hacer la captura y el texto sale en
una sans genérica; `02`, `03` y `04` sí muestran Bricolage Grotesque + DM Sans.

## Hero recomendado: A, con dos préstamos de B

**A — "Bloques de color con adornos colgantes"** (`03-hero-var-a.png`). Por qué:
- Es la que más se parece a "entrar a un taller lleno de color": el color está en planos grandes,
  como un puesto de mercado pintado, no esparcido en detalles.
- El producto es el protagonista: los adornos cuelgan de hilos desde el borde superior, que es
  literalmente cómo se exhiben y se usan. Además es el gesto de movimiento más propio del sitio
  (balanceo suave con GSAP).
- El titular crema sobre fucsia es enorme y legible (5.16:1), y la estructura aguanta con
  fotos imperfectas: si no hay recortes limpios, los adornos van en círculos o baldosas con
  borde de tinta, como en la captura, y sigue funcionando.
- Pasa a móvil sin trucos: bloque fucsia con titular + CTA primero, franja girasol/turquesa con
  3 adornos colgando debajo.

**B** (`04-hero-var-b.png`) es más fina y editorial, pero el titular centrado con fotos
flotando alrededor es un recurso muy visto en Awwwards. Además depende de recortes perfectos
y, en las dos pasadas, Stitch terminó tapando letras con stickers. Tomamos de B:
1. el **sticker troquelado** (borde blanco grueso + sombra dura de tinta) para las insignias y
   los adornos recortados;
2. el **confeti folk** plano (estrella de 8 puntas, gota, flor de 6 pétalos, hoja) repartido en
   los márgenes.

Titular: vale cualquiera de los dos. "Hecho a mano, lleno de color." (A) es más corto y
contundente. "Adornos hechos a mano para llenar tu casa de *color*" (01/02) dice qué se vende
y trae el motivo de **la palabra dentro de una píldora girasol inclinada**, que conviene
usar en las secciones sobre crema.

## Paleta

Todo el color va en fondos, bloques, formas, stickers y anillos de foto. El texto chico
siempre es tinta sobre claro, o crema sobre ciruela o fucsia.

| Token | Hex | Rol | Texto permitido encima (contraste medido) |
|---|---|---|---|
| `--papel` | `#FFF4E4` | Fondo de página, crema cálida de papel | tinta 15.5 · fucsia 5.16 · `#6B4A73` (texto secundario) 6.77 |
| `--papel-2` | `#FBE7CF` | Superficie alterna, bandas suaves, campos | tinta 13.99 |
| `--tinta` | `#2B1238` | Todo el texto y los titulares sobre claro, bordes de 2px, sombras duras | — |
| `--ciruela` | `#4A1D5C` | Banda del taller, pie. Color oscuro de apoyo | crema 11.91 · `#E8D6EC` (cuerpo) 9.41 · girasol 8.01 |
| `--fucsia` | `#C8175F` | Primario: botón WhatsApp, bloque del hero, banda de cierre | crema 5.16 (**nada de tinta**: 3.0) |
| `--mandarina` | `#F4661B` | Banda de encargos, stickers, tarjetas | tinta 5.43 (**crema no**: 2.86) |
| `--girasol` | `#FFC21F` | Píldora de palabra, marquesina, stickers, subrayado dibujado | tinta 10.42 |
| `--turquesa` | `#12A89E` | Bloques, manchas, panel de FAQ, anillos | tinta 5.71 (**crema no**: 2.71) |
| `--hoja` | `#3E9B45` | Sólo formas: hojas, confeti, un anillo de foto | tinta 4.80 si hace falta (**crema no**: 3.23) |
| `--rosa` / `--menta` | `#FFD6E3` / `#CDEFE6` | Tintes opcionales, sólo como superficie de tarjeta, nunca bandas grandes | tinta 12.8 / 13.7 |

Reglas: sin degradados ni resplandores borrosos. El foco visible es un contorno de 3px en
tinta con 3px de separación. Sobre fucsia o ciruela, el contorno va en girasol.

## Tipografía (OFL, Google Fonts / Fontsource, autoalojadas)

- **Display: Bricolage Grotesque** (`@fontsource-variable/bricolage-grotesque`, ejes
  `opsz` 12–96, `wdth` 75–100, `wght` 200–800). Peso 800, `opsz` 96, interlineado 0.92–0.98,
  tracking −0.03em. Es una grotesca con carácter, algo irregular, cálida sin caer en lo infantil.
  Tamaños: hero `clamp(3.25rem, 8.5vw, 8.25rem)`, H2 `clamp(2.5rem, 5vw, 4.5rem)`, título de
  tarjeta 1.5–1.75rem a peso 700.
- **Cuerpo: DM Sans** (`@fontsource-variable/dm-sans`). 17–18px en cuerpo, 20px en entradas,
  interlineado 1.55–1.6, pesos 400/500/700. Botones a 600–700, 17–18px.
- **Acento opcional: Fraunces Italic** (`@fontsource-variable/fraunces`, `SOFT` 100, `WONK` 1),
  como máximo en 1 o 2 palabras de toda la página (por ejemplo, *a mano*), para dar el toque
  cosido a mano. Si compite con la píldora girasol, se descarta.
- Nada de eyebrows en mayúsculas con tracking. Si hace falta una etiqueta, va en tipo oración.

## Forma, bordes y sombras

- Radios: tarjetas 28–32px, paneles grandes 40px, botones y píldoras 999px. **Máscaras de foto**:
  arco (`border-radius: 999px 999px 28px 28px`), círculo y rectángulo girado 2–3°.
- Borde de tinta de 2px en tarjetas, fotos, botones y stickers. Es el trazo que le da cara de
  "recortado y pegado".
- **Sombras duras, nunca difusas**: `4px 4px 0 var(--tinta)` en botones y stickers chicos,
  `6px 6px 0` en tarjetas. Al pasar el mouse: `translate(-2px,-2px)` y la sombra crece a 6/8px.
  Al presionar: vuelve a 0 y la sombra desaparece.
- Anillo de color desplazado detrás de las fotos (girasol, turquesa o mandarina), como en el taller.
- Rotaciones: tarjetas entre −2° y 2°, stickers entre −10° y 10°. Nunca dos vecinos con el mismo ángulo.
- Botones de al menos 52px de alto en escritorio y CTA de 56px a todo el ancho en móvil.

## Sección por sección

1. **Header** (crema). Wordmark "Erika" en Bricolage 800 con la bajada "Adornos hechos a mano"
   en DM Sans. 5 enlaces y píldora fucsia "Pedir por WhatsApp" con sombra dura. El borde de abajo
   es un **festón** (fila de semicírculos crema) que muerde el hero (A). En móvil: píldora
   "WhatsApp" + botón de menú redondo con borde de tinta (02).
2. **Hero** (A). Bloque fucsia de ~55% con el titular crema gigante, un **subrayado girasol
   dibujado a mano** (trazo SVG que se dibuja al cargar), párrafo, píldora crema "Pedir por
   WhatsApp" y enlace subrayado a Instagram. A la derecha, bloque girasol arriba y turquesa
   abajo, con 4 adornos que **cuelgan de hilos a distintas alturas** desde el borde superior.
   Encima, un sticker redondo mandarina con **texto en tinta**, "Encargos de Navidad abiertos",
   girado −8°. Confeti: una estrella girasol y una hoja. Nada más. En móvil, el orden es
   contenido primero (el titular es el LCP y entra con CSS), luego la franja de adornos. Otra
   opción de móvil ya probada (02): foto en arco con una mancha turquesa desplazada detrás y el
   sticker "Hecho a mano en Panamá".
3. **Colecciones — "Encuentra tu pieza"**. Una **cuerda de guirnalda** con cuentas de colores
   cruza el contenedor y de ella cuelgan 5 tarjetas con hilos cortos. Cada tarjeta tiene un color
   de acento, texto en tinta y la foto en arco con borde de tinta. Llevan rotaciones y desfases
   verticales alternados (01). Al pasar el mouse, la tarjeta se balancea hasta 0°. En móvil:
   carrusel con scroll-snap que deja asomar la siguiente tarjeta (02).
4. **El taller — "Del hilo a tu árbol"**. Festón de entrada a la banda ciruela, con titular crema.
   Collage de 3 fotos del proceso en arco, círculo y rectángulo girado, cada una con anillo de
   color. Las etiquetas-píldora sobre las fotos ("Pinceladas vivas") quedan bien, pero sólo si
   el texto es verdad. Los 3 pasos (Diseño / Pinto y coso / Empaco con cariño) llevan
   **marcadores de forma folk** (estrella, círculo, corazón como en 02), no "01/02/03". Sale
   con una onda de vuelta a crema.
5. **Navidad — "Ya viene diciembre"**. Arriba, una **marquesina girasol** con texto en tinta
   ("Encargos de Navidad abiertos ★ …"). Debajo, un **bento asimétrico**: 1 pieza destacada alta
   con foto en arco, 4 chicas con foto en círculo o arco y anillo de color, y 1 ancha. Cada pieza
   tiene nombre, una línea de descripción, etiqueta de material y la píldora fucsia "Pedir por
   WhatsApp", con mensaje prellenado que incluye el nombre de la pieza. En la tarjeta destacada
   de 01 sobra un hueco vacío: hay que rellenarlo o acortarla.
6. **Encargos — "¿Lo quieres con tu nombre?"**. Banda mandarina con **borde ondulado** y texto
   en tinta. Son 3 tarjetas crema con número en círculo de color (aquí el número sí dice algo:
   es un orden). Un **hilo punteado** las une, como una costura. CTAs: WhatsApp en fucsia y
   "Escribir por correo" con contorno crema. Sin las etiquetas en mayúsculas del pie de cada tarjeta.
7. **Instagram**. El handle es el titular. 6 baldosas con desfase vertical alternado, radio 20px,
   borde de tinta y sombra dura, más la píldora de contorno "Ver Instagram". Son fotos propias
   enlazadas al perfil; no hay API.
8. **Preguntas frecuentes**. Dos columnas. Izquierda: panel turquesa con **texto en tinta**, un
   adorno colgado de una "chinche" en el borde superior y una foto de la mesa de trabajo.
   Derecha: acordeón hecho con `<details>/<summary>` (funciona sin JS), filas crema con borde de
   2px y sombra dura, y un círculo de color con "+" que gira a "×".
9. **Cierre y pie**. Borde de **papel picado en zig-zag** de entrada a la banda fucsia. Titular
   crema enorme, "Hagamos algo bonito juntos", píldora crema "Pedir por WhatsApp" y el correo
   subrayado. Pie ciruela con wordmark, navegación y contacto, títulos en girasol y en tipo oración.

## Motivos que vale la pena construir (SVG/CSS propios)

- **Bordes de sección**: festón (semicírculos), onda suave, zig-zag de papel picado. Cada uno es
  un SVG `preserveAspectRatio="none"` o una `mask` repetida, del color de la sección siguiente.
- **Hilos colgantes**: línea de 1.5px en tinta y adorno con el `transform-origin` en el nudo.
  Balanceo de ±2–3° con curva seno, entre 3 y 5 s, desfasado entre adornos. Se quieto con
  `prefers-reduced-motion`.
- **Cuerda de guirnalda** con cuentas de colores (círculos de 8px en los acentos).
- **Palabra en píldora girasol** girada −2° con sombra dura, y **subrayado dibujado** girasol
  (animación de `stroke-dashoffset`).
- **Stickers**: insignia redonda con texto en tinta, a veces con borde festoneado, y recortes de
  producto con borde blanco de 6px y sombra de tinta.
- **Juego de confeti** (6 formas planas): estrella de 8 puntas, destello de 4 puntas, flor de
  6 pétalos, gota, hoja y anillo. Se usan con moderación en los márgenes, 2 o 3 por sección
  como máximo.
- **Anillo de color desplazado** detrás de las fotos (arco, círculo o rectángulo).
- **Marquesina girasol** de la temporada, que se pausa al pasar el mouse y queda fija con
  movimiento reducido.
- Entrada al hacer scroll: las tarjetas "caen" colgando (translateY −32px y la rotación se
  asienta con un pequeño rebote). Todo lo que se oculta para animar va sólo bajo `html.js`.

## Qué NO copiar de Stitch

- **Datos inventados**, en todas sus formas. En la página: "Lana 100% natural", "madera
  recuperada", "Envíos a todo el país", "Cupos limitados", "Edición limitada", "Taller propio",
  el sticker "100%", "© 2024" y "Ciudad de Panamá" hasta que se confirme. En las **respuestas
  del FAQ**: Yappy/ACH, "2 a 3 días hábiles", "7 a 12 días", envíos al interior. En las
  descripciones de producto: "fieltro de lana 100% natural", "hilo dorado". Todo eso lo tiene
  que escribir el cliente, y va en el archivo de datos.
- Eyebrows en mayúsculas con tracking (v1: "CATÁLOGO DE FORMAS", "DIARIO VISUAL",
  "CONTACTO DIRECTO"…), los "01–05" de las categorías y los "01/02/03" de los pasos del taller.
- La fila de sellos de confianza bajo el CTA del hero (v1) y la línea de datos al pie del hero A v1.
- Las líneas negras rectas entre secciones (v1). Todo va con bordes orgánicos.
- El resplandor difuso menta/durazno detrás del arco del hero. Van formas planas.
- **Texto crema sobre turquesa, mandarina u hoja** (el panel del FAQ y la tarjeta verde en v1,
  el sticker de A v1). No pasa AA.
- La grilla uniforme de 3×2 tarjetas (v1) y el collage de fotos rectangulares encimadas (A v1).
- Stickers que tapan letras del titular (B, en las dos pasadas).
- Fotos de IA que no son producto o no son de acá: la multitud en un mercado, el nido de pájaro,
  el cuadro de paisaje en el caballete, el mercado navideño europeo. También motivos importados
  como la llama andina o el "corazón milagrito" mexicano, salvo que Erika de verdad haga esas
  piezas. Las fotos finales son las de Erika.
- Relleno de copy: "Llenando hogares de calor folclórico", "Diseñado y elaborado a mano con
  devoción ♥", el emoji 📍 del pie y las flechas ↗ en exceso.
- El HTML de Stitch en sí: Tailwind por CDN, estilos en línea, fuentes desde Google en tiempo
  de ejecución, sin `details` y sin estados de foco.

## Nota para el cliente sobre las fotos

La dirección depende de fotos reales con luz natural y fondo liso. Dos tipos:
1. **Ambiente**: piezas colgadas de hilos sobre una pared o tela crema (como
   `assets/hero-adornos-colgantes.jpg`).
2. **Pieza sola**: sobre fondo liso claro, para recortarla y usarla como sticker o adorno
   colgante del hero.

Con celular y luz de ventana alcanza. Mejor pocas fotos coherentes que muchas mezcladas.
