
import { estaEnChile } from "./geografiaChile";

// Comprueba si un destino antiguo conserva los datos necesarios
// para ser reconocido como una dirección previamente verificada.
export function esDestinoVerificado(destino) {
    if (!destino || typeof destino !== "object") {
        return false;
    }

    const texto = valor =>
        typeof valor === "string" && valor.trim() !== "";

    return (
        destino.verificadaPorGoogle === true &&
        destino.codigoPais === "CL" &&
        texto(destino.direccion) &&
        texto(destino.calle) &&
        texto(destino.numero) &&
        texto(destino.comuna) &&
        texto(destino.placeId) &&
        Number.isFinite(Number(destino.latitud)) &&
        Number.isFinite(Number(destino.longitud)) &&
        estaEnChile(Number(destino.latitud), Number(destino.longitud))
    );
}
