import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useProductos, {
    crearSlug
} from "../../assets/js/tienda/useProductos";

function Productos() {
    const {
        productos,
        categorias,
        obtenerPrecioFinal,
        formatearPrecio,
        obtenerRutaImagen,
        agregarAlCarrito
    } = useProductos();

    const [parametros] = useSearchParams();

    const [filtroTipo, setFiltroTipo] = useState(
        parametros.get("categoria") || "todos"
    );

    const [filtroColor, setFiltroColor] = useState("todos");
    const [filtroDescuento, setFiltroDescuento] = useState("todos");

    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [tallaSeleccionada, setTallaSeleccionada] = useState("");
    const [mensaje, setMensaje] = useState("");

    // Actualizar la categoría si cambia la URL.
    useEffect(() => {
        setFiltroTipo(parametros.get("categoria") || "todos");
    }, [parametros]);

    // Obtener los colores existentes en los productos.
    const colores = useMemo(() => {
        return [
            ...new Set(
                productos
                    .map((producto) => producto.color)
                    .filter(Boolean)
            )
        ];
    }, [productos]);

    // Aplicar los filtros seleccionados.
    const productosFiltrados = useMemo(() => {
        return productos.filter((producto) => {
            const categoriaProducto = crearSlug(
                producto.categoriaNombre ||
                producto.categoria ||
                ""
            );

            const categoriaSeleccionada = crearSlug(filtroTipo);

            const coincideCategoria =
                filtroTipo === "todos" ||
                categoriaProducto === categoriaSeleccionada;

            const coincideColor =
                filtroColor === "todos" ||
                crearSlug(producto.color || "") === crearSlug(filtroColor);

            const descuento = Number(producto.descuento) || 0;

            const coincideDescuento =
                filtroDescuento === "todos" ||
                (
                    filtroDescuento === "0"
                        ? descuento === 0
                        : descuento >= Number(filtroDescuento)
                );

            return (
                coincideCategoria &&
                coincideColor &&
                coincideDescuento
            );
        });
    }, [productos, filtroTipo, filtroColor, filtroDescuento]);

    // Abrir el modal del producto seleccionado.
    function abrirProducto(producto) {
        setProductoSeleccionado(producto);
        setTallaSeleccionada("");
        setMensaje("");
    }

    // Cerrar el modal y limpiar la selección.
    function cerrarModal() {
        setProductoSeleccionado(null);
        setTallaSeleccionada("");
        setMensaje("");
    }

    // Agregar el producto seleccionado al carrito.
    function manejarAgregarCarrito() {
        if (!productoSeleccionado) {
            return;
        }

        if (!tallaSeleccionada) {
            setMensaje("Selecciona una talla antes de continuar.");
            return;
        }

        const agregado = agregarAlCarrito(
            productoSeleccionado,
            tallaSeleccionada
        );

        if (agregado) {
            cerrarModal();
        } else {
            setMensaje("No se pudo agregar el producto al carrito.");
        }
    }

    // Limpiar todos los filtros.
    function limpiarFiltros() {
        setFiltroTipo("todos");
        setFiltroColor("todos");
        setFiltroDescuento("todos");
    }

    return (
        <div className="pagina-tienda">
            <NavbarTienda />
            <main>
                <section className="container py-5">

                    {/* ENCABEZADO */}
                    <div className="encabezado-tienda text-center mb-5">
                        <span className="etiqueta">
                            Encuentra tu estilo
                        </span>

                        <h1 className="titulo-seccion">
                            Nuestros productos
                        </h1>

                        <p className="subtitulo-seccion">
                            Descubre prendas y accesorios para personalizar tu estilo.
                        </p>
                    </div>

                    {/* FILTROS */}
                    <div className="row g-4 mb-4">

                        {/* FILTRO POR CATEGORÍA */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="filtroTipo"
                                className="form-label"
                            >
                                Categoría
                            </label>

                            <select
                                id="filtroTipo"
                                className="form-select"
                                value={filtroTipo}
                                onChange={(evento) =>
                                    setFiltroTipo(evento.target.value)
                                }
                            >
                                <option value="todos">
                                    Todas las categorías
                                </option>

                                {categorias.map((categoria) => (
                                    <option
                                        key={categoria.id ?? categoria.nombre}
                                        value={crearSlug(categoria.nombre)}
                                    >
                                        {categoria.nombre}
                                    </option>
                                ))}

                                {categorias.length === 0 && (
                                    <>
                                        <option value="poleras">
                                            Poleras
                                        </option>

                                        <option value="polerones">
                                            Polerones
                                        </option>

                                        <option value="gorras">
                                            Gorras
                                        </option>
                                    </>
                                )}
                            </select>
                        </div>

                        {/* FILTRO POR COLOR */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="filtroColor"
                                className="form-label"
                            >
                                Color
                            </label>

                            <select
                                id="filtroColor"
                                className="form-select"
                                value={filtroColor}
                                onChange={(evento) =>
                                    setFiltroColor(evento.target.value)
                                }
                            >
                                <option value="todos">
                                    Todos los colores
                                </option>

                                {colores.map((color) => (
                                    <option key={color} value={color}>
                                        {String(color).charAt(0).toUpperCase() +
                                            String(color).slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* FILTRO POR DESCUENTO */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="filtroDescuento"
                                className="form-label"
                            >
                                Rango de descuentos
                            </label>

                            <select
                                id="filtroDescuento"
                                className="form-select"
                                value={filtroDescuento}
                                onChange={(evento) =>
                                    setFiltroDescuento(evento.target.value)
                                }
                            >
                                <option value="todos">
                                    Todos los descuentos
                                </option>

                                <option value="0">
                                    Sin descuento
                                </option>

                                <option value="25">
                                    25% o más
                                </option>

                                <option value="50">
                                    50% o más
                                </option>

                                <option value="90">
                                    90% o más
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* ENCABEZADO DE RESULTADOS */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                        <h2 className="h5 mb-0">
                            Catálogo de productos
                        </h2>

                        <span className="text-muted">
                            {productosFiltrados.length} producto(s)
                        </span>
                    </div>

                    {/* LISTADO DE PRODUCTOS */}
                    {productosFiltrados.length === 0 ? (
                        <div className="text-center py-5">
                            <h3 className="h5">
                                No hay productos disponibles
                            </h3>

                            <p className="text-muted">
                                Prueba cambiando los filtros seleccionados.
                            </p>

                            <button
                                type="button"
                                className="btn btn-tienda"
                                onClick={limpiarFiltros}
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {productosFiltrados.map((producto) => {
                                const descuento =
                                    Number(producto.descuento) || 0;

                                return (
                                    <div
                                        className="col-12 col-md-6 col-lg-4"
                                        key={producto.id}
                                    >
                                        <article className="tarjeta-producto h-100">
                                            <img
                                                src={obtenerRutaImagen(producto.imagen)}
                                                className="imagen-producto"
                                                alt={producto.nombre}
                                            />

                                            <div className="contenido-producto">
                                                <h3 className="nombre-producto">
                                                    {producto.nombre}
                                                </h3>

                                                <p>
                                                    {producto.descripcion || ""}
                                                </p>

                                                <div className="mt-auto mb-3">
                                                    {descuento > 0 && (
                                                        <p className="precio-anterior mb-1">
                                                            <s>
                                                                {formatearPrecio(
                                                                    producto.precio
                                                                )}
                                                            </s>

                                                            <span className="etiqueta-descuento ms-2">
                                                                -{descuento}%
                                                            </span>
                                                        </p>
                                                    )}

                                                    <p className="precio-producto mb-0">
                                                        {formatearPrecio(
                                                            obtenerPrecioFinal(producto)
                                                        )}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-tienda w-100"
                                                    onClick={() =>
                                                        abrirProducto(producto)
                                                    }
                                                >
                                                    Ver producto
                                                </button>
                                            </div>
                                        </article>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            {/* MODAL DEL PRODUCTO */}
            {productoSeleccionado && (
                <div
                    className="modal fade show d-block"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modalNombre"
                    onClick={(evento) => {
                        if (evento.target === evento.currentTarget) {
                            cerrarModal();
                        }
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            {/* CABECERA DEL MODAL */}
                            <div className="modal-header">
                                <h2
                                    className="modal-title fs-5"
                                    id="modalNombre"
                                >
                                    {productoSeleccionado.nombre}
                                </h2>

                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Cerrar"
                                    onClick={cerrarModal}
                                />
                            </div>

                            {/* INFORMACIÓN DEL PRODUCTO */}
                            <div className="modal-body">
                                <div className="modal-imagen-contenedor">
                                    <img
                                        src={obtenerRutaImagen(
                                            productoSeleccionado.imagen
                                        )}
                                        alt={productoSeleccionado.nombre}
                                    />
                                </div>

                                <p className="mt-3">
                                    {productoSeleccionado.descripcion || ""}
                                </p>

                                {Number(productoSeleccionado.descuento) > 0 && (
                                    <p className="precio-anterior mb-1">
                                        <s>
                                            {formatearPrecio(
                                                productoSeleccionado.precio
                                            )}
                                        </s>

                                        <span className="etiqueta-descuento ms-2">
                                            -{productoSeleccionado.descuento}%
                                        </span>
                                    </p>
                                )}

                                <p className="precio-producto">
                                    {formatearPrecio(
                                        obtenerPrecioFinal(productoSeleccionado)
                                    )}
                                </p>

                                {/* SELECTOR DE TALLA */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="modalTalla"
                                        className="form-label"
                                    >
                                        Talla
                                    </label>

                                    <select
                                        id="modalTalla"
                                        className="form-select"
                                        value={tallaSeleccionada}
                                        onChange={(evento) => {
                                            setTallaSeleccionada(
                                                evento.target.value
                                            );
                                            setMensaje("");
                                        }}
                                    >
                                        <option value="">
                                            Selecciona una talla
                                        </option>

                                        {(productoSeleccionado.tallas || []).map(
                                            (talla) => (
                                                <option
                                                    key={talla}
                                                    value={talla}
                                                >
                                                    {talla}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {mensaje && (
                                    <p className="text-danger" role="alert">
                                        {mensaje}
                                    </p>
                                )}
                            </div>

                            {/* BOTONES DEL MODAL */}
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={cerrarModal}
                                >
                                    Cerrar
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-tienda"
                                    onClick={manejarAgregarCarrito}
                                >
                                    Añadir al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FONDO OSCURO DEL MODAL */}
            {productoSeleccionado && (
                <div
                    className="modal-backdrop fade show"
                    onClick={cerrarModal}
                />
            )}

            <FooterTienda />
        </div>
    );
}

export default Productos;
