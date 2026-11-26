
import { guardarJSON, leerJSON } from "./catalogo";
import { estaEnChile } from "../../../services/geografiaChile";
import { esDestinoVerificado } from "../../../services/direccionesChile";

const CLAVE_CONFIGURACION = "configuracionDespacho";
const CLAVE_DESTINO = "destinoDespacho";

// Datos iniciales: una bodega ficticia en Santiago, reemplazable desde
// el panel de administración (sección Despacho).
export const configuracionDespachoInicial = {
    nombreCentro: "Bodega de prueba Tu Polera",
    direccion: "Calle Ficticia 1234, Santiago, Región Metropolitana",
    latitud: -33.4372,
    longitud: -70.6506,
    precioBase: 2990,
    costoPorKm: 150,
    tarifaMinima: 2990,
    tarifaMaxima: 15000,
    esUbicacionPrueba: true
};

function numeroValido(valor, respaldo) {
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : respaldo;
}

export function cargarConfiguracionDespacho() {
    const guardada = leerJSON(CLAVE_CONFIGURACION, null);

    if (!guardada || typeof guardada !== "object") {
        return { ...configuracionDespachoInicial };
    }

    const inicial = configuracionDespachoInicial;

    return {
        nombreCentro: String(guardada.nombreCentro ?? inicial.nombreCentro),
        direccion: String(guardada.direccion ?? inicial.direccion),
        latitud: numeroValido(guardada.latitud, inicial.latitud),
        longitud: numeroValido(guardada.longitud, inicial.longitud),
        precioBase: numeroValido(guardada.precioBase, inicial.precioBase),
        costoPorKm: numeroValido(guardada.costoPorKm, inicial.costoPorKm),
        tarifaMinima: guardada.tarifaMinima === null
            ? null
            : numeroValido(guardada.tarifaMinima, inicial.tarifaMinima),
        tarifaMaxima: guardada.tarifaMaxima === null
            ? null
            : numeroValido(guardada.tarifaMaxima, inicial.tarifaMaxima),
        esUbicacionPrueba: Boolean(guardada.esUbicacionPrueba)
    };
}

// Revisa la configuración antes de guardarla.
// Devuelve un texto de error o null si todo está correcto.
export function validarConfiguracionDespacho(configuracion) {
    if (!configuracion.direccion.trim()) {
        return "Ingresa la dirección del centro de distribución.";
    }

    if (!estaEnChile(configuracion.latitud, configuracion.longitud)) {
        return "La latitud y la longitud deben estar dentro de Chile.";
    }

    if (configuracion.precioBase < 0 || configuracion.costoPorKm < 0) {
        return "El precio base y el costo por kilómetro no pueden ser negativos.";
    }

    const { tarifaMinima, tarifaMaxima } = configuracion;

    if (
        (tarifaMinima !== null && tarifaMinima < 0) ||
        (tarifaMaxima !== null && tarifaMaxima < 0)
    ) {
        return "Las tarifas mínima y máxima no pueden ser negativas.";
    }

    if (
        tarifaMinima !== null &&
        tarifaMaxima !== null &&
        tarifaMaxima < tarifaMinima
    ) {
        return "La tarifa máxima no puede ser menor que la mínima.";
    }

    return null;
}

export function guardarConfiguracionDespacho(configuracion) {
    return guardarJSON(CLAVE_CONFIGURACION, configuracion);
}

// Fórmula original:
// precio = precio base + (costo por km × distancia)
// limitado por la tarifa mínima y máxima, si existen.
export function calcularPrecioDespacho(distanciaKm, configuracion) {
    let precio =
        configuracion.precioBase +
        configuracion.costoPorKm * Math.max(0, distanciaKm);

    if (configuracion.tarifaMinima !== null) {
        precio = Math.max(precio, configuracion.tarifaMinima);
    }

    if (configuracion.tarifaMaxima !== null) {
        precio = Math.min(precio, configuracion.tarifaMaxima);
    }

    // Se redondea a la decena de pesos más cercana.
    return Math.round(precio / 10) * 10;
}

// Comprueba si una dirección ingresada manualmente tiene los datos mínimos.
export function esDireccionManualValida(destino) {
    return Boolean(
        destino &&
        destino.metodoSeleccion === "manual" &&
        typeof destino.direccion === "string" &&
        destino.direccion.trim() &&
        typeof destino.calle === "string" &&
        destino.calle.trim() &&
        typeof destino.numero === "string" &&
        destino.numero.trim() &&
        typeof destino.comuna === "string" &&
        destino.comuna.trim() &&
        typeof destino.region === "string" &&
        destino.region.trim() &&
        destino.codigoPais === "CL"
    );
}

// Acepta direcciones antiguas que fueron verificadas anteriormente
// y las nuevas direcciones ingresadas manualmente.
export function esDestinoDespachoValido(destino) {
    return (
        esDestinoVerificado(destino) ||
        esDireccionManualValida(destino)
    );
}

// Recupera el destino guardado si cumple las validaciones.
export function cargarDestinoDespacho() {
    const destino = leerJSON(CLAVE_DESTINO, null);

    return esDestinoDespachoValido(destino) ? destino : null;
}

// Guarda o elimina el destino de despacho.
export function guardarDestinoDespacho(destino) {
    if (destino === null) {
        localStorage.removeItem(CLAVE_DESTINO);
        return true;
    }

    return guardarJSON(CLAVE_DESTINO, destino);
}
