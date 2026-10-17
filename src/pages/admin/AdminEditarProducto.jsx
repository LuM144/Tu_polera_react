
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { productosIniciales } from "../../data/productosIniciales";
import { images } from "../../data/imagenes";
import {
    categoriasIniciales,
    coloresIniciales
} from "../../data/categoriasIniciales";

function cargarProductos() {
    const productosGuardados = localStorage.getItem("productos");

    if (productosGuardados !== null) {
        return JSON.parse(productosGuardados);
    }

    return productosIniciales;
}

function cargarOpciones(clave, iniciales) {
    const opcionesGuardadas = localStorage.getItem(clave);

    if (opcionesGuardadas !== null) {
        return JSON.parse(opcionesGuardadas);
    }

    localStorage.setItem(clave, JSON.stringify(iniciales));
    return iniciales;
}

function obtenerImagen(rutaImagen) {
    if (!rutaImagen) {
        return "";
    }

    // Las imágenes subidas se guardan como data URL.
    if (rutaImagen.startsWith("data:image/")) {
        return rutaImagen;
    }

    const ruta = rutaImagen.toLowerCase();

    if (ruta.includes("imagen1")) return images.imagen1;
    if (ruta.includes("imagen2")) return images.imagen2;
    if (ruta.includes("imagen3")) return images.imagen3;
    if (ruta.includes("imagen4")) return images.imagen4;
    if (ruta.includes("imagen5")) return images.imagen5;
    if (ruta.includes("imagen6")) return images.imagen6;
    if (ruta.includes("placeholder")) return images.placeholder;

    return rutaImagen;
}

function crearFormulario(producto) {
    if (!producto) {
        return {
            nombre: "",
            categoria: "",
            precio: "",
            color: "",
            descuento: 0,
            tallas: [],
            manga_corta: "si",
            capucha: "si",
            tipo_gorro: "",
            imagen: "",
            descripcion: ""
        };
    }

    return {
        nombre: producto.nombre || "",
        categoria: producto.categoria || "",
        precio: producto.precio ?? "",
        color: producto.color || "",
        descuento: producto.descuento ?? 0,
        tallas: producto.tallas || [],
        manga_corta: producto.manga_corta || "si",
        capucha: producto.capucha || "si",
        tipo_gorro: producto.tipo_gorro || "",
        imagen: obtenerImagen(producto.imagen),
        descripcion: producto.descripcion || ""
    };
}

function AdminEditarProducto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productos] = useState(cargarProductos);

    const [categorias] = useState(
        () => cargarOpciones("categorias", categoriasIniciales)
    );

    const [colores] = useState(
        () => cargarOpciones("colores", coloresIniciales)
    );

    const producto = id
        ? productos.find(function (productoActual) {
            return productoActual.id === Number(id);
        })
        : null;

    const [formulario, setFormulario] = useState(
        () => crearFormulario(producto)
    );

    const [error, setError] = useState("");

    function actualizarCampo(evento) {
        const { name, value } = evento.target;

        setFormulario(function (formularioActual) {
            return {
                ...formularioActual,
                [name]: value
            };
        });
    }

    function actualizarCategoria(evento) {
        const categoriaSeleccionada = evento.target.value;

        setFormulario(function (formularioActual) {
            return {
                ...formularioActual,
                categoria: categoriaSeleccionada,
                tallas: categoriaSeleccionada === "gorras"
                    ? ["Única"]
                    : formularioActual.categoria === "gorras"
                        ? []
                        : formularioActual.tallas
            };
        });
    }

    function actualizarTalla(talla) {
        setFormulario(function (formularioActual) {
            const tallasActuales = formularioActual.tallas;

            const tallasActualizadas = tallasActuales.includes(talla)
                ? tallasActuales.filter(function (tallaActual) {
                    return tallaActual !== talla;
                })
                : [...tallasActuales, talla];

            return {
                ...formularioActual,
                tallas: tallasActualizadas
            };
        });
    }

    function subirImagen(evento) {
        const archivo = evento.target.files[0];

        if (!archivo) {
            return;
        }

        if (!archivo.type.startsWith("image/")) {
            setError("Selecciona un archivo de imagen válido.");
            evento.target.value = "";
            return;
        }

        if (archivo.size > 8 * 1024 * 1024) {
            setError("La imagen no puede superar los 8 MB.");
            evento.target.value = "";
            return;
        }

        setError("");

        const urlTemporal = URL.createObjectURL(archivo);
        const imagenTemporal = new Image();

        imagenTemporal.onload = function () {
            try {
                const limite = 1000;

                const escala = Math.min(
                    1,
                    limite / imagenTemporal.naturalWidth,
                    limite / imagenTemporal.naturalHeight
                );

                const canvas = document.createElement("canvas");

                canvas.width = Math.max(
                    1,
                    Math.round(imagenTemporal.naturalWidth * escala)
                );

                canvas.height = Math.max(
                    1,
                    Math.round(imagenTemporal.naturalHeight * escala)
                );

                const contexto = canvas.getContext("2d");

                if (!contexto) {
                    throw new Error("No se pudo procesar la imagen.");
                }

                contexto.drawImage(
                    imagenTemporal,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const imagenComprimida = canvas.toDataURL(
                    "image/webp",
                    0.75
                );

                setFormulario(function (formularioActual) {
                    return {
                        ...formularioActual,
                        imagen: imagenComprimida
                    };
                });
            } catch {
                setError("No se pudo procesar la imagen seleccionada.");
            } finally {
                URL.revokeObjectURL(urlTemporal);
            }
        };

        imagenTemporal.onerror = function () {
            URL.revokeObjectURL(urlTemporal);
            setError("No se pudo abrir la imagen seleccionada.");
        };

        imagenTemporal.src = urlTemporal;
    }

    function obtenerNuevoId() {
        if (productos.length === 0) {
            return 1;
        }

        return Math.max(
            ...productos.map(function (productoActual) {
                return Number(productoActual.id);
            })
        ) + 1;
    }

    function guardarProducto(evento) {
        evento.preventDefault();
        setError("");

        if (id && !producto) {
            setError("No se encontró el producto que intentas editar.");
            return;
        }

        if (!formulario.imagen) {
            setError("Selecciona una imagen o sube una desde tu computador.");
            return;
        }

        const productoActualizado = {
            id: producto ? producto.id : obtenerNuevoId(),
            nombre: formulario.nombre.trim(),
            categoria: formulario.categoria,
            precio: Number(formulario.precio),
            color: formulario.color,
            descuento: Number(formulario.descuento),
            tallas: formulario.tallas,
            imagen: formulario.imagen,
            descripcion: formulario.descripcion.trim()
        };

        if (productoActualizado.categoria === "poleras") {
            productoActualizado.manga_corta = formulario.manga_corta;
        }

        if (productoActualizado.categoria === "polerones") {
            productoActualizado.capucha = formulario.capucha;
        }

        if (productoActualizado.categoria === "gorras") {
            productoActualizado.tipo_gorro = formulario.tipo_gorro.trim();
        }

        let productosActualizados;

        if (producto) {
            productosActualizados = productos.map(function (productoActual) {
                return productoActual.id === producto.id
                    ? productoActualizado
                    : productoActual;
            });
        } else {
            productosActualizados = [
                ...productos,
                productoActualizado
            ];
        }

        try {
            localStorage.setItem(
                "productos",
                JSON.stringify(productosActualizados)
            );

            navigate("/admin/productos");
        } catch {
            setError(
                "No se pudo guardar el producto. La imagen puede ser demasiado grande o el almacenamiento estar lleno."
            );
        }
    }

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="fw-bold">
                                    {producto
                                        ? "Editar producto"
                                        : "Agregar producto"}
                                </h1>

                                <p className="text-muted mb-0">
                                    {producto
                                        ? "Modifica la información del producto."
                                        : "Completa la información del nuevo producto."}
                                </p>
                            </div>

                            <Link
                                to="/admin/productos"
                                className="btn btn-secondary"
                            >
                                Volver
                            </Link>
                        </div>

                        {id && !producto ? (
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h2>Producto no encontrado</h2>

                                    <p>
                                        No existe un producto con el ID solicitado.
                                    </p>

                                    <Link
                                        to="/admin/productos"
                                        className="btn btn-primary"
                                    >
                                        Volver a productos
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={guardarProducto}>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="nombre"
                                                className="form-label"
                                            >
                                                Nombre del producto
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nombre"
                                                name="nombre"
                                                value={formulario.nombre}
                                                onChange={actualizarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                htmlFor="categoria"
                                                className="form-label"
                                            >
                                                Categoría
                                            </label>

                                            <select
                                                className="form-select"
                                                id="categoria"
                                                name="categoria"
                                                value={formulario.categoria}
                                                onChange={actualizarCategoria}
                                                required
                                            >
                                                <option value="">
                                                    Seleccionar categoría
                                                </option>

                                                {categorias.map(categoria => (
                                                    <option
                                                        key={categoria}
                                                        value={categoria}
                                                    >
                                                        {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                                                    </option>
                                                ))}

                                                {formulario.categoria &&
                                                    !categorias.includes(formulario.categoria) && (
                                                        <option value={formulario.categoria}>
                                                            {formulario.categoria}
                                                        </option>
                                                    )}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                htmlFor="precio"
                                                className="form-label"
                                            >
                                                Precio
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                id="precio"
                                                name="precio"
                                                min="0"
                                                step="1"
                                                value={formulario.precio}
                                                onChange={actualizarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                htmlFor="color"
                                                className="form-label"
                                            >
                                                Color
                                            </label>

                                            <select
                                                className="form-select"
                                                id="color"
                                                name="color"
                                                value={formulario.color}
                                                onChange={actualizarCampo}
                                                required
                                            >
                                                <option value="">
                                                    Seleccionar color
                                                </option>

                                                {colores.map(color => (
                                                    <option
                                                        key={color}
                                                        value={color}
                                                    >
                                                        {color.charAt(0).toUpperCase() + color.slice(1)}
                                                    </option>
                                                ))}

                                                {formulario.color &&
                                                    !colores.includes(formulario.color) && (
                                                        <option value={formulario.color}>
                                                            {formulario.color}
                                                        </option>
                                                    )}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                htmlFor="descuento"
                                                className="form-label"
                                            >
                                                Descuento (%)
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                id="descuento"
                                                name="descuento"
                                                min="0"
                                                max="100"
                                                value={formulario.descuento}
                                                onChange={actualizarCampo}
                                                required
                                            />
                                        </div>

                                        {formulario.categoria && (
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Tallas
                                                </label>

                                                <div>
                                                    {(formulario.categoria === "gorras"
                                                        ? ["Única"]
                                                        : ["S", "M", "L", "XL"]
                                                    ).map(function (talla) {
                                                        return (
                                                            <div
                                                                className="form-check form-check-inline"
                                                                key={talla}
                                                            >
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`talla${talla}`}
                                                                    checked={formulario.tallas.includes(talla)}
                                                                    onChange={() => actualizarTalla(talla)}
                                                                />

                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`talla${talla}`}
                                                                >
                                                                    {talla}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {formulario.categoria === "poleras" && (
                                            <div className="mb-3">
                                                <label
                                                    htmlFor="manga_corta"
                                                    className="form-label"
                                                >
                                                    ¿Manga corta?
                                                </label>

                                                <select
                                                    className="form-select"
                                                    id="manga_corta"
                                                    name="manga_corta"
                                                    value={formulario.manga_corta}
                                                    onChange={actualizarCampo}
                                                >
                                                    <option value="si">Sí</option>
                                                    <option value="no">No</option>
                                                </select>
                                            </div>
                                        )}

                                        {formulario.categoria === "polerones" && (
                                            <div className="mb-3">
                                                <label
                                                    htmlFor="capucha"
                                                    className="form-label"
                                                >
                                                    ¿Tiene capucha?
                                                </label>

                                                <select
                                                    className="form-select"
                                                    id="capucha"
                                                    name="capucha"
                                                    value={formulario.capucha}
                                                    onChange={actualizarCampo}
                                                >
                                                    <option value="si">Sí</option>
                                                    <option value="no">No</option>
                                                </select>
                                            </div>
                                        )}

                                        {formulario.categoria === "gorras" && (
                                            <div className="mb-3">
                                                <label
                                                    htmlFor="tipo_gorro"
                                                    className="form-label"
                                                >
                                                    Tipo de gorro
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="tipo_gorro"
                                                    name="tipo_gorro"
                                                    placeholder="Ej: Snapback"
                                                    value={formulario.tipo_gorro}
                                                    onChange={actualizarCampo}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label
                                                htmlFor="imagen"
                                                className="form-label"
                                            >
                                                Imagen del producto
                                            </label>

                                            <select
                                                className="form-select"
                                                id="imagen"
                                                name="imagen"
                                                value={formulario.imagen}
                                                onChange={actualizarCampo}
                                            >
                                                <option value="">
                                                    Seleccionar imagen existente
                                                </option>

                                                <option value={images.imagen1}>
                                                    Imagen 1
                                                </option>

                                                <option value={images.imagen2}>
                                                    Imagen 2
                                                </option>

                                                <option value={images.imagen3}>
                                                    Imagen 3
                                                </option>

                                                <option value={images.imagen4}>
                                                    Imagen 4
                                                </option>

                                                <option value={images.imagen5}>
                                                    Imagen 5
                                                </option>

                                                <option value={images.imagen6}>
                                                    Imagen 6
                                                </option>

                                                {formulario.imagen.startsWith("data:image/") && (
                                                    <option value={formulario.imagen}>
                                                        Imagen subida desde el computador
                                                    </option>
                                                )}
                                            </select>

                                            <div className="mt-3">
                                                <label
                                                    htmlFor="archivoImagen"
                                                    className="form-label"
                                                >
                                                    O subir una imagen desde tu computador
                                                </label>

                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="archivoImagen"
                                                    accept="image/*"
                                                    onChange={subirImagen}
                                                />

                                                <div className="form-text">
                                                    Opcional. Máximo 8 MB antes de la compresión.
                                                </div>
                                            </div>
                                        </div>

                                        {formulario.imagen && (
                                            <div className="mb-3">
                                                <p className="form-label">
                                                    Vista previa
                                                </p>

                                                <img
                                                    src={formulario.imagen}
                                                    alt="Vista previa del producto"
                                                    className="img-fluid imagen-producto-admin"
                                                    onError={(evento) => {
                                                        evento.currentTarget.onerror = null;
                                                        evento.currentTarget.src = images.placeholder;
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label
                                                htmlFor="descripcion"
                                                className="form-label"
                                            >
                                                Descripción
                                            </label>

                                            <textarea
                                                className="form-control"
                                                id="descripcion"
                                                name="descripcion"
                                                rows="4"
                                                value={formulario.descripcion}
                                                onChange={actualizarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                {producto
                                                    ? "Guardar cambios"
                                                    : "Crear producto"}
                                            </button>

                                            <Link
                                                to="/admin/productos"
                                                className="btn btn-secondary ms-2"
                                            >
                                                Cancelar
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminEditarProducto;
