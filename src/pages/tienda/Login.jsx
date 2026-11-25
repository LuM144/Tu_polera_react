
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";

import {
    validarCorreo,
    obtenerUsuarios
} from "../../assets/js/tienda/validacionesAuth";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [formulario, setFormulario] = useState({
        correo: "",
        password: ""
    });

    const [errores, setErrores] = useState({});
    const [mensaje] = useState(location.state?.mensaje || "");

    function manejarCambio(e) {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });

        setErrores({
            ...errores,
            [name]: ""
        });
    }

    function manejarLogin(e) {
        e.preventDefault();

        const nuevosErrores = {};

        if (!formulario.correo.trim()) {
            nuevosErrores.correo = "Ingresa tu correo electrónico.";
        } else if (!validarCorreo(formulario.correo)) {
            nuevosErrores.correo = "Ingresa un correo electrónico válido.";
        }

        if (!formulario.password) {
            nuevosErrores.password = "Ingresa tu contraseña.";
        }

        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        const usuarios = obtenerUsuarios();

        const usuarioEncontrado = usuarios.find(
            (usuario) =>
                usuario.correo.toLowerCase() ===
                formulario.correo.trim().toLowerCase()
        );

        if (!usuarioEncontrado) {
            setErrores({
                correo: "No existe una cuenta con este correo."
            });
            return;
        }

        if (usuarioEncontrado.password !== formulario.password) {
            setErrores({
                password: "La contraseña es incorrecta."
            });
            return;
        }

        // Guardar los datos de sesión sin incluir la contraseña.
        const datosSesion = { ...usuarioEncontrado };
        delete datosSesion.password;

        localStorage.setItem(
            "usuarioActual",
            JSON.stringify(datosSesion)
        );

        // Redirigir según el rol del usuario.
        if (usuarioEncontrado.rol === "administrador") {
            navigate("/admin");
        } else if (usuarioEncontrado.rol === "vendedor") {
            navigate("/admin/productos");
        } else {
            navigate("/usuario");
        }
    }

    return (
        <div className="pagina-tienda">
            <NavbarTienda />

            <main>
                <section className="container py-5">
                    <div className="encabezado-tienda text-center mb-5">
                        <span className="etiqueta">
                            Bienvenido de vuelta
                        </span>

                        <h1 className="titulo-seccion">
                            Iniciar sesión
                        </h1>

                        <p className="subtitulo-seccion">
                            Ingresa a tu cuenta para continuar.
                        </p>
                    </div>

                    <form
                        onSubmit={manejarLogin}
                        noValidate
                        className="formulario-auth"
                    >
                        {mensaje && (
                            <div className="alert alert-success" role="alert">
                                {mensaje}
                            </div>
                        )}

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
                                placeholder="Ingresa tu contraseña"
                                value={formulario.password}
                                onChange={manejarCambio}
                                autoComplete="current-password"
                            />

                            {errores.password && (
                                <div className="invalid-feedback">
                                    {errores.password}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-tienda w-100"
                        >
                            Iniciar sesión
                        </button>

                        <p className="enlace-auth">
                            ¿Todavía no tienes una cuenta?{" "}
                            <Link to="/registro">
                                Regístrate aquí
                            </Link>
                        </p>
                    </form>
                </section>
            </main>

            <FooterTienda />
        </div>
    );
}

export default Login;
