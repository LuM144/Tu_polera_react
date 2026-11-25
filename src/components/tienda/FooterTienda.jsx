import { Link } from "react-router-dom";
import useIndex from "../../assets/js/tienda/useIndex";
import Logo from "../Logo";

function FooterTienda() {
    const { usuarioActual } = useIndex();

    return (
        <footer className="pie-tienda">
            <div className="container">
                <div className="row g-4">
                    <div className="col-md-5">
                        <Logo variante="claro" />

                        <p className="pie-descripcion">
                            Tienda online de prendas básicas, cómodas y
                            accesibles: poleras, polerones, gorras y más.
                            Consulta las medidas de cada prenda y calcula el
                            despacho según tu dirección.
                        </p>
                    </div>

                    <div className="col-6 col-md-3">
                        <h5>Navegación</h5>

                        <ul className="list-unstyled">
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/productos">Productos</Link></li>
                            <li><Link to="/nosotros">Nosotros</Link></li>
                            <li><Link to="/blogs">Blog</Link></li>
                            <li><Link to="/contacto">Contacto</Link></li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-4">
                        <h5>Tu cuenta</h5>

                        <ul className="list-unstyled">
                            <li>
                                <Link to={usuarioActual ? "/usuario" : "/registro"}>
                                    {usuarioActual ? "Mi cuenta" : "Registrarse"}
                                </Link>
                            </li>

                            {usuarioActual && (
                                <li>
                                    <Link to="/usuario/compras">Mis compras</Link>
                                </li>
                            )}

                            <li><Link to="/carrito">Mi carrito</Link></li>
                        </ul>
                    </div>
                </div>

                <hr className="pie-separador" />

                <p className="pie-derechos">
                    © 2026 Tu Polera · Tienda online, sin local de atención al público
                </p>
            </div>
        </footer>
    );
}

export default FooterTienda;
