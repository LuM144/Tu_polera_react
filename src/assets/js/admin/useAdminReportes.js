
import { useEffect, useState } from "react";
import { obtenerCompras, calcularTotalCompra } from "../tienda/compras";

function useAdminReportes() {
    const [boletas, setBoletas] = useState([]);

    useEffect(() => {
        setBoletas(obtenerCompras());
    }, []);

    const exitosas = boletas.filter(
        (boleta) => boleta.estado === "exitosa"
    );

    const fallidas = boletas.filter(
        (boleta) => boleta.estado === "fallida"
    );

    // Solo se contabilizan compras exitosas como ventas.
    const totalVendido = exitosas.reduce(
        (total, boleta) => total + calcularTotalCompra(boleta),
        0
    );

    const unidadesVendidas = exitosas.reduce(
        (total, boleta) =>
            total +
            (boleta.items || []).reduce(
                (cantidad, item) =>
                    cantidad + (Number(item.cantidad) || 0),
                0
            ),
        0
    );

    const productosVendidos = {};

    exitosas.forEach((boleta) => {
        (boleta.items || []).forEach((item) => {
            const nombre = item.nombre || "Producto sin nombre";

            if (!productosVendidos[nombre]) {
                productosVendidos[nombre] = {
                    nombre,
                    cantidad: 0,
                    total: 0
                };
            }

            productosVendidos[nombre].cantidad +=
                Number(item.cantidad) || 0;

            productosVendidos[nombre].total +=
                (Number(item.precio) || 0) *
                (Number(item.cantidad) || 0);
        });
    });

    const listaProductos = Object.values(productosVendidos).sort(
        (a, b) => b.cantidad - a.cantidad
    );

    return {
        totalVendido,
        exitosas,
        fallidas,
        unidadesVendidas,
        listaProductos
    };
}

export default useAdminReportes;
