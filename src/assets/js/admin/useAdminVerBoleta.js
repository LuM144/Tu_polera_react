
import { useParams } from "react-router-dom";
import { obtenerCompras, calcularTotalCompra } from "../tienda/compras";

function useAdminVerBoleta() {
    const { id } = useParams();

    const compras = obtenerCompras();

    const boleta = compras.find(
        (compra) => String(compra.id) === String(id)
    ) || null;

    const subtotal = boleta ? calcularTotalCompra(boleta) : 0;

    const neto = Math.round(subtotal / 1.19);
    const iva = subtotal - neto;

    function formatoPrecio(valor) {
        return "$" + Number(valor || 0).toLocaleString("es-CL");
    }

    return {
        boleta,
        subtotal,
        neto,
        iva,
        formatoPrecio
    };
}

export default useAdminVerBoleta;
