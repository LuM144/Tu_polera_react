
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    cargarCategorias,
    cargarColores,
    cargarProductos,
    guardarProductos,
    leerImagenComoDataUrl,
    listarTallas,
    obtenerCategoria
} from "../tienda/catalogo";

// Valor inicial de un atributo según su tipo de dato.
function valorInicialAtributo(atributo) {
    return atributo.tipo === "booleano" ? false : "";
}

// Datos que se editan en el formulario (todo como texto para los inputs).
function crearFormulario(producto) {
    if (!producto) {
        return {
            nombre: "",
            categoriaId: "",
            precio: "",
            color: "",
            descuento: 0,
            tallas: {},
            atributos: {},
            imagen: "",
            descripcion: ""
        };
    }

    const tallas = {};

    Object.entries(producto.tallas ?? {}).forEach(([talla, variante]) => {
        const medidas = {};

        Object.entries(variante.medidas ?? {}).forEach(([id, valor]) => {
            medidas[id] = String(valor);
        });

        tallas[talla] = {
            stock: String(variante.stock ?? 0),
            medidas
        };
    });

    return {
        nombre: producto.nombre || "",
        categoriaId: producto.categoriaId !== null && producto.categoriaId !== undefined
            ? String(producto.categoriaId)
            : "",
        precio: producto.precio ?? "",
        color: producto.color || "",
        descuento: producto.descuento ?? 0,
        tallas,
        atributos: { ...(producto.atributos ?? {}) },
        imagen: producto.imagen || "",
        descripcion: producto.descripcion || ""
    };
}

function useAdminEditarProducto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categorias] = useState(cargarCategorias);
    const [colores] = useState(cargarColores);
    const [productos] = useState(() => cargarProductos(categorias));

    const producto = id
        ? productos.find(actual => actual.id === Number(id))
        : null;

    const [formulario, setFormulario] = useState(
        () => crearFormulario(producto)
    );

    const [error, setError] = useState("");

    // Configuración de la categoría elegida: de aquí salen los campos.
    const categoria = obtenerCategoria(categorias, formulario.categoriaId);

    // Tallas que se pueden elegir: las de la categoría y las que el
    // producto ya tenía, para no perder datos si la categoría cambió.
    const tallasDisponibles = categoria
        ? listarTallas(
            {
                tallas: Object.fromEntries(
                    [...new Set([
                        ...categoria.tallas,
                        ...Object.keys(formulario.tallas)
                    ])].map(talla => [talla, true])
                )
            },
            categoria
        )
        : [];

    const tallaUnica = categoria?.tallas.length === 1;

    function actualizarCampo(evento) {
        const { name, value } = evento.target;

        setFormulario(actual => ({
            ...actual,
            [name]: value
        }));
    }

    function actualizarCategoria(evento) {
        const nuevaCategoria = obtenerCategoria(categorias, evento.target.value);

        setFormulario(actual => {
            if (actual.categoriaId === evento.target.value) {
                return actual;
            }

            // Al cambiar de categoría se generan los campos de la nueva.
            const atributos = {};

            (nuevaCategoria?.atributos ?? []).forEach(atributo => {
                atributos[atributo.id] = valorInicialAtributo(atributo);
            });

            const tallas = {};

            // Las categorías con una sola talla (por ejemplo, "Única")
            // la seleccionan automáticamente.
            if (nuevaCategoria?.tallas.length === 1) {
                tallas[nuevaCategoria.tallas[0]] = { stock: "0", medidas: {} };
            }

            return {
                ...actual,
                categoriaId: evento.target.value,
                atributos,
                tallas
            };
        });
    }

    function actualizarAtributo(atributoId, valor) {
        setFormulario(actual => ({
            ...actual,
            atributos: {
                ...actual.atributos,
                [atributoId]: valor
            }
        }));
    }

    function alternarTalla(talla) {
        setFormulario(actual => {
            const tallas = { ...actual.tallas };

            if (tallas[talla]) {
                delete tallas[talla];
            } else {
                tallas[talla] = { stock: "0", medidas: {} };
            }

            return { ...actual, tallas };
        });
    }

    function actualizarStock(talla, valor) {
        setFormulario(actual => ({
            ...actual,
            tallas: {
                ...actual.tallas,
                [talla]: { ...actual.tallas[talla], stock: valor }
            }
        }));
    }

    function actualizarMedida(talla, medidaId, valor) {
        setFormulario(actual => ({
            ...actual,
            tallas: {
                ...actual.tallas,
                [talla]: {
                    ...actual.tallas[talla],
                    medidas: {
                        ...actual.tallas[talla].medidas,
                        [medidaId]: valor
                    }
                }
            }
        }));
    }

    async function subirImagen(evento) {
        const archivo = evento.target.files[0];

        if (!archivo) {
            return;
        }

        try {
            const imagen = await leerImagenComoDataUrl(archivo, 1000);

            setError("");
            setFormulario(actual => ({ ...actual, imagen }));
        } catch (errorImagen) {
            setError(errorImagen.message);
        }

        evento.target.value = "";
    }

    function obtenerNuevoId() {
        if (productos.length === 0) {
            return 1;
        }

        return Math.max(...productos.map(actual => Number(actual.id))) + 1;
    }

    // Revisa el formulario según la configuración de la categoría.
    // Devuelve un mensaje de error o los datos listos para guardar.
    function validarFormulario() {
        const precioIngresado = String(formulario.precio).trim();
        const precio = Number(precioIngresado);

        if (precioIngresado === "" || !Number.isFinite(precio) || precio <= 0) {
            return { error: "El precio debe ser un número válido mayor que $0." };
        }

        const descuento = Number(formulario.descuento);

        if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
            return { error: "El descuento debe estar entre 0 y 100." };
        }

        if (!categoria) {
            return { error: "Selecciona una categoría." };
        }

        // Atributos particulares de la categoría.
        const atributos = {};

        for (const atributo of categoria.atributos) {
            const valor = formulario.atributos[atributo.id];

            if (atributo.tipo === "booleano") {
                atributos[atributo.id] = Boolean(valor);
                continue;
            }

            const texto = String(valor ?? "").trim();

            if (texto === "") {
                if (atributo.obligatorio) {
                    return { error: `Completa el atributo "${atributo.nombre}".` };
                }

                continue;
            }

            if (atributo.tipo === "numero") {
                if (!Number.isFinite(Number(texto))) {
                    return { error: `"${atributo.nombre}" debe ser un número.` };
                }

                atributos[atributo.id] = Number(texto);
            } else if (
                atributo.tipo === "seleccion" &&
                !atributo.opciones.includes(texto)
            ) {
                return { error: `Elige una opción válida para "${atributo.nombre}".` };
            } else {
                atributos[atributo.id] = texto;
            }
        }

        // Tallas, stock y medidas por talla.
        const nombresTallas = Object.keys(formulario.tallas);

        if (nombresTallas.length === 0) {
            return { error: "Debes seleccionar al menos una talla para este producto." };
        }

        const tallas = {};

        for (const talla of nombresTallas) {
            const datos = formulario.tallas[talla];
            const stock = Number(datos.stock);

            if (
                String(datos.stock).trim() === "" ||
                !Number.isInteger(stock) ||
                stock < 0
            ) {
                return {
                    error: `El stock de la talla ${talla} debe ser un número entero de 0 o más.`
                };
            }

            const medidas = {};

            for (const medida of categoria.medidas) {
                if (!medida.registrarProducto) {
                    continue;
                }

                const texto = String(datos.medidas[medida.id] ?? "").trim();
                const valor = Number(texto);

                if (texto === "" || !Number.isFinite(valor) || valor <= 0) {
                    return {
                        error: `Ingresa "${medida.nombre}" (${medida.unidad}) para la talla ${talla}.`
                    };
                }

                medidas[medida.id] = valor;
            }

            tallas[talla] = { stock, medidas };
        }

        if (!formulario.imagen) {
            return { error: "Selecciona una imagen o sube una desde tu dispositivo." };
        }

        return { precio, descuento, atributos, tallas };
    }

    function guardarProductoFormulario(evento) {
        evento.preventDefault();
        setError("");

        if (id && !producto) {
            setError("No se encontró el producto que intentas editar.");
            return;
        }

        const resultado = validarFormulario();

        if (resultado.error) {
            setError(resultado.error);
            return;
        }

        const productoActualizado = {
            id: producto ? producto.id : obtenerNuevoId(),
            nombre: formulario.nombre.trim(),
            categoriaId: categoria.id,
            precio: resultado.precio,
            color: formulario.color,
            descuento: resultado.descuento,
            tallas: resultado.tallas,
            atributos: resultado.atributos,
            descripcion: formulario.descripcion.trim(),
            imagen: formulario.imagen
        };

        const productosActualizados = producto
            ? productos.map(actual =>
                actual.id === producto.id ? productoActualizado : actual
            )
            : [...productos, productoActualizado];

        if (!guardarProductos(productosActualizados)) {
            setError(
                "No se pudo guardar el producto. La imagen puede ser demasiado grande o el almacenamiento estar lleno."
            );
            return;
        }

        navigate("/admin/productos");
    }

    return {
        id,
        producto,
        categorias,
        categoria,
        colores,
        tallasDisponibles,
        tallaUnica,
        formulario,
        error,
        actualizarCampo,
        actualizarCategoria,
        actualizarAtributo,
        alternarTalla,
        actualizarStock,
        actualizarMedida,
        subirImagen,
        guardarProducto: guardarProductoFormulario
    };
}

export default useAdminEditarProducto;
