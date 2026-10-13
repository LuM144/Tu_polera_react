
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { productosIniciales } from "../../data/productosIniciales";

function cargarProductos() {
    const productosGuardados = localStorage.getItem("productos");

    if (productosGuardados) {
        return JSON.parse(productosGuardados);
    }

    return productosIniciales;
}

function AdminProductos() {
    const [productos, setProductos] = useState(cargarProductos);

    useEffect(() => {
        localStorage.setItem("productos", JSON.stringify(productos));
    }, [productos]);

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="fw-bold">
                                    Productos
                                </h1>

                                <p className="text-muted mb-0">
                                    Administra los productos de la tienda.
                                </p>
                            </div>

                            <Link
                                to="/admin/productos/editar"
                                className="btn btn-primary"
                            >
                                + Agregar producto
                            </Link>
                        </div>

                        <div className="card border-0 shadow-sm">
                            <div className="card-body">

                                <h5 className="card-title mb-4">
                                    Lista de productos
                                </h5>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">

                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Producto</th>
                                                <th>Precio</th>
                                                <th>Descuento</th>
                                                <th>Datos</th>
                                                <th>Editar</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {productos.map((producto) => (
                                                <tr key={producto.id}>
                                                    <td>{producto.id}</td>

                                                    <td>{producto.nombre}</td>

                                                    <td>
                                                        ${producto.precio.toLocaleString("es-CL")}
                                                    </td>

                                                    <td>{producto.descuento}%</td>

                                                    <td>
                                                        <Link
                                                            to={`/admin/productos/ver/${producto.id}`}
                                                            className="btn btn-dark btn-sm"
                                                        >
                                                            Datos
                                                        </Link>
                                                    </td>

                                                    <td>
                                                        <Link
                                                            to={`/admin/productos/editar/${producto.id}`}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            Editar
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>

                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminProductos;
