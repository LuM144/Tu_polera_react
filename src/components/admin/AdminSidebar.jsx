
import { NavLink } from "react-router-dom";

function AdminSidebar() {
    return (
        <aside className="col-md-3 col-lg-2 bg-dark text-white p-0">
            <div className="p-4">
                <h4 className="mb-4">
                    Tu Polera
                </h4>

                <p className="text-secondary small">
                    PANEL DE ADMINISTRACIÓN
                </p>

                <hr />

                <nav className="nav flex-column">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `nav-link text-white mb-2${isActive ? " active" : ""}`
                        }
                    >
                        Inicio
                    </NavLink>

                    <NavLink
                        to="/admin/productos"
                        className={({ isActive }) =>
                            `nav-link text-white mb-2${isActive ? " active" : ""}`
                        }
                    >
                        Productos
                    </NavLink>

                    <NavLink
                        to="/admin/usuarios"
                        className={({ isActive }) =>
                            `nav-link text-white mb-2${isActive ? " active" : ""}`
                        }
                    >
                        Usuarios
                    </NavLink>
                </nav>
            </div>

            <div className="position-absolute bottom-0 p-4">
                <a href="/" className="btn btn-outline-light">
                    Volver a la tienda
                </a>
            </div>
        </aside>
    );
}

export default AdminSidebar;
