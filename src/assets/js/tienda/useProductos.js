
import { useState } from "react";
import { images } from "../../../data/imagenes";

function leerDatos(clave) {
    try {
        const datos = JSON.parse(localStorage.getItem(clave) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

export function crearSlug(texto = "") {
    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
}

export default function useProductos() {
    const [productos] = useState(() => leerDatos("productos"));
    const [categorias] = useState(() => leerDatos("categorias"));

    function obtenerPrecioFinal(producto) {
        const precio = Number(producto.precio) || 0;
        const descuento = Number(producto.descuento) || 0;

        return Math.max(0, precio - (precio * descuento / 100));
    }

    function formatearPrecio(precio) {
        return Number(precio).toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        });
    }

    function obtenerRutaImagen(imagen) {
        if (!imagen) {
            return images.placeholder;
        }

        // Si el producto guarda el nombre de una imagen importada.
        if (typeof imagen === "string" && images[imagen]) {
            return images[imagen];
        }

        // Si guarda directamente una ruta o URL.
        return imagen;
    }

    function agregarAlCarrito(producto, talla) {
        if (!producto || !talla) {
            return false;
        }

        const carrito = leerDatos("carrito");

        const existente = carrito.find((item) =>
            String(item.id) === String(producto.id) &&
            item.talla === talla
        );

        if (existente) {
            existente.cantidad = (Number(existente.cantidad) || 0) + 1;
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

        localStorage.setItem("carrito", JSON.stringify(carrito));

        return true;
    }

    return {
        productos,
        categorias,
        obtenerPrecioFinal,
        formatearPrecio,
        obtenerRutaImagen,
        agregarAlCarrito
    };
}
