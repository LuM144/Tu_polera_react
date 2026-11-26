import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";
import ModalProducto from "../../components/tienda/ModalProducto";
import { obtenerStockTotal } from "../../assets/js/tienda/catalogo";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useProductos, {
    crearSlug
} from "../../assets/js/tienda/useProductos";
import useAnimacionesProductos from "../../assets/js/tienda/useAnimacionesProductos";

function Productos() {
    const {
        productos,
        categorias,
        obtenerCategoria,
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
                categorias.find(
                    categoria => String(categoria.id) === String(producto.categoriaId)
                )?.nombre || ""
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
    }, [productos, categorias, filtroTipo, filtroColor, filtroDescuento]);

    // Inicializar las animaciones de productos.
    const raizAnimaciones = useAnimacionesProductos(
        productosFiltrados.map((producto) => producto.id).join("|")
    );

    // Abrir y cerrar el modal del producto seleccionado.
    function abrirProducto(producto) {
        setProductoSeleccionado(producto);
    }

    function cerrarModal() {
        setProductoSeleccionado(null);
    }

    // Limpiar todos los filtros.
    function limpiarFiltros() {
        setFiltroTipo("todos");
        setFiltroColor("todos");
        setFiltroDescuento("todos");
    }

    return (
        <div className="pagina-tienda" ref={raizAnimaciones}>
            <NavbarTienda />
            <main>

                {/* ENCABEZADO */}
                <section className="portada-pagina">
                    <div className="container">
                        <span
                            className="etiqueta"
                            data-anim="portada-item"
                        >
                            Productos
                        </span>

                        <h1 data-anim="portada-item">
                            Encuentra tu estilo
                        </h1>

                        <p data-anim="portada-item">
                            Descubre poleras, polerones, gorras y más prendas
                            básicas para tu día a día.
                        </p>
                    </div>
                </section>

                <section className="container py-5">

                    {/* FILTROS */}
                    <div
                        className="row g-4 mb-4"
                        data-anim="filtros"
                    >

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
                                        data-anim="tarjeta"
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

                                                {obtenerStockTotal(producto) === 0 && (
                                                    <p className="stock-agotado">
                                                        Agotado
                                                    </p>
                                                )}

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
                <ModalProducto
                    key={productoSeleccionado.id}
                    producto={productoSeleccionado}
                    categoria={obtenerCategoria(productoSeleccionado)}
                    alCerrar={cerrarModal}
                    alAgregar={agregarAlCarrito}
                />
            )}

            <FooterTienda />
        </div>
    );
}

export default Productos;
