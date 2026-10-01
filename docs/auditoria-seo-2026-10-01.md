# Elizabeth Creations · Auditoría SEO / AEO y competencia

Fecha: 1 de octubre de 2026. Auditoría de solo lectura del sitio https://tommyjoawu.github.io/elizabeth-creations/ y del código.

## 0. Resumen en 30 segundos
- Hoy hay **tres fallas que anulan casi todo el SEO**: el `canonical` y el `og:url` apuntan a `https://elizabethcreations.example.com/`; la `og:image` también, así que **al compartir el link en WhatsApp o Facebook no sale la foto**; y los 32 botones de WhatsApp abren `wa.me/50760000000`, un número de prueba.
- La página muestra **notas internas** en público ("Falta que Erika lo confirme… (en el audio no se entiende el nombre)", "+507 6000-0000 número por confirmar").
- **En Google casi no hay competencia directa para "adornos de fieltro" en Panamá**: salen tutoriales, Pinterest y sederías que venden fieltro en lámina. Las que venden adornos terminados están solo en redes y son muy chicas.
- Se puede quedar **#1 en los términos con "La Chorrera" y "producto + Panamá"**, pero el volumen es de decenas de búsquedas al mes: **la venta va a salir de Google Business Profile, Instagram/Facebook, WhatsApp y ferias.**
- Para que una IA la cite: **ficha de Google + reseñas + el mismo nombre, zona y teléfono en todos lados**. El `llms.txt` casi no mueve la aguja.

## 1. Problemas del sitio en vivo

### Críticos
| # | Problema | Arreglo |
|---|---|---|
| C1 | Canonical a un dominio falso (`marca.url` en `src/datos/marca.json`) | Poner la URL real; con dominio propio se cambia solo ahí |
| C2 | og:image y og:url rotas | Se arregla con C1; probar con el Sharing Debugger de Facebook y mandándote el link por WhatsApp |
| C3 | WhatsApp de prueba en los 32 botones | Número real de Erika antes de anunciar el sitio |
| C4 | Notas internas visibles | En producción, texto neutro ("Foto muy pronto", "el costo de entrega te lo confirmo por WhatsApp") |
| C5 | Repo público | No subir nada privado de Erika (`docs/material-erika` ya está excluido) |

### Importantes
| # | Problema | Arreglo |
|---|---|---|
| I1 | H1 = "Bienvenidos a Elizabeth Creations" | H1 con términos: "Adornos de fieltro hechos a mano en La Chorrera" (la marca sigue grande) |
| I2 | H2 poéticos sin términos | "Adornos navideños de fieltro: sets de 3 por $15", "Varitas mágicas de fieltro (luna o estrella)", "Guirnaldas de fieltro con nombre", "Cómo pedir tus adornos por WhatsApp", "Preguntas frecuentes sobre los adornos de fieltro" |
| I3 | H3 "Galleta de jengibre" duplicado | Distinguir la segunda |
| I4 | **No hay medidas** en ningún lado | Pedirle a Erika las medidas de cada pieza |
| I5 | JSON-LD pobre y con URL falsa | Ver §6.3 |
| I6 | `/variantes/*` y `/docs/galeria/` indexables | `noindex` y sacarlas del deploy cuando no hagan falta |
| I7 | 404 genérico de GitHub | `404.html` propio |
| I8 | robots.txt en subruta no sirve | Enviar el sitemap a mano en Search Console |
| I9 | Rendimiento móvil: Perf 52, **TBT 6.3 s**, TTI 10.1 s, LCP 4.3 s, 1,476 nodos DOM | Cargar GSAP/Lenis después del primer pintado, quitar reflows forzados, reducir DOM |
| I10 | Pocas variantes de "hecho(s) a mano" | Variar frases sin rellenar |
| I11 | Una sola URL para todo | Páginas por colección (§4B) |
| I12 | Cache fija de 10 min en GitHub Pages | Dominio propio + Cloudflare |

### Lo que ya está bien
Contenido en HTML estático (precios, FAQ, políticas visibles para Google y las IA), precios publicados en texto (casi nadie lo hace localmente), alt de fotos en español, CLS 0, Accesibilidad 100, y el JSON-LD no publica datos de prueba.

## 2. Auditoría del prompt de optimización
1. El canonical no tenía valor definido. **Conviene comprar el dominio antes de empujar SEO.**
2. robots.txt en subruta no tiene efecto; funciona el meta `noindex` y el sitemap manual.
3. ItemList/Product en la home sirve para las IA, **pero no da rich results**: Google limita los Product snippets a páginas de un solo producto, y los merchant listings exigen comprar en la página.
4. FAQPage: bien para las IA, pero **Google dejó de mostrar FAQ rich results el 7 de mayo de 2026**.
5. `Store` implica local físico: mejor `LocalBusiness`/`OnlineStore` con `areaServed`, sin `geo`, sin calle, sin horario.
6. **Nunca** `AggregateRating`/`Review` propios.
7. Faltaban: quitar notas internas, H1/H2 con términos, medidas, el JS del hilo principal como problema #1, Search Console + **Bing Webmaster Tools** (ChatGPT Search y Copilot usan Bing), fecha con año, y poner lo de fuera del sitio (Google Business, dominio, reseñas) **al principio**, no al final.

**Title propuesto:** `Adornos de fieltro hechos a mano en La Chorrera, Panamá · Elizabeth Creations`
**Meta description:** `Adornos navideños de fieltro cosidos a mano en La Chorrera: sets de 3 por $15, varitas mágicas a $2.50 y guirnaldas con nombre. Pide por WhatsApp; Navidad hasta el 15 de noviembre.`

## 3. Competencia

| Competidor | Qué hace bien | Debilidad que aprovechar |
|---|---|---|
| [Sueños en Fieltro](https://www.facebook.com/suenosenfieltropanama/) (FB, 61 likes) | Mismo nicho | Sin web ni precios |
| [Sempiterno](https://www.instagram.com/sempiterno.handstitch/) (IG, 788 seguidores) | Constancia | Sin web; no confirmado que sea de Panamá |
| [Regalos Personalizados PTY](https://regalospersonalizadospty.com/) | Web completa, 3–4 días | Industrial, $10–$18, nada de fieltro |
| [Christmas Warehouse PTY](https://christmaswarehousepty.com/) | Desde $2, envío gratis desde $100 | Importado: "no es de fábrica" |
| [Taller del Pesebre](https://www.tallerdelpesebre.com) | Hecho a mano, apartado, blog, FAQ | Madera, $24–$450: **copiar su estructura** |
| [Artesanos de Panamá](https://artesanosdepanama.com/) | Testimonios, personalizados | Sin Navidad: posible socio de reventa |
| [Manos del Istmo](https://manosdelistmo.com) | Publica envío ($6.50) | Lección: publicar el costo de entrega |
| Temu / Alibaba / [Etsy](https://www.etsy.com/market/felt_christmas_ornaments_personalized) | $0.50–$2 / $12–$22 | Erika es el punto medio: hecha a mano, local, 3–5 días, con nombre |

Ferias como canal: [AMPYME](https://ampyme.gob.pa/?p=31433), [bazar de Cancillería](https://mire.gob.pa/bazar-navideno-de-cancilleria-convertido-en-vitrina-del-talento-emprendedor/), [Villas Navideñas de La Chorrera](https://www.panamaamerica.com.pa/provincias/alcaldia-de-la-chorrera-da-detalles-de-la-celebracion-del-desfile-y-villas-navidenas/amp), [Casa Artesanal en la Feria de La Chorrera](https://micultura.gob.pa/2025/01/23/micultura-reafirma-el-compromiso-con-los-artesanos-en-la-feria-internacional-de-la-chorrera/) (enero).

### Palabras clave (volumen ESTIMADO, sin verificar: ● <10, ●● 10–50, ●●● 50–200 al mes)
| Palabra clave | Vol. | Dificultad | Dónde |
|---|---|---|---|
| adornos de fieltro La Chorrera | ● | Muy baja | Home |
| adornos de fieltro Panamá | ●● | Baja | Home + `/navidad/` |
| adornos navideños hechos a mano Panamá | ●● (pico oct–dic) | Baja-media | `/navidad/` |
| guirnalda con nombre Panamá | ●–●● | Baja | `/guirnaldas-con-nombre/` |
| varitas mágicas de fieltro / recuerdos de cumpleaños | ●●–●●● | Media | `/varitas-magicas/` |
| regalos hechos a mano Panamá / regalo de $15 | ●● | Baja-media | Guía de regalos |
| adornos bajo el mar / sirenita | ● | Baja | `/bajo-el-mar/` |

Confirmar volúmenes en Google Keyword Planner (ubicación Panamá) y Google Trends.

## 4. Mejoras en el sitio
**P0 (esta semana):** URL real, esconder notas internas, H1/H2 con términos, title y description, fecha con año.
**P1 (antes del 15 de octubre):**
- Ficha por set: medidas, materiales, cinta incluida, cuidado, aviso de edad si lleva piezas pequeñas (confirmar con Erika: las varitas son para niños y llevan perlitas y cascabel).
- Línea "Soy Erika, de La Chorrera…" con lo que ella confirme.
- Páginas nuevas (cada una con su foto, title, canonical y entrada en el sitemap; **no crear páginas sin foto**):
  - `/navidad/`: los 2 sets, ficha técnica, fecha de corte.
  - `/varitas-magicas/`: $2.50, $25 la docena, $43 variada; recuerdos de cumpleaños, piñatas, baby showers (aquí sí califica para Product snippet).
  - `/guirnaldas-con-nombre/`: cuando haya foto.
  - `/bajo-el-mar/`: set para cumpleaños de sirenas.
  - `/regalos-hechos-a-mano-panama/`: guía por presupuesto ($3, $7, $15, $25).
  - `/como-cuidar-adornos-de-fieltro/`: ángulo de la humedad panameña.
- Secciones nuevas: "Hecho a mano vs. de fábrica" (tabla honesta), "¿Para quién es?", cuenta regresiva al 15/11, foto del empaque, reseñas cuando existan.

## 5. Fuera del sitio (Erika / Tommy)
1. **Google Business Profile** (lo más importante): negocio de área de servicio con la dirección oculta, nombre exacto "Elizabeth Creations" (sin palabras clave), productos con precio, 15–20 fotos reales, publicaciones semanales hasta diciembre, atributo Yappy.
2. **WhatsApp Business** con catálogo, respuesta automática y etiquetas.
3. **Dominio propio**: `elizabethcreations.com` está tomado; sugerencia `elizabethcreationspty.com` (verificado solo por DNS) detrás de Cloudflare.
4. **Mismo usuario y datos en todos lados**: "Elizabeth Creations · La Chorrera, Panamá Oeste · +507 …".
5. **Redes**: 3 reels por semana con los que ya hay; grupos de Facebook de La Chorrera y Arraiján; Marketplace; **Pinterest** (domina "adornos de fieltro" y manda tráfico de búsqueda).
6. **Reseñas**: meta 10–15 en Google esta Navidad; pedir el link al entregar, sin descuentos a cambio.
7. **Directorios**: Infoguía (gratis), Bing Places, Apple Business Connect, Páginas Amarillas, Encuentra24, AMPYME.
8. **Ferias, prensa y colaboraciones**: bazares de noviembre con tarjeta y QR; nota a medios de Panamá Oeste; decoradoras de fiestas, tiendas de piñatas, fotógrafas navideñas, escuelas.

## 6. AEO / GEO (que las IA la citen)
- En citas locales de IA pesa más la ficha de Google (~42 %), luego directorios (~28 %), la web propia (~17 %) y la prensa (~8 %) — fuente secundaria, tómalo como tendencia.
- Frases autocontenidas con datos en la home y la FAQ (quién, qué, dónde, precios, tiempos, pagos, fecha límite con año).
- FAQ nuevas: ¿Dónde comprar adornos navideños hechos a mano en Panamá? ¿Cuánto cuesta un adorno de fieltro hecho a mano? ¿Hacen guirnaldas con nombre? ¿Venden varitas por docena para recuerdos? ¿Cuánto miden? ¿Hasta cuándo puedo pedir para Navidad? ¿Hacen pedidos para escuelas o empresas? ¿Envían a Arraiján o al interior?
- JSON-LD: `LocalBusiness`/`OnlineStore` con `@id` estable, localidad/región/país sin calle, `areaServed`, pagos, `priceRange`, ofertas `MadeToOrder`, `MerchantReturnNotPermitted`, `sameAs` solo con perfiles reales. Nunca reseñas propias, ubicación de la casa, teléfono de prueba ni horario inventado.

## 7. Plan de 6 semanas
| Semana | Sitio | Erika / Tommy |
|---|---|---|
| 1 (1–7 oct) | URL real, notas internas, H1/H2, title, noindex, Search Console + Bing | WhatsApp real, IG/FB, medidas, fotos de guirnalda, tarjeta y empaque |
| 2 (8–14 oct) | `/navidad/`, `/varitas-magicas/`, ficha técnica, bajar TBT | Ficha de Google (la verificación tarda), comprar dominio |
| 3 (15–21 oct) | Mudanza al dominio + Cloudflare, guía de regalos, "vs. de fábrica" | Primeras reseñas, directorios, 20 pines |
| 4 (22–28 oct) | `/guirnaldas-con-nombre/`, `/bajo-el-mar/`, cuenta regresiva | Bazares de noviembre, reels |
| 5 (29 oct–4 nov) | Guía de cuidado, ajustar títulos con Search Console | Nota a medios, publicaciones de Google con "pide antes del 15/11" |
| 6 (5–15 nov) | "Últimos días"; después del 15/11, empujar varitas y recuerdos | Villas Navideñas de La Chorrera |

## 8. Incertidumbres
Volúmenes estimados; no se pudo ver un SERP de Google Panamá; ubicación de Sempiterno sin confirmar; Encuentra24 no se pudo revisar (403); nombres de categorías de Google Business sin confirmar; dominios revisados solo por DNS; el estudio de citas en IA es de fuente secundaria.
