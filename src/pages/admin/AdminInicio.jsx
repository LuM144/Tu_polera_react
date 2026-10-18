
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminInicio() {
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

                            <div className="col-12 col-lg-6">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-4">
                                        <h3 className="mt-3">
                                            Usuarios
                                        </h3>

                                        <p className="text-muted">
                                            Consulta los usuarios registrados
                                            y administra la información
                                            correspondiente.
                                        </p>

                                        <a
                                            href="/admin/usuarios"
                                            className="btn btn-primary"
                                        >
                                            Administrar usuarios
                                        </a>
                                    </div>
                                </div>
                            </div>
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
