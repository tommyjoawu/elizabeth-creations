// La entrada del JavaScript: casi nada, a propósito.
//
// El hero se ve entero sin JavaScript (el titular entra con CSS), así que
// el bundle —Stimulus, GSAP, ScrollTrigger y los controladores— no tiene
// nada que hacer en el primer pantallazo. Si se pidiera desde el <head>,
// competiría por la red con las fuentes y las fotos del tendedero, y su
// arranque, con el primer pintado. Por eso se pide recién DESPUÉS del
// primer fotograma (`requestAnimationFrame` + `setTimeout`), en `aplicacion.js`.
// El tope de 500 ms cubre la pestaña abierta en segundo plano, donde no hay
// fotogramas.
const despuesDelPintado = () => new Promise((listo) => {
  requestAnimationFrame(() => setTimeout(listo, 0))
  setTimeout(listo, 500)
})

despuesDelPintado().then(() => import("./aplicacion.js"))
