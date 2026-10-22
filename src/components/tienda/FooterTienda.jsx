import { Link } from "react-router-dom";
import useIndex from "../../assets/js/tienda/useIndex";

function FooterTienda() {
    const { usuarioActual } = useIndex();

    return (
        <footer>
            <div className="container">
                <div className="row g-4">

                    {/* INFORMACIÓN DE LA TIENDA */}
                    <div className="col-md-4">
                        <h5>Tu Polera</h5>

                        <p>
                            Diseña y personaliza tus prendas para crear un
                            estilo único.
                        </p>
                    </div>

                    {/* ENLACES DE NAVEGACIÓN */}
                    <div className="col-md-4">
                        <h5>Navegación</h5>

                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/">Inicio</Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/productos">Productos</Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/nosotros">Nosotros</Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/blogs">Blogs</Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/contacto">Contacto</Link>
                            </li>
                        </ul>
                    </div>

                    {/* ENLACES DE LA CUENTA */}
                    <div className="col-md-4">
                        <h5>Tu cuenta</h5>

                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to={usuarioActual ? "/usuario" : "/registro"}>
                                    {usuarioActual ? "Mi cuenta" : "Registrarse"}
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/carrito">
                                    Mi carrito
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* DERECHOS RESERVADOS */}
                <hr className="border-secondary my-4" />

                <div className="text-center">
                    <p className="mb-0">
                        © 2026 Tu Polera - Todos los derechos reservados
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default FooterTienda;