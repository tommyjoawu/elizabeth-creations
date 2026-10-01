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
#
# Correr desde la raíz:  bash scripts/procesar-material.sh
# Sólo las fotos de los sets (sin rehacer todo ni los videos):
#                         bash scripts/procesar-material.sh sets
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

# exportar <slug> <origen> <recorte|-> <ancho1> <ancho2>
#   recorte: "cx cy lado" (un cuadrado centrado en la pieza), "AxB+X+Y" (un
#   rectángulo, en píxeles de la foto ya girada) o "-" (la foto entera, 3:4).
#   GIRO=-90 delante gira la foto antes de recortar (una foto tomada de lado).
exportar() {
  local slug="$1" origen="$2" recorte="$3"; shift 3
  local base="/tmp/elizabeth-$slug.png"
  local giro=(-auto-orient)
  [[ -n "${GIRO:-}" ]] && giro+=(-rotate "$GIRO" +repage)
  if [[ "$recorte" == "-" ]]; then
    convert "$origen" "${giro[@]}" "${TONO[@]}" "$base"
  elif [[ "$recorte" == *x*+*+* ]]; then
    convert "$origen" "${giro[@]}" -crop "$recorte" +repage "${TONO[@]}" "$base"
  else
    read -r cx cy lado <<<"$recorte"
    convert "$origen" "${giro[@]}" -crop "${lado}x${lado}+$((cx - lado / 2))+$((cy - lado / 2))" +repage "${TONO[@]}" "$base"
  fi
  for ancho in "$@"; do
    convert "$base" -resize "${ancho}x" -strip -quality 80 "$IMG/$slug-$ancho.webp"
    convert "$base" -resize "${ancho}x" -strip -quality 55 "$IMG/$slug-$ancho.avif"
    convert "$base" -resize "${ancho}x" -strip -sampling-factor 4:2:0 -interlace JPEG -quality 80 "$IMG/$slug-$ancho.jpg"
  done
  rm -f "$base"
  echo "  ✓ $slug"
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
  GIRO=-90 exportar set-bajo-el-mar     "$(fotoSet '1.58.16 PM')" "960x720+0+330"     600 960
  exportar set-navidad-nevada           "$(fotoSet '1.58.26 PM')" "960x760+0+310"     600 960
  # Las tres en fila (mucha cobija vacía arriba y abajo): bien apretada.
  # Es la del banderín de Navidad, que es ancho y bajito.
  exportar set-navidad-clasica          "$(fotoSet '2.05.09 PM')" "1000x750+100+430"  600 960
  # Las tres agrupadas, más de cerca: la del letrero del set.
  exportar set-navidad-clasica-cerca    "$(fotoSet '2.05.10 PM')" "1200x900+0+350"    600 960
}
if [[ "${1:-}" == "sets" ]]; then sets; exit 0; fi

echo "Piezas en la mano, con la luz de la ventana (las etiquetas):"
exportar pieza-arbol-verde        "$(foto '7.44.24 PM (6)')" - 600 1200
exportar pieza-arbol-blanco       "$(foto '7.44.24 PM (3)')" - 600 1200
exportar pieza-estrella-amarilla  "$(foto '7.44.25 PM')"     - 600 1200
exportar pieza-estrella-blanca    "$(foto '7.44.24 PM (4)')" - 600 1200
exportar pieza-galleta-jengibre   "$(foto '7.44.24 PM (5)')" - 600 1200
exportar pieza-sirenita           "$(foto '7.44.24 PM')"     - 600 1200
exportar pieza-pececito           "$(foto '7.44.24 PM (2)')" - 600 1200
exportar pieza-cangrejito         "$(foto '7.44.24 PM (1)')" - 600 1200
exportar pieza-varita-luna        "$(foto '7.44.25 PM (1)')" - 600 1200
# La varita de estrella terminada (01-10-2026): fieltro blanco con carita,
# lentejuelas, cinta rosada y cascabel. Ya viene en 3:4 (1200×1600).
exportar pieza-varita-estrella    "$(foto1001 '1.28.30 PM')" - 600 1200

echo "Adornos colgados, recortados en cuadrado (medallones del tendedero y la pared):"
exportar adorno-estrella-amarilla "$(foto '7.44.12 PM (4)')" "555 825 620"   400 800
exportar adorno-sirenita          "$(foto '7.44.12 PM (7)')" "562 837 720"   400 800
exportar adorno-galleta-jengibre  "$(foto '7.44.12 PM (3)')" "530 862 660"   400 800
exportar adorno-arbol-verde       "$(foto '7.44.12 PM (5)')" "625 900 760"   400 800
exportar adorno-cangrejito        "$(foto '7.44.13 PM')"     "580 912 800"   400 800
exportar adorno-pececito          "$(foto '7.44.13 PM (1)')" "567 925 700"   400 800
exportar adorno-estrella-blanca   "$(foto '7.44.12 PM (2)')" "575 950 740"   400 800
exportar adorno-arbol-blanco      "$(foto '7.44.12 PM (1)')" "595 900 680"   400 800
exportar adorno-varita-luna       "$(foto '7.44.19 PM')"     "555 650 760"   400 800

echo "Escenas (la varita en uso, la colección junta):"
# Las fotos 7.44.11 PM y 7.44.12 PM (una niña con la varita) NO se exportan:
# la clienta pidió quitarla. Se usan las fotos de la varita sola.
exportar varita-luna-ventana       "$(foto '7.43.59 PM')"     - 600 1200
exportar coleccion-fieltro         "$(foto '7.44.13 PM (2)')" - 600 1200

sets

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
