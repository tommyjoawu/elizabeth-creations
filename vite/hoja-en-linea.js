// La hoja de la página principal, metida en el <head> como <style>.
//
// Con un <link>, el navegador baja el HTML, recién ahí descubre la hoja, la
// baja, y recién ahí descubre las fuentes y puede pintar: dos viajes
// seguidos antes del primer pintado. En un teléfono con 4G floja cada viaje
// son cientos de milisegundos. Con la hoja adentro del HTML (~20 KB con
// gzip) hay un viaje menos, y el HTML no se cachea peor: es una sola página
// y el hosting estático no manda cabeceras de caché largas de todos modos.
//
// Sólo en el build y sólo para `index.html`; las variantes quedan como
// están. El archivo .css se sigue publicando: el 404.html usa la misma hoja
// con su <link>. Las `url()` de la hoja ya salen absolutas (con la base), así que
// siguen apuntando bien desde el HTML.
export function hojaEnLinea({ pagina = "index.html" } = {}) {
  return {
    name: "erika-hoja-en-linea",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle || ctx.filename.replace(/\\/g, "/").split("/").pop() !== pagina ||
            ctx.path !== `/${pagina}`) return html
        return html.replace(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g, (etiqueta, href) => {
          const nombre = Object.keys(ctx.bundle).find((archivo) => href.endsWith(`/${archivo}`))
          const hoja = nombre && ctx.bundle[nombre]
          if (!hoja || hoja.type !== "asset") return etiqueta
          const css = String(hoja.source).replace(/<\/style/gi, "<\\/style")
          return `<style>${css}</style>`
        })
      }
    }
  }
}
