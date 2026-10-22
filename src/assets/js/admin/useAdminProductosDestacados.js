
import { useState } from "react";
import { productosIniciales } from "../../../data/productosIniciales";
import { images } from "../../../data/imagenes";

function cargarProductos() {
    const guardados = localStorage.getItem("productos");

    if (guardados !== null) {
        return JSON.parse(guardados);
    }

    return productosIniciales;
}

function cargarDestacados() {
    const guardados = localStorage.getItem("productosDestacados");

    if (guardados !== null) {
        return JSON.parse(guardados);
    }

    return [];
}

function obtenerImagen(rutaImagen) {
    if (!rutaImagen) {
        return images.placeholder;
    }

    if (rutaImagen.startsWith("data:image/")) {
        return rutaImagen;
    }

    if (images[rutaImagen]) {
        return images[rutaImagen];
    }

    for (let i = 1; i <= 6; i++) {
        if (rutaImagen === images[`imagen${i}`]) {
            return rutaImagen;
        }
    }

    return images.placeholder;
}

function useAdminProductosDestacados() {
    const [productos] = useState(cargarProductos);
    const [destacados, setDestacados] = useState(cargarDestacados);
    const [busqueda, setBusqueda] = useState("");
    const [mensaje, setMensaje] = useState("");

    function cambiarDestacado(id) {
        const yaDestacado = destacados.some(
            (idDestacado) => String(idDestacado) === String(id)
        );

        const nuevosDestacados = yaDestacado
            ? destacados.filter(
                (idDestacado) => String(idDestacado) !== String(id)
            )
            : [...destacados, id];

        try {
            localStorage.setItem(
                "productosDestacados",
                JSON.stringify(nuevosDestacados)
            );

            setDestacados(nuevosDestacados);

            setMensaje(
                yaDestacado
                    ? "Producto quitado de destacados."
                    : "Producto agregado a destacados."
            );
        } catch {
            setMensaje("No se pudieron guardar los cambios.");
        }
    }

    const productosFiltrados = productos.filter((producto) => {
        const texto = busqueda.toLowerCase();

        return (
            producto.nombre.toLowerCase().includes(texto) ||
            String(producto.categoria || "").toLowerCase().includes(texto)
        );
    });

    const totalDestacados = destacados.filter((id) =>
        productos.some(
            (producto) => String(producto.id) === String(id)
        )
    ).length;

    return {
        productosFiltrados,
        destacados,
        busqueda,
        setBusqueda,
        mensaje,
        cambiarDestacado,
        obtenerImagen,
        totalDestacados
    };
}

export default useAdminProductosDestacados;
