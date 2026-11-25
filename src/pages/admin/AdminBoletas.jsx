
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import useAdminBoletas from "../../assets/js/admin/useAdminBoletas";

function AdminBoletas() {
    const {
        busqueda,
        setBusqueda,
        estado,
        setEstado,
        boletas,
        boletasFiltradas,
        totalExitosas,
        totalFallidas,
        calcularTotal
    } = useAdminBoletas();

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                        <div className="mb-4">
                            <h1 className="fw-bold">Boletas</h1>
                            <p className="text-muted">
                                Consulta las compras y revisa sus comprobantes.
                            </p>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">
                                            Total de boletas
                                        </p>
                                        <h3 className="fw-bold">
                                            {boletas.length}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">
                                            Compras exitosas
                                        </p>
                                        <h3 className="fw-bold text-success">
                                            {totalExitosas}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">
                                            Compras fallidas
                                        </p>
                                        <h3 className="fw-bold text-danger">
                                            {totalFallidas}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="row g-3 mb-4">
                                    <div className="col-md-8">
                                        <label
                                            htmlFor="buscarBoleta"
                                            className="form-label"
                                        >
                                            Buscar boleta
                                        </label>

                                        <input
                                            id="buscarBoleta"
                                            type="text"
                                            className="form-control"
                                            placeholder="Número, comprador o RUT..."
                                            value={busqueda}
                                            onChange={(evento) =>
                                                setBusqueda(evento.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label
                                            htmlFor="filtroEstado"
                                            className="form-label"
                                        >
                                            Estado de compra
                                        </label>

                                        <select
                                            id="filtroEstado"
                                            className="form-select"
                                            value={estado}
                                            onChange={(evento) =>
                                                setEstado(evento.target.value)
                                            }
                                        >
                                            <option value="todas">
                                                Todos los estados
                                            </option>
                                            <option value="exitosa">
                                                Exitosa
                                            </option>
                                            <option value="fallida">
                                                Fallida
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-dark">
                                            <tr>
                                                <th className="text-white">Boleta</th>
                                                <th className="text-white">Fecha</th>
                                                <th className="text-white">Comprador</th>
                                                <th className="text-white">Estado</th>
                                                <th className="text-white">Total</th>
                                                <th className="text-white">Acciones</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {boletasFiltradas.map((boleta) => (
                                                <tr key={boleta.id}>
                                                    <td>{boleta.numero}</td>

                                                    <td>
                                                        {new Date(
                                                            boleta.fecha + "T12:00:00"
                                                        ).toLocaleDateString("es-CL")}
                                                    </td>

                                                    <td>
                                                        <div className="fw-semibold">
                                                            {boleta.comprador}
                                                        </div>
                                                        <small className="text-muted">
                                                            {boleta.rut}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                boleta.estado === "exitosa"
                                                                    ? "text-bg-success"
                                                                    : "text-bg-danger"
                                                            }`}
                                                        >
                                                            {boleta.estado === "exitosa"
                                                                ? "Exitosa"
                                                                : "Fallida"}
                                                        </span>
                                                    </td>

                                                    <td className="fw-semibold">
                                                        $
                                                        {calcularTotal(
                                                            boleta
                                                        ).toLocaleString("es-CL")}
                                                    </td>

                                                    <td>
                                                        <Link
                                                            to={`/admin/boletas/ver/${boleta.id}`}
                                                            className="btn btn-outline-primary btn-sm"
                                                        >
                                                            Ver boleta
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}

                                            {boletasFiltradas.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan="6"
                                                        className="text-center py-4 text-muted"
                                                    >
                                                        No se encontraron boletas.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-muted small mb-0">
                                    Mostrando {boletasFiltradas.length} de{" "}
                                    {boletas.length} boletas.
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminBoletas;
