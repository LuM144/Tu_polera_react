
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    cargarCategorias,
    cargarProductos,
    guardarProductos,
    listarTallas,
    obtenerCategoria
} from "../tienda/catalogo";

function useAdminVerProducto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categorias] = useState(cargarCategorias);
    const [productos, setProductos] = useState(
        () => cargarProductos(categorias)
    );
    const [mostrarModal, setMostrarModal] = useState(false);

    const producto = productos.find(function (productoActual) {
        return productoActual.id === Number(id);
    });

    const categoria = producto
        ? obtenerCategoria(categorias, producto.categoriaId)
        : null;

    const tallas = producto ? listarTallas(producto, categoria) : [];

    function eliminarProducto() {
        const productosActualizados = productos.filter(function (productoActual) {
            return productoActual.id !== Number(id);
        });

        guardarProductos(productosActualizados);
        setProductos(productosActualizados);
        setMostrarModal(false);

        navigate("/admin/productos");
    }

    function abrirModal() {
        setMostrarModal(true);
    }

    function cerrarModal() {
        setMostrarModal(false);
    }

    return {
        producto,
        categoria,
        tallas,
        mostrarModal,
        eliminarProducto,
        abrirModal,
        cerrarModal
    };
}

export default useAdminVerProducto;
