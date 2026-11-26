// Punto de integración PENDIENTE con el backend (cotización y confirmación de
// despacho).
//
// Hoy NO existe un contrato de comunicación con el backend: no hay rutas,
// métodos ni estructuras de respuesta definidos. Por eso este módulo NO hace
// ninguna solicitud HTTP y NO simula respuestas del backend.
//
// Las funciones existen para que el resto del frontend tenga un único lugar
// al que llamar cuando la integración exista. Mientras tanto fallan con
// IntegracionPendienteError, y la interfaz debe seguir mostrando:
//   - el costo como "Estimación de despacho (modo de prueba)", y
//   - la dirección como "verificada por Google" y "pendiente de confirmación
//     por el backend".
//
// Cuando haya un contrato real, se implementa aquí (y solo aquí) la llamada.
// Ver docs/google-maps-y-despacho.md para la propuesta de datos.

export const BACKEND_DESPACHO_INTEGRADO = false;

export class IntegracionPendienteError extends Error {
    constructor(operacion) {
        super(
            `La operación "${operacion}" depende de una integración con el backend que aún no existe.`
        );
        this.name = "IntegracionPendienteError";
        this.operacion = operacion;
    }
}

// Reúne los datos que el backend necesitaría recibir (según el alcance de esta
// tarea). NO es un contrato aprobado: es solo la lista de datos disponibles en
// el frontend, y sus nombres pueden cambiar cuando se defina la integración.
export function prepararDatosDireccion(destino, { pedidoId = null } = {}) {
    if (!destino) {
        return null;
    }

    return {
        direccionFormateada: destino.direccion,
        calle: destino.calle,
        numero: destino.numero,
        comuna: destino.comuna,
        region: destino.region,
        pais: destino.pais,
        latitud: destino.latitud,
        longitud: destino.longitud,
        placeId: destino.placeId,
        pedidoId
    };
}

// Cotización definitiva del despacho. Pendiente de integración.
export async function cotizarDespacho(destino, opciones) {
    prepararDatosDireccion(destino, opciones);
    throw new IntegracionPendienteError("cotizarDespacho");
}

// Confirmación de la dirección y de su cobertura. Pendiente de integración.
export async function confirmarDireccion(destino, opciones) {
    prepararDatosDireccion(destino, opciones);
    throw new IntegracionPendienteError("confirmarDireccion");
}
