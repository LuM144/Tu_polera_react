import { Link } from "react-router-dom";
import useIndex from "../../assets/js/tienda/useIndex";

function NavbarTienda() {
    const { usuarioActual } = useIndex();

    return (
        <header>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    {/* LOGO */}
                    <Link className="navbar-brand" to="/">
                        TU POLERA
                    </Link>

                    {/* BOTÓN PARA MÓVILES */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#menuTienda"
                        aria-controls="menuTienda"
                        aria-expanded="false"
                        aria-label="Abrir menú"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* ENLACES DE NAVEGACIÓN */}
                    <div
                        className="collapse navbar-collapse"
                        id="menuTienda"
                    >
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Inicio
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/productos">
                                    Productos
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/nosotros">
                                    Nosotros
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/blogs">
                                    Blogs
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/contacto">
                                    Contacto
                                </Link>
                            </li>
                        </ul>

                        {/* BOTONES DE USUARIO */}
                        <div className="d-flex flex-wrap gap-2 mt-3 mt-lg-0">
                            <Link
                                to="/carrito"
                                className="btn btn-outline-dark"
                            >
                                Carrito
                            </Link>

                            <Link
                                to={usuarioActual ? "/usuario" : "/registro"}
                                className="btn btn-dark"
                            >
                                {usuarioActual ? "Mi cuenta" : "Registro"}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default NavbarTienda;