
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function consultarApi(ruta, signal) {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        },
        signal
    });

    if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status} al consultar ${ruta}`);
    }

    return respuesta.json();
}

export async function cargarCatalogoApi(signal) {
    const [categorias, productos] = await Promise.all([
        consultarApi("/api/v1/categorias", signal),
        consultarApi("/api/v1/productos", signal)
    ]);

    if (!Array.isArray(categorias) || !Array.isArray(productos)) {
        throw new Error("La API devolvió un formato de catálogo inesperado.");
    }

    return { categorias, productos };
}
