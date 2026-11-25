import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Icono from "../../components/Iconos";
import Logo from "../../components/Logo";
import useAdminInicio from "../../assets/js/admin/useAdminInicio";

function AdminInicio() {
    const { estadisticas, accesos } = useAdminInicio();

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 admin-contenido p-4 p-md-5">

                        <section className="admin-portada">
                            <Logo variante="claro" />

                            <div>
                                <h1>Panel de administración</h1>

                                <p>
                                    Gestiona el catálogo, el stock, los pedidos y los
                                    despachos de Tu Polera.
                                </p>
                            </div>

                            <Link to="/admin/productos" className="btn btn-light">
                                <Icono nombre="caja" tamano={18} />
                                Administrar productos
                            </Link>
                        </section>

                        <div className="mb-3">
                            <h2 className="admin-seccion-titulo">
                                Resumen de la tienda
                            </h2>

                            <p className="admin-subtitulo mb-0">
                                Consulta rápidamente el estado de tu tienda.
                            </p>
                        </div>

                        <div className="row g-3 mb-5">
                            {estadisticas.map((estadistica) => (
                                <div
                                    className="col-12 col-sm-6 col-xl-3"
                                    key={estadistica.titulo}
                                >
                                    <Link
                                        to={estadistica.ruta}
                                        className="admin-estadistica"
                                    >
                                        <div>
                                            <p className="admin-estadistica-titulo">
                                                {estadistica.titulo}
                                            </p>

                                            <strong className="admin-estadistica-valor">
                                                {estadistica.cantidad}
                                            </strong>

                                            <small>
                                                {estadistica.descripcion}
                                            </small>
                                        </div>

                                        <span
                                            className={`admin-estadistica-icono admin-color-${estadistica.color}`}
                                        >
                                            <Icono
                                                nombre={estadistica.icono}
                                                tamano={24}
                                            />
                                        </span>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="mb-3">
                            <h2 className="admin-seccion-titulo">
                                Accesos directos
                            </h2>

                            <p className="admin-subtitulo mb-0">
                                Entra directamente a la sección que necesitas.
                            </p>
                        </div>

                        <div className="row g-3">
                            {accesos.map((acceso) => (
                                <div
                                    className="col-12 col-md-6 col-xl-4"
                                    key={acceso.titulo}
                                >
                                    <Link to={acceso.ruta} className="admin-acceso">
                                        <span className="admin-acceso-icono">
                                            <Icono nombre={acceso.icono} tamano={24} />
                                        </span>

                                        <div>
                                            <h3>{acceso.titulo}</h3>

                                            <p>{acceso.descripcion}</p>
                                        </div>

                                        <Icono
                                            nombre="flecha"
                                            tamano={18}
                                            className="admin-acceso-flecha"
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <footer className="admin-pie">
                            Tu Polera · Panel de administración
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminInicio;
