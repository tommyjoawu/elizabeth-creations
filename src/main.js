// La entrada del JavaScript de la página: Stimulus, GSAP con ScrollTrigger y
// Lenis, y nada más.
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

gsap.registerPlugin(ScrollTrigger)

const application = Application.start()

application.register("revela", RevelaController)
application.register("suave", SuaveController)
application.register("isla", IslaController)
application.register("lectura", LecturaController)
application.register("video-fondo", VideoFondoController)
application.register("tendedero", TendederoController)
application.register("taller", TallerController)
application.register("encargo", EncargoController)
application.register("pildora", PildoraController)
application.register("carril", CarrilController)
application.register("pedido", PedidoController)
application.register("galeria", GaleriaController)
application.register("costura", CosturaController)
application.register("varitas", VaritasController)

// Las fotos cargan tarde (`loading="lazy"`) y cambian la altura de la página
// después de que ScrollTrigger midió dónde empieza cada escena. Recalcular al
// terminar de cargar todo evita que las escenas arranquen corridas.
window.addEventListener("load", () => ScrollTrigger.refresh())
