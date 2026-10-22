
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productosIniciales } from "../../../data/productosIniciales";

function cargarProductos() {
    const productosGuardados = localStorage.getItem("productos");

    if (productosGuardados) {
        return JSON.parse(productosGuardados);
    }

    return productosIniciales;
}

function useAdminVerProducto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productos, setProductos] = useState(cargarProductos);
    const [mostrarModal, setMostrarModal] = useState(false);

    const producto = productos.find(function (productoActual) {
        return productoActual.id === Number(id);
    });

    function eliminarProducto() {
        const productosActualizados = productos.filter(function (productoActual) {
            return productoActual.id !== Number(id);
        });

        localStorage.setItem(
            "productos",
            JSON.stringify(productosActualizados)
        );

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
        mostrarModal,
        eliminarProducto,
        abrirModal,
        cerrarModal
    };
}

export default useAdminVerProducto;
