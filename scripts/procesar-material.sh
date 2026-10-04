#!/usr/bin/env bash
# Procesa las fotos y videos que mandó Elizabeth Creations (docs/material-erika/)
# y deja en el proyecto lo que la página usa:
#
#   src/assets/img/<slug>-<ancho>.{avif,webp,jpg}   fotos, en dos anchos
#   public/video/<slug>.{mp4,webm} + <slug>-poster.{webp,jpg}   bucles mudos
#
# Por qué así:
#   · Los nombres van en español y en kebab-case, diciendo QUÉ pieza es: el
#     WhatsApp los llama "WhatsApp Image 2026-09-29 at 7.44.12 PM (3).jpeg".
#   · Tres formatos: AVIF (el más liviano), WebP y JPEG de respaldo. El ayudante
#     {{imagen}} arma el <picture> solo con lo que encuentre en la carpeta.
#   · Las fotos son de celular sobre una pared blanca que sale gris: se les
#     sube un poco la luz y el color (-modulate/-level), igual a todas, para
#     que la pared se lea blanca y el fieltro con su color de verdad.
#   · Los videos van en "ida y vuelta" (adelante + al revés): el giro de la
#     varita o el paneo sobre la colección vuelven solos al principio y el
#     bucle no tiene corte.
#   · Las fotos de PRODUCTO (piezas, varitas, sets y las escenas de la pared)
#     salen con la marca de agua quemada abajo a la derecha (MARCA=1), igual
#     que el catálogo de Abastra: la página nunca sirve una foto limpia de una
#     pieza, ni siquiera la grande que abre el `zoom`. La marca es un PNG por
#     ancho (scripts/marca-de-agua/marca-<ancho>.png, de
#     scripts/marca-de-agua.mjs) que mide siempre el 26 % del ancho de la
#     foto. Quedan limpios los adornos redondos del hero (medallones de
#     ~7 rem: ahí una marca sería ruido), las fotos de la historia, los
#     videos y sus pósters.
#
# Correr desde la raíz:  bash scripts/procesar-material.sh
# Sólo un grupo (sin rehacer todo ni los videos):
#                         bash scripts/procesar-material.sh sets
#   grupos: piezas, adornos, escenas, sets, historia, productos (= piezas +
#   escenas + sets), videos
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
MAT="$RAIZ/docs/material-erika"
IMG="$RAIZ/src/assets/img"
VID="$RAIZ/public/video"
mkdir -p "$IMG" "$VID"

foto() { echo "$MAT/WhatsApp Image 2026-09-29 at $1.jpeg"; }
video() { echo "$MAT/WhatsApp Video 2026-09-29 at $1.mp4"; }
# La tanda del 01-10-2026 (las manos de Erika haciendo una varita de estrella)
# llegó en su propia carpeta: docs/material-erika/2026-10-01/.
foto1001() { echo "$MAT/2026-10-01/WhatsApp Image 2026-10-01 at $1.jpeg"; }
# Las fotos de los sets (01-10-2026, "todos los sets son de 3"): las tres
# piezas juntas sobre una cobija blanca.
fotoSet() { echo "$MAT/2026-10-01-sets/WhatsApp Image 2026-10-01 at $1.jpeg"; }
video1001() { echo "$MAT/2026-10-01/WhatsApp Video 2026-10-01 at $1.mp4"; }

TONO=(-modulate 104,110 -level 0%,95%)

MARCAS="$RAIZ/scripts/marca-de-agua"

# exportar <slug> <origen> <recorte|-> <ancho1> <ancho2>
#   recorte: "cx cy lado" (un cuadrado centrado en la pieza), "AxB+X+Y" (un
#   rectángulo, en píxeles de la foto ya girada) o "-" (la foto entera, 3:4).
#   GIRO=-90 delante gira la foto antes de recortar (una foto tomada de lado).
#   MARCA=1 delante le quema la marca de agua a cada ancho exportado.
#   DIFUMINAR="cx cy rx ry" delante difumina una elipse (en píxeles de la
#   foto original, antes de recortar): la clienta pidió no mostrar nunca la
#   cara de su hija. El original de docs/ queda intacto.
exportar() {
  local slug="$1" origen="$2" recorte="$3"; shift 3
  local base="/tmp/elizabeth-$slug.png"
  local giro=(-auto-orient)
  [[ -n "${GIRO:-}" ]] && giro+=(-rotate "$GIRO" +repage)
  if [[ -n "${DIFUMINAR:-}" ]]; then
    # La foto, una copia muy borrosa y una máscara con la elipse de bordes
    # suaves: sólo esa zona toma la copia borrosa, sin un recuadro que se note.
    local cx cy rx ry limpia="/tmp/elizabeth-$slug-difuminada.png"
    read -r cx cy rx ry <<<"$DIFUMINAR"
    convert "$origen" -auto-orient \
      \( +clone -blur 0x16 \) \
      \( +clone -fill black -colorize 100 -fill white -draw "ellipse $cx,$cy $rx,$ry 0,360" -blur 0x6 \) \
      -composite "$limpia"
    origen="$limpia"
  fi
  if [[ "$recorte" == "-" ]]; then
    convert "$origen" "${giro[@]}" "${TONO[@]}" "$base"
  elif [[ "$recorte" == *x*+*+* ]]; then
    convert "$origen" "${giro[@]}" -crop "$recorte" +repage "${TONO[@]}" "$base"
  else
    read -r cx cy lado <<<"$recorte"
    convert "$origen" "${giro[@]}" -crop "${lado}x${lado}+$((cx - lado / 2))+$((cy - lado / 2))" +repage "${TONO[@]}" "$base"
  fi
  for ancho in "$@"; do
    local medida="/tmp/elizabeth-$slug-$ancho.png"
    convert "$base" -resize "${ancho}x" "$medida"
    if [[ -n "${MARCA:-}" ]]; then
      # Abajo a la derecha, separada del borde lo mismo en proporción que
      # en Abastra (14 px en 600): 2.3 % del ancho.
      local marca="$MARCAS/marca-$ancho.png" margen=$(( (ancho * 233 + 5000) / 10000 ))
      [[ -f "$marca" ]] || { echo "Falta $marca: corre node scripts/marca-de-agua.mjs (y agrega $ancho a ANCHOS)" >&2; exit 1; }
      convert "$medida" "$marca" -gravity SouthEast -geometry "+$margen+$margen" -composite "$medida"
    fi
    convert "$medida" -strip -quality 80 "$IMG/$slug-$ancho.webp"
    convert "$medida" -strip -quality 55 "$IMG/$slug-$ancho.avif"
    convert "$medida" -strip -sampling-factor 4:2:0 -interlace JPEG -quality 80 "$IMG/$slug-$ancho.jpg"
    rm -f "$medida"
  done
  rm -f "$base" "/tmp/elizabeth-$slug-difuminada.png"
  echo "  ✓ $slug${MARCA:+ (con marca de agua)}"
}

# Los sets: el letrero de cada set en "Las piezas" y el banderín de la
# colección. Recortados apaisados (~4:3) y apretados alrededor de las tres
# piezas: en la cobija sobra mucho blanco. Las fotos miden 960 o 1200 de
# ancho, así que salen en 600 y 960 (nunca agrandadas: el ancho del nombre
# es el `w` del srcset).
sets() {
  echo "Los sets, las tres piezas juntas sobre la cobija:"
  # Bajo el mar llegó acostada (1280×960, la sirenita de lado): se gira
  # -90° para que las tres caritas queden derechas.
  GIRO=-90 MARCA=1 exportar set-bajo-el-mar     "$(fotoSet '1.58.16 PM')" "960x720+0+330"     600 960
  MARCA=1 exportar set-navidad-nevada           "$(fotoSet '1.58.26 PM')" "960x760+0+310"     600 960
  # Las tres en fila (mucha cobija vacía arriba y abajo): bien apretada.
  # Es la del banderín de Navidad, que es ancho y bajito.
  MARCA=1 exportar set-navidad-clasica          "$(fotoSet '2.05.09 PM')" "1000x750+100+430"  600 960
  # Las tres agrupadas, más de cerca: la del letrero del set.
  MARCA=1 exportar set-navidad-clasica-cerca    "$(fotoSet '2.05.10 PM')" "1200x900+0+350"    600 960
}

piezas() {
echo "Piezas en la mano, con la luz de la ventana (las etiquetas), con marca de agua:"
MARCA=1 exportar pieza-arbol-verde        "$(foto '7.44.24 PM (6)')" - 600 1200
MARCA=1 exportar pieza-arbol-blanco       "$(foto '7.44.24 PM (3)')" - 600 1200
MARCA=1 exportar pieza-estrella-amarilla  "$(foto '7.44.25 PM')"     - 600 1200
MARCA=1 exportar pieza-estrella-blanca    "$(foto '7.44.24 PM (4)')" - 600 1200
MARCA=1 exportar pieza-galleta-jengibre   "$(foto '7.44.24 PM (5)')" - 600 1200
MARCA=1 exportar pieza-sirenita           "$(foto '7.44.24 PM')"     - 600 1200
MARCA=1 exportar pieza-pececito           "$(foto '7.44.24 PM (2)')" - 600 1200
MARCA=1 exportar pieza-cangrejito         "$(foto '7.44.24 PM (1)')" - 600 1200
MARCA=1 exportar pieza-varita-luna        "$(foto '7.44.25 PM (1)')" - 600 1200
# La varita de estrella terminada (01-10-2026): fieltro blanco con carita,
# lentejuelas, cinta rosada y cascabel. Ya viene en 3:4 (1200×1600).
MARCA=1 exportar pieza-varita-estrella    "$(foto1001 '1.28.30 PM')" - 600 1200
}

adornos() {
echo "Adornos colgados, recortados en cuadrado (medallones del tendedero y la pared), sin marca:"
exportar adorno-estrella-amarilla "$(foto '7.44.12 PM (4)')" "555 825 620"   400 800
exportar adorno-sirenita          "$(foto '7.44.12 PM (7)')" "562 837 720"   400 800
exportar adorno-galleta-jengibre  "$(foto '7.44.12 PM (3)')" "530 862 660"   400 800
exportar adorno-arbol-verde       "$(foto '7.44.12 PM (5)')" "625 900 760"   400 800
exportar adorno-cangrejito        "$(foto '7.44.13 PM')"     "580 912 800"   400 800
exportar adorno-pececito          "$(foto '7.44.13 PM (1)')" "567 925 700"   400 800
exportar adorno-estrella-blanca   "$(foto '7.44.12 PM (2)')" "575 950 740"   400 800
exportar adorno-arbol-blanco      "$(foto '7.44.12 PM (1)')" "595 900 680"   400 800
exportar adorno-varita-luna       "$(foto '7.44.19 PM')"     "555 650 760"   400 800
}

escenas() {
echo "Escenas (la varita en uso, la colección junta), con marca de agua:"
# Las fotos 7.44.11 PM y 7.44.12 PM (una niña con la varita) NO se exportan:
# la clienta pidió quitarla. Se usan las fotos de la varita sola.
# También llevan marca: son fotos de producto en 1200 (la pared, el banderín
# de Varitas), y una limpia ahí sería la copia que se puede llevar cualquiera.
MARCA=1 exportar varita-luna-ventana       "$(foto '7.43.59 PM')"     - 600 1200
MARCA=1 exportar coleccion-fieltro         "$(foto '7.44.13 PM (2)')" - 600 1200
}

# La historia de Erika (03-10-2026, docs/material-erika/2026-10-03-historia/):
# cuatro fotos para las polaroids de "Mi historia", en 4:5 y sin marca (no
# son producto). Miden 1200×1600; salen en 480 y 960 (la polaroid más ancha
# mide ~15 rem).
fotoHistoria() { echo "$MAT/2026-10-03-historia/WhatsApp Image 2026-10-03 at 6.31.31 PM$1.jpeg"; }
historia() {
  echo "La historia de Erika (polaroids):"
  # Su hija de espaldas, con su vestido de princesa, en el cuarto decorado
  # con hojas y copos de foami. No se le ve la cara: va sin difuminar.
  exportar historia-cuarto     "$(fotoHistoria '')"     "1040x1300+80+120"  480 960
  # La ecografía enmarcada con flores y mariposas de foami.
  exportar historia-ecografia  "$(fotoHistoria ' (2)')" "1200x1500+0+100"   480 960
  # Erika con la bebé en brazos frente al espejo que decoró. La bebé está de
  # espaldas, pero asoma el borde de su mejilla junto a la oreja: se difumina
  # esa zona (la cara de Erika la tapa el celular).
  DIFUMINAR="620 752 30 44" exportar historia-espejo "$(fotoHistoria ' (3)')" "800x1000+250+520" 480 960
  # Las princesas de foami que hacía antes de descubrir el fieltro.
  exportar historia-foami      "$(fotoHistoria ' (1)')" "1200x1500+0+40"    480 960
}

productos() { piezas; escenas; sets; }

if [[ -n "${1:-}" && "$1" != "videos" ]]; then "$1"; exit 0; fi
if [[ -z "${1:-}" ]]; then piezas; adornos; escenas; sets; historia; fi

# bucle <slug> <origen> <desde> <dura>
bucle() {
  local slug="$1" origen="$2" desde="$3" dura="$4"
  local filtro="[0:v]trim=start=$desde:duration=$dura,setpts=PTS-STARTPTS,eq=brightness=0.03:saturation=1.12,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]"
  ffmpeg -v error -y -i "$origen" -filter_complex "$filtro" -map "[v]" -an \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 25 -preset slow -movflags +faststart "$VID/$slug.mp4"
  ffmpeg -v error -y -i "$origen" -filter_complex "$filtro" -map "[v]" -an \
    -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good "$VID/$slug.webm"
  ffmpeg -v error -y -ss 0.4 -i "$VID/$slug.mp4" -frames:v 1 -update 1 "/tmp/elizabeth-poster.png"
  convert /tmp/elizabeth-poster.png -strip -quality 80 "$VID/$slug-poster.webp"
  convert /tmp/elizabeth-poster.png -strip -quality 80 "$VID/$slug-poster.jpg"
  rm -f /tmp/elizabeth-poster.png
  echo "  ✓ $slug ($(du -h "$VID/$slug.mp4" | cut -f1) mp4, $(du -h "$VID/$slug.webm" | cut -f1) webm)"
}

echo "Videos en bucle (mudos, ida y vuelta):"
bucle varita-luna-gira      "$(video '7.44.04 PM')" 0.5 4.5
bucle coleccion-fieltro     "$(video '7.44.18 PM')" 1 6

# recto <slug> <origen> <desde> <dura> <poster-en>
#   Como `bucle`, pero SIN la vuelta al revés: son las manos de Erika
#   cosiendo, y una aguja que se descose hacia atrás se ve falsa. El corte
#   al volver al principio se nota menos que unas manos en reversa.
#   `poster-en` (segundos dentro del tramo) escoge el fotograma que mejor
#   cuenta el paso: es lo que se ve sin JavaScript y con reduced-motion.
#   Se dejan en 464 de ancho (el original) y con más calidad que los de ida
#   y vuelta: duran la mitad y ninguno pasa de ~0.8 MB.
recto() {
  local slug="$1" origen="$2" desde="$3" dura="$4" poster="$5"
  local filtro="trim=start=$desde:duration=$dura,setpts=PTS-STARTPTS,eq=brightness=0.03:saturation=1.12"
  ffmpeg -v error -y -i "$origen" -vf "$filtro" -an \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 23 -preset slow -movflags +faststart "$VID/$slug.mp4"
  ffmpeg -v error -y -i "$origen" -vf "$filtro" -an \
    -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good "$VID/$slug.webm"
  ffmpeg -v error -y -ss "$poster" -i "$VID/$slug.mp4" -frames:v 1 -update 1 "/tmp/elizabeth-poster.png"
  convert /tmp/elizabeth-poster.png -strip -quality 80 "$VID/$slug-poster.webp"
  convert /tmp/elizabeth-poster.png -strip -quality 80 "$VID/$slug-poster.jpg"
  rm -f /tmp/elizabeth-poster.png
  echo "  ✓ $slug ($(du -h "$VID/$slug.mp4" | cut -f1) mp4, $(du -h "$VID/$slug.webm" | cut -f1) webm)"
}

echo "Las manos de Erika haciendo una varita de estrella (01-10-2026, sólo manos):"
recto taller-coser-bisuteria   "$(video1001 '1.28.19 PM')" 0.1 6.7 3.0
recto taller-coser-borde       "$(video1001 '1.28.21 PM')" 0.1 5.5 2.4
recto taller-decorar           "$(video1001 '1.28.25 PM')" 0.1 7.7 0.6
recto taller-rellenar-palito   "$(video1001 '1.28.27 PM')" 0.1 6.7 5.6
recto varita-estrella-lista    "$(video1001 '1.28.30 PM')" 0.1 5.4 1.0
