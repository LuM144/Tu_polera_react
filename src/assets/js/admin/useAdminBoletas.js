
import { useEffect, useState } from "react";
import { obtenerCompras, calcularTotalCompra } from "../tienda/compras";

function calcularTotal(boleta) {
    return calcularTotalCompra(boleta);
}

function useAdminBoletas() {
    const [busqueda, setBusqueda] = useState("");
    const [estado, setEstado] = useState("todas");
    const [boletas, setBoletas] = useState([]);

    useEffect(() => {
        setBoletas(obtenerCompras());
    }, []);

    const textoBusqueda = busqueda.toLowerCase().trim();

    const boletasFiltradas = boletas.filter((boleta) => {
        const coincideBusqueda =
            (boleta.numero || "").toLowerCase().includes(textoBusqueda) ||
            (boleta.comprador || "").toLowerCase().includes(textoBusqueda) ||
            (boleta.rut || "").toLowerCase().includes(textoBusqueda);

        const coincideEstado =
            estado === "todas" || boleta.estado === estado;

        return coincideBusqueda && coincideEstado;
    });

    const totalExitosas = boletas.filter(
        (boleta) => boleta.estado === "exitosa"
    ).length;

    const totalFallidas = boletas.filter(
        (boleta) => boleta.estado === "fallida"
    ).length;

    return {
        busqueda,
        setBusqueda,
        estado,
        setEstado,
        boletas,
        boletasFiltradas,
        totalExitosas,
        totalFallidas,
        calcularTotal
    };
}

export default useAdminBoletas;
