
import { useEffect, useState } from "react";
import { productosIniciales } from "../../../data/productosIniciales";

function cargarProductos() {
    const productosGuardados = localStorage.getItem("productos");

    if (productosGuardados) {
        return JSON.parse(productosGuardados);
    }

    return productosIniciales;
}

function useAdminProductos() {
    const [productos, setProductos] = useState(cargarProductos);

    useEffect(() => {
        localStorage.setItem("productos", JSON.stringify(productos));
    }, [productos]);

    return {
        productos
    };
}

export default useAdminProductos;
