
import { NavLink } from "react-router-dom";

function AdminSidebar() {
    return (
        <aside className="col-12 col-md-3 col-lg-2 bg-dark text-white p-0">
            <div className="p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                        Tu Polera
                    </h4>

                    <button
                        className="navbar-toggler d-md-none border border-secondary rounded p-2"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#menuAdmin"
                        aria-controls="menuAdmin"
                        aria-expanded="false"
                        aria-label="Mostrar u ocultar menú"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="d-none d-md-block">
                    <p className="text-secondary small mt-3 mb-2">
                        PANEL DE ADMINISTRACIÓN
                    </p>
                    <hr />
                </div>

                <div className="collapse d-md-block mt-3 mt-md-0" id="menuAdmin">
                    <p className="text-secondary small d-md-none mb-2">
                        PANEL DE ADMINISTRACIÓN
                    </p>

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
                            end
                            className={({ isActive }) =>
                                `nav-link text-white mb-2${isActive ? " active" : ""}`
                            }
                        >
                            Productos
                        </NavLink>

                        <NavLink
                            to="/admin/productos-destacados"
                            className={({ isActive }) =>
                                `nav-link text-white ps-4 mb-2${isActive ? " active" : ""}`
                            }
                        >
                            Productos destacados
                        </NavLink>

                        <NavLink
                            to="/admin/categorias"
                            className={({ isActive }) =>
                                `nav-link text-white mb-2${isActive ? " active" : ""}`
                            }
                        >
                            Categorías
                        </NavLink>

                        <NavLink
                            to="/admin/usuarios"
                            className={({ isActive }) =>
                                `nav-link text-white mb-2${isActive ? " active" : ""}`
                            }
                        >
                            Usuarios
                        </NavLink>

                        <NavLink
                            to="/admin/boletas"
                            className={({ isActive }) =>
                                `nav-link text-white mb-2${isActive ? " active" : ""}`
                            }
                        >
                            Boletas
                        </NavLink>

                        <NavLink
                            to="/admin/reportes"
                            className={({ isActive }) =>
                                `nav-link text-white mb-2${isActive ? " active" : ""}`
                            }
                        >
                            Reportes
                        </NavLink>
                    </nav>

                    <div className="mt-3">
                        <a
                            href="/"
                            className="btn btn-outline-light w-100"
                        >
                            Volver a la tienda
                        </a>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;
