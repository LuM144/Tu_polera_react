// Utilidades para esperar los recursos de una ficha y descargarla como PNG.
//
// La biblioteca html-to-image se carga bajo demanda (solo al descargar) para
// no aumentar el tamaño de la página principal.

// Pesos de Nunito Sans que usa la ficha.
const PESOS_TIPOGRAFIA = [400, 600, 700, 800, 900];
const ESPERA_MAXIMA_MS = 10000;

function conTiempoLimite(promesa, mensaje) {
    let temporizador;

    const limite = new Promise((_, rechazar) => {
        temporizador = setTimeout(
            () => rechazar(new Error(mensaje)),
            ESPERA_MAXIMA_MS
        );
    });

    return Promise.race([promesa, limite]).finally(() =>
        clearTimeout(temporizador)
    );
}

// Espera a que Nunito Sans esté cargada antes de capturar o imprimir.
export async function esperarFuentes() {
    if (!document.fonts) {
        return;
    }

    await conTiempoLimite(
        Promise.all(
            PESOS_TIPOGRAFIA.map(peso =>
                document.fonts.load(`${peso} 16px "Nunito Sans"`)
            )
        ).then(() => document.fonts.ready),
        "La tipografía tardó demasiado en cargar."
    );
}

// Espera a que todas las imágenes del contenedor estén cargadas.
export async function esperarImagenes(contenedor) {
    const imagenes = Array.from(contenedor.querySelectorAll("img"));

    await conTiempoLimite(
        Promise.all(
            imagenes.map(imagen => {
                if (imagen.complete) {
                    return imagen.decode
                        ? imagen.decode().catch(() => undefined)
                        : undefined;
                }

                return new Promise(resolver => {
                    imagen.addEventListener("load", resolver, { once: true });
                    imagen.addEventListener("error", resolver, { once: true });
                });
            })
        ),
        "Las imágenes tardaron demasiado en cargar."
    );
}

// Genera un PNG con el contenido del nodo y lo descarga.
// pixelRatio 2 mantiene la nitidez en pantallas y al imprimir la imagen.
export async function descargarNodoComoPng(nodo, nombreArchivo) {
    await esperarFuentes();
    await esperarImagenes(nodo);

    const { toPng } = await import("html-to-image");

    const url = await toPng(nodo, {
        pixelRatio: 2,
        backgroundColor: "#ffffff"
    });

    const enlace = document.createElement("a");
    enlace.download = nombreArchivo;
    enlace.href = url;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
}
