import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
    descargarNodoComoPng,
    esperarFuentes,
    esperarImagenes
} from "./descargaFicha";

// Maneja la descarga como imagen y la impresión de UNA ficha.
//
// nombreArchivo: nombre del PNG (ya único dentro del pedido).
//
// Para imprimir se crea un contenedor temporal con una copia de la ficha
// activa y los estilos de impresión ocultan todo lo demás. La impresión se
// inicia desde el clic (no desde un efecto), así React StrictMode no puede
// duplicarla.
function useFichaPrenda(nombreArchivo) {
    const nodoRef = useRef(null);
    const limpiarImpresionRef = useRef(null);

    const [generando, setGenerando] = useState(false);
    const [error, setError] = useState("");
    const [contenedorImpresion, setContenedorImpresion] = useState(null);

    async function descargarPng() {
        if (generando || !nodoRef.current) {
            return;
        }

        setGenerando(true);
        setError("");

        try {
            await descargarNodoComoPng(nodoRef.current, nombreArchivo);
        } catch (falla) {
            console.error("Error al generar la imagen de la ficha:", falla);

            setError(
                "No se pudo generar la imagen de la ficha. Inténtalo nuevamente."
            );
        } finally {
            setGenerando(false);
        }
    }

    async function imprimir() {
        // Ya hay una impresión en curso.
        if (limpiarImpresionRef.current) {
            return;
        }

        setError("");

        const contenedor = document.createElement("div");
        contenedor.className = "ficha-impresion-raiz";
        document.body.appendChild(contenedor);

        const limpiar = () => {
            window.removeEventListener("afterprint", limpiar);
            document.body.classList.remove("imprimiendo-ficha");
            contenedor.remove();
            limpiarImpresionRef.current = null;
            setContenedorImpresion(null);
        };

        limpiarImpresionRef.current = limpiar;
        window.addEventListener("afterprint", limpiar);

        try {
            // Se dibuja la ficha en el contenedor antes de abrir el diálogo.
            flushSync(() => setContenedorImpresion(contenedor));

            await esperarFuentes();
            await esperarImagenes(contenedor);

            document.body.classList.add("imprimiendo-ficha");
            window.print();
        } catch (falla) {
            console.error("Error al preparar la impresión:", falla);

            setError("No se pudo preparar la impresión de la ficha.");
            limpiar();
        }
    }

    // Si el componente se desmonta durante la impresión, se limpia todo.
    useEffect(() => {
        return () => limpiarImpresionRef.current?.();
    }, []);

    return {
        nodoRef,
        generando,
        error,
        contenedorImpresion,
        descargarPng,
        imprimir
    };
}

export default useFichaPrenda;
