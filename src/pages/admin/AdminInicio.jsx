
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { productosIniciales } from "../../data/productosIniciales";
import { UsuariosTest } from "../../data/usuariosTest";
import { boletasTest } from "../../data/boletasTest";

function AdminInicio() {
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [compras, setCompras] = useState([]);

    useEffect(() => {
        const productosGuardados = localStorage.getItem("productos");
        const usuariosGuardados = localStorage.getItem("usuarios");
        const comprasGuardadas = localStorage.getItem("compras");

        setProductos(
            productosGuardados !== null
                ? JSON.parse(productosGuardados)
                : productosIniciales
        );

        setUsuarios(
            usuariosGuardados !== null
                ? JSON.parse(usuariosGuardados)
                : UsuariosTest
        );

        setCompras(
            comprasGuardadas !== null
                ? JSON.parse(comprasGuardadas)
                : boletasTest
        );
    }, []);

    const comprasExitosas = compras.filter(
        (compra) => compra.estado === "exitosa"
    );

    const totalVendido = comprasExitosas.reduce(
        (total, compra) =>
            total +
            (compra.items || []).reduce(
                (subtotal, item) =>
                    subtotal + item.precio * item.cantidad,
                0
            ),
        0
    );

    const estadisticas = [
        {
            titulo: "Productos",
            cantidad: productos.length,
            descripcion: "Productos en el catálogo",
            icono: "bi bi-box-seam",
            color: "primary",
            ruta: "/admin/productos"
        },
        {
            titulo: "Usuarios",
            cantidad: usuarios.length,
            descripcion: "Usuarios registrados",
            icono: "bi bi-people",
            color: "success",
            ruta: "/admin/usuarios"
        },
        {
            titulo: "Compras exitosas",
            cantidad: comprasExitosas.length,
            descripcion: "Compras completadas",
            icono: "bi bi-bag-check",
            color: "info",
            ruta: "/admin/boletas"
        },
        {
            titulo: "Total vendido",
            cantidad: `$${totalVendido.toLocaleString("es-CL")}`,
            descripcion: "Suma de compras exitosas",
            icono: "bi bi-currency-dollar",
            color: "warning",
            ruta: "/admin/reportes"
        }
    ];

    const accesos = [
        {
            titulo: "Productos",
            descripcion: "Administra el catálogo y sus precios.",
            icono: "bi bi-box-seam",
            ruta: "/admin/productos"
        },
        {
            titulo: "Usuarios",
            descripcion: "Consulta y administra las cuentas.",
            icono: "bi bi-person-gear",
            ruta: "/admin/usuarios"
        },
        {
            titulo: "Categorías",
            descripcion: "Organiza los productos de la tienda.",
            icono: "bi bi-tags",
            ruta: "/admin/categorias"
        },
        {
            titulo: "Boletas",
            descripcion: "Consulta el historial de compras.",
            icono: "bi bi-receipt",
            ruta: "/admin/boletas"
        },
        {
            titulo: "Productos destacados",
            descripcion: "Gestiona los productos destacados.",
            icono: "bi bi-star",
            ruta: "/admin/productos-destacados"
        },
        {
            titulo: "Reportes",
            descripcion: "Revisa las ventas y los resultados.",
            icono: "bi bi-bar-chart",
            ruta: "/admin/reportes"
        }
    ];

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                        <div className="bg-dark text-white rounded-4 p-4 p-md-5 mb-4 shadow-sm">
                            <div className="row align-items-center g-4">
                                <div className="col-lg-8">
                                    <span className="badge text-white mb-3">
                                        TU POLERA · ADMINISTRACIÓN
                                    </span>

                                    <h1 className="fw-bold text-white mb-3">
                                        Panel de Administración
                                    </h1>

                                    <p className="text-white-50 mb-0">
                                        Bienvenido. Desde aquí puedes administrar
                                        tu tienda, revisar las compras y consultar
                                        el rendimiento del negocio.
                                    </p>
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
                                                        <i className={`${estadistica.icono} fs-4`}></i>
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
                                                        <i className={`${acceso.icono} fs-4`}></i>
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
                            <p className="text-muted small mb-0">
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
