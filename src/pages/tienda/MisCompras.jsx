
import { Link } from "react-router-dom";
import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";
import Icono from "../../components/Iconos";
import useMisCompras, {
    describirEstado,
    formatearFecha
} from "../../assets/js/tienda/useMisCompras";
import { formatearPrecio } from "../../assets/js/tienda/catalogo";

function DetalleCompra({ compra, calcularTotalCompra }) {
    const estado = describirEstado(compra);

    const subtotal = (compra.items || []).reduce(
        (total, item) =>
            total + (Number(item.precio) || 0) * (Number(item.cantidad) || 0),
        0
    );

    return (
        <article className="boleta-usuario">
            <header className="boleta-cabecera">
                <div>
                    <span className="etiqueta">Boleta</span>
                    <h1>{compra.numero}</h1>
                    <p>{formatearFecha(compra.fecha)}</p>
                </div>

                <span className={`boleta-estado ${estado.clase}`}>
                    {estado.texto}
                </span>
            </header>

            <div className="table-responsive">
                <table className="table boleta-tabla">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Talla</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(compra.items || []).map((item, indice) => (
                            <tr key={`${item.id ?? item.nombre}-${item.talla}-${indice}`}>
                                <td>{item.nombre}</td>
                                <td>{item.talla || "—"}</td>
                                <td>{item.cantidad}</td>
                                <td>{formatearPrecio(item.precio)}</td>
                                <td>
                                    {formatearPrecio(
                                        (Number(item.precio) || 0) *
                                        (Number(item.cantidad) || 0)
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="boleta-totales">
                <div>
                    <span>Subtotal</span>
                    <span>{formatearPrecio(subtotal)}</span>
                </div>

                <div>
                    <span>Despacho</span>
                    <span>{formatearPrecio(compra.envio)}</span>
                </div>

                <div className="boleta-total">
                    <strong>Total pagado</strong>
                    <strong>{formatearPrecio(calcularTotalCompra(compra))}</strong>
                </div>
            </div>

            {compra.despacho?.direccion && (
                <p className="boleta-despacho">
                    <Icono nombre="mapa" tamano={16} />
                    Despacho a: {compra.despacho.direccion}
                </p>
            )}

            <Link to="/usuario/compras" className="btn btn-outline-dark">
                Volver a mis compras
            </Link>
        </article>
    );
}

function MisCompras() {
    const {
        usuario,
        compras,
        compraSeleccionada,
        id,
        calcularTotalCompra
    } = useMisCompras();

    if (!usuario) {
        return null;
    }

    return (
        <div className="pagina-tienda">
            <NavbarTienda />

            <main className="container py-5">
                {id ? (
                    compraSeleccionada ? (
                        <DetalleCompra
                            compra={compraSeleccionada}
                            calcularTotalCompra={calcularTotalCompra}
                        />
                    ) : (
                        <div className="carrito-vacio">
                            <h1>Compra no encontrada</h1>

                            <p>
                                No existe una compra con ese número en tu cuenta.
                            </p>

                            <Link to="/usuario/compras" className="btn btn-tienda">
                                Ver mis compras
                            </Link>
                        </div>
                    )
                ) : (
                    <>
                        <div className="encabezado-tienda text-center">
                            <span className="etiqueta">Mi cuenta</span>

                            <h1 className="titulo-seccion">Mis compras</h1>

                            <p className="subtitulo-seccion">
                                Consulta tus boletas y el detalle de cada compra.
                            </p>
                        </div>

                        {compras.length === 0 ? (
                            <div className="carrito-vacio">
                                <h2>Aún no tienes compras</h2>

                                <p>
                                    Cuando realices un pedido aparecerá aquí.
                                </p>

                                <Link to="/productos" className="btn btn-tienda">
                                    Ver productos
                                </Link>
                            </div>
                        ) : (
                            <ul className="lista-compras">
                                {compras.map(compra => {
                                    const estado = describirEstado(compra);
                                    const unidades = (compra.items || []).reduce(
                                        (total, item) =>
                                            total + (Number(item.cantidad) || 0),
                                        0
                                    );

                                    return (
                                        <li key={compra.id} className="compra-item">
                                            <div>
                                                <h2>{compra.numero}</h2>

                                                <p>
                                                    {formatearFecha(compra.fecha)} ·{" "}
                                                    {unidades} unidad(es)
                                                </p>
                                            </div>

                                            <span className={`boleta-estado ${estado.clase}`}>
                                                {estado.texto}
                                            </span>

                                            <strong className="compra-total">
                                                {formatearPrecio(calcularTotalCompra(compra))}
                                            </strong>

                                            <Link
                                                to={`/usuario/compras/${compra.id}`}
                                                className="btn btn-outline-dark btn-sm"
                                            >
                                                Ver detalle
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </>
                )}
            </main>

            <FooterTienda />
        </div>
    );
}

export default MisCompras;
