
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { images } from "../../data/imagenes";
import useAdminVerProducto from "../../assets/js/admin/useAdminVerProducto";
import {
    formatearPrecio,
    mostrarValorAtributo,
    obtenerRutaImagen
} from "../../assets/js/tienda/catalogo";

function AdminVerProducto() {
    const {
        producto,
        categoria,
        tallas,
        mostrarModal,
        eliminarProducto,
        abrirModal,
        cerrarModal
    } = useAdminVerProducto();

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 admin-contenido p-4 p-md-5">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="admin-titulo">
                                    Información del producto
                                </h1>

                                <p className="text-muted">
                                    Datos del producto seleccionado
                                </p>
                            </div>

                            <Link
                                to="/admin/productos"
                                className="btn btn-secondary"
                            >
                                Volver
                            </Link>
                        </div>

                        {!producto ? (
                            <div className="card">
                                <div className="card-body">
                                    <h2>Producto no encontrado</h2>

                                    <p className="text-muted">
                                        El producto no existe o pudo haber sido eliminado.
                                    </p>

                                    <Link
                                        to="/admin/productos"
                                        className="btn btn-primary"
                                    >
                                        Volver a productos
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <div className="row">

                                        <div className="col-md-5 text-center mb-4 mb-md-0">
                                            <img
                                                src={obtenerRutaImagen(producto.imagen)}
                                                className="img-fluid imagen-producto-admin"
                                                alt={producto.nombre}
                                                onError={(evento) => {
                                                    evento.currentTarget.onerror = null;
                                                    evento.currentTarget.src = images.placeholder;
                                                }}
                                            />
                                        </div>

                                        <div className="col-md-7">
                                            <h2>{producto.nombre}</h2>

                                            <hr />

                                            <p>
                                                <strong>ID:</strong>{" "}
                                                {producto.id}
                                            </p>

                                            <p>
                                                <strong>Categoría:</strong>{" "}
                                                {categoria ? categoria.nombre : "Sin categoría"}
                                            </p>

                                            <p>
                                                <strong>Precio:</strong>{" "}
                                                {formatearPrecio(producto.precio)}
                                            </p>

                                            <p>
                                                <strong>Color:</strong>{" "}
                                                {producto.color}
                                            </p>

                                            <p>
                                                <strong>Descuento:</strong>{" "}
                                                {producto.descuento}%
                                            </p>

                                            {categoria && categoria.atributos.map((atributo) => (
                                                <p key={atributo.id}>
                                                    <strong>{atributo.nombre}:</strong>{" "}
                                                    {mostrarValorAtributo(
                                                        atributo,
                                                        producto.atributos?.[atributo.id]
                                                    )}
                                                </p>
                                            ))}

                                            <p>
                                                <strong>Descripción:</strong>
                                            </p>

                                            <p>
                                                {producto.descripcion || "Sin descripción"}
                                            </p>

                                            <h3 className="admin-bloque-titulo mt-3">
                                                Tallas, stock y medidas
                                            </h3>

                                            {tallas.length === 0 ? (
                                                <p>Sin tallas registradas.</p>
                                            ) : (
                                                <div className="table-responsive">
                                                    <table className="table table-sm align-middle">
                                                        <thead>
                                                            <tr>
                                                                <th>Talla</th>
                                                                <th>Stock</th>
                                                                {categoria && categoria.medidas
                                                                    .filter((medida) => medida.registrarProducto)
                                                                    .map((medida) => (
                                                                        <th key={medida.id}>
                                                                            {medida.nombre} ({medida.unidad})
                                                                        </th>
                                                                    ))}
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {tallas.map((talla) => (
                                                                <tr key={talla}>
                                                                    <td>{talla}</td>

                                                                    <td>
                                                                        {producto.tallas[talla].stock === 0 ? (
                                                                            <span className="badge text-bg-danger">
                                                                                Agotada
                                                                            </span>
                                                                        ) : (
                                                                            producto.tallas[talla].stock
                                                                        )}
                                                                    </td>

                                                                    {categoria && categoria.medidas
                                                                        .filter((medida) => medida.registrarProducto)
                                                                        .map((medida) => (
                                                                            <td key={medida.id}>
                                                                                {producto.tallas[talla].medidas[medida.id] ?? "—"}
                                                                            </td>
                                                                        ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            <hr />

                                            <Link
                                                to={`/admin/productos/editar/${producto.id}`}
                                                className="btn btn-primary"
                                            >
                                                Editar producto
                                            </Link>

                                            <button
                                                type="button"
                                                className="btn btn-danger ms-2"
                                                onClick={abrirModal}
                                            >
                                                Eliminar producto
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>

            {mostrarModal && producto && (
                <>
                    <div
                        className="modal fade show d-block"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modalEliminarLabel"
                        tabIndex="-1"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5
                                        className="modal-title"
                                        id="modalEliminarLabel"
                                    >
                                        Eliminar producto
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Cerrar"
                                        onClick={cerrarModal}
                                    />
                                </div>

                                <div className="modal-body text-center">
                                    <img
                                        src={images.placeholder}
                                        alt="Eliminar producto"
                                        className="img-fluid mb-3 imagen-eliminar-producto"
                                    />

                                    <p>
                                        ¿Estás seguro de que quieres eliminar este producto?
                                    </p>

                                    <strong>{producto.nombre}</strong>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={cerrarModal}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={eliminarProducto}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div
                        className="modal-backdrop fade show"
                        onClick={cerrarModal}
                    />
                </>
            )}
        </div>
    );
}

export default AdminVerProducto;
