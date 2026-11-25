
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import useAdminVerBoleta from "../../assets/js/admin/useAdminVerBoleta";

function AdminVerBoleta() {
    const {
        boleta,
        subtotal,
        neto,
        iva,
        formatoPrecio
    } = useAdminVerBoleta();

    if (!boleta) {
        return (
            <div className="pagina-admin">
                <div className="container-fluid">
                    <div className="row min-vh-100">
                        <AdminSidebar />

                        <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                            <h1 className="fw-bold">
                                Boleta no encontrada
                            </h1>

                            <p className="text-muted">
                                No existe una boleta con ese identificador.
                            </p>

                            <Link
                                to="/admin/boletas"
                                className="btn btn-primary"
                            >
                                Volver a boletas
                            </Link>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                            <div>
                                <h1 className="fw-bold">
                                    Detalle de boleta
                                </h1>

                                <p className="text-muted mb-0">
                                    Número: {boleta.numero}
                                </p>
                            </div>

                            <Link
                                to="/admin/boletas"
                                className="btn btn-outline-secondary"
                            >
                                Volver a boletas
                            </Link>
                        </div>

                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <h5 className="fw-bold mb-3">
                                            Información de la compra
                                        </h5>

                                        <p className="mb-2">
                                            <strong>Boleta:</strong>{" "}
                                            {boleta.numero}
                                        </p>

                                        <p className="mb-2">
                                            <strong>Fecha:</strong>{" "}
                                            {new Date(
                                                boleta.fecha + "T12:00:00"
                                            ).toLocaleDateString("es-CL")}
                                        </p>

                                        <p className="mb-2">
                                            <strong>Estado:</strong>{" "}
                                            <span
                                                className={`badge ${
                                                    boleta.estado === "exitosa"
                                                        ? "text-bg-success"
                                                        : "text-bg-danger"
                                                }`}
                                            >
                                                {boleta.estado === "exitosa"
                                                    ? "Compra exitosa"
                                                    : "Compra fallida"}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <h5 className="fw-bold mb-3">
                                            Datos del comprador
                                        </h5>

                                        <p className="mb-2">
                                            <strong>Nombre:</strong>{" "}
                                            {boleta.comprador}
                                        </p>

                                        <p className="mb-2">
                                            <strong>RUT:</strong>{" "}
                                            {boleta.rut}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3">
                                    Productos comprados
                                </h5>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-dark">
                                            <tr>
                                                <th className="text-white">
                                                    Producto
                                                </th>

                                                <th className="text-center text-white">
                                                    Cantidad
                                                </th>

                                                <th className="text-end text-white">
                                                    Precio unitario
                                                </th>

                                                <th className="text-end text-white">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {boleta.items.map((item, indice) => (
                                                <tr key={indice}>
                                                    <td>{item.nombre}</td>

                                                    <td className="text-center">
                                                        {item.cantidad}
                                                    </td>

                                                    <td className="text-end">
                                                        {formatoPrecio(item.precio)}
                                                    </td>

                                                    <td className="text-end fw-semibold">
                                                        {formatoPrecio(
                                                            item.precio * item.cantidad
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-end">
                            <div className="col-12 col-md-6 col-lg-5">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-3">
                                            Resumen del pago
                                        </h5>

                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Subtotal neto</span>
                                            <span>{formatoPrecio(neto)}</span>
                                        </div>

                                        <div className="d-flex justify-content-between mb-3">
                                            <span>IVA (19 %)</span>
                                            <span>{formatoPrecio(iva)}</span>
                                        </div>

                                        <hr />

                                        <div className="d-flex justify-content-between align-items-center">
                                            <strong>Total</strong>

                                            <h4 className="fw-bold mb-0">
                                                {formatoPrecio(subtotal)}
                                            </h4>
                                        </div>

                                        {boleta.estado === "fallida" && (
                                            <div className="alert alert-danger mt-3 mb-0">
                                                Esta compra no se completó
                                                correctamente. El total mostrado
                                                corresponde al monto del intento
                                                de compra, no necesariamente a
                                                un cobro realizado.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminVerBoleta;
