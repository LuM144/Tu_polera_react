
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";

function Usuario() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);

    // Comprobar si existe una sesión iniciada.
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuarioActual");

        if (!usuarioGuardado) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const usuarioActual = JSON.parse(usuarioGuardado);

            // Comprobar que los datos guardados sean válidos.
            if (!usuarioActual || !usuarioActual.nombre || !usuarioActual.rol) {
                localStorage.removeItem("usuarioActual");
                navigate("/login", { replace: true });
                return;
            }

            setUsuario(usuarioActual);
        } catch {
            // Si los datos están dañados, eliminar la sesión.
            localStorage.removeItem("usuarioActual");
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    // Cerrar la sesión del usuario.
    function cerrarSesion() {
        localStorage.removeItem("usuarioActual");
        navigate("/", { replace: true });
    }

    // Evitar mostrar la página mientras se comprueba la sesión.
    if (!usuario) {
        return null;
    }

    return (
        <div className="pagina-tienda">
            <NavbarTienda />

            <main className="container py-5">
                <section className="usuario-bienvenida">
                    <span className="etiqueta">
                        Mi cuenta
                    </span>

                    <h1>
                        ¡Bienvenido a tu cuenta, {usuario.nombre}!
                    </h1>

                    <p>
                        Desde aquí puedes administrar tu cuenta
                        y comprar nuestros productos.
                    </p>

                    <button
                        type="button"
                        className="btn btn-tienda"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>
                </section>

                <div className="row g-4 mt-4 justify-content-center">
                    {usuario.rol === "administrador" && (
                        <div className="col-12 col-md-4">
                            <div className="usuario-card">
                                <div className="usuario-icon">
                                    ⚙️
                                </div>

                                <h2>
                                    Administración
                                </h2>

                                <p>
                                    Administra los productos y usuarios
                                    de la tienda.
                                </p>

                                <Link
                                    to="/admin"
                                    className="btn btn-tienda"
                                >
                                    Panel de administración
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="col-12 col-md-4">
                        <div className="usuario-card">
                            <div className="usuario-icon">
                                🛍️
                            </div>

                            <h2>
                                Productos
                            </h2>

                            <p>
                                Explora todos los productos disponibles.
                            </p>

                            <Link
                                to="/productos"
                                className="btn btn-tienda"
                            >
                                Ver productos
                            </Link>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="usuario-card">
                            <div className="usuario-icon">
                                🛒
                            </div>

                            <h2>
                                Mi carrito
                            </h2>

                            <p>
                                Revisa los productos que has agregado.
                            </p>

                            <Link
                                to="/carrito"
                                className="btn btn-tienda"
                            >
                                Ver carrito
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <FooterTienda />
        </div>
    );
}

export default Usuario;
