// Los precios de Elizabeth Creations, en un solo lugar para los que los
// cuentan: el resumen del pedido (controlador `pedido`), la varita armable
// (controlador `varitas`) y la ficha de pedido (controlador `encargo`). Si
// cada uno formateara por su lado, tarde o temprano uno diría "$2.5" y el
// otro "$2.50".
//
// Cada renglón de un pedido es { texto, precio, desde, cantidad }:
//   · `precio` en dólares, o null si todavía no tiene (entonces el total
//     queda "por confirmar": un total a medias sería un precio inventado);
//   · `desde`: el precio es el mínimo de un rango (la guirnalda con nombre,
//     de $5.00 a $10.00), y el total también lo dice.

// 2.5 → "$2.50". Siempre con centavos: es como Erika escribe sus precios.
export const dinero = (monto) => `$${Number(monto).toFixed(2)}`

// Suma en centavos enteros: 0.1 + 0.2 no da 0.3 en coma flotante, y un
// abono de "$7.349999" no se le puede mandar a nadie.
const centavos = (monto) => Math.round(Number(monto) * 100)

export function totalDe(renglones) {
  if (renglones.length === 0) return { monto: 0, desde: false, falta: false }
  const falta = renglones.some((r) => !Number.isFinite(r.precio))
  const monto = falta ? null : renglones.reduce((suma, r) => suma + centavos(r.precio), 0) / 100
  return { monto, desde: renglones.some((r) => r.desde), falta }
}

// "Total: $24.50", "desde $7.50" o "por confirmar".
export function textoTotal(total) {
  if (total.falta) return "por confirmar"
  return `${total.desde ? "desde " : ""}${dinero(total.monto)}`
}

// El abono, sólo cuando el total es un número cerrado. Con un rango o un
// precio pendiente se dice que se calcula después: un 30 % de "desde"
// parecería una cifra que no es.
//
// `delCliente`: el texto va en el mensaje que la clienta le manda a Erika,
// así que habla ella ("cuando me confirmes"), no la página ("te confirme").
// El monto del abono ("$4.50"), o null si el total no es cerrado.
export function montoAbono(total, porcentaje) {
  if (total.falta || total.desde) return null
  return dinero(Math.round(centavos(total.monto) * porcentaje / 100) / 100)
}

// `parte`: el pedido mezcla varitas con lo demás, y el abono es sólo de lo
// demás: el rótulo lo dice, para que el monto no parezca mal sacado.
export function textoAbono(total, porcentaje, { delCliente = false, parte = false } = {}) {
  const rotulo = `Abono (${porcentaje} %${parte ? " de los sets, las piezas y las guirnaldas" : ""})`
  if (total.falta || total.desde) {
    return delCliente
      ? `${rotulo}: cuando me confirmes el total`
      : `${rotulo}: al confirmar el total`
  }
  return `${rotulo}: ${dinero(Math.round(centavos(total.monto) * porcentaje / 100) / 100)}`
}

// Las varitas no llevan abono (Erika, 03-10-2026): sólo los sets, las piezas
// sueltas y las guirnaldas. Un renglón es de varitas si llega con
// `grupo: "varitas"` (lo arma el controlador `varitas`).
export const esVarita = (renglon) => renglon?.grupo === "varitas"

// A qué parte del pedido le toca el abono:
//   · `aplica`: "no" (sólo varitas: ni renglón ni ventanita), "todo" (nada
//     de varitas) o "parte" (mezclado);
//   · `total`: el total de lo que sí lleva abono (sobre eso es el 30 %).
export function abonoDe(renglones) {
  const conAbono = renglones.filter((r) => !esVarita(r))
  if (conAbono.length === 0) return { aplica: "no", total: null }
  return { aplica: conAbono.length === renglones.length ? "todo" : "parte", total: totalDe(conAbono) }
}

// Llena las llaves {…} de una plantilla de mensaje (marca.mensajePedido).
// Cada renglón se recorta (Handlebars indenta los parciales y la sangría se
// colaba en el mensaje), y un renglón que era sólo una llave vacía se quita:
// así un pedido de puras varitas no deja un hueco donde iba el abono.
export function rellenarMensaje(plantilla, valores) {
  return plantilla.split("\n").map((r) => r.trim())
    .filter((r) => { const llave = r.match(/^\{(\w+)\}$/); return !llave || valores[llave[1]] })
    .map((r) => r.replace(/\{(\w+)\}/g, (llave, nombre) => (nombre in valores ? valores[nombre] : llave)))
    .join("\n")
}
