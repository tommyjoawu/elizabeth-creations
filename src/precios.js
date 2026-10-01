// Los precios de Elizabeth Creations, en un solo lugar para los dos que los
// cuentan: el resumen del pedido (controlador `pedido`) y la varita armable
// (controlador `varitas`). Si cada uno formateara por su lado, tarde o
// temprano uno diría "$2.5" y el otro "$2.50".
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
export function textoAbono(total, porcentaje, { delCliente = false } = {}) {
  if (total.falta || total.desde) {
    return delCliente
      ? `Abono (${porcentaje} %): cuando me confirmes el total`
      : `Abono (${porcentaje} %): al confirmar el total`
  }
  return `Abono (${porcentaje} %): ${dinero(Math.round(centavos(total.monto) * porcentaje / 100) / 100)}`
}
