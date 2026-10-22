import { Link } from "react-router-dom";
import useIndex from "../../assets/js/tienda/useIndex";
import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";

function Home() {
    const {
        productosDestacados,
        categorias,
        bannersIniciales,
        noticiasIniciales,
        usuarioActual,
        obtenerPrecioFinal,
        formatearPrecio,
        obtenerRutaImagen
    } = useIndex();

    function crearSlug(nombre) {
        return nombre
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "");
    }

    return (
        <div className="pagina-tienda">
            <NavbarTienda />

            {/* CARRUSEL PRINCIPAL */}
            <section className="container my-5">
                <div
                    id="carruselHome"
                    className="carousel slide carousel-home mx-auto"
                    data-bs-ride="carousel"
                >
                    <div className="carousel-indicators">
                        {bannersIniciales.map((banner, indice) => (
                            <button
                                key={banner.id}
                                type="button"
                                data-bs-target="#carruselHome"
                                data-bs-slide-to={indice}
                                className={indice === 0 ? "active" : ""}
                                aria-label={`Banner ${indice + 1}`}
                                aria-current={indice === 0 ? "true" : undefined}
                            />
                        ))}
                    </div>

                    <div className="carousel-inner">
                        {bannersIniciales.map((banner, indice) => (
                            <div
                                key={banner.id}
                                className={`carousel-item ${
                                    indice === 0 ? "active" : ""
                                }`}
                            >
                                <img
                                    src={obtenerRutaImagen(banner.imagen)}
                                    className="d-block w-100"
                                    alt={banner.titulo}
                                />

                                <div className="carousel-caption bg-dark bg-opacity-50 p-3">
                                    <h1 className="text-white">
                                        {banner.titulo}
                                    </h1>

                                    <p className="text-white">
                                        {banner.descripcion}
                                    </p>

                                    <Link to="/productos" className="btn btn-light">
                                        Ver productos
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carruselHome"
                        data-bs-slide="prev"
                        aria-label="Banner anterior"
                    >
                        <span className="carousel-control-prev-icon"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carruselHome"
                        data-bs-slide="next"
                        aria-label="Banner siguiente"
                    >
                        <span className="carousel-control-next-icon"></span>
                        <span className="visually-hidden">Siguiente</span>
                    </button>
                </div>
            </section>


            {/* CATEGORÍAS */}
            <section className="container my-5">
                <div className="encabezado-tienda text-center">
                    <span className="etiqueta">Calidad sin marcas</span>

                    <h2 className="titulo-seccion">
                        Explora nuestros esenciales a medida
                    </h2>

                    <p className="subtitulo-seccion">
                        Prendas básicas confeccionadas exactamente para ti, sin logos y al alcance de todos.
                    </p>
                </div>

                {categorias.length === 0 ? (
                    <p className="text-center text-muted">
                        No hay categorías disponibles.
                    </p>
                ) : (
                    <div
                        id="carruselCategorias"
                        className="carousel slide carrusel-categorias"
                    >
                        <div className="carousel-inner">
                            {Array.from(
                                { length: Math.ceil(categorias.length / 3) },
                                (_, indice) => categorias.slice(
                                    indice * 3,
                                    indice * 3 + 3
                                )
                            ).map((grupo, indice) => (
                                <div
                                    key={indice}
                                    className={`carousel-item ${
                                        indice === 0 ? "active" : ""
                                    }`}
                                >
                                    <div className="row g-4 justify-content-center px-4 px-md-5">
                                        {grupo.map((categoria) => (
                                            <div
                                                key={categoria.id ?? categoria.nombre}
                                                className="col-10 col-sm-8 col-md-4"
                                            >
                                                <Link
                                                    to={`/productos?categoria=${encodeURIComponent(
                                                        crearSlug(categoria.nombre)
                                                    )}`}
                                                    className="d-block h-100"
                                                >
                                                    <div className="tarjeta-categoria">
                                                        <img
                                                            src={obtenerRutaImagen(
                                                                categoria.imagen
                                                            )}
                                                            className="imagen-categoria"
                                                            alt={categoria.nombre}
                                                        />

                                                        <div className="contenido-categoria text-center">
                                                            <h3>{categoria.nombre}</h3>
                                                        
                                                            <p>
                                                                {categoria.descripcion ?? ""}
                                                            </p>
                                                        
                                                            <span className="enlace-categoria">
                                                                Ver categoría →
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {categorias.length > 3 && (
                            <>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#carruselCategorias"
                                    data-bs-slide="prev"
                                    aria-label="Categorías anteriores"
                                >
                                    <span className="carousel-control-prev-icon bg-dark p-3" />
                                    <span className="visually-hidden">
                                        Anterior
                                    </span>
                                </button>
                        
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#carruselCategorias"
                                    data-bs-slide="next"
                                    aria-label="Categorías siguientes"
                                >
                                    <span className="carousel-control-next-icon bg-dark p-3" />
                                    <span className="visually-hidden">
                                        Siguiente
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </section>


            {/* PRODUCTOS DESTACADOS */}
            <section className="container my-5">
                <div className="encabezado-tienda text-center">
                    <span className="etiqueta">Selección especial</span>

                    <h2 className="titulo-seccion">
                        Esenciales destacados
                    </h2>

                    <p className="subtitulo-seccion">
                        Descubre nuestras prendas de mayor durabilidad y calce perfecto.
                    </p>
                </div>

                <div
                    id="carruselProductos"
                    className="carousel slide"
                    data-bs-ride="carousel"
                >
                    <div className="carousel-inner">
                        {productosDestacados.length === 0 ? (
                            <div className="carousel-item active">
                                <div className="text-center py-5">
                                    <h4>No hay productos disponibles</h4>

                                    <p className="text-muted">
                                        Actualmente no existen productos destacados.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            Array.from(
                                {
                                    length: Math.ceil(
                                        productosDestacados.length / 3
                                    )
                                },
                                (_, indice) =>
                                    productosDestacados.slice(
                                        indice * 3,
                                        indice * 3 + 3
                                    )
                            ).map((grupo, indice) => (
                                <div
                                    key={indice}
                                    className={`carousel-item ${
                                        indice === 0 ? "active" : ""
                                    }`}
                                >
                                    <div className="row g-4 justify-content-center px-md-5">
                                        {grupo.map((producto) => {
                                            const precio =
                                                Number(producto.precio) || 0;

                                            const descuento =
                                                Number(producto.descuento) || 0;

                                            const precioFinal =
                                                obtenerPrecioFinal(producto);

                                            return (
                                                <div
                                                    className="col-12 col-md-4"
                                                    key={producto.id}
                                                >
                                                    <div className="tarjeta-producto">
                                                        <img
                                                            src={obtenerRutaImagen(
                                                                producto.imagen
                                                            )}
                                                            className="imagen-producto"
                                                            alt={producto.nombre}
                                                        />

                                                        <div className="contenido-producto d-flex flex-column">
                                                            {descuento > 0 && (
                                                                <span className="etiqueta-descuento align-self-start mb-2">
                                                                    -{descuento}%
                                                                </span>
                                                            )}

                                                            <h3 className="nombre-producto">
                                                                {producto.nombre}
                                                            </h3>

                                                            <p className="text-muted small">
                                                                {producto.descripcion ?? ""}
                                                            </p>

                                                            {descuento > 0 && (
                                                                <p className="mb-1">
                                                                    <span className="precio-anterior">
                                                                        ${formatearPrecio(precio)}
                                                                    </span>
                                                                </p>
                                                            )}

                                                            <p className="precio-producto mb-3">
                                                                ${formatearPrecio(
                                                                    descuento > 0
                                                                        ? precioFinal
                                                                        : precio
                                                                )}
                                                            </p>

                                                            <div className="mt-auto">
                                                                <Link
                                                                    to="/productos"
                                                                    className="btn btn-dark w-100"
                                                                >
                                                                    Ver productos
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {productosDestacados.length > 3 && (
                        <>
                            <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#carruselProductos"
                                data-bs-slide="prev"
                                aria-label="Productos anteriores"
                            >
                                <span className="carousel-control-prev-icon bg-dark p-3"></span>
                                <span className="visually-hidden">Anterior</span>
                            </button>

                            <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#carruselProductos"
                                data-bs-slide="next"
                                aria-label="Productos siguientes"
                            >
                                <span className="carousel-control-next-icon bg-dark p-3"></span>
                                <span className="visually-hidden">Siguiente</span>
                            </button>
                        </>
                    )}
                </div>
            </section>

            {/* NOTICIAS */}
            <section className="container my-5">
                <div className="encabezado-tienda text-center">
                    <span className="etiqueta">Novedades</span>

                    <h2 className="titulo-seccion">
                        Noticias del Taller
                    </h2>

                    <p className="subtitulo-seccion">
                        Entérate de las últimas actualizaciones en patronaje, calidad y precios accesibles.
                    </p>
                </div>

                <div
                    id="carruselNoticias"
                    className="carousel slide carousel-noticias mx-auto"
                    data-bs-ride="carousel"
                >
                    <div className="carousel-indicators">
                        {noticiasIniciales.map((noticia, indice) => (
                            <button
                                key={noticia.id}
                                type="button"
                                data-bs-target="#carruselNoticias"
                                data-bs-slide-to={indice}
                                className={indice === 0 ? "active" : ""}
                                aria-label={`Noticia ${indice + 1}`}
                                aria-current={indice === 0 ? "true" : undefined}
                            />
                        ))}
                    </div>

                    <div className="carousel-inner">
                        {noticiasIniciales.map((noticia, indice) => (
                            <div
                                key={noticia.id}
                                className={`carousel-item ${
                                    indice === 0 ? "active" : ""
                                }`}
                            >
                                <img
                                    src={obtenerRutaImagen(noticia.imagen)}
                                    className="d-block w-100"
                                    alt={noticia.titulo}
                                />

                                <div className="carousel-caption bg-dark bg-opacity-50 p-3">
                                    <h3 className="text-white">
                                        {noticia.titulo}
                                    </h3>

                                    <p className="text-white">
                                        {noticia.descripcion}
                                    </p>

                                    <Link
                                        to={noticia.enlace}
                                        className="btn btn-light"
                                    >
                                        Ver novedades
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carruselNoticias"
                        data-bs-slide="prev"
                        aria-label="Noticia anterior"
                    >
                        <span className="carousel-control-prev-icon"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carruselNoticias"
                        data-bs-slide="next"
                        aria-label="Noticia siguiente"
                    >
                        <span className="carousel-control-next-icon"></span>
                        <span className="visually-hidden">Siguiente</span>
                    </button>
                </div>
            </section>

        
            <FooterTienda />

        </div>
    );
}

export default Home;