
import AdminSidebar from "../../components/admin/AdminSidebar";
import useAdminDespacho from "../../assets/js/admin/useAdminDespacho";
import { formatearPrecio } from "../../assets/js/tienda/catalogo";

function AdminDespacho() {
    const {
        formulario,
        actualizarCampo,
        guardar,
        mensaje,
        tipoMensaje,
        ejemplos
    } = useAdminDespacho();

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 admin-contenido p-4 p-md-5">

                        <h1 className="admin-titulo">
                            Centro de distribución
                        </h1>

                        <p className="admin-subtitulo mb-4">
                            Tu Polera es una tienda online: los despachos salen
                            desde una bodega. Configura su ubicación y las
                            tarifas con las que se calcula el despacho.
                        </p>

                        {mensaje && (
                            <div
                                className={`alert alert-${tipoMensaje}`}
                                role="status"
                            >
                                {mensaje}
                            </div>
                        )}

                        {formulario.esUbicacionPrueba && (
                            <div className="alert alert-warning" role="note">
                                <strong>Ubicación de prueba.</strong> La dirección
                                actual es ficticia. Reemplázala por la dirección
                                real de la bodega antes de usar la tienda.
                            </div>
                        )}

                        <div className="row">
                            <div className="col-xl-8">
                                <form
                                    className="admin-tarjeta mb-4"
                                    onSubmit={guardar}
                                >
                                    <h2 className="admin-tarjeta-titulo">
                                        Origen de los despachos
                                    </h2>

                                    <div className="mb-3">
                                        <label htmlFor="nombreCentro" className="form-label">
                                            Nombre del centro
                                        </label>

                                        <input
                                            id="nombreCentro"
                                            type="text"
                                            className="form-control"
                                            value={formulario.nombreCentro}
                                            onChange={evento =>
                                                actualizarCampo("nombreCentro", evento.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="direccionCentro" className="form-label">
                                            Dirección de origen
                                        </label>

                                        <input
                                            id="direccionCentro"
                                            type="text"
                                            className="form-control"
                                            placeholder="Calle, número, comuna"
                                            value={formulario.direccion}
                                            onChange={evento =>
                                                actualizarCampo("direccion", evento.target.value)
                                            }
                                            required
                                        />

                                        <p className="admin-ayuda mt-2 mb-0">
                                            Ingresa manualmente la dirección del centro
                                            de distribución.
                                        </p>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="latitudCentro" className="form-label">
                                                Latitud
                                            </label>

                                            <input
                                                id="latitudCentro"
                                                type="number"
                                                step="any"
                                                className="form-control"
                                                value={formulario.latitud}
                                                onChange={evento =>
                                                    actualizarCampo("latitud", evento.target.value)
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="longitudCentro" className="form-label">
                                                Longitud
                                            </label>

                                            <input
                                                id="longitudCentro"
                                                type="number"
                                                step="any"
                                                className="form-control"
                                                value={formulario.longitud}
                                                onChange={evento =>
                                                    actualizarCampo("longitud", evento.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <p className="admin-ayuda mb-4">
                                        Las coordenadas deben corresponder a la ubicación
                                        real de la bodega y estar dentro de Chile.
                                    </p>

                                    <div className="form-check form-switch mb-4">
                                        <input
                                            id="ubicacionPrueba"
                                            type="checkbox"
                                            role="switch"
                                            className="form-check-input"
                                            checked={formulario.esUbicacionPrueba}
                                            onChange={evento =>
                                                actualizarCampo(
                                                    "esUbicacionPrueba",
                                                    evento.target.checked
                                                )
                                            }
                                        />

                                        <label
                                            htmlFor="ubicacionPrueba"
                                            className="form-check-label"
                                        >
                                            Esta es una ubicación de prueba
                                        </label>
                                    </div>

                                    <h2 className="admin-tarjeta-titulo">
                                        Tarifas
                                    </h2>

                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label htmlFor="precioBase" className="form-label">
                                                Precio base ($)
                                            </label>

                                            <input
                                                id="precioBase"
                                                type="number"
                                                min="0"
                                                step="1"
                                                className="form-control"
                                                value={formulario.precioBase}
                                                onChange={evento =>
                                                    actualizarCampo("precioBase", evento.target.value)
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="costoPorKm" className="form-label">
                                                Costo adicional por kilómetro ($)
                                            </label>

                                            <input
                                                id="costoPorKm"
                                                type="number"
                                                min="0"
                                                step="1"
                                                className="form-control"
                                                value={formulario.costoPorKm}
                                                onChange={evento =>
                                                    actualizarCampo("costoPorKm", evento.target.value)
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="tarifaMinima" className="form-label">
                                                Tarifa mínima ($, opcional)
                                            </label>

                                            <input
                                                id="tarifaMinima"
                                                type="number"
                                                min="0"
                                                step="1"
                                                className="form-control"
                                                value={formulario.tarifaMinima}
                                                onChange={evento =>
                                                    actualizarCampo("tarifaMinima", evento.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="tarifaMaxima" className="form-label">
                                                Tarifa máxima ($, opcional)
                                            </label>

                                            <input
                                                id="tarifaMaxima"
                                                type="number"
                                                min="0"
                                                step="1"
                                                className="form-control"
                                                value={formulario.tarifaMaxima}
                                                onChange={evento =>
                                                    actualizarCampo("tarifaMaxima", evento.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        Guardar configuración
                                    </button>
                                </form>
                            </div>

                            <div className="col-xl-4">
                                <div className="admin-tarjeta mb-4">
                                    <h2 className="admin-tarjeta-titulo">
                                        Cómo se calcula
                                    </h2>

                                    <p className="admin-ayuda">
                                        Precio = precio base + (costo por km × distancia
                                        por ruta), limitado por la tarifa mínima y máxima.
                                    </p>

                                    <table className="table table-sm mb-0">
                                        <thead>
                                            <tr>
                                                <th>Distancia</th>
                                                <th>Despacho</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {ejemplos.map(ejemplo => (
                                                <tr key={ejemplo.km}>
                                                    <td>{ejemplo.km} km</td>

                                                    <td>
                                                        {ejemplo.precio === null
                                                            ? "—"
                                                            : formatearPrecio(ejemplo.precio)}
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

export default AdminDespacho;
