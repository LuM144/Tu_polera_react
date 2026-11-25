
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import useAdminEditarUsuario from "../../assets/js/admin/useAdminEditarUsuario";

function AdminEditarUsuario() {
    const {
        id,
        usuarioExistente,
        esEdicion,
        formulario,
        errores,
        regiones,
        comunas,
        manejarCambio,
        guardarUsuario
    } = useAdminEditarUsuario();

    if (esEdicion && !usuarioExistente) {
        return (
            <div className="pagina-admin">
                <div className="container-fluid">
                    <div className="row min-vh-100">
                        <AdminSidebar />

                        <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                            <h1>Usuario no encontrado</h1>

                            <p>El usuario solicitado no existe.</p>

                            <Link
                                to="/admin/usuarios"
                                className="btn btn-secondary"
                            >
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
                                    {esEdicion
                                        ? "Editar usuario"
                                        : "Crear usuario"}
                                </h1>

                                <p className="text-muted mb-0">
                                    Ingresa la información del usuario.
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
                                <form onSubmit={guardarUsuario}>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            ID
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                usuarioExistente?.id ??
                                                "Se asignará al guardar"
                                            }
                                            readOnly
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="nombre"
                                            className="form-label"
                                        >
                                            Nombre
                                        </label>

                                        <input
                                            id="nombre"
                                            name="nombre"
                                            type="text"
                                            className={`form-control ${
                                                errores.nombre
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formulario.nombre}
                                            onChange={manejarCambio}
                                            required
                                        />

                                        <div className="invalid-feedback">
                                            {errores.nombre}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="correo"
                                            className="form-label"
                                        >
                                            Correo electrónico
                                        </label>

                                        <input
                                            id="correo"
                                            name="correo"
                                            type="email"
                                            className={`form-control ${
                                                errores.correo
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formulario.correo}
                                            onChange={manejarCambio}
                                            required
                                        />

                                        <div className="invalid-feedback">
                                            {errores.correo}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="rut"
                                            className="form-label"
                                        >
                                            RUT
                                        </label>

                                        <input
                                            id="rut"
                                            name="rut"
                                            type="text"
                                            className={`form-control ${
                                                errores.rut
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
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
                                        <label
                                            htmlFor="region"
                                            className="form-label"
                                        >
                                            Región
                                        </label>

                                        <select
                                            id="region"
                                            name="region"
                                            className={`form-select ${
                                                errores.region
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formulario.region}
                                            onChange={manejarCambio}
                                            required
                                        >
                                            <option value="">
                                                Seleccionar región
                                            </option>

                                            {Object.keys(regiones).map(
                                                function (region) {
                                                    return (
                                                        <option
                                                            key={region}
                                                            value={region}
                                                        >
                                                            {region}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>

                                        <div className="invalid-feedback">
                                            {errores.region}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="comuna"
                                            className="form-label"
                                        >
                                            Comuna
                                        </label>

                                        <select
                                            id="comuna"
                                            name="comuna"
                                            className={`form-select ${
                                                errores.comuna
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formulario.comuna}
                                            onChange={manejarCambio}
                                            disabled={!formulario.region}
                                            required
                                        >
                                            <option value="">
                                                Seleccionar comuna
                                            </option>

                                            {comunas.map(function (comuna) {
                                                return (
                                                    <option
                                                        key={comuna}
                                                        value={comuna}
                                                    >
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
                                        <label
                                            htmlFor="password"
                                            className="form-label"
                                        >
                                            Contraseña
                                        </label>

                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            className={`form-control ${
                                                errores.password
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formulario.password}
                                            onChange={manejarCambio}
                                            placeholder={
                                                esEdicion
                                                    ? "Dejar en blanco para mantener la actual"
                                                    : ""
                                            }
                                            required={!esEdicion}
                                        />

                                        <div className="invalid-feedback">
                                            {errores.password}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="rol"
                                            className="form-label"
                                        >
                                            Rol
                                        </label>

                                        <select
                                            id="rol"
                                            name="rol"
                                            className={`form-select ${
                                                errores.rol
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formulario.rol}
                                            onChange={manejarCambio}
                                            required
                                        >
                                            <option value="">
                                                Seleccionar rol
                                            </option>

                                            <option value="cliente">
                                                Cliente
                                            </option>

                                            <option value="vendedor">
                                                Vendedor
                                            </option>

                                            <option value="administrador">
                                                Administrador
                                            </option>
                                        </select>

                                        <div className="invalid-feedback">
                                            {errores.rol}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
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
