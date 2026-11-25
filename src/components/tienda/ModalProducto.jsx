import { useState } from "react";
import ComparadorMedidas, { GuiaTallas } from "./ComparadorMedidas";
import {
    formatearPrecio,
    listarTallas,
    mostrarValorAtributo,
    obtenerPrecioFinal,
    obtenerRutaImagen,
    obtenerStockTalla
} from "../../assets/js/tienda/catalogo";

// Ventana con el detalle de un producto: tallas con stock, atributos,
// comparador de medidas y botón para agregar al carrito.
function ModalProducto({ producto, categoria, alCerrar, alAgregar }) {
    const [tallaSeleccionada, setTallaSeleccionada] = useState("");
    const [mensaje, setMensaje] = useState("");

    const tallas = listarTallas(producto, categoria);
    const descuento = Number(producto.descuento) || 0;

    const stockSeleccionado = tallaSeleccionada
        ? obtenerStockTalla(producto, tallaSeleccionada)
        : null;

    function seleccionarTalla(talla) {
        setTallaSeleccionada(talla);
        setMensaje("");
    }

    function manejarAgregar() {
        if (!tallaSeleccionada) {
            setMensaje("Selecciona una talla antes de continuar.");
            return;
        }

        const resultado = alAgregar(producto, tallaSeleccionada);

        if (resultado.agregado) {
            alCerrar();
        } else {
            setMensaje(resultado.mensaje);
        }
    }

    return (
        <>
            <div
                className="modal fade show d-block modal-producto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modalNombre"
                onClick={(evento) => {
                    if (evento.target === evento.currentTarget) {
                        alCerrar();
                    }
                }}
            >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h2 className="modal-title fs-5" id="modalNombre">
                                {producto.nombre}
                            </h2>

                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Cerrar"
                                onClick={alCerrar}
                            />
                        </div>

                        <div className="modal-body">
                            <div className="row g-4">
                                <div className="col-md-5">
                                    <div className="modal-imagen-contenedor">
                                        <img
                                            src={obtenerRutaImagen(producto.imagen)}
                                            alt={producto.nombre}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-7">
                                    {categoria && (
                                        <span className="producto-categoria">
                                            {categoria.nombre}
                                        </span>
                                    )}

                                    <p className="mt-2">
                                        {producto.descripcion || ""}
                                    </p>

                                    {descuento > 0 && (
                                        <p className="precio-anterior mb-1">
                                            <s>{formatearPrecio(producto.precio)}</s>

                                            <span className="etiqueta-descuento ms-2">
                                                -{descuento}%
                                            </span>
                                        </p>
                                    )}

                                    <p className="precio-producto">
                                        {formatearPrecio(obtenerPrecioFinal(producto))}
                                    </p>

                                    {categoria && categoria.atributos.length > 0 && (
                                        <dl className="producto-atributos">
                                            {categoria.atributos.map(atributo => (
                                                <div key={atributo.id}>
                                                    <dt>{atributo.nombre}</dt>

                                                    <dd>
                                                        {mostrarValorAtributo(
                                                            atributo,
                                                            producto.atributos?.[atributo.id]
                                                        )}
                                                    </dd>
                                                </div>
                                            ))}

                                            <div>
                                                <dt>Color</dt>

                                                <dd className="text-capitalize">
                                                    {producto.color || "No especificado"}
                                                </dd>
                                            </div>
                                        </dl>
                                    )}

                                    <fieldset className="selector-tallas">
                                        <legend className="form-label">Talla</legend>

                                        <div className="tallas-opciones">
                                            {tallas.map(talla => {
                                                const stock = obtenerStockTalla(producto, talla);
                                                const agotada = stock === 0;

                                                return (
                                                    <button
                                                        key={talla}
                                                        type="button"
                                                        className={
                                                            "talla-boton" +
                                                            (tallaSeleccionada === talla ? " activa" : "") +
                                                            (agotada ? " agotada" : "")
                                                        }
                                                        disabled={agotada}
                                                        aria-pressed={tallaSeleccionada === talla}
                                                        onClick={() => seleccionarTalla(talla)}
                                                    >
                                                        {talla}

                                                        {agotada && (
                                                            <small>Agotada</small>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </fieldset>

                                    <p className="stock-texto" aria-live="polite">
                                        {stockSeleccionado === null
                                            ? "Selecciona una talla para ver las unidades disponibles."
                                            : stockSeleccionado <= 5
                                                ? `Quedan solo ${stockSeleccionado} unidad(es) en talla ${tallaSeleccionada}.`
                                                : `${stockSeleccionado} unidades disponibles en talla ${tallaSeleccionada}.`}
                                    </p>

                                    {tallas.every(
                                        talla => obtenerStockTalla(producto, talla) === 0
                                    ) && (
                                        <p className="text-danger fw-bold">
                                            Producto agotado.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <ComparadorMedidas
                                producto={producto}
                                categoria={categoria}
                                tallaSeleccionada={tallaSeleccionada}
                            />

                            <GuiaTallas producto={producto} categoria={categoria} />

                            {mensaje && (
                                <p className="text-danger mt-3 mb-0" role="alert">
                                    {mensaje}
                                </p>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={alCerrar}
                            >
                                Cerrar
                            </button>

                            <button
                                type="button"
                                className="btn btn-tienda"
                                onClick={manejarAgregar}
                            >
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal-backdrop fade show"
                onClick={alCerrar}
            />
        </>
    );
}

export default ModalProducto;
