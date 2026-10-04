---
workflow: general-video
flow: automation
storyboard: no
format: 1080x1920 (index.html) + 1080x1080 (cuadrado/index.html)
duration: 39s / 25s
destination: Instagram Reels (vertical); feed / página (cuadrado)
---

# Tutorial · Cómo pedir en elizabethcreation.com

Spec completo: ../como-comprar-prompt.md. Una sola toma continua, sin cortes ni fundidos a negro, sin audio.

- Capturas reales: `node scripts/capturar.cjs` (sitio publicado, 390×844 @3x) → assets/cap/.
- Composición: `python3 generar.py` escribe index.html, cuadrado/index.html y assets/{vertical,cuadrado}.css; el movimiento está en assets/tutorial.js.
- Render: `npx hyperframes render --no-browser-gpu -o ../como-comprar-9x16.mp4` (y desde cuadrado/ → ../../como-comprar-1x1.mp4).
