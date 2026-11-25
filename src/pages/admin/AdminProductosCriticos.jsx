
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Icono from "../../components/Iconos";
import useAdminProductosCriticos from "../../assets/js/admin/useAdminProductosCriticos";
import { obtenerRutaImagen } from "../../assets/js/tienda/catalogo";

function AdminProductosCriticos() {
    const {
        criticos,
        agotados,
        stockBajo,
        umbral,
        umbralTexto,
        setUmbralTexto,
        guardarUmbral,
        mensaje
    } = useAdminProductosCriticos();

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 admin-contenido p-4 p-md-5">

                        <h1 className="admin-titulo">
                            Productos críticos
                        </h1>

                        <p className="admin-subtitulo mb-4">
                            Tallas agotadas o con pocas unidades que necesitan
                            reposición.
                        </p>

                        {mensaje && (
                            <div className="alert alert-info" role="status">
                                {mensaje}
                            </div>
                        )}

                        <div className="row g-3 mb-4">
                            <div className="col-12 col-md-4">
                                <div className="admin-resumen admin-resumen-peligro">
                                    <Icono nombre="cerrar" tamano={28} />

                                    <div>
                                        <strong>{agotados.length}</strong>
                                        <span>Tallas agotadas</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="admin-resumen admin-resumen-alerta">
                                    <Icono nombre="alerta" tamano={28} />

                                    <div>
                                        <strong>{stockBajo.length}</strong>
                                        <span>Con stock bajo</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <form
                                    className="admin-resumen admin-resumen-formulario"
                                    onSubmit={guardarUmbral}
                                >
                                    <label htmlFor="umbralStock">
                                        Umbral de stock bajo
                                    </label>

                                    <div className="input-group">
                                        <input
                                            id="umbralStock"
                                            type="number"
                                            min="1"
                                            step="1"
                                            className="form-control"
                                            value={umbralTexto}
                                            onChange={evento =>
                                                setUmbralTexto(evento.target.value)
                                            }
                                        />

                                        <button
                                            type="submit"
                                            className="btn btn-dark"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="admin-tarjeta">
                            <h2 className="admin-tarjeta-titulo">
                                Tallas con {umbral} unidad(es) o menos
                            </h2>

                            {criticos.length === 0 ? (
                                <p className="text-muted mb-0">
                                    No hay productos con stock crítico.
                                </p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Categoría</th>
                                                <th>Talla</th>
                                                <th>Disponible</th>
                                                <th>Estado</th>
                                                <th>Administrar</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {criticos.map(item => (
                                                <tr
                                                    key={`${item.producto.id}-${item.talla}`}
                                                >
                                                    <td>
                                                        <div className="admin-producto-celda">
                                                            <img
                                                                src={obtenerRutaImagen(
                                                                    item.producto.imagen
                                                                )}
                                                                alt={item.producto.nombre}
                                                                className="admin-miniatura"
                                                            />

                                                            <span>{item.producto.nombre}</span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {item.categoria?.nombre ?? "Sin categoría"}
                                                    </td>

                                                    <td>{item.talla}</td>

                                                    <td>
                                                        <strong>{item.stock} u.</strong>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`badge text-bg-${item.agotado ? "danger" : "warning"}`}
                                                        >
                                                            {item.agotado ? "Agotada" : "Stock bajo"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <Link
                                                            to={`/admin/productos/editar/${item.producto.id}`}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            Reponer stock
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminProductosCriticos;
