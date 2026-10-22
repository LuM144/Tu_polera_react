import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { images } from "../../data/imagenes";
import useAdminEditarProducto from "../../assets/js/admin/useAdminEditarProducto";

function AdminEditarProducto() {
    const {
        id,
        producto,
        categorias,
        colores,
        formulario,
        error,
        actualizarCampo,
        actualizarCategoria,
        actualizarTalla,
        subirImagen,
        guardarProducto
    } = useAdminEditarProducto();

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="fw-bold">
                                    {producto
                                        ? "Editar producto"
                                        : "Agregar producto"}
                                </h1>

                                <p className="text-muted mb-0">
                                    {producto
                                        ? "Modifica la información del producto."
                                        : "Completa la información del nuevo producto."}
                                </p>
                            </div>

                            <Link
                                to="/admin/productos"
                                className="btn btn-secondary"
                            >
                                Volver
                            </Link>
                        </div>

                        {id && !producto ? (
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h2>Producto no encontrado</h2>

                                    <p>
                                        No existe un producto con el ID solicitado.
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

                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={guardarProducto}>

                                        <div className="mb-3">
                                            <label
                                                htmlFor="nombre"
                                                className="form-label"
                                            >
                                                Nombre del producto
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nombre"
                                                name="nombre"
                                                value={formulario.nombre}
                                                onChange={actualizarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                htmlFor="categoria"
                                                className="form-label"
                                            >
                                                Categoría
                                            </label>

                                            <select
                                                className="form-select"
                                                id="categoria"
                                                name="categoria"
                                                value={formulario.categoria}
                                                onChange={actualizarCategoria}
                                                required
                                            >
                                                <option value="">
                                                    Seleccionar categoría
                                                </option>

                                                <option value="poleras">
                                                    Poleras
                                                </option>

                                                <option value="polerones">
                                                    Polerones
                                                </option>

                                                <option value="gorras">
                                                    Gorras
                                                </option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                htmlFor="precio"
                                                className="form-label"
                                            >
                                                Precio
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                id="precio"
                                                name="precio"
                                                min="0"
                                                step="1"
                                                value={formulario.precio}
                                                onChange={actualizarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                htmlFor="color"
                                                className="form-label"
                                            >
                                                Color
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="color"
                                                name="color"
                                                value={formulario.color}
                                                onChange={actualizarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                htmlFor="descuento"
                                                className="form-label"
                                            >
                                                Descuento (%)
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                id="descuento"
                                                name="descuento"
                                                min="0"
                                                max="100"
                                                value={formulario.descuento}
                                                onChange={actualizarCampo}
                                                required
                                            />
                                        </div>

                                        {formulario.categoria && (
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Tallas
                                                </label>

                                                <div>
                                                    {(formulario.categoria === "gorras"
                                                        ? ["Única"]
                                                        : ["S", "M", "L", "XL"]
                                                    ).map(function (talla) {
                                                        return (
                                                            <div
                                                                className="form-check form-check-inline"
                                                                key={talla}
                                                            >
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`talla${talla}`}
                                                                    checked={formulario.tallas.includes(talla)}
                                                                    onChange={() => actualizarTalla(talla)}
                                                                />

                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`talla${talla}`}
                                                                >
                                                                    {talla}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {formulario.categoria === "poleras" && (
                                            <div className="mb-3">
                                                <label
                                                    htmlFor="manga_corta"
                                                    className="form-label"
                                                >
                                                    ¿Manga corta?
                                                </label>

                                                <select
                                                    className="form-select"
                                                    id="manga_corta"
                                                    name="manga_corta"
                                                    value={formulario.manga_corta}
                                                    onChange={actualizarCampo}
                                                >
                                                    <option value="si">Sí</option>
                                                    <option value="no">No</option>
                                                </select>
                                            </div>
                                        )}

                                        {formulario.categoria === "polerones" && (
                                            <div className="mb-3">
                                                <label
                                                    htmlFor="capucha"
                                                    className="form-label"
                                                >
                                                    ¿Tiene capucha?
                                                </label>

                                                <select
                                                    className="form-select"
                                                    id="capucha"
                                                    name="capucha"
                                                    value={formulario.capucha}
                                                    onChange={actualizarCampo}
                                                >
                                                    <option value="si">Sí</option>
                                                    <option value="no">No</option>
                                                </select>
                                            </div>
                                        )}

                                        {formulario.categoria === "gorras" && (
                                            <div className="mb-3">
                                                <label
                                                    htmlFor="tipo_gorro"
                                                    className="form-label"
                                                >
                                                    Tipo de gorro
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="tipo_gorro"
                                                    name="tipo_gorro"
                                                    placeholder="Ej: Snapback"
                                                    value={formulario.tipo_gorro}
                                                    onChange={actualizarCampo}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label
                                                htmlFor="imagen"
                                                className="form-label"
                                            >
                                                Imagen del producto
                                            </label>

                                            <select
                                                className="form-select"
                                                id="imagen"
                                                name="imagen"
                                                value={formulario.imagen}
                                                onChange={actualizarCampo}
                                                required
                                            >
                                                <option value="">
                                                    Seleccionar imagen
                                                </option>

                                                <option value={images.imagen1}>
                                                    Imagen 1
                                                </option>

                                                <option value={images.imagen2}>
                                                    Imagen 2
                                                </option>

                                                <option value={images.imagen3}>
                                                    Imagen 3
                                                </option>

                                                <option value={images.imagen4}>
                                                    Imagen 4
                                                </option>

                                                <option value={images.imagen5}>
                                                    Imagen 5
                                                </option>

                                                <option value={images.imagen6}>
                                                    Imagen 6
                                                </option>
                                            </select>
                                        </div>

                                        {formulario.imagen && (
                                            <div className="mb-3">
                                                <p className="form-label">
                                                    Vista previa
                                                </p>

                                                <img
                                                    src={formulario.imagen}
                                                    alt="Vista previa del producto"
                                                    className="img-fluid imagen-producto-admin"
                                                    onError={(evento) => {
                                                        evento.currentTarget.onerror = null;
                                                        evento.currentTarget.src = images.placeholder;
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label
                                                htmlFor="descripcion"
                                                className="form-label"
                                            >
                                                Descripción
                                            </label>

                                            <textarea
                                                className="form-control"
                                                id="descripcion"
                                                name="descripcion"
                                                rows="4"
                                                value={formulario.descripcion}
                                                onChange={actualizarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                {producto
                                                    ? "Guardar cambios"
                                                    : "Crear producto"}
                                            </button>

                                            <Link
                                                to="/admin/productos"
                                                className="btn btn-secondary ms-2"
                                            >
                                                Cancelar
                                            </Link>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminEditarProducto;