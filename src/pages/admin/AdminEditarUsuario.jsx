
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { regiones } from "../../data/regionesComunas";

function cargarUsuarios() {
    const usuariosGuardados = localStorage.getItem("usuarios");
    return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
}

function obtenerUsuario(id) {
    if (!id) return null;

    const usuarios = cargarUsuarios();

    return usuarios.find(function (usuario) {
        return usuario.id === Number(id);
    }) || null;
}

function crearFormulario(usuario) {
    return {
        nombre: usuario?.nombre || "",
        correo: usuario?.correo || "",
        rut: usuario?.rut || "",
        region: usuario?.region || "",
        comuna: usuario?.comuna || "",
        password: "",
        rol: usuario?.rol || ""
    };
}

function AdminEditarUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();

    const usuarioExistente = obtenerUsuario(id);

    const [formulario, setFormulario] = useState(
        () => crearFormulario(usuarioExistente)
    );
    const [errores, setErrores] = useState({});

    const esEdicion = Boolean(id);
    const comunas = formulario.region ? regiones[formulario.region] || [] : [];

    function manejarCambio(evento) {
        const { name, value } = evento.target;

        setFormulario(function (anterior) {
            if (name === "region") {
                return {
                    ...anterior,
                    region: value,
                    comuna: ""
                };
            }

            return {
                ...anterior,
                [name]: value
            };
        });

        setErrores(function (anteriores) {
            return {
                ...anteriores,
                [name]: ""
            };
        });
    }

    function guardarUsuario(evento) {
        evento.preventDefault();

        const nuevosErrores = {};

        if (!formulario.nombre.trim()) {
            nuevosErrores.nombre = "Ingresa el nombre.";
        }

        if (!formulario.correo.trim()) {
            nuevosErrores.correo = "Ingresa el correo.";
        }

        if (!formulario.rut.trim()) {
            nuevosErrores.rut = "Ingresa el RUT.";
        }

        if (!formulario.region) {
            nuevosErrores.region = "Selecciona una región.";
        }

        if (!formulario.comuna) {
            nuevosErrores.comuna = "Selecciona una comuna.";
        }

        if (!esEdicion && !formulario.password.trim()) {
            nuevosErrores.password = "Ingresa una contraseña.";
        }

        if (!formulario.rol) {
            nuevosErrores.rol = "Selecciona un rol.";
        }

        const usuarios = cargarUsuarios();

        const correoDuplicado = usuarios.some(function (usuario) {
            return usuario.correo.toLowerCase() ===
                formulario.correo.trim().toLowerCase() &&
                usuario.id !== Number(id);
        });

        if (correoDuplicado) {
            nuevosErrores.correo = "Este correo ya está registrado.";
        }

        const rutDuplicado = usuarios.some(function (usuario) {
            return usuario.rut.toLowerCase() ===
                formulario.rut.trim().toLowerCase() &&
                usuario.id !== Number(id);
        });

        if (rutDuplicado) {
            nuevosErrores.rut = "Este RUT ya está registrado.";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        let usuarioGuardado;

        if (esEdicion) {
            usuarioGuardado = {
                ...usuarioExistente,
                nombre: formulario.nombre.trim(),
                correo: formulario.correo.trim(),
                rut: formulario.rut.trim(),
                region: formulario.region,
                comuna: formulario.comuna,
                rol: formulario.rol
            };

            // Si se ingresó una contraseña nueva, se actualiza.
            // Si se dejó vacía, se conserva la anterior.
            if (formulario.password.trim()) {
                usuarioGuardado.password = formulario.password;
            }

            const usuariosActualizados = usuarios.map(function (usuario) {
                return usuario.id === Number(id)
                    ? usuarioGuardado
                    : usuario;
            });

            localStorage.setItem(
                "usuarios",
                JSON.stringify(usuariosActualizados)
            );
        } else {
            const nuevoId = usuarios.length > 0
                ? Math.max(...usuarios.map(function (usuario) {
                    return Number(usuario.id) || 0;
                })) + 1
                : 1;

            usuarioGuardado = {
                id: nuevoId,
                nombre: formulario.nombre.trim(),
                correo: formulario.correo.trim(),
                rut: formulario.rut.trim(),
                region: formulario.region,
                comuna: formulario.comuna,
                password: formulario.password,
                rol: formulario.rol
            };

            usuarios.push(usuarioGuardado);

            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        }

        navigate("/admin/usuarios");
    }

    if (esEdicion && !usuarioExistente) {
        return (
            <div className="pagina-admin">
                <div className="container-fluid">
                    <div className="row min-vh-100">
                        <AdminSidebar />
                        <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                            <h1>Usuario no encontrado</h1>
                            <p>El usuario solicitado no existe.</p>
                            <Link to="/admin/usuarios" className="btn btn-secondary">
                                Volver a usuarios
                            </Link>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="fw-bold">
                                    {esEdicion ? "Editar usuario" : "Crear usuario"}
                                </h1>
                                <p className="text-muted mb-0">
                                    Ingresa la información del usuario.
                                </p>
                            </div>

                            <Link to="/admin/usuarios" className="btn btn-secondary">
                                Volver
                            </Link>
                        </div>

                        <div className="card shadow-sm">
                            <div className="card-body">
                                <form onSubmit={guardarUsuario}>
                                    <div className="mb-3">
                                        <label className="form-label">ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={usuarioExistente?.id ?? "Se asignará al guardar"}
                                            readOnly
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">
                                            Nombre
                                        </label>
                                        <input
                                            id="nombre"
                                            name="nombre"
                                            type="text"
                                            className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                                            value={formulario.nombre}
                                            onChange={manejarCambio}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            {errores.nombre}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="correo" className="form-label">
                                            Correo electrónico
                                        </label>
                                        <input
                                            id="correo"
                                            name="correo"
                                            type="email"
                                            className={`form-control ${errores.correo ? "is-invalid" : ""}`}
                                            value={formulario.correo}
                                            onChange={manejarCambio}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            {errores.correo}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="rut" className="form-label">
                                            RUT
                                        </label>
                                        <input
                                            id="rut"
                                            name="rut"
                                            type="text"
                                            className={`form-control ${errores.rut ? "is-invalid" : ""}`}
                                            placeholder="12345678-9"
                                            value={formulario.rut}
                                            onChange={manejarCambio}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            {errores.rut}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="region" className="form-label">
                                            Región
                                        </label>
                                        <select
                                            id="region"
                                            name="region"
                                            className={`form-select ${errores.region ? "is-invalid" : ""}`}
                                            value={formulario.region}
                                            onChange={manejarCambio}
                                            required
                                        >
                                            <option value="">Seleccionar región</option>
                                            {Object.keys(regiones).map(function (region) {
                                                return (
                                                    <option key={region} value={region}>
                                                        {region}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="invalid-feedback">
                                            {errores.region}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="comuna" className="form-label">
                                            Comuna
                                        </label>
                                        <select
                                            id="comuna"
                                            name="comuna"
                                            className={`form-select ${errores.comuna ? "is-invalid" : ""}`}
                                            value={formulario.comuna}
                                            onChange={manejarCambio}
                                            disabled={!formulario.region}
                                            required
                                        >
                                            <option value="">Seleccionar comuna</option>
                                            {comunas.map(function (comuna) {
                                                return (
                                                    <option key={comuna} value={comuna}>
                                                        {comuna}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="invalid-feedback">
                                            {errores.comuna}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Contraseña
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            className={`form-control ${errores.password ? "is-invalid" : ""}`}
                                            value={formulario.password}
                                            onChange={manejarCambio}
                                            placeholder={esEdicion ? "Dejar en blanco para mantener la actual" : ""}
                                            required={!esEdicion}
                                        />
                                        <div className="invalid-feedback">
                                            {errores.password}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="rol" className="form-label">
                                            Rol
                                        </label>
                                        <select
                                            id="rol"
                                            name="rol"
                                            className={`form-select ${errores.rol ? "is-invalid" : ""}`}
                                            value={formulario.rol}
                                            onChange={manejarCambio}
                                            required
                                        >
                                            <option value="">Seleccionar rol</option>
                                            <option value="cliente">Cliente</option>
                                            <option value="vendedor">Vendedor</option>
                                            <option value="administrador">Administrador</option>
                                        </select>
                                        <div className="invalid-feedback">
                                            {errores.rol}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-primary">
                                            Guardar usuario
                                        </button>

                                        <Link
                                            to="/admin/usuarios"
                                            className="btn btn-secondary ms-2"
                                        >
                                            Cancelar
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminEditarUsuario;
