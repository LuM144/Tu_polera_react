
import { useState } from "react";
import {
    calcularPrecioDespacho,
    cargarConfiguracionDespacho,
    guardarConfiguracionDespacho,
    validarConfiguracionDespacho
} from "../tienda/despacho";
import {
    geocodificarDireccion,
    mapasConfigurado
} from "../../../services/googleMaps";

function aFormulario(configuracion) {
    return {
        nombreCentro: configuracion.nombreCentro,
        direccion: configuracion.direccion,
        latitud: String(configuracion.latitud),
        longitud: String(configuracion.longitud),
        precioBase: String(configuracion.precioBase),
        costoPorKm: String(configuracion.costoPorKm),
        tarifaMinima: configuracion.tarifaMinima === null
            ? ""
            : String(configuracion.tarifaMinima),
        tarifaMaxima: configuracion.tarifaMaxima === null
            ? ""
            : String(configuracion.tarifaMaxima),
        esUbicacionPrueba: configuracion.esUbicacionPrueba
    };
}

// Convierte el texto de un campo opcional en número o null.
function numeroOpcional(texto) {
    return texto.trim() === "" ? null : Number(texto);
}

function aConfiguracion(formulario) {
    return {
        nombreCentro: formulario.nombreCentro.trim(),
        direccion: formulario.direccion.trim(),
        latitud: Number(formulario.latitud),
        longitud: Number(formulario.longitud),
        precioBase: Number(formulario.precioBase),
        costoPorKm: Number(formulario.costoPorKm),
        tarifaMinima: numeroOpcional(formulario.tarifaMinima),
        tarifaMaxima: numeroOpcional(formulario.tarifaMaxima),
        esUbicacionPrueba: formulario.esUbicacionPrueba
    };
}

function useAdminDespacho() {
    const [formulario, setFormulario] = useState(
        () => aFormulario(cargarConfiguracionDespacho())
    );

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("info");
    const [buscando, setBuscando] = useState(false);

    function mostrarMensaje(texto, tipo = "info") {
        setMensaje(texto);
        setTipoMensaje(tipo);
    }

    function actualizarCampo(campo, valor) {
        setFormulario(actual => ({ ...actual, [campo]: valor }));
    }

    // Obtiene latitud y longitud de la dirección escrita usando Geocoding API.
    async function buscarCoordenadas() {
        setBuscando(true);
        mostrarMensaje("");

        try {
            const resultado = await geocodificarDireccion(formulario.direccion);

            setFormulario(actual => ({
                ...actual,
                direccion: resultado.direccion,
                latitud: String(resultado.latitud),
                longitud: String(resultado.longitud)
            }));

            mostrarMensaje(
                "Ubicación encontrada. Revisa los datos y guarda los cambios.",
                "success"
            );
        } catch (error) {
            mostrarMensaje(error.message, "danger");
        } finally {
            setBuscando(false);
        }
    }

    function guardar(evento) {
        evento.preventDefault();

        const configuracion = aConfiguracion(formulario);

        const numeros = [
            configuracion.latitud,
            configuracion.longitud,
            configuracion.precioBase,
            configuracion.costoPorKm
        ];

        if (numeros.some(numero => !Number.isFinite(numero))) {
            mostrarMensaje("Revisa que los campos numéricos sean válidos.", "danger");
            return;
        }

        const error = validarConfiguracionDespacho(configuracion);

        if (error) {
            mostrarMensaje(error, "danger");
            return;
        }

        if (!guardarConfiguracionDespacho(configuracion)) {
            mostrarMensaje("No se pudo guardar la configuración.", "danger");
            return;
        }

        mostrarMensaje("Configuración de despacho guardada.", "success");
    }

    // Ejemplos de precio con la configuración que se está editando.
    const configuracionActual = aConfiguracion(formulario);

    const ejemplos = [2, 5, 10, 25, 100].map(km => ({
        km,
        precio: [
            configuracionActual.precioBase,
            configuracionActual.costoPorKm
        ].every(Number.isFinite)
            ? calcularPrecioDespacho(km, configuracionActual)
            : null
    }));

    return {
        formulario,
        actualizarCampo,
        buscarCoordenadas,
        buscando,
        guardar,
        mensaje,
        tipoMensaje,
        ejemplos,
        mapasConfigurado: mapasConfigurado()
    };
}

export default useAdminDespacho;
