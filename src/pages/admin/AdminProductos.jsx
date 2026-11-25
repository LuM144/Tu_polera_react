
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import useAdminProductos from "../../assets/js/admin/useAdminProductos";
import {
    formatearPrecio,
    obtenerRutaImagen
} from "../../assets/js/tienda/catalogo";

function AdminProductos() {
    const {
        productos,
        obtenerNombreCategoria,
        obtenerStockTotal,
        obtenerEstadoStock
    } = useAdminProductos();

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 admin-contenido p-4 p-md-5">

                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                            <div>
                                <h1 className="admin-titulo">
                                    Productos
                                </h1>

                                <p className="admin-subtitulo mb-0">
                                    Administra los productos y el stock de la tienda.
                                </p>
                            </div>

                            <Link
                                to="/admin/productos/editar"
                                className="btn btn-primary"
                            >
                                + Agregar producto
                            </Link>
                        </div>

                        <div className="admin-tarjeta">
                            <h2 className="admin-tarjeta-titulo">
                                Lista de productos
                            </h2>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle">

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Producto</th>
                                            <th>Categoría</th>
                                            <th>Precio</th>
                                            <th>Descuento</th>
                                            <th>Stock</th>
                                            <th>Datos</th>
                                            <th>Editar</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {productos.map((producto) => {
                                            const estado = obtenerEstadoStock(producto);

                                            return (
                                                <tr key={producto.id}>
                                                    <td>{producto.id}</td>

                                                    <td>
                                                        <div className="admin-producto-celda">
                                                            <img
                                                                src={obtenerRutaImagen(producto.imagen)}
                                                                alt={producto.nombre}
                                                                className="admin-miniatura"
                                                            />

                                                            <span>{producto.nombre}</span>
                                                        </div>
                                                    </td>

                                                    <td>{obtenerNombreCategoria(producto)}</td>

                                                    <td>{formatearPrecio(producto.precio)}</td>

                                                    <td>{producto.descuento}%</td>

                                                    <td>
                                                        <div className="admin-stock-celda">
                                                            <strong>
                                                                {obtenerStockTotal(producto)} u.
                                                            </strong>

                                                            <span className={`badge text-bg-${estado.clase}`}>
                                                                {estado.texto}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <Link
                                                            to={`/admin/productos/ver/${producto.id}`}
                                                            className="btn btn-dark btn-sm"
                                                        >
                                                            Datos
                                                        </Link>
                                                    </td>

                                                    <td>
                                                        <Link
                                                            to={`/admin/productos/editar/${producto.id}`}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            Editar
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </table>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminProductos;
