
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { calcularTotalCompra, obtenerCompras } from "./compras";

// Mismo identificador que se usa al registrar la compra en el carrito.
function obtenerIdentificador(usuario) {
    return usuario.id ?? usuario.correo?.toLowerCase();
}

export function formatearFecha(fecha) {
    const objeto = new Date(
        /^\d{4}-\d{2}-\d{2}$/.test(String(fecha)) ? `${fecha}T00:00:00` : fecha
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

    const [usuario, setUsuario] = useState(null);
    const [compras, setCompras] = useState([]);

    useEffect(() => {
        let usuarioActual;

        try {
            usuarioActual = JSON.parse(
                localStorage.getItem("usuarioActual") || "null"
            );
        } catch {
            usuarioActual = null;
        }

        if (!usuarioActual || !usuarioActual.nombre || !usuarioActual.rol) {
            navigate("/login", { replace: true });
            return;
        }

        const identificador = obtenerIdentificador(usuarioActual);

        // Solo se cargan las compras que pertenecen al usuario con sesión.
        const propias = obtenerCompras()
            .filter(
                compra =>
                    compra.usuarioId !== undefined &&
                    compra.usuarioId !== null &&
                    String(compra.usuarioId) === String(identificador)
            )
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        setUsuario(usuarioActual);
        setCompras(propias);
    }, [navigate]);

    // El detalle solo se encuentra entre las compras del propio usuario.
    const compraSeleccionada = id
        ? compras.find(compra => String(compra.id) === String(id)) ?? null
        : null;

    return {
        usuario,
        compras,
        compraSeleccionada,
        id,
        calcularTotalCompra
    };
}

export default useMisCompras;
