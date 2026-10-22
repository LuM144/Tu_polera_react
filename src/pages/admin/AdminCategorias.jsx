
import AdminSidebar from "../../components/admin/AdminSidebar";
import useAdminCategorias from "../../assets/js/admin/useAdminCategorias";
import { images } from "../../data/imagenes";

function mostrarNombre(nombre) {
    if (!nombre) return "";

    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

function AdminCategorias() {
    const {
        categorias,
        colores,
        formulario,
        actualizarFormulario,
        editandoId,
        mensaje,
        guardarCategoria,
        comenzarEdicion,
        cancelarEdicion,
        eliminarCategoria,
        nuevoColor,
        setNuevoColor,
        agregarColor,
        eliminarColor
    } = useAdminCategorias();

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                        <h1 className="fw-bold">
                            Categorías y colores
                        </h1>

                        <p className="text-muted mb-4">
                            Administra las categorías, sus imágenes y los
                            colores disponibles para los productos.
                        </p>

                        {mensaje && (
                            <div className="alert alert-info" role="status">
                                {mensaje}
                            </div>
                        )}

                        <div className="row">
                            <div className="col-lg-7">
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body">
                                        <h4 className="mb-3">
                                            {editandoId !== null
                                                ? "Editar categoría"
                                                : "Agregar categoría"}
                                        </h4>

                                        <form onSubmit={guardarCategoria}>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Nombre
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Ej.: Poleras"
                                                    value={formulario.nombre}
                                                    onChange={evento =>
                                                        actualizarFormulario(
                                                            "nombre",
                                                            evento.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Descripción
                                                </label>

                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    placeholder="Describe esta categoría"
                                                    value={formulario.descripcion}
                                                    onChange={evento =>
                                                        actualizarFormulario(
                                                            "descripcion",
                                                            evento.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Imagen de la categoría
                                                </label>

                                                <select
                                                    className="form-select"
                                                    value={formulario.imagen}
                                                    onChange={evento =>
                                                        actualizarFormulario(
                                                            "imagen",
                                                            evento.target.value
                                                        )
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        Selecciona una imagen
                                                    </option>

                                                    {Object.keys(images).map(nombre => (
                                                        <option
                                                            key={nombre}
                                                            value={nombre}
                                                        >
                                                            {mostrarNombre(nombre)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {formulario.imagen && (
                                                <div className="mb-3">
                                                    <p className="form-label">
                                                        Vista previa
                                                    </p>

                                                    <img
                                                        src={
                                                            images[formulario.imagen] ??
                                                            images.placeholder
                                                        }
                                                        alt="Vista previa de la categoría"
                                                        className="img-thumbnail"
                                                        style={{
                                                            width: "220px",
                                                            height: "150px",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                className="btn btn-primary me-2"
                                            >
                                                {editandoId !== null
                                                    ? "Guardar cambios"
                                                    : "Agregar categoría"}
                                            </button>

                                            {editandoId !== null && (
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={cancelarEdicion}
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                        </form>
                                    </div>
                                </div>

                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body">
                                        <h4 className="mb-3">
                                            Categorías registradas
                                        </h4>

                                        {categorias.length === 0 ? (
                                            <p className="text-muted">
                                                No hay categorías registradas.
                                            </p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table align-middle">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Imagen</th>
                                                            <th>Nombre</th>
                                                            <th>Descripción</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {categorias.map(categoria => (
                                                            <tr key={categoria.id}>
                                                                <td>{categoria.id}</td>

                                                                <td>
                                                                    <img
                                                                        src={
                                                                            images[categoria.imagen] ??
                                                                            images.placeholder
                                                                        }
                                                                        alt={categoria.nombre}
                                                                        style={{
                                                                            width: "65px",
                                                                            height: "65px",
                                                                            objectFit: "cover"
                                                                        }}
                                                                    />
                                                                </td>

                                                                <td>
                                                                    {categoria.nombre}
                                                                </td>

                                                                <td>
                                                                    {categoria.descripcion}
                                                                </td>

                                                                <td>
                                                                    <div className="d-flex flex-column gap-2">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-primary btn-sm"
                                                                            onClick={() =>
                                                                                comenzarEdicion(categoria)
                                                                            }
                                                                        >
                                                                            Editar
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-danger btn-sm"
                                                                            onClick={() =>
                                                                                eliminarCategoria(categoria.id)
                                                                            }
                                                                        >
                                                                            Eliminar
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body">
                                        <h4 className="mb-3">
                                            Colores registrados
                                        </h4>

                                        {colores.length === 0 ? (
                                            <p className="text-muted">
                                                No hay colores registrados.
                                            </p>
                                        ) : (
                                            <ul className="list-group list-group-flush mb-3">
                                                {colores.map(color => (
                                                    <li
                                                        key={color}
                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                    >
                                                        {mostrarNombre(color)}

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() =>
                                                                eliminarColor(color)
                                                            }
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <form onSubmit={agregarColor}>
                                            <label className="form-label">
                                                Nuevo color
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control mb-3"
                                                placeholder="Ej.: azul"
                                                value={nuevoColor}
                                                onChange={evento =>
                                                    setNuevoColor(evento.target.value)
                                                }
                                                required
                                            />

                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                Agregar color
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminCategorias;
