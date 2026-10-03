// El JavaScript de la página: Stimulus, GSAP con ScrollTrigger y Lenis, y
// nada más. Lo pide `main.js` después del primer pintado.
//
// Todo lo que se mueve lo hace un controlador de Stimulus colgado del HTML con
// `data-controller`. Así el HTML sigue siendo la fuente de verdad —se lee y
// funciona sin este archivo— y el JavaScript sólo agrega movimiento encima.
// La hoja NO se importa acá: va con un <link> en el <head>, para que la página
// tenga estilo aunque este archivo no llegue.
import { Application } from "@hotwired/stimulus"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import RevelaController from "./controladores/revela_controller.js"
import SuaveController from "./controladores/suave_controller.js"
import IslaController from "./controladores/isla_controller.js"
import LecturaController from "./controladores/lectura_controller.js"
import VideoFondoController from "./controladores/video_fondo_controller.js"
import TendederoController from "./controladores/tendedero_controller.js"
import TallerController from "./controladores/taller_controller.js"
import EncargoController from "./controladores/encargo_controller.js"
import PildoraController from "./controladores/pildora_controller.js"
import CarrilController from "./controladores/carril_controller.js"
import PedidoController from "./controladores/pedido_controller.js"
import GaleriaController from "./controladores/galeria_controller.js"
import CosturaController from "./controladores/costura_controller.js"
import VaritasController from "./controladores/varitas_controller.js"
import ZoomController from "./controladores/zoom_controller.js"
import AbonoController from "./controladores/abono_controller.js"

gsap.registerPlugin(ScrollTrigger)

const application = Application.start()

// Primero lo que se toca: la isla, el pedido, las varitas, la ficha y lo que
// aparece al entrar en pantalla. Son livianos y cada uno conecta en un
// suspiro.
application.register("revela", RevelaController)
application.register("isla", IslaController)
application.register("pildora", PildoraController)
application.register("carril", CarrilController)
application.register("pedido", PedidoController)
application.register("varitas", VaritasController)
application.register("encargo", EncargoController)
application.register("video-fondo", VideoFondoController)
application.register("zoom", ZoomController)
application.register("abono", AbonoController)
// La galería ya no es una escena de scroll (no se fija): sólo flechas y
// vaivén, liviana como las de arriba.
application.register("galeria", GaleriaController)

// Después, las escenas de scroll, UNA POR TAREA. Registrar un controlador
// conecta en el acto todos sus elementos, y cada escena mide la página
// (ScrollTrigger, el fijado de la galería, el hilo): todas juntas eran una
// sola tarea larga que dejaba la página sin responder en un teléfono. Entre
// una y otra se le devuelve el turno al navegador, que pinta y atiende un
// toque si llega.
//
// El orden es el de la página, y el hilo va al final porque recorre todas
// las secciones ya acomodadas.
const ESCENAS = [
  ["suave", SuaveController],
  ["tendedero", TendederoController],
  ["lectura", LecturaController],
  ["taller", TallerController],
  ["costura", CosturaController]
]
const ceder = () => new Promise((listo) =>
  globalThis.scheduler?.yield ? globalThis.scheduler.yield().then(listo) : setTimeout(listo, 0))

;(async () => {
  for (const [nombre, controlador] of ESCENAS) {
    await ceder()
    application.register(nombre, controlador)
  }
})()

// ScrollTrigger ya vuelve a medir solo en `load` (y al cambiar el tamaño de
// la ventana); lo que llega después —fotos `lazy` que cambian el alto— lo
// atrapa el ResizeObserver del hilo (costura), que pide un `refresh`.
