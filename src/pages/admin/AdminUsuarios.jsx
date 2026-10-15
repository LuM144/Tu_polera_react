
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { UsuariosTest } from "../../data/usuariosTest";

function cargarUsuarios() {
    const usuariosGuardados = localStorage.getItem("usuarios");

    if (usuariosGuardados !== null) {
        return JSON.parse(usuariosGuardados);
    }

    localStorage.setItem("usuarios", JSON.stringify(UsuariosTest));

    return UsuariosTest;
}

function AdminUsuarios() {
    const [usuarios] = useState(cargarUsuarios);

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="fw-bold">
                                    Usuarios
                                </h1>

                                <p className="text-muted mb-0">
                                    Administra los usuarios de la tienda.
                                </p>
                            </div>

                            <Link
                                to="/admin/usuarios/editar"
                                className="btn btn-primary"
                            >
                                + Crear usuario
                            </Link>
                        </div>

                        <div className="card border-0 shadow-sm">
                            <div className="card-body">

                                <h5 className="card-title mb-4">
                                    Lista de usuarios
                                </h5>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">

                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Correo</th>
                                                <th>RUT</th>
                                                <th>Rol</th>
                                                <th>Datos</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {usuarios.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="6"
                                                        className="text-center py-4"
                                                    >
                                                        No hay usuarios registrados.
                                                    </td>
                                                </tr>
                                            ) : (
                                                usuarios.map(function (usuario) {
                                                    return (
                                                        <tr key={usuario.id}>
                                                            <td>{usuario.id}</td>

                                                            <td>{usuario.nombre}</td>

                                                            <td>{usuario.correo}</td>

                                                            <td>{usuario.rut}</td>

                                                            <td>{usuario.rol}</td>

                                                            <td>
                                                                <Link
                                                                    to={`/admin/usuarios/ver/${usuario.id}`}
                                                                    className="btn btn-dark btn-sm text-white"
                                                                >
                                                                    Datos
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminUsuarios;
