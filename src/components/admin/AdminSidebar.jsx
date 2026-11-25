import { NavLink, Link } from "react-router-dom";
import Icono from "../Iconos";
import Logo from "../Logo";

const SECCIONES = [
    { ruta: "/admin", texto: "Inicio", icono: "casa", exacta: true },
    { ruta: "/admin/productos", texto: "Productos", icono: "caja" },
    { ruta: "/admin/productos-criticos", texto: "Productos críticos", icono: "alerta" },
    { ruta: "/admin/productos-destacados", texto: "Productos destacados", icono: "estrella" },
    { ruta: "/admin/categorias", texto: "Categorías", icono: "etiqueta" },
    { ruta: "/admin/despacho", texto: "Despacho", icono: "camion" },
    { ruta: "/admin/usuarios", texto: "Usuarios", icono: "usuarios" },
    { ruta: "/admin/boletas", texto: "Boletas", icono: "recibo" },
    { ruta: "/admin/reportes", texto: "Reportes", icono: "grafico" }
];

function AdminSidebar() {
    return (
        <aside className="col-md-3 col-lg-2 admin-sidebar p-0">
            <div className="admin-sidebar-contenido">
                <div className="admin-sidebar-cabecera">
                    <Logo variante="claro" />

                    <p className="admin-sidebar-etiqueta">
                        Panel de administración
                    </p>
                </div>

                <nav className="nav flex-column admin-sidebar-menu">
                    {SECCIONES.map(seccion => (
                        <NavLink
                            key={seccion.ruta}
                            to={seccion.ruta}
                            end={seccion.exacta}
                            className={({ isActive }) =>
                                `nav-link${isActive ? " active" : ""}`
                            }
                        >
                            <Icono nombre={seccion.icono} tamano={18} />
                            {seccion.texto}
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-pie">
                    <Link to="/" className="btn btn-outline-light">
                        <Icono nombre="tienda" tamano={16} />
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;
