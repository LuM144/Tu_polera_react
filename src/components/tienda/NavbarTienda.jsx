import { Link, NavLink } from "react-router-dom";
import useIndex from "../../assets/js/tienda/useIndex";
import Icono from "../Iconos";
import Logo from "../Logo";

const ENLACES = [
    { ruta: "/", texto: "Inicio", exacta: true },
    { ruta: "/productos", texto: "Productos" },
    { ruta: "/nosotros", texto: "Nosotros" },
    { ruta: "/blogs", texto: "Blog" },
    { ruta: "/contacto", texto: "Contacto" }
];

function NavbarTienda() {
    const { usuarioActual } = useIndex();

    return (
        <header className="cabecera-tienda">
            <div className="barra-anuncio">
                Ropa básica a precios accesibles · Despacho a todo Chile
            </div>

            <nav className="navbar navbar-expand-lg" aria-label="Navegación principal">
                <div className="container">
                    <Link className="navbar-brand" to="/" aria-label="Tu Polera, inicio">
                        <Logo />
                    </Link>

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

                    <div className="collapse navbar-collapse" id="menuTienda">
                        <ul className="navbar-nav mx-auto">
                            {ENLACES.map(enlace => (
                                <li className="nav-item" key={enlace.ruta}>
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link${isActive ? " active" : ""}`
                                        }
                                        to={enlace.ruta}
                                        end={enlace.exacta}
                                    >
                                        {enlace.texto}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        <div className="acciones-navbar">
                            <Link to="/carrito" className="btn btn-outline-dark">
                                <Icono nombre="carrito" tamano={18} />
                                Carrito
                            </Link>

                            <Link
                                to={usuarioActual ? "/usuario" : "/registro"}
                                className="btn btn-dark"
                            >
                                <Icono nombre="usuario" tamano={18} />
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
