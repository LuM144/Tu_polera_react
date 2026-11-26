import { useState } from "react";
import { images } from "../../data/imagenes";
import { obtenerRutaImagen } from "../../assets/js/tienda/catalogo";
import { formatearFecha } from "../../assets/js/tienda/useMisCompras";

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatearMedida(valor) {
    return Number(valor).toLocaleString("es-CL", {
        maximumFractionDigits: 1
    });
}

// Ficha visual de una prenda comprada. Muestra únicamente los datos que
// guardó la compra (instantánea histórica) y no consulta el catálogo.
// Se usa también para generar el PNG y para imprimir, por eso no incluye
// botones ni elementos de navegación.
function FichaPrenda({ datos, estadoTexto }) {
    const [imagenFallida, setImagenFallida] = useState(false);

    const rutaImagen =
        imagenFallida || !datos.imagen
            ? images.placeholder
            : obtenerRutaImagen(datos.imagen);

    const caracteristicas = [
        datos.color && { etiqueta: "Color", valor: capitalizar(datos.color) },
        datos.talla && { etiqueta: "Talla", valor: datos.talla },
        { etiqueta: "Cantidad", valor: String(datos.cantidad) },
        ...datos.atributos.map(atributo => ({
            etiqueta: atributo.nombre,
            valor: atributo.valor
        }))
    ].filter(Boolean);

    return (
        <article
            className="ficha-prenda"
            aria-label={`Ficha de ${datos.nombre}`}
        >
            <div className="ficha-cabecera">
                <span className="ficha-marca">TU POLERA</span>
                <span className="ficha-subtitulo">Ficha de tu prenda</span>
            </div>

            <div className="ficha-cuerpo">
                <div className="ficha-imagen">
                    <img
                        src={rutaImagen}
                        alt={datos.nombre}
                        onError={() => setImagenFallida(true)}
                    />
                </div>

                <div className="ficha-identificacion">
                    {datos.categoria && (
                        <span className="ficha-categoria">
                            {datos.categoria}
                        </span>
                    )}

                    <h3 className="ficha-nombre">{datos.nombre}</h3>

                    {datos.productoId !== null &&
                        datos.productoId !== undefined && (
                            <p className="ficha-codigo">
                                Código de producto: {datos.productoId}
                            </p>
                        )}
                </div>
            </div>

            {!datos.historicaDisponible && (
                <p className="ficha-aviso">
                    La información histórica de esta prenda (categoría,
                    color y medidas) no está disponible, porque la compra
                    se realizó antes de que se guardaran las fichas.
                </p>
            )}

            <section className="ficha-seccion">
                <h4>Características de tu compra</h4>

                <dl className="ficha-datos">
                    {caracteristicas.map(dato => (
                        <div key={dato.etiqueta}>
                            <dt>{dato.etiqueta}</dt>
                            <dd>{dato.valor}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            {datos.historicaDisponible && (
                <section className="ficha-seccion">
                    <h4>
                        {datos.talla
                            ? `Medidas de la talla ${datos.talla}`
                            : "Medidas"}
                    </h4>

                    {datos.medidas.length > 0 ? (
                        <table className="ficha-medidas">
                            <tbody>
                                {datos.medidas.map(medida => (
                                    <tr key={medida.id}>
                                        <th scope="row">{medida.nombre}</th>
                                        <td>
                                            {formatearMedida(medida.valor)}{" "}
                                            {medida.unidad}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="ficha-sin-medidas">
                            Esta prenda no tiene medidas registradas.
                        </p>
                    )}
                </section>
            )}

            <div className="ficha-pedido">
                <div>
                    <span>Pedido</span>
                    <strong>{datos.pedido.numero}</strong>
                </div>

                <div>
                    <span>Fecha de compra</span>
                    <strong>{formatearFecha(datos.pedido.fecha)}</strong>
                </div>

                <div>
                    <span>Estado</span>
                    <strong>{estadoTexto}</strong>
                </div>
            </div>
        </article>
    );
}

export default FichaPrenda;
