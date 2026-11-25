
import { useState } from "react";
import {
    cargarCategorias,
    cargarProductos,
    obtenerNombreCategoria,
    obtenerRutaImagen
} from "../tienda/catalogo";

function cargarDestacados() {
    const guardados = localStorage.getItem("productosDestacados");

    if (guardados !== null) {
        return JSON.parse(guardados);
    }

    return [];
}

// Las imágenes se resuelven con la misma función que usa el resto del proyecto.
const obtenerImagen = obtenerRutaImagen;

function useAdminProductosDestacados() {
    const [categorias] = useState(cargarCategorias);
    const [productos] = useState(() => cargarProductos(categorias));
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
            obtenerNombreCategoria(categorias, producto).toLowerCase().includes(texto)
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
        obtenerNombreCategoria: producto =>
            obtenerNombreCategoria(categorias, producto),
        totalDestacados
    };
}

export default useAdminProductosDestacados;
