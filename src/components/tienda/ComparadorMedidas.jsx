import { useState } from "react";
import {
    compararMedidas,
    listarTallas
} from "../../assets/js/tienda/catalogo";

// Texto que describe la diferencia entre la prenda y el cuerpo del cliente.
function describirDiferencia(diferencia, unidad) {
    if (diferencia === null) {
        return "—";
    }

    if (diferencia === 0) {
        return "Igual a tu medida";
    }

    const valor = Math.abs(diferencia).toLocaleString("es-CL");

    return diferencia > 0
        ? `La prenda es ${valor} ${unidad} más grande`
        : `La prenda es ${valor} ${unidad} más pequeña`;
}

// Permite al cliente ingresar sus medidas y compararlas con la talla elegida.
// Las medidas que se solicitan dependen de la configuración de la categoría.
function ComparadorMedidas({ producto, categoria, tallaSeleccionada }) {
    const [medidasCliente, setMedidasCliente] = useState({});

    const medidasSolicitadas = (categoria?.medidas ?? []).filter(
        medida => medida.solicitarCliente
    );

    if (medidasSolicitadas.length === 0) {
        return null;
    }

    const variante = tallaSeleccionada
        ? producto.tallas?.[tallaSeleccionada]
        : null;

    const comparacion = variante
        ? compararMedidas(categoria, variante, medidasCliente)
        : [];

    function actualizarMedida(medidaId, valor) {
        setMedidasCliente(actual => ({ ...actual, [medidaId]: valor }));
    }

    return (
        <section
            className="comparador-medidas"
            aria-labelledby="tituloComparador"
        >
            <h3 id="tituloComparador" className="comparador-titulo">
                Compara tus medidas
            </h3>

            <p className="comparador-ayuda">
                Ingresa tus medidas corporales y elige una talla para ver
                en qué se diferencian de las dimensiones de la prenda.
            </p>

            <div className="row g-2">
                {medidasSolicitadas.map(medida => (
                    <div key={medida.id} className="col-12 col-sm-6">
                        <label
                            htmlFor={`cliente-${medida.id}`}
                            className="form-label"
                        >
                            {medida.nombre} ({medida.unidad})
                        </label>

                        <input
                            id={`cliente-${medida.id}`}
                            type="number"
                            min="0"
                            step="0.1"
                            inputMode="decimal"
                            className="form-control"
                            value={medidasCliente[medida.id] ?? ""}
                            onChange={evento =>
                                actualizarMedida(medida.id, evento.target.value)
                            }
                        />
                    </div>
                ))}
            </div>

            {!tallaSeleccionada ? (
                <p className="comparador-aviso">
                    Selecciona una talla para ver la comparación.
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-sm comparador-tabla">
                        <caption className="visually-hidden">
                            Comparación de medidas para la talla {tallaSeleccionada}
                        </caption>

                        <thead>
                            <tr>
                                <th>Medida</th>
                                <th>Tú</th>
                                <th>Talla {tallaSeleccionada}</th>
                                <th>Diferencia</th>
                            </tr>
                        </thead>

                        <tbody>
                            {comparacion.map(fila => (
                                <tr key={fila.medida.id}>
                                    <td>{fila.medida.nombre}</td>

                                    <td>
                                        {fila.cliente === null
                                            ? "—"
                                            : `${fila.cliente} ${fila.medida.unidad}`}
                                    </td>

                                    <td>
                                        {fila.prenda === null
                                            ? "Sin dato"
                                            : `${fila.prenda} ${fila.medida.unidad}`}
                                    </td>

                                    <td>
                                        {describirDiferencia(
                                            fila.diferencia,
                                            fila.medida.unidad
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="comparador-nota">
                Es solo una referencia: no recomendamos una talla automáticamente.
                Tú decides cuál se ajusta mejor a lo que buscas.
            </p>
        </section>
    );
}

// Tabla con las medidas de cada talla del producto.
export function GuiaTallas({ producto, categoria }) {
    const medidas = (categoria?.medidas ?? []).filter(
        medida => medida.registrarProducto
    );

    const tallas = listarTallas(producto, categoria);

    if (medidas.length === 0 || tallas.length === 0) {
        return null;
    }

    return (
        <details className="guia-tallas">
            <summary>Ver medidas de todas las tallas</summary>

            <div className="table-responsive">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Talla</th>

                            {medidas.map(medida => (
                                <th key={medida.id}>
                                    {medida.nombre} ({medida.unidad})
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {tallas.map(talla => (
                            <tr key={talla}>
                                <td>{talla}</td>

                                {medidas.map(medida => (
                                    <td key={medida.id}>
                                        {producto.tallas[talla].medidas?.[medida.id] ?? "—"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </details>
    );
}

export default ComparadorMedidas;
