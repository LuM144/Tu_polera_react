
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productosIniciales } from "../../../data/productosIniciales";
import { images } from "../../../data/imagenes";
import {
    categoriasIniciales,
    coloresIniciales
} from "../../../data/categoriasIniciales";

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

function useAdminEditarProducto() {
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

        // Validar que el precio sea un número válido y mayor que cero.
        const precioIngresado = String(formulario.precio).trim();
        const precio = Number(precioIngresado);

        if (
            precioIngresado === "" ||
            !Number.isFinite(precio) ||
            precio <= 0
        ) {
            setError("El precio debe ser un número válido mayor que $0.");
            return;
        }

        // Las gorras utilizan talla única automáticamente.
        // Los demás productos deben tener al menos una talla.
        if (formulario.categoria !== "gorras" && formulario.tallas.length === 0) {
            setError("Debes seleccionar al menos una talla para este producto.");
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
            precio: precio,
            color: formulario.color,
            descuento: Number(formulario.descuento),
            tallas: formulario.categoria === "gorras"
                ? ["Única"]
                : formulario.tallas,
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

    return {
        id,
        producto,
        categorias,
        colores,
        formulario,
        error,
        actualizarCampo,
        actualizarCategoria,
        actualizarTalla,
        subirImagen,
        guardarProducto
    };
}

export default useAdminEditarProducto;
