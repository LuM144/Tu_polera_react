
import { useState } from "react";
import {
    cargarCategorias,
    cargarProductos,
    crearSlug,
    formatearPrecio,
    leerJSON,
    guardarJSON,
    obtenerPrecioFinal,
    obtenerRutaImagen,
    obtenerStockTalla
} from "./catalogo";

export { crearSlug };

function leerLista(clave) {
    const datos = leerJSON(clave, []);
    return Array.isArray(datos) ? datos : [];
}

export default function useProductos() {
    const [categorias] = useState(cargarCategorias);
    const [productos] = useState(() => cargarProductos(categorias));

    function obtenerCategoria(producto) {
        return categorias.find(
            categoria => String(categoria.id) === String(producto?.categoriaId)
        ) ?? null;
    }

    // Agrega una unidad al carrito sin superar el stock de la talla.
    // Devuelve { agregado, mensaje }.
    function agregarAlCarrito(producto, talla) {
        if (!producto || !talla) {
            return {
                agregado: false,
                mensaje: "Selecciona una talla antes de continuar."
            };
        }

        const disponible = obtenerStockTalla(producto, talla);

        if (disponible === 0) {
            return {
                agregado: false,
                mensaje: `La talla ${talla} está agotada.`
            };
        }

        const carrito = leerLista("carrito");

        const existente = carrito.find((item) =>
            String(item.id) === String(producto.id) &&
            item.talla === talla
        );

        const cantidadActual = Number(existente?.cantidad) || 0;

        if (cantidadActual + 1 > disponible) {
            return {
                agregado: false,
                mensaje: cantidadActual > 0
                    ? `Ya tienes ${cantidadActual} unidad(es) en el carrito y solo hay ${disponible} disponible(s).`
                    : `Solo hay ${disponible} unidad(es) disponible(s).`
            };
        }

        if (existente) {
            existente.cantidad = cantidadActual + 1;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: Number(producto.precio) || 0,
                descuento: Number(producto.descuento) || 0,
                imagen: producto.imagen,
                talla,
                cantidad: 1
            });
        }

        if (!guardarJSON("carrito", carrito)) {
            return {
                agregado: false,
                mensaje: "No se pudo agregar el producto al carrito."
            };
        }

        return { agregado: true, mensaje: "" };
    }

    return {
        productos,
        categorias,
        obtenerCategoria,
        obtenerPrecioFinal,
        formatearPrecio,
        obtenerRutaImagen,
        agregarAlCarrito
    };
}
