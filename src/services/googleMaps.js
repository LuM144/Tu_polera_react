// Integración con Google Maps Platform (Geocoding API y Routes API).
//
// La clave se lee desde la variable de entorno VITE_GOOGLE_MAPS_API_KEY
// (archivo .env en la raíz del proyecto, ver .env.example). No se escribe
// ninguna clave en el código fuente.
//
// IMPORTANTE: como esta aplicación no tiene servidor propio, la clave queda
// visible para el navegador. Por eso debe ser una clave restringida por
// dominio (HTTP referrer) y limitada solo a Geocoding API y Routes API.
// En producción lo recomendable es llamar a estas APIs desde un servidor.

const URL_GEOCODING = "https://maps.googleapis.com/maps/api/geocode/json";
const URL_RUTAS = "https://routes.googleapis.com/directions/v2:computeRoutes";

// Rectángulo que contiene a Chile continental, Isla de Pascua y Juan Fernández
// de forma aproximada. Sirve para descartar coordenadas fuera del país.
const LIMITES_CHILE = {
    latitudMin: -56.5,
    latitudMax: -17.4,
    longitudMin: -110,
    longitudMax: -66
};

export function obtenerClaveMapas() {
    return String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "").trim();
}

export function mapasConfigurado() {
    return obtenerClaveMapas() !== "";
}

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

// Distancia en línea recta entre dos puntos (fórmula de Haversine), en km.
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

// Convierte una dirección en coordenadas. Solo acepta resultados en Chile.
export async function geocodificarDireccion(direccion) {
    const texto = String(direccion ?? "").trim();

    if (texto.length < 5) {
        throw new Error("Escribe una dirección con calle y número.");
    }

    const clave = obtenerClaveMapas();

    if (!clave) {
        throw new Error(
            "El servicio de mapas no está configurado. Falta VITE_GOOGLE_MAPS_API_KEY."
        );
    }

    const parametros = new URLSearchParams({
        address: texto,
        components: "country:CL",
        region: "cl",
        language: "es",
        key: clave
    });

    let datos;

    try {
        const respuesta = await fetch(`${URL_GEOCODING}?${parametros}`);
        datos = await respuesta.json();
    } catch {
        throw new Error(
            "No se pudo conectar con el servicio de direcciones. Revisa tu conexión."
        );
    }

    if (datos.status === "ZERO_RESULTS") {
        throw new Error("No encontramos esa dirección en Chile. Revisa los datos.");
    }

    if (datos.status !== "OK" || !datos.results?.length) {
        throw new Error(
            `El servicio de direcciones respondió con un error (${datos.status}).`
        );
    }

    const resultado = datos.results[0];
    const ubicacion = resultado.geometry?.location;

    const componentes = resultado.address_components ?? [];
    const esChile = componentes.some(
        componente =>
            componente.types.includes("country") &&
            componente.short_name === "CL"
    );

    if (!esChile || !estaEnChile(ubicacion?.lat, ubicacion?.lng)) {
        throw new Error("Solo realizamos despachos dentro de Chile.");
    }

    // La dirección debe llegar al nivel de calle para poder calcular el despacho.
    const tieneCalle = componentes.some(componente =>
        ["route", "street_address", "premise"].includes(componente.types[0]) ||
        componente.types.includes("route")
    );

    if (!tieneCalle) {
        throw new Error(
            "La dirección es demasiado general. Incluye la calle y el número."
        );
    }

    return {
        direccion: resultado.formatted_address,
        latitud: ubicacion.lat,
        longitud: ubicacion.lng
    };
}

// Obtiene la distancia por calles entre dos puntos con Routes API.
// Devuelve { distanciaKm, tipo } donde tipo es "ruta" o "linea_recta".
export async function calcularDistanciaRuta(origen, destino) {
    const clave = obtenerClaveMapas();

    if (clave) {
        try {
            const respuesta = await fetch(URL_RUTAS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": clave,
                    "X-Goog-FieldMask": "routes.distanceMeters"
                },
                body: JSON.stringify({
                    origin: {
                        location: {
                            latLng: {
                                latitude: origen.latitud,
                                longitude: origen.longitud
                            }
                        }
                    },
                    destination: {
                        location: {
                            latLng: {
                                latitude: destino.latitud,
                                longitude: destino.longitud
                            }
                        }
                    },
                    travelMode: "DRIVE",
                    routingPreference: "TRAFFIC_UNAWARE",
                    languageCode: "es-CL",
                    units: "METRIC"
                })
            });

            const datos = await respuesta.json();
            const metros = datos.routes?.[0]?.distanceMeters;

            if (respuesta.ok && Number.isFinite(metros)) {
                return { distanciaKm: metros / 1000, tipo: "ruta" };
            }
        } catch (error) {
            console.error("Error al calcular la ruta:", error);
        }
    }

    // Si Routes API no responde, se usa la distancia en línea recta y se
    // informa al cliente que el valor es una estimación.
    return {
        distanciaKm: calcularDistanciaLineaRecta(origen, destino),
        tipo: "linea_recta"
    };
}
