
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { regiones } from "../../data/regionesComunas";

import {
    validarCorreo,
    validarRutChileno,
    normalizarRut,
    obtenerUsuarios
} from "../../assets/js/tienda/validacionesAuth";

import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";

function Registro() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: "",
        correo: "",
        rut: "",
        region: "",
        comuna: "",
        password: "",
        confirmar: "",
        aceptaTerminos: false
    });

    const [errores, setErrores] = useState({});

    const comunas = regiones[formulario.region] || [];

    function manejarCambio(e) {
        const { name, value, type, checked } = e.target;

        setFormulario((formularioAnterior) => ({
            ...formularioAnterior,
            [name]: type === "checkbox" ? checked : value,
            ...(name === "region" ? { comuna: "" } : {})
        }));

        setErrores((erroresAnteriores) => ({
            ...erroresAnteriores,
            [name]: ""
        }));
    }

    function manejarRegistro(e) {
        e.preventDefault();

        const nuevosErrores = {};

        // Validar nombre.
        if (formulario.nombre.trim().length < 3) {
            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";
        }

        // Validar correo.
        if (!formulario.correo.trim()) {
            nuevosErrores.correo = "Ingresa tu correo electrónico.";
        } else if (!validarCorreo(formulario.correo)) {
            nuevosErrores.correo = "Ingresa un correo electrónico válido.";
        }

        // Validar RUT chileno y dígito verificador.
        if (!formulario.rut.trim()) {
            nuevosErrores.rut = "Ingresa tu RUT.";
        } else if (!validarRutChileno(formulario.rut)) {
            nuevosErrores.rut = "Ingresa un RUT chileno válido.";
        }

        // Validar región.
        if (!formulario.region) {
            nuevosErrores.region = "Selecciona una región.";
        }

        // Validar comuna.
        if (!formulario.comuna) {
            nuevosErrores.comuna = "Selecciona una comuna.";
        } else if (!comunas.includes(formulario.comuna)) {
            nuevosErrores.comuna = "Selecciona una comuna válida.";
        }

        // Validar contraseña.
        if (formulario.password.length < 6) {
            nuevosErrores.password =
                "La contraseña debe tener al menos 6 caracteres.";
        }

        // Confirmar contraseña.
        if (!formulario.confirmar) {
            nuevosErrores.confirmar =
                "Confirma tu contraseña.";
        } else if (formulario.password !== formulario.confirmar) {
            nuevosErrores.confirmar =
                "Las contraseñas no coinciden.";
        }

        // Validar aceptación de términos.
        if (!formulario.aceptaTerminos) {
            nuevosErrores.aceptaTerminos =
                "Debes aceptar los términos y condiciones.";
        }

        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        // Obtener los usuarios registrados.
        const usuarios = obtenerUsuarios();

        // Comprobar si el correo ya está registrado.
        const correoExiste = usuarios.some(
            (usuario) =>
                usuario.correo.toLowerCase() ===
                formulario.correo.trim().toLowerCase()
        );

        if (correoExiste) {
            setErrores({
                correo: "Este correo ya está registrado."
            });
            return;
        }

        // Comprobar si el RUT ya está registrado.
        const rutNormalizado = normalizarRut(formulario.rut);

        const rutExiste = usuarios.some(
            (usuario) =>
                normalizarRut(usuario.rut) === rutNormalizado
        );

        if (rutExiste) {
            setErrores({
                rut: "Este RUT ya está registrado."
            });
            return;
        }

        // Generar un ID para el nuevo usuario.
        const nuevoId =
            usuarios.length > 0
                ? Math.max(...usuarios.map((usuario) => usuario.id || 0)) + 1
                : 1;

        const nuevoUsuario = {
            id: nuevoId,
            nombre: formulario.nombre.trim(),
            correo: formulario.correo.trim().toLowerCase(),
            rut: rutNormalizado,
            region: formulario.region,
            comuna: formulario.comuna,
            password: formulario.password,
            rol: "cliente"
        };

        try {
            usuarios.push(nuevoUsuario);

            localStorage.setItem(
                "usuarios",
                JSON.stringify(usuarios)
            );

            navigate("/login", {
                state: {
                    mensaje:
                        "Cuenta creada correctamente. Ya puedes iniciar sesión."
                }
            });
        } catch {
            setErrores({
                general:
                    "No fue posible guardar la cuenta. Inténtalo nuevamente."
            });
        }
    }

    return (
        <div className="pagina-tienda">
            <NavbarTienda />

            <main>
                <section className="container py-5">
                    <div className="encabezado-tienda text-center mb-5">
                        <span className="etiqueta">
                            Únete a nosotros
                        </span>

                        <h1 className="titulo-seccion">
                            Crear cuenta
                        </h1>

                        <p className="subtitulo-seccion">
                            Regístrate para descubrir y comprar tus
                            productos favoritos.
                        </p>
                    </div>

                    <form
                        onSubmit={manejarRegistro}
                        noValidate
                        className="formulario-auth"
                    >
                        {errores.general && (
                            <div className="alert alert-danger" role="alert">
                                {errores.general}
                            </div>
                        )}

                        <div className="mb-3">
                            <label
                                htmlFor="nombre"
                                className="form-label"
                            >
                                Nombre completo
                            </label>

                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                className={`form-control ${
                                    errores.nombre ? "is-invalid" : ""
                                }`}
                                placeholder="Ingresa tu nombre completo"
                                value={formulario.nombre}
                                onChange={manejarCambio}
                                autoComplete="name"
                            />

                            {errores.nombre && (
                                <div className="invalid-feedback">
                                    {errores.nombre}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="correo"
                                className="form-label"
                            >
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                className={`form-control ${
                                    errores.correo ? "is-invalid" : ""
                                }`}
                                placeholder="ejemplo@correo.com"
                                value={formulario.correo}
                                onChange={manejarCambio}
                                autoComplete="email"
                            />

                            {errores.correo && (
                                <div className="invalid-feedback">
                                    {errores.correo}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="rut"
                                className="form-label"
                            >
                                RUT
                            </label>

                            <input
                                type="text"
                                id="rut"
                                name="rut"
                                className={`form-control ${
                                    errores.rut ? "is-invalid" : ""
                                }`}
                                placeholder="12.345.678-5"
                                value={formulario.rut}
                                onChange={manejarCambio}
                            />

                            {errores.rut && (
                                <div className="invalid-feedback">
                                    {errores.rut}
                                </div>
                            )}
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
                                    errores.region ? "is-invalid" : ""
                                }`}
                                value={formulario.region}
                                onChange={manejarCambio}
                            >
                                <option value="">
                                    Selecciona una región
                                </option>

                                {Object.keys(regiones).map((region) => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>

                            {errores.region && (
                                <div className="invalid-feedback">
                                    {errores.region}
                                </div>
                            )}
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
                                    errores.comuna ? "is-invalid" : ""
                                }`}
                                value={formulario.comuna}
                                onChange={manejarCambio}
                                disabled={!formulario.region}
                            >
                                <option value="">
                                    Selecciona una comuna
                                </option>

                                {comunas.map((comuna) => (
                                    <option key={comuna} value={comuna}>
                                        {comuna}
                                    </option>
                                ))}
                            </select>

                            {errores.comuna && (
                                <div className="invalid-feedback">
                                    {errores.comuna}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="password"
                                className="form-label"
                            >
                                Contraseña
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                className={`form-control ${
                                    errores.password ? "is-invalid" : ""
                                }`}
                                placeholder="Mínimo 6 caracteres"
                                value={formulario.password}
                                onChange={manejarCambio}
                                autoComplete="new-password"
                            />

                            {errores.password && (
                                <div className="invalid-feedback">
                                    {errores.password}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="confirmar"
                                className="form-label"
                            >
                                Confirmar contraseña
                            </label>

                            <input
                                type="password"
                                id="confirmar"
                                name="confirmar"
                                className={`form-control ${
                                    errores.confirmar ? "is-invalid" : ""
                                }`}
                                placeholder="Repite tu contraseña"
                                value={formulario.confirmar}
                                onChange={manejarCambio}
                                autoComplete="new-password"
                            />

                            {errores.confirmar && (
                                <div className="invalid-feedback">
                                    {errores.confirmar}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    id="aceptaTerminos"
                                    name="aceptaTerminos"
                                    className={`form-check-input ${
                                        errores.aceptaTerminos
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    checked={formulario.aceptaTerminos}
                                    onChange={manejarCambio}
                                />

                                <label
                                    htmlFor="aceptaTerminos"
                                    className="form-check-label"
                                >
                                    Acepto los términos y condiciones.
                                </label>

                                {errores.aceptaTerminos && (
                                    <div className="invalid-feedback">
                                        {errores.aceptaTerminos}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-tienda w-100"
                        >
                            Crear cuenta
                        </button>

                        <p className="enlace-auth">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </form>
                </section>
            </main>

            <FooterTienda />
        </div>
    );
}

export default Registro;
