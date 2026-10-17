
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { boletasTest } from "../../data/boletasTest";

function calcularTotal(boleta) {
    return (boleta.items || []).reduce(
        (total, item) => total + item.precio * item.cantidad,
        0
    );
}

function AdminReportes() {
    const [boletas, setBoletas] = useState([]);

    useEffect(() => {
        const guardadas = localStorage.getItem("compras");

        if (guardadas !== null) {
            setBoletas(JSON.parse(guardadas));
        } else {
            localStorage.setItem(
                "compras",
                JSON.stringify(boletasTest)
            );

            setBoletas(boletasTest);
        }
    }, []);

    const exitosas = boletas.filter(
        (boleta) => boleta.estado === "exitosa"
    );

    const fallidas = boletas.filter(
        (boleta) => boleta.estado === "fallida"
    );

    const totalVendido = exitosas.reduce(
        (total, boleta) => total + calcularTotal(boleta),
        0
    );

    const unidadesVendidas = exitosas.reduce(
        (total, boleta) =>
            total +
            (boleta.items || []).reduce(
                (cantidad, item) => cantidad + item.cantidad,
                0
            ),
        0
    );

    const productosVendidos = {};

    exitosas.forEach((boleta) => {
        (boleta.items || []).forEach((item) => {
            if (!productosVendidos[item.nombre]) {
                productosVendidos[item.nombre] = {
                    nombre: item.nombre,
                    cantidad: 0,
                    total: 0
                };
            }

            productosVendidos[item.nombre].cantidad += item.cantidad;

            productosVendidos[item.nombre].total +=
                item.precio * item.cantidad;
        });
    });

    const listaProductos = Object.values(productosVendidos).sort(
        (a, b) => b.cantidad - a.cantidad
    );

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                        <div className="mb-4">
                            <h1 className="fw-bold">Reportes</h1>

                            <p className="text-muted">
                                Revisa las ventas y el rendimiento de los productos.
                            </p>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">
                                            Total vendido
                                        </p>

                                        <h3 className="fw-bold">
                                            ${totalVendido.toLocaleString("es-CL")}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">
                                            Compras exitosas
                                        </p>

                                        <h3 className="fw-bold text-success">
                                            {exitosas.length}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">
                                            Compras fallidas
                                        </p>

                                        <h3 className="fw-bold text-danger">
                                            {fallidas.length}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">
                                            Unidades vendidas
                                        </p>

                                        <h3 className="fw-bold">
                                            {unidadesVendidas}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="fw-bold mb-3">
                                    Productos más vendidos
                                </h5>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-dark">
                                            <tr>
                                                <th className="text-white">Producto</th>
                                                <th className="text-white">Unidades vendidas</th>
                                                <th className="text-white">Total generado</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {listaProductos.map((producto) => (
                                                <tr key={producto.nombre}>
                                                    <td>{producto.nombre}</td>

                                                    <td>{producto.cantidad}</td>

                                                    <td>
                                                        ${producto.total.toLocaleString("es-CL")}
                                                    </td>
                                                </tr>
                                            ))}

                                            {listaProductos.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center text-muted py-4"
                                                    >
                                                        Todavía no hay ventas exitosas.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-muted small mb-0">
                                    Se consideran únicamente las compras exitosas.
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminReportes;
