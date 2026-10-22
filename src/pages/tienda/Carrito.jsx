
import { Link } from "react-router-dom";

import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";
import useCarrito from "../../assets/js/tienda/useCarrito";

function Carrito() {
    const {
        usuario,
        carrito,
        mostrarPago,
        setMostrarPago,
        mensaje,
        tipoMensaje,
        cargando,
        subtotal,
        envio,
        total,
        formatearPrecio,
        obtenerPrecioFinal,
        sumarCantidad,
        restarCantidad,
        eliminarProducto,
        procesarPago
    } = useCarrito();

    if (cargando || !usuario) {
        return null;
    }

    return (
        <div className="pagina-tienda">
            <NavbarTienda />

            <main className="container py-5">
                <div className="encabezado-tienda text-center mb-5">
                    <span className="etiqueta">
                        Tu pedido
                    </span>

                    <h1 className="titulo-seccion">
                        Mi carrito
                    </h1>

                    <p className="subtitulo-seccion">
                        Revisa tus productos antes de finalizar la compra.
                    </p>
                </div>

                {mensaje && (
                    <div
                        className={`alert alert-${tipoMensaje}`}
                        role="alert"
                    >
                        {mensaje}
                    </div>
                )}

                <div className="row g-4">
                    {/* Productos del carrito */}
                    <div className="col-12 col-lg-8">
                        {carrito.length === 0 ? (
                            <div className="carrito-vacio">
                                <h2>Tu carrito está vacío</h2>

                                <p>
                                    Agrega productos para comenzar tu compra.
                                </p>

                                <Link
                                    to="/productos"
                                    className="btn btn-tienda"
                                >
                                    Ver productos
                                </Link>
                            </div>
                        ) : (
                            carrito.map((producto, indice) => {
                                const precio =
                                    Number(producto.precio) || 0;

                                const descuento = Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        Number(producto.descuento) || 0
                                    )
                                );

                                const precioFinal =
                                    obtenerPrecioFinal(producto);

                                const cantidad = Math.max(
                                    1,
                                    Number(producto.cantidad) || 1
                                );

                                return (
                                    <article
                                        className="carrito-producto"
                                        key={`${producto.id ?? producto.nombre}-${indice}`}
                                    >
                                        <div className="carrito-imagen">
                                            {producto.imagen ? (
                                                <img
                                                    src={producto.imagen}
                                                    alt={
                                                        producto.nombre ||
                                                        "Producto"
                                                    }
                                                />
                                            ) : (
                                                <div className="carrito-sin-imagen">
                                                    Sin imagen
                                                </div>
                                            )}
                                        </div>

                                        <div className="carrito-detalle">
                                            <h2>
                                                {producto.nombre || "Producto"}
                                            </h2>

                                            <p>
                                                <strong>Talla:</strong>{" "}
                                                {producto.talla || "Única"}
                                            </p>

                                            {descuento > 0 ? (
                                                <>
                                                    <p className="carrito-precio-original">
                                                        Precio original:{" "}
                                                        <s>
                                                            {formatearPrecio(
                                                                precio
                                                            )}
                                                        </s>
                                                    </p>

                                                    <p className="carrito-descuento">
                                                        Descuento: -{descuento}%
                                                    </p>

                                                    <p className="carrito-precio-final">
                                                        {formatearPrecio(
                                                            precioFinal
                                                        )}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="carrito-precio-final">
                                                    {formatearPrecio(
                                                        precioFinal
                                                    )}
                                                </p>
                                            )}

                                            <div className="carrito-acciones">
                                                <span>Cantidad:</span>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() =>
                                                        restarCantidad(indice)
                                                    }
                                                    aria-label={`Restar una unidad de ${producto.nombre}`}
                                                >
                                                    −
                                                </button>

                                                <span className="carrito-cantidad">
                                                    {cantidad}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() =>
                                                        sumarCantidad(indice)
                                                    }
                                                    aria-label={`Agregar una unidad de ${producto.nombre}`}
                                                >
                                                    +
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        eliminarProducto(indice)
                                                    }
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>

                    {/* Resumen del pedido */}
                    <div className="col-12 col-lg-4">
                        <section className="carrito-resumen">
                            <h2>Resumen del pedido</h2>

                            <div className="carrito-linea-resumen">
                                <span>Subtotal</span>
                                <span>
                                    {formatearPrecio(subtotal)}
                                </span>
                            </div>

                            <div className="carrito-linea-resumen">
                                <span>Envío</span>
                                <span>
                                    {formatearPrecio(envio)}
                                </span>
                            </div>

                            <hr />

                            <div className="carrito-linea-resumen carrito-total">
                                <strong>Total</strong>
                                <strong>
                                    {formatearPrecio(total)}
                                </strong>
                            </div>

                            <button
                                type="button"
                                className="btn btn-tienda w-100 mt-3"
                                disabled={carrito.length === 0}
                                onClick={() => {
                                    setMostrarPago(!mostrarPago);
                                }}
                            >
                                Proceder al pago
                            </button>

                            {mostrarPago && carrito.length > 0 && (
                                <div className="carrito-simulacion-pago">
                                    <h3>Simulación de pago</h3>

                                    <p>
                                        Selecciona un resultado para probar
                                        el registro de la compra.
                                    </p>

                                    <button
                                        type="button"
                                        className="btn btn-success w-100 mb-2"
                                        onClick={() =>
                                            procesarPago("Aprobado")
                                        }
                                    >
                                        Simular pago aprobado
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger w-100"
                                        onClick={() =>
                                            procesarPago("Rechazado")
                                        }
                                    >
                                        Simular pago rechazado
                                    </button>
                                </div>
                            )}

                            <Link
                                to="/productos"
                                className="btn btn-outline-dark w-100 mt-2"
                            >
                                Seguir comprando
                            </Link>

                            <p className="carrito-nota">
                                El pago es simulado. No se realiza ningún
                                cobro real.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <FooterTienda />
        </div>
    );
}

export default Carrito;
