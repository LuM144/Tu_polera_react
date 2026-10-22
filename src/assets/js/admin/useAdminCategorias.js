
import { useState } from "react";
import {
    categoriasIniciales,
    coloresIniciales
} from "../../../data/categoriasIniciales";
import { images } from "../../../data/imagenes";

function crearSlug(nombre) {
    return nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
}

function normalizarCategoria(categoria, indice) {
    // Compatibilidad con las categorías antiguas que eran textos.
    if (typeof categoria === "string") {
        const inicial = categoriasIniciales.find(
            item => item.nombre.toLowerCase() === categoria.toLowerCase()
        );

        if (inicial) {
            return { ...inicial };
        }

        return {
            id: indice + 1,
            nombre: categoria,
            descripcion: "",
            imagen: "placeholder"
        };
    }

    const inicial = categoriasIniciales.find(
        item =>
            item.nombre.toLowerCase() ===
            String(categoria?.nombre ?? "").toLowerCase()
    );

    const imagenValida =
        typeof categoria?.imagen === "string" &&
        Object.hasOwn(images, categoria.imagen);

    return {
        id: categoria?.id ?? indice + 1,
        nombre: categoria?.nombre ?? "",
        descripcion: categoria?.descripcion ?? "",
        imagen: imagenValida
            ? categoria.imagen
            : inicial?.imagen ?? "placeholder"
    };
}

function cargarCategorias() {
    try {
        const guardadas = localStorage.getItem("categorias");

        if (guardadas === null) {
            localStorage.setItem(
                "categorias",
                JSON.stringify(categoriasIniciales)
            );

            return categoriasIniciales.map(categoria => ({
                ...categoria
            }));
        }

        const datos = JSON.parse(guardadas);

        if (!Array.isArray(datos)) {
            return categoriasIniciales.map(categoria => ({
                ...categoria
            }));
        }

        const categorias = datos.map(normalizarCategoria);

        // Guarda la nueva estructura si había datos antiguos.
        localStorage.setItem("categorias", JSON.stringify(categorias));

        return categorias;
    } catch (error) {
        console.error("Error al cargar categorías:", error);

        return categoriasIniciales.map(categoria => ({
            ...categoria
        }));
    }
}

function cargarOpciones(clave, iniciales) {
    try {
        const guardadas = localStorage.getItem(clave);

        if (guardadas !== null) {
            const datos = JSON.parse(guardadas);

            if (Array.isArray(datos)) {
                return datos;
            }
        }

        localStorage.setItem(clave, JSON.stringify(iniciales));
        return iniciales;
    } catch (error) {
        console.error(`Error al cargar ${clave}:`, error);
        return iniciales;
    }
}

function useAdminCategorias() {
    const [categorias, setCategorias] = useState(cargarCategorias);

    const [colores, setColores] = useState(
        () => cargarOpciones("colores", coloresIniciales)
    );

    const [formulario, setFormulario] = useState({
        nombre: "",
        descripcion: "",
        imagen: ""
    });

    const [editandoId, setEditandoId] = useState(null);
    const [nuevoColor, setNuevoColor] = useState("");
    const [mensaje, setMensaje] = useState("");

    function actualizarFormulario(campo, valor) {
        setFormulario(actual => ({
            ...actual,
            [campo]: valor
        }));
    }

    function guardarCategorias(actualizadas) {
        setCategorias(actualizadas);
        localStorage.setItem("categorias", JSON.stringify(actualizadas));
    }

    function guardarColores(actualizados) {
        setColores(actualizados);
        localStorage.setItem("colores", JSON.stringify(actualizadas));
    }

    function guardarCategoria(evento) {
        evento.preventDefault();

        const nombre = formulario.nombre.trim();
        const descripcion = formulario.descripcion.trim();
        const imagen = formulario.imagen;

        if (!nombre || !descripcion || !imagen) {
            setMensaje(
                "Debes ingresar el nombre, la descripción y seleccionar una imagen."
            );
            return;
        }

        if (!Object.hasOwn(images, imagen)) {
            setMensaje("Selecciona una imagen válida.");
            return;
        }

        const slug = crearSlug(nombre);

        const duplicada = categorias.some(
            categoria =>
                categoria.id !== editandoId &&
                crearSlug(categoria.nombre) === slug
        );

        if (duplicada) {
            setMensaje("Ya existe una categoría con ese nombre.");
            return;
        }

        if (editandoId !== null) {
            const categoriaAnterior = categorias.find(
                categoria => categoria.id === editandoId
            );

            const actualizadas = categorias.map(categoria =>
                categoria.id === editandoId
                    ? {
                        ...categoria,
                        nombre,
                        descripcion,
                        imagen
                    }
                    : categoria
            );

            // Si cambia el nombre, actualizamos también los productos.
            if (
                categoriaAnterior &&
                crearSlug(categoriaAnterior.nombre) !== slug
            ) {
                try {
                    const productos = JSON.parse(
                        localStorage.getItem("productos") || "[]"
                    );

                    const productosActualizados = productos.map(producto => {
                        if (
                            crearSlug(producto.categoria ?? "") ===
                            crearSlug(categoriaAnterior.nombre)
                        ) {
                            return {
                                ...producto,
                                categoria: slug
                            };
                        }

                        return producto;
                    });

                    localStorage.setItem(
                        "productos",
                        JSON.stringify(productosActualizados)
                    );
                } catch (error) {
                    console.error(
                        "Error al actualizar las categorías de los productos:",
                        error
                    );

                    setMensaje(
                        "No se pudieron actualizar los productos. Intenta nuevamente."
                    );
                    return;
                }
            }

            guardarCategorias(actualizadas);
            setMensaje("Categoría modificada correctamente.");
        } else {
            const nuevoId = categorias.length > 0
                ? Math.max(...categorias.map(categoria => Number(categoria.id) || 0)) + 1
                : 1;

            const nueva = {
                id: nuevoId,
                nombre,
                descripcion,
                imagen
            };

            guardarCategorias([...categorias, nueva]);
            setMensaje("Categoría agregada correctamente.");
        }

        cancelarEdicion();
    }

    function comenzarEdicion(categoria) {
        setEditandoId(categoria.id);

        setFormulario({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion,
            imagen: categoria.imagen
        });

        setMensaje("");
    }

    function cancelarEdicion() {
        setEditandoId(null);

        setFormulario({
            nombre: "",
            descripcion: "",
            imagen: ""
        });
    }

    function eliminarCategoria(id) {
        const categoria = categorias.find(item => item.id === id);

        if (!categoria) {
            return;
        }

        let productos;

        try {
            productos = JSON.parse(
                localStorage.getItem("productos") || "[]"
            );
        } catch (error) {
            console.error("Error al leer los productos:", error);
            setMensaje("No se pudieron comprobar los productos asociados.");
            return;
        }

        const estaEnUso = productos.some(
            producto =>
                crearSlug(producto.categoria ?? "") ===
                crearSlug(categoria.nombre)
        );

        if (estaEnUso) {
            setMensaje(
                `No puedes eliminar "${categoria.nombre}" porque hay productos que la utilizan.`
            );
            return;
        }

        const actualizadas = categorias.filter(
            item => item.id !== id
        );

        guardarCategorias(actualizadas);

        if (editandoId === id) {
            cancelarEdicion();
        }

        setMensaje("Categoría eliminada correctamente.");
    }

    function agregarColor(evento) {
        evento.preventDefault();

        const nombre = nuevoColor.trim().toLowerCase();

        if (!nombre) {
            setMensaje("Escribe un nombre para el color.");
            return;
        }

        if (colores.some(color => color.toLowerCase() === nombre)) {
            setMensaje("Ese color ya existe.");
            return;
        }

        guardarColores([...colores, nombre]);
        setNuevoColor("");
        setMensaje("Color agregado correctamente.");
    }

    function eliminarColor(nombre) {
        let productos;

        try {
            productos = JSON.parse(
                localStorage.getItem("productos") || "[]"
            );
        } catch (error) {
            console.error("Error al leer los productos:", error);
            setMensaje("No se pudieron comprobar los productos.");
            return;
        }

        if (
            productos.some(
                producto =>
                    producto.color?.toLowerCase() === nombre.toLowerCase()
            )
        ) {
            setMensaje(
                `No puedes eliminar "${nombre}" porque hay productos que lo utilizan.`
            );
            return;
        }

        guardarColores(
            colores.filter(color => color !== nombre)
        );

        setMensaje("Color eliminado correctamente.");
    }

    return {
        categorias,
        colores,
        formulario,
        actualizarFormulario,
        editandoId,
        mensaje,
        guardarCategoria,
        comenzarEdicion,
        cancelarEdicion,
        eliminarCategoria,
        nuevoColor,
        setNuevoColor,
        agregarColor,
        eliminarColor
    };
}

export default useAdminCategorias;
