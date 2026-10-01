import { Controller } from "@hotwired/stimulus"
import { dinero, totalDe, textoTotal, textoAbono } from "../precios.js"

// La ficha de pedido: arma el mensaje de WhatsApp a partir de los campos.
//
// Sin este controlador el formulario ya funciona: es un GET a wa.me con el
// pedido en el campo `text`, que es lo único que wa.me lee. Lo que se agrega
// acá es orden:
//
//   1. Se muestran los campos (pieza, cantidad, color, fecha, zona, tarjeta),
//      que sin JavaScript se perderían (no se llaman `text`).
//   2. "¿Luna o estrella?" aparece sólo si la pieza es una varita, y el campo
//      del mensaje de la tarjeta sólo si se marcó la tarjeta: lo demás no
//      se personaliza, y preguntarlo prometería algo que no se hace.
//   3. El texto libre deja de llamarse `text` y deja de ser obligatorio (la
//      pieza ya dice qué se quiere); un campo oculto con ese nombre lleva el
//      mensaje completo, un renglón por dato.
//   4. La burbuja muestra lo que Erika va a recibir, mientras se escribe.
//   5. Cada pieza trae su precio (data-precio en la <option>, de
//      productos.json y varitas.json): con la cantidad, el mensaje lleva la
//      cuenta ("2 × $6.00 = $12.00") y el abono. La docena variada suma
//      $1.50 por varita; la guirnalda con nombre es un rango, y se dice
//      "desde".
export default class extends Controller {
  static targets = ["campos", "campo", "pieza", "forma", "soloVarita", "tarjeta", "soloTarjeta",
                    "soloDocena", "variada", "soloNombre", "colorExtra", "precioColor",
                    "idea", "rotuloIdea", "vista", "texto"]
  static values = { saludo: String, abono: String, porcentaje: { type: Number, default: 30 } }

  connect() {
    this.camposTarget.hidden = false
    this.vistaTarget.hidden = false

    this.oculto = document.createElement("input")
    this.oculto.type = "hidden"
    this.oculto.name = "text"
    this.ideaTarget.removeAttribute("name")
    this.ideaTarget.required = false
    this.rotuloIdeaTarget.textContent = "Algo más que deba saber (opcional)"
    this.piezaTarget.required = true
    this.element.appendChild(this.oculto)

    this.componer()
  }

  disconnect() {
    // Deja el formulario como estaba: sin controlador, el texto libre vuelve
    // a ser el mensaje.
    this.oculto?.remove()
    this.ideaTarget.name = "text"
    this.ideaTarget.required = true
  }

  componer() {
    const opcion = this.piezaTarget.selectedOptions[0]
    const tipo = opcion?.dataset.tipo
    const variada = tipo === "docena" && this.variadaTarget.checked
    const esVarita = tipo === "varita" || (tipo === "docena" && !variada)
    const conTarjeta = this.tarjetaTarget.checked
    this.soloVaritaTarget.hidden = !esVarita
    this.soloDocenaTarget.hidden = tipo !== "docena"
    this.soloNombreTarget.hidden = tipo !== "nombre"
    this.soloTarjetaTarget.hidden = !conTarjeta
    if (tipo === "nombre") this.precioColorTarget.textContent = dinero(opcion.dataset.colorExtra)

    const renglones = []
    for (const campo of this.campoTargets) {
      // Lo que está escondido no viaja: si se cambió de varita a estrella, la
      // forma que se había marcado no tiene que llegar en el mensaje.
      if (campo.closest("[hidden]")) continue
      const valor = campo.value.trim()
      if (!valor) continue
      renglones.push(`• ${campo.dataset.rotulo}: ${valor}`)
      if (campo === this.piezaTarget && esVarita) {
        const forma = this.formaTargets.find((opcion) => opcion.checked)
        if (forma) renglones.push(`• Con: ${forma.value}`)
      }
    }
    if (variada) renglones.push("• Variada: sí (la mezcla te la digo por aquí)")
    if (tipo === "nombre" && this.colorExtraTarget.checked) renglones.push("• Color adicional: sí")
    const precio = this.precio(opcion, tipo, variada)
    if (precio) renglones.push(...precio)
    if (conTarjeta && !renglones.some((r) => r.startsWith("• Tarjeta:"))) {
      renglones.push("• Tarjeta: sí, personalizada")
    }
    const idea = this.ideaTarget.value.trim()
    if (idea) renglones.push(`• Detalle: ${idea}`)

    // La nota del abono va al final de todo pedido: es la regla que Erika
    // pidió dejar clara, y así queda dicha también en el chat.
    const mensaje = [this.saludoValue, ...renglones, ...(this.abonoValue ? ["", this.abonoValue] : [])].join("\n")
    this.oculto.value = mensaje
    this.textoTarget.textContent = mensaje
  }

  // La cuenta de la pieza escogida, en renglones para el mensaje, o nada
  // si no tiene precio ("Otra idea").
  precio(opcion, tipo, variada) {
    const base = parseFloat(opcion?.dataset.precio)
    if (!Number.isFinite(base)) return null
    const cantidad = Math.max(1, parseInt(this.campoTargets.find((c) => c.dataset.rotulo === "Cantidad")?.value, 10) || 1)
    let unidad = base
    let detalle = dinero(base)
    if (variada) {
      const extra = parseFloat(opcion.dataset.variada)
      const n = parseInt(opcion.dataset.porDocena, 10)
      unidad = (Math.round(base * 100) + n * Math.round(extra * 100)) / 100
      detalle = `${dinero(base)} + ${n} × ${dinero(extra)} = ${dinero(unidad)}`
    }
    if (tipo === "nombre" && this.colorExtraTarget.checked) {
      const extra = parseFloat(opcion.dataset.colorExtra)
      unidad = (Math.round(base * 100) + Math.round(extra * 100)) / 100
    }
    const desde = tipo === "nombre"
    const monto = Math.round(unidad * 100) * cantidad / 100
    const total = totalDe([{ precio: monto, desde }])
    const cuenta = cantidad > 1 ? `${cantidad} × ${dinero(unidad)} = ${dinero(monto)}` : dinero(monto)
    return [
      `• Precio: ${desde ? "desde " : ""}${variada ? detalle + (cantidad > 1 ? `; ${cuenta}` : "") : cuenta}` +
        (desde ? ` (de ${dinero(base)} a ${dinero(opcion.dataset.hasta)})` : ""),
      `• Total: ${textoTotal(total)}`,
      `• ${textoAbono(total, this.porcentajeValue, { delCliente: true })}`
    ]
  }

  enviar() {
    // Por si algo se autocompletó sin disparar `input`.
    this.componer()
  }
}
