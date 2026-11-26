
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { calcularTotalCompra, obtenerCompras } from "./compras";

// Mismo identificador que se usa al registrar la compra en el carrito.
function obtenerIdentificador(usuario) {
    return usuario.id ?? usuario.correo?.toLowerCase();
}

function obtenerUsuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual") || "null");
    } catch {
        return null;
    }
}

export function formatearFecha(fecha) {
    const objeto = new Date(
        /^\d{4}-\d{2}-\d{2}$/.test(String(fecha))
            ? `${fecha}T00:00:00`
            : fecha
    );

    if (Number.isNaN(objeto.getTime())) {
        return String(fecha ?? "");
    }

    return objeto.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

export function describirEstado(compra) {
    return compra.estado === "exitosa"
        ? { texto: "Pagada", clase: "pagada" }
        : { texto: "Pago rechazado", clase: "rechazada" };
}

function useMisCompras() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Se obtiene la sesión directamente desde localStorage.
    const usuario = obtenerUsuarioActual();

    const sesionValida =
        usuario &&
        usuario.nombre &&
        usuario.rol;

    // Si no existe una sesión válida, no se muestran compras.
    const compras = sesionValida
        ? obtenerCompras()
            .filter(compra => {
                const identificador = obtenerIdentificador(usuario);

                return (
                    compra.usuarioId !== undefined &&
                    compra.usuarioId !== null &&
                    String(compra.usuarioId) === String(identificador)
                );
            })
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        : [];

    // El efecto solamente se encarga de redireccionar.
    useEffect(() => {
        if (!sesionValida) {
            navigate("/login", { replace: true });
        }
    }, [sesionValida, navigate]);

    // El detalle solo se encuentra entre las compras del propio usuario.
    const compraSeleccionada = id
        ? compras.find(compra => String(compra.id) === String(id)) ?? null
        : null;

    return {
        usuario: sesionValida ? usuario : null,
        compras,
        compraSeleccionada,
        id,
        calcularTotalCompra
    };
}

export default useMisCompras;
