
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import useAdminVerUsuario from "../../assets/js/admin/useAdminVerUsuario";

function AdminVerUsuario() {
    const {
        usuario,
        mostrarModal,
        abrirModal,
        cerrarModal,
        eliminarUsuario
    } = useAdminVerUsuario();

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                        {!usuario ? (
                            <>
                                <h1 className="fw-bold">
                                    Usuario no encontrado
                                </h1>

                                <p>El usuario solicitado no existe.</p>

                                <Link
                                    to="/admin/usuarios"
                                    className="btn btn-secondary"
                                >
                                    Volver a usuarios
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h1 className="fw-bold">
                                            Información del usuario
                                        </h1>

                                        <p className="text-muted mb-0">
                                            Datos del usuario seleccionado.
                                        </p>
                                    </div>

                                    <Link
                                        to="/admin/usuarios"
                                        className="btn btn-secondary"
                                    >
                                        Volver
                                    </Link>
                                </div>

                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h2>{usuario.nombre}</h2>

                                        <hr />

                                        <p>
                                            <strong>ID:</strong> {usuario.id}
                                        </p>

                                        <p>
                                            <strong>Nombre:</strong>{" "}
                                            {usuario.nombre}
                                        </p>

                                        <p>
                                            <strong>Correo:</strong>{" "}
                                            {usuario.correo}
                                        </p>

                                        <p>
                                            <strong>RUT:</strong> {usuario.rut}
                                        </p>

                                        <p>
                                            <strong>Región:</strong>{" "}
                                            {usuario.region || "No especificada"}
                                        </p>

                                        <p>
                                            <strong>Comuna:</strong>{" "}
                                            {usuario.comuna || "No especificada"}
                                        </p>

                                        <p>
                                            <strong>Rol:</strong> {usuario.rol}
                                        </p>

                                        <hr />

                                        <Link
                                            to={`/admin/usuarios/editar/${usuario.id}`}
                                            className="btn btn-primary"
                                        >
                                            Editar usuario
                                        </Link>

                                        <button
                                            type="button"
                                            className="btn btn-danger ms-2"
                                            onClick={abrirModal}
                                        >
                                            Eliminar usuario
                                        </button>
                                    </div>
                                </div>

                                {mostrarModal && (
                                    <div
                                        className="modal d-block"
                                        tabIndex="-1"
                                        role="dialog"
                                        aria-modal="true"
                                    >
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">
                                                        Eliminar usuario
                                                    </h5>

                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        aria-label="Cerrar"
                                                        onClick={cerrarModal}
                                                    />
                                                </div>

                                                <div className="modal-body text-center">
                                                    <p>
                                                        ¿Estás seguro de que quieres
                                                        eliminar este usuario?
                                                    </p>

                                                    <strong>
                                                        {usuario.nombre}
                                                    </strong>
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
                                                        onClick={eliminarUsuario}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminVerUsuario;
