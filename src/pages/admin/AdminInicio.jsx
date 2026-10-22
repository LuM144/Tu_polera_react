import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import useAdminInicio from "../../assets/js/admin/useAdminInicio";

function AdminInicio() {
    const { estadisticas, accesos } = useAdminInicio();

    return (
        <div className="pagina-admin">

            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                        <div className="mb-4">
                            <h1 className="fw-bold">
                                Panel de Administración
                            </h1>

                            <p className="text-muted mb-0">
                                Bienvenido al panel de administración de Tu Polera.
                            </p>
                        </div>

                        <div className="row g-4">
                            <div className="col-12 col-lg-6">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-4">
                                        <h3 className="mt-3">
                                            Productos
                                        </h3>

                                        <p className="text-muted">
                                            Agrega nuevos productos, modifica
                                            información existente y administra
                                            el catálogo de la tienda.
                                        </p>

                                        <a
                                            href="/admin/productos"
                                            className="btn btn-primary"
                                        >
                                            Administrar productos
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="fw-bold mb-1">
                                Resumen de la tienda
                            </h4>

                            <p className="text-muted mb-0">
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
                                        className="text-decoration-none text-dark"
                                    >
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <p className="text-muted mb-2">
                                                            {estadistica.titulo}
                                                        </p>

                                                        <h3 className="fw-bold mb-0">
                                                            {estadistica.cantidad}
                                                        </h3>
                                                    </div>

                                                    <div
                                                        className={`bg-${estadistica.color}-subtle text-${estadistica.color} rounded-3 p-3`}
                                                    >
                                                        <i
                                                            className={`${estadistica.icono} fs-4`}
                                                        ></i>
                                                    </div>
                                                </div>

                                                <small className="text-muted">
                                                    {estadistica.descripcion}
                                                </small>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="mb-3">
                            <h4 className="fw-bold mb-1">
                                Accesos directos
                            </h4>

                            <p className="text-muted mb-0">
                                Entra directamente a la sección que necesitas.
                            </p>
                        </div>

                        <div className="row g-3">
                            {accesos.map((acceso) => (
                                <div
                                    className="col-12 col-md-6 col-xl-4"
                                    key={acceso.titulo}
                                >
                                    <Link
                                        to={acceso.ruta}
                                        className="text-decoration-none text-dark"
                                    >
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-body p-4">
                                                <div className="d-flex align-items-center gap-3 mb-3">
                                                    <div className="bg-white border rounded-3 p-3">
                                                        <i
                                                            className={`${acceso.icono} fs-4`}
                                                        ></i>
                                                    </div>

                                                    <h5 className="fw-bold mb-0">
                                                        {acceso.titulo}
                                                    </h5>
                                                </div>

                                                <p className="text-muted mb-3">
                                                    {acceso.descripcion}
                                                </p>

                                                <span className="text-primary fw-semibold">
                                                    Ir a la sección
                                                    <i className="bi bi-arrow-right ms-2"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <footer className="mt-5 pt-4 border-top">
                            <p className=" small mb-0">
                                Tu Polera · Panel de Administración
                            </p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminInicio;