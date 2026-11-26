import { useState } from "react";
import { createPortal } from "react-dom";
import FichaPrenda from "./FichaPrenda";
import useFichaPrenda from "../../assets/js/tienda/useFichaPrenda";
import {
    crearNombreArchivoFicha,
    obtenerDatosFicha
} from "../../assets/js/tienda/fichas";
import { describirEstado } from "../../assets/js/tienda/useMisCompras";

// Una ficha con sus botones. Cada ficha se descarga e imprime por separado.
function FichaConAcciones({ datos, estadoTexto, nombreArchivo }) {
    const {
        nodoRef,
        generando,
        error,
        contenedorImpresion,
        descargarPng,
        imprimir
    } = useFichaPrenda(nombreArchivo);

    return (
        <div className="ficha-bloque">
            {/* Solo este contenido se captura como imagen. */}
            <div className="ficha-captura" ref={nodoRef}>
                <FichaPrenda datos={datos} estadoTexto={estadoTexto} />
            </div>

            <div className="ficha-acciones">
                <button
                    type="button"
                    className="btn btn-tienda btn-sm"
                    onClick={descargarPng}
                    disabled={generando}
                >
                    {generando ? "Generando imagen..." : "Descargar como imagen"}
                </button>

                <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={imprimir}
                    disabled={generando}
                >
                    Imprimir
                </button>
            </div>

            {error && (
                <p className="text-danger mt-2 mb-0" role="alert">
                    {error}
                </p>
            )}

            {contenedorImpresion &&
                createPortal(
                    <FichaPrenda datos={datos} estadoTexto={estadoTexto} />,
                    contenedorImpresion
                )}
        </div>
    );
}

// Sección desplegable del detalle de compra con una ficha por cada
// producto o variante del pedido.
function FichasPedido({ compra }) {
    const [abierto, setAbierto] = useState(false);

    const items = Array.isArray(compra.items) ? compra.items : [];

    if (items.length === 0) {
        return null;
    }

    const fichas = items.map((item, indice) =>
        obtenerDatosFicha(compra, item, indice)
    );

    const estadoTexto = describirEstado(compra).texto;
    const idPanel = `fichas-pedido-${compra.id}`;

    return (
        <section className="fichas-pedido">
            <button
                type="button"
                className="btn btn-tienda"
                aria-expanded={abierto}
                aria-controls={idPanel}
                onClick={() => setAbierto(actual => !actual)}
            >
                {abierto
                    ? "Ocultar fichas de mis prendas"
                    : "Ver ficha de mis prendas"}
            </button>

            {abierto && (
                <div id={idPanel} className="fichas-lista">
                    {fichas.map((datos, indice) => (
                        <FichaConAcciones
                            key={datos.clave}
                            datos={datos}
                            estadoTexto={estadoTexto}
                            nombreArchivo={crearNombreArchivoFicha(
                                datos,
                                indice,
                                fichas
                            )}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default FichasPedido;
