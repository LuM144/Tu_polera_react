
import { boletasTest } from "../../../data/boletasTest";

// Obtiene las compras guardadas.
// Si todavía no existen, utiliza las boletas de prueba.
export function obtenerCompras() {
    try {
        const guardadas = localStorage.getItem("compras");

        if (guardadas !== null) {
            const compras = JSON.parse(guardadas);

            return Array.isArray(compras) ? compras : [];
        }

        localStorage.setItem(
            "compras",
            JSON.stringify(boletasTest)
        );

        return boletasTest;
    } catch (error) {
        console.error("Error al obtener las compras:", error);
        return [];
    }
}

// Guarda una nueva compra en el historial general
// y en el historial asociado al usuario.
export function registrarCompra(datosCompra, usuario) {
    if (!usuario || usuario.id == null) {
        throw new Error("Debes iniciar sesión para registrar una compra.");
    }

    if (
        datosCompra.estado !== "exitosa" &&
        datosCompra.estado !== "fallida"
    ) {
        throw new Error("El estado de la compra no es válido.");
    }

    const compras = obtenerCompras();

    const nuevoId =
        compras.reduce(
            (mayor, compra) => Math.max(mayor, Number(compra.id) || 0),
            0
        ) + 1;

    const nuevaCompra = {
        ...datosCompra,
        id: nuevoId,
        numero: `BOL-${String(nuevoId).padStart(4, "0")}`,
        fecha: datosCompra.fecha || new Date().toLocaleDateString("sv-SE"),
        comprador: usuario.nombre || "Usuario",
        rut: usuario.rut || "",
        usuarioId: usuario.id,
        items: (datosCompra.items || []).map((item) => ({
            ...item,
            precio: Number(item.precio) || 0,
            cantidad: Number(item.cantidad) || 0
        })),
        envio: Math.max(0, Number(datosCompra.envio) || 0)
    };

    // Historial general para el panel de administración.
    const comprasActualizadas = [...compras, nuevaCompra];

    localStorage.setItem(
        "compras",
        JSON.stringify(comprasActualizadas)
    );

    // Historial asociado al usuario registrado.
    const claveUsuario = `comprasUsuario_${usuario.id}`;

    let comprasUsuario = [];

    try {
        const guardadasUsuario = localStorage.getItem(claveUsuario);
        comprasUsuario = guardadasUsuario
            ? JSON.parse(guardadasUsuario)
            : [];
    } catch {
        comprasUsuario = [];
    }

    if (!Array.isArray(comprasUsuario)) {
        comprasUsuario = [];
    }

    localStorage.setItem(
        claveUsuario,
        JSON.stringify([...comprasUsuario, nuevaCompra])
    );

    return nuevaCompra;
}

// Calcula el total de los productos más el envío.
export function calcularTotalCompra(compra) {
    const totalProductos = (compra.items || []).reduce(
        (total, item) =>
            total +
            (Number(item.precio) || 0) *
            (Number(item.cantidad) || 0),
        0
    );

    return totalProductos + (Number(compra.envio) || 0);
}
