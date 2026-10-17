
import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { productosIniciales } from "../../data/productosIniciales";
import { images } from "../../data/imagenes";

function cargarProductos() {
    const guardados = localStorage.getItem("productos");

    if (guardados !== null) {
        return JSON.parse(guardados);
    }

    return productosIniciales;
}

function cargarDestacados() {
    const guardados = localStorage.getItem("productosDestacados");

    if (guardados !== null) {
        return JSON.parse(guardados);
    }

    return [];
}

function obtenerImagen(rutaImagen) {
    if (!rutaImagen) {
        return images.placeholder;
    }

    if (rutaImagen.startsWith("data:image/")) {
        return rutaImagen;
    }

    if (images[rutaImagen]) {
        return images[rutaImagen];
    }

    for (let i = 1; i <= 6; i++) {
        if (rutaImagen === images[`imagen${i}`]) {
            return rutaImagen;
        }
    }

    return images.placeholder;
}

function AdminProductosDestacados() {
    const [productos] = useState(cargarProductos);
    const [destacados, setDestacados] = useState(cargarDestacados);
    const [busqueda, setBusqueda] = useState("");
    const [mensaje, setMensaje] = useState("");

    function cambiarDestacado(id) {
        const yaDestacado = destacados.some(
            (idDestacado) => String(idDestacado) === String(id)
        );

        const nuevosDestacados = yaDestacado
            ? destacados.filter(
                (idDestacado) => String(idDestacado) !== String(id)
            )
            : [...destacados, id];

        try {
            localStorage.setItem(
                "productosDestacados",
                JSON.stringify(nuevosDestacados)
            );

            setDestacados(nuevosDestacados);

            setMensaje(
                yaDestacado
                    ? "Producto quitado de destacados."
                    : "Producto agregado a destacados."
            );
        } catch {
            setMensaje("No se pudieron guardar los cambios.");
        }
    }

    const productosFiltrados = productos.filter((producto) => {
        const texto = busqueda.toLowerCase();

        return (
            producto.nombre.toLowerCase().includes(texto) ||
            String(producto.categoria || "").toLowerCase().includes(texto)
        );
    });

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">

                        <div className="mb-4">
                            <h1 className="fw-bold">
                                Productos destacados
                            </h1>

                            <p className="text-muted mb-0">
                                Selecciona los productos que aparecerán destacados en la tienda.
                            </p>
                        </div>

                        {mensaje && (
                            <div className="alert alert-info" role="status">
                                {mensaje}
                            </div>
                        )}

                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body">

                                <label
                                    htmlFor="buscarProducto"
                                    className="form-label"
                                >
                                    Buscar producto
                                </label>

                                <input
                                    id="buscarProducto"
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre o categoría..."
                                    value={busqueda}
                                    onChange={(evento) =>
                                        setBusqueda(evento.target.value)
                                    }
                                />

                                <p className="mt-3 mb-0">
                                    Total de productos destacados:{" "}
                                    <strong>
                                        {destacados.filter((id) =>
                                            productos.some(
                                                (producto) =>
                                                    String(producto.id) === String(id)
                                            )
                                        ).length}
                                    </strong>
                                </p>

                            </div>
                        </div>

                        {productosFiltrados.length === 0 ? (
                            <div className="alert alert-warning">
                                No se encontraron productos.
                            </div>
                        ) : (
                            <div className="row g-4">

                                {productosFiltrados.map((producto) => {
                                    const destacado = destacados.some(
                                        (id) =>
                                            String(id) === String(producto.id)
                                    );

                                    return (
                                        <div
                                            className="col-12 col-sm-6 col-lg-4"
                                            key={producto.id}
                                        >
                                            <div className="card h-100">

                                                <img
                                                    src={obtenerImagen(producto.imagen)}
                                                    alt={producto.nombre}
                                                    className="card-img-top"
                                                    style={{
                                                        height: "220px",
                                                        objectFit: "contain",
                                                        padding: "12px"
                                                    }}
                                                />

                                                <div className="card-body d-flex flex-column">

                                                    <h5 className="card-title">
                                                        {producto.nombre}
                                                    </h5>

                                                    <p className="text-muted mb-1">
                                                        Categoría: {producto.categoria}
                                                    </p>

                                                    <p className="fw-bold">
                                                        ${Number(producto.precio).toLocaleString("es-CL")}
                                                    </p>

                                                    <div className="mt-auto">

                                                        {destacado && (
                                                            <div className="mb-2">
                                                                <span className="badge text-bg-success">
                                                                    Destacado
                                                                </span>
                                                            </div>
                                                        )}

                                                        <button
                                                            type="button"
                                                            className={`btn w-100 ${
                                                                destacado
                                                                    ? "btn-outline-danger"
                                                                    : "btn-primary"
                                                            }`}
                                                            onClick={() =>
                                                                cambiarDestacado(producto.id)
                                                            }
                                                        >
                                                            {destacado
                                                                ? "Quitar de destacados"
                                                                : "Destacar producto"}
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminProductosDestacados;
