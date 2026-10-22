
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { images } from "../../data/imagenes";
import useAdminVerProducto from "../../assets/js/admin/useAdminVerProducto";

function AdminVerProducto() {
    const {
        producto,
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

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="fw-bold">
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
                                                src={producto.imagen || images.placeholder}
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
                                                {producto.categoria}
                                            </p>

                                            <p>
                                                <strong>Precio:</strong>{" "}
                                                ${producto.precio.toLocaleString("es-CL")}
                                            </p>

                                            <p>
                                                <strong>Color:</strong>{" "}
                                                {producto.color}
                                            </p>

                                            <p>
                                                <strong>Descuento:</strong>{" "}
                                                {producto.descuento}%
                                            </p>

                                            <p>
                                                <strong>Tallas:</strong>{" "}
                                                {producto.tallas && producto.tallas.length > 0
                                                    ? producto.tallas.join(", ")
                                                    : "Sin tallas"}
                                            </p>

                                            {producto.categoria === "poleras" && (
                                                <p>
                                                    <strong>Manga corta:</strong>{" "}
                                                    {producto.manga_corta === "si"
                                                        ? "Sí"
                                                        : "No"}
                                                </p>
                                            )}

                                            {producto.categoria === "polerones" && (
                                                <p>
                                                    <strong>Capucha:</strong>{" "}
                                                    {producto.capucha === "si"
                                                        ? "Sí"
                                                        : "No"}
                                                </p>
                                            )}

                                            {producto.categoria === "gorras" && (
                                                <p>
                                                    <strong>Tipo de gorro:</strong>{" "}
                                                    {producto.tipo_gorro || "No especificado"}
                                                </p>
                                            )}

                                            <p>
                                                <strong>Descripción:</strong>
                                            </p>

                                            <p>
                                                {producto.descripcion || "Sin descripción"}
                                            </p>

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
