
import { useState } from "react";
import {
    cargarCategorias,
    cargarProductos,
    cargarUmbralStock,
    obtenerNombreCategoria,
    obtenerStockTotal
} from "../tienda/catalogo";

function useAdminProductos() {
    const [categorias] = useState(cargarCategorias);
    const [productos] = useState(() => cargarProductos(categorias));
    const [umbral] = useState(cargarUmbralStock);

    // Estado de stock de cada producto para mostrarlo en la tabla.
    function obtenerEstadoStock(producto) {
        const variantes = Object.values(producto.tallas ?? {});

        if (variantes.length === 0 || obtenerStockTotal(producto) === 0) {
            return { texto: "Agotado", clase: "danger" };
        }

        const hayAgotadas = variantes.some(variante => variante.stock === 0);
        const hayBajas = variantes.some(variante => variante.stock <= umbral);

        if (hayAgotadas || hayBajas) {
            return { texto: "Stock crítico", clase: "warning" };
        }

        return { texto: "Disponible", clase: "success" };
    }

    return {
        productos,
        categorias,
        obtenerNombreCategoria: producto =>
            obtenerNombreCategoria(categorias, producto),
        obtenerStockTotal,
        obtenerEstadoStock
    };
}

export default useAdminProductos;
