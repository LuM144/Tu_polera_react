
// Límites geográficos aproximados de Chile continental,
// Isla de Pascua y Juan Fernández.
const LIMITES_CHILE = {
    latitudMin: -56.5,
    latitudMax: -17.4,
    longitudMin: -110,
    longitudMax: -66
};

// Comprueba si unas coordenadas están dentro de los límites aproximados de Chile.
export function estaEnChile(latitud, longitud) {
    return (
        Number.isFinite(latitud) &&
        Number.isFinite(longitud) &&
        latitud >= LIMITES_CHILE.latitudMin &&
        latitud <= LIMITES_CHILE.latitudMax &&
        longitud >= LIMITES_CHILE.longitudMin &&
        longitud <= LIMITES_CHILE.longitudMax
    );
}

// Calcula la distancia en línea recta entre dos puntos mediante
// la fórmula de Haversine. El resultado se expresa en kilómetros.
export function calcularDistanciaLineaRecta(origen, destino) {
    const radioTierraKm = 6371;
    const aRadianes = grados => (grados * Math.PI) / 180;

    const diferenciaLatitud = aRadianes(destino.latitud - origen.latitud);
    const diferenciaLongitud = aRadianes(destino.longitud - origen.longitud);

    const a =
        Math.sin(diferenciaLatitud / 2) ** 2 +
        Math.cos(aRadianes(origen.latitud)) *
        Math.cos(aRadianes(destino.latitud)) *
        Math.sin(diferenciaLongitud / 2) ** 2;

    return radioTierraKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
