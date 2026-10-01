# Brief compartido — erika-landing

Proyecto nuevo: /home/tjoa/Catalyst/erika-landing. Una landing de UNA página para
Erika, que hace y vende **adornos decorativos artesanales, hechos a mano**
(colgantes, esferas pintadas, guirnaldas, móviles, piezas de fieltro, cerámica,
papel, tejido… y la temporada de Navidad que se viene). Público: Latinoamérica
(Panamá), copy **en español**.

Vibra: **colorida, alegre, cálida, hecha a mano**. Nada de lujo frío ni
minimalismo gris. Tiene que sentirse como entrar a un taller lleno de color —
pero con nivel de agencia (Awwwards), no de plantilla de Etsy ni de IA genérica.

## Cómo se vende (define los CTA)
- **WhatsApp** es el CTA principal (mensaje prellenado, también por producto).
- **Instagram** como secundario (galería tipo feed / enlace al perfil).
- **Correo / formulario** para pedidos personalizados.
- Sin carrito, sin checkout, sin precios inventados.

## Marca (provisoria, todo en un solo archivo de datos para cambiarla)
- Nombre de trabajo: **"Erika"** + bajada "Adornos hechos a mano". Es un
  marcador: el nombre real de la tienda se cambia en un solo lugar.
- WhatsApp, Instagram y correo: marcadores (+507 6000-0000, @erika.hechoamano,
  hola@example.com) hasta que el cliente los dé.

## Reglas duras (heredadas de la portada v2 de ticket-qr-system)
- **No inventar hechos del negocio**: nada de testimonios falsos, cifras
  ("+500 clientes"), años de experiencia, premios ni precios. El contenido de
  producto es de muestra y vive en un archivo de datos, fácil de reemplazar.
- Contraste WCAG AA medido (4.5:1 texto normal) — con paleta colorida esto es
  lo más fácil de romper: el color va en fondos/formas, el texto se mantiene
  legible.
- Funciona sin JavaScript (lo oculto para animar vive sólo bajo `html.js`),
  respeta `prefers-reduced-motion`, foco visible, objetivos táctiles de 44–48px,
  campos a 16px, 0 scroll horizontal a 360px.
- Fuentes autoalojadas y precargadas (`font-display: swap`). El titular del
  hero entra con CSS, no espera al bundle.
- Sin emojis como iconos, sin etiquetas "SECCIÓN 01". Comentarios en español
  que explican el PORQUÉ.

## Stack
Vite + Tailwind v4 (`@tailwindcss/vite`), GSAP + ScrollTrigger, Lenis,
Stimulus (controladores portados de la v2: revela, suave, isla, lectura…).
HTML estático partido en parciales por sección (`src/secciones/*.html`) que un
plugin de Vite une en `index.html`. Build a `dist/` estático.

## Estructura de página tentativa (AIDA; se ajusta con la investigación)
1. Hero (Atención) — color, producto real, titular con carácter, CTA WhatsApp.
2. Colecciones / categorías (Interés).
3. Hecho a mano: el proceso / el taller / quién es Erika (Interés, confianza).
4. Piezas destacadas / temporada Navidad (Deseo) — cada una con "Pedir por WhatsApp".
5. Encargos personalizados (Deseo) — cómo funciona: 3 pasos.
6. Instagram / galería (prueba social sin inventar testimonios).
7. Preguntas frecuentes (lo que frena un pedido: envíos, tiempos, cuidados).
8. Cierre + contacto (Acción) y pie.
