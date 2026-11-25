
import { useState } from "react";
import {
    cargarCategorias,
    cargarProductos,
    cargarUmbralStock,
    guardarUmbralStock,
    obtenerProductosCriticos
} from "../tienda/catalogo";

function useAdminProductosCriticos() {
    const [categorias] = useState(cargarCategorias);
    const [productos] = useState(() => cargarProductos(categorias));
    const [umbral, setUmbral] = useState(cargarUmbralStock);
    const [umbralTexto, setUmbralTexto] = useState(String(cargarUmbralStock()));
    const [mensaje, setMensaje] = useState("");

    const criticos = obtenerProductosCriticos(productos, categorias, umbral);

    const agotados = criticos.filter(item => item.agotado);
    const stockBajo = criticos.filter(item => !item.agotado);

    function guardarUmbral(evento) {
        evento.preventDefault();

        const nuevoUmbral = Number(umbralTexto);

        if (
            umbralTexto.trim() === "" ||
            !Number.isInteger(nuevoUmbral) ||
            nuevoUmbral < 1
        ) {
            setMensaje("El umbral debe ser un número entero de 1 o más.");
            return;
        }

        if (!guardarUmbralStock(nuevoUmbral)) {
            setMensaje("No se pudo guardar el umbral.");
            return;
        }

        setUmbral(nuevoUmbral);
        setMensaje("Umbral actualizado correctamente.");
    }

    return {
        criticos,
        agotados,
        stockBajo,
        umbral,
        umbralTexto,
        setUmbralTexto,
        guardarUmbral,
        mensaje
    };
}

export default useAdminProductosCriticos;
