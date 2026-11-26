
import { useState } from "react";
import Icono from "../Iconos";

// Permite ingresar una dirección de despacho manualmente.
function SelectorDireccion({ destino, alSeleccionar, alLimpiar }) {
    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");
    const [comuna, setComuna] = useState("");
    const [region, setRegion] = useState("");
    const [referencia, setReferencia] = useState("");
    const [error, setError] = useState("");

    function seleccionarDireccion(evento) {
        evento.preventDefault();

        const datos = {
            calle: calle.trim(),
            numero: numero.trim(),
            comuna: comuna.trim(),
            region: region.trim(),
            referencia: referencia.trim()
        };

        if (
            !datos.calle ||
            !datos.numero ||
            !datos.comuna ||
            !datos.region
        ) {
            setError("Completa la calle, el número, la comuna y la región.");
            return;
        }

        const direccion = `${datos.calle} ${datos.numero}, ${datos.comuna}, ${datos.region}, Chile`;

        alSeleccionar({
            ...datos,
            direccion,
            codigoPais: "CL",
            metodoSeleccion: "manual",
            verificadaPorGoogle: false
        });

        setError("");
    }

    function cambiarDireccion() {
        alLimpiar();
        setCalle("");
        setNumero("");
        setComuna("");
        setRegion("");
        setReferencia("");
        setError("");
    }

    return (
        <div className="selector-direccion">
            {destino ? (
                <div className="selector-direccion-resumen">
                    <p className="despacho-direccion">
                        <Icono nombre="mapa" tamano={16} />
                        {destino.direccion}
                    </p>

                    <ul className="selector-direccion-datos">
                        <li>
                            <span>Comuna</span> {destino.comuna}
                        </li>

                        <li>
                            <span>Región</span> {destino.region}
                        </li>

                        {destino.referencia && (
                            <li>
                                <span>Referencia</span> {destino.referencia}
                            </li>
                        )}
                    </ul>

                    <p className="selector-direccion-estados">
                        <span className="estado-pendiente">
                            Dirección ingresada manualmente
                        </span>
                    </p>

                    <p className="carrito-nota">
                        El despacho utiliza una tarifa fija de prueba. La
                        dirección no ha sido verificada geográficamente.
                    </p>

                    <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        onClick={cambiarDireccion}
                    >
                        Cambiar dirección
                    </button>
                </div>
            ) : (
                <form onSubmit={seleccionarDireccion}>
                    <p className="carrito-nota">
                        Ingresa la dirección donde deseas recibir tu compra.
                    </p>

                    <div className="mb-3">
                        <label htmlFor="calleDespacho" className="form-label">
                            Calle
                        </label>

                        <input
                            id="calleDespacho"
                            type="text"
                            className="form-control"
                            value={calle}
                            onChange={evento => setCalle(evento.target.value)}
                            placeholder="Ej. Avenida Providencia"
                            maxLength={120}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="numeroDespacho" className="form-label">
                            Número
                        </label>

                        <input
                            id="numeroDespacho"
                            type="text"
                            className="form-control"
                            value={numero}
                            onChange={evento => setNumero(evento.target.value)}
                            placeholder="Ej. 1234"
                            maxLength={20}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="comunaDespacho" className="form-label">
                            Comuna
                        </label>

                        <input
                            id="comunaDespacho"
                            type="text"
                            className="form-control"
                            value={comuna}
                            onChange={evento => setComuna(evento.target.value)}
                            placeholder="Ej. Providencia"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="regionDespacho" className="form-label">
                            Región
                        </label>

                        <input
                            id="regionDespacho"
                            type="text"
                            className="form-control"
                            value={region}
                            onChange={evento => setRegion(evento.target.value)}
                            placeholder="Ej. Región Metropolitana"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="referenciaDespacho"
                            className="form-label"
                        >
                            Referencia adicional (opcional)
                        </label>

                        <input
                            id="referenciaDespacho"
                            type="text"
                            className="form-control"
                            value={referencia}
                            onChange={evento => setReferencia(evento.target.value)}
                            placeholder="Ej. Departamento 402, casa azul"
                            maxLength={150}
                        />
                    </div>

                    {error && (
                        <p className="text-danger mt-2" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-dark"
                    >
                        Usar esta dirección
                    </button>
                </form>
            )}
        </div>
    );
}

export default SelectorDireccion;
