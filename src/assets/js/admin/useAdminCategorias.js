
import { useState } from "react";
import {
    cargarCategorias,
    cargarColores,
    cargarProductos,
    crearIdentificador,
    crearSlug,
    guardarCategorias as guardarCategoriasAlmacenadas,
    guardarJSON,
    leerImagenComoDataUrl
} from "../tienda/catalogo";
import { images } from "../../../data/imagenes";

let contadorClaves = 0;

function nuevaClave() {
    contadorClaves += 1;
    return `fila-${contadorClaves}`;
}

function crearFormularioVacio() {
    return {
        nombre: "",
        descripcion: "",
        imagen: "",
        tallas: [],
        atributos: [],
        medidas: []
    };
}

// Convierte una categoría guardada en datos editables del formulario.
function crearFormulario(categoria) {
    return {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        imagen: categoria.imagen,
        tallas: [...categoria.tallas],
        atributos: categoria.atributos.map(atributo => ({
            ...atributo,
            clave: nuevaClave(),
            opcionesTexto: atributo.opciones.join(", ")
        })),
        medidas: categoria.medidas.map(medida => ({
            ...medida,
            clave: nuevaClave()
        }))
    };
}

// Genera un id único dentro de la categoría a partir del nombre.
function generarIdUnico(nombre, usados, respaldo) {
    const base = crearIdentificador(nombre) || respaldo;
    let id = base;
    let numero = 2;

    while (usados.has(id)) {
        id = `${base}_${numero}`;
        numero += 1;
    }

    usados.add(id);
    return id;
}

function useAdminCategorias() {
    const [categorias, setCategorias] = useState(cargarCategorias);
    const [colores, setColores] = useState(cargarColores);
    const [formulario, setFormulario] = useState(crearFormularioVacio);
    const [editandoId, setEditandoId] = useState(null);
    const [nuevaTalla, setNuevaTalla] = useState("");
    const [nuevoColor, setNuevoColor] = useState("");
    const [mensaje, setMensaje] = useState("");

    function actualizarFormulario(campo, valor) {
        setFormulario(actual => ({
            ...actual,
            [campo]: valor
        }));
    }

    function guardarCategorias(actualizadas) {
        if (!guardarCategoriasAlmacenadas(actualizadas)) {
            setMensaje("No se pudo guardar. El almacenamiento puede estar lleno.");
            return false;
        }

        setCategorias(actualizadas);
        return true;
    }

    function guardarColores(actualizados) {
        guardarJSON("colores", actualizados);
        setColores(actualizados);
    }

    /* ---------------- Imagen ---------------- */

    async function subirImagen(evento) {
        const archivo = evento.target.files[0];

        if (!archivo) {
            return;
        }

        try {
            const imagen = await leerImagenComoDataUrl(archivo, 900);
            actualizarFormulario("imagen", imagen);
            setMensaje("");
        } catch (error) {
            setMensaje(error.message);
        }

        evento.target.value = "";
    }

    /* ---------------- Tallas ---------------- */

    function agregarTalla(evento) {
        evento.preventDefault();

        // Permite escribir varias tallas separadas por coma.
        const nuevas = nuevaTalla
            .split(",")
            .map(talla => talla.trim())
            .filter(Boolean);

        if (nuevas.length === 0) {
            setMensaje("Escribe una talla, por ejemplo: M, 40 o 35-38.");
            return;
        }

        setFormulario(actual => ({
            ...actual,
            tallas: [...new Set([...actual.tallas, ...nuevas])]
        }));

        setNuevaTalla("");
        setMensaje("");
    }

    function eliminarTalla(talla) {
        setFormulario(actual => ({
            ...actual,
            tallas: actual.tallas.filter(item => item !== talla)
        }));
    }

    /* ---------------- Atributos ---------------- */

    function agregarAtributo() {
        setFormulario(actual => ({
            ...actual,
            atributos: [
                ...actual.atributos,
                {
                    clave: nuevaClave(),
                    id: "",
                    nombre: "",
                    tipo: "texto",
                    opciones: [],
                    opcionesTexto: "",
                    obligatorio: false
                }
            ]
        }));
    }

    function actualizarAtributo(clave, campo, valor) {
        setFormulario(actual => ({
            ...actual,
            atributos: actual.atributos.map(atributo =>
                atributo.clave === clave
                    ? { ...atributo, [campo]: valor }
                    : atributo
            )
        }));
    }

    function eliminarAtributo(clave) {
        setFormulario(actual => ({
            ...actual,
            atributos: actual.atributos.filter(
                atributo => atributo.clave !== clave
            )
        }));
    }

    /* ---------------- Medidas ---------------- */

    function agregarMedida() {
        setFormulario(actual => ({
            ...actual,
            medidas: [
                ...actual.medidas,
                {
                    clave: nuevaClave(),
                    id: "",
                    nombre: "",
                    unidad: "cm",
                    solicitarCliente: false,
                    registrarProducto: true
                }
            ]
        }));
    }

    function actualizarMedida(clave, campo, valor) {
        setFormulario(actual => ({
            ...actual,
            medidas: actual.medidas.map(medida =>
                medida.clave === clave
                    ? { ...medida, [campo]: valor }
                    : medida
            )
        }));
    }

    function eliminarMedida(clave) {
        setFormulario(actual => ({
            ...actual,
            medidas: actual.medidas.filter(medida => medida.clave !== clave)
        }));
    }

    /* ---------------- Categorías ---------------- */

    // Valida la configuración y devuelve los atributos y medidas limpios.
    function prepararConfiguracion() {
        const idsAtributos = new Set(
            formulario.atributos.map(atributo => atributo.id).filter(Boolean)
        );

        const atributos = [];

        for (const atributo of formulario.atributos) {
            const nombre = atributo.nombre.trim();

            if (!nombre) {
                return { error: "Todos los atributos deben tener un nombre." };
            }

            const opciones = [
                ...new Set(
                    atributo.opcionesTexto
                        .split(",")
                        .map(opcion => opcion.trim())
                        .filter(Boolean)
                )
            ];

            if (atributo.tipo === "seleccion" && opciones.length < 2) {
                return {
                    error: `El atributo "${nombre}" necesita al menos dos opciones separadas por coma.`
                };
            }

            atributos.push({
                id: atributo.id || generarIdUnico(nombre, idsAtributos, "atributo"),
                nombre,
                tipo: atributo.tipo,
                opciones: atributo.tipo === "seleccion" ? opciones : [],
                obligatorio: atributo.obligatorio
            });
        }

        const idsMedidas = new Set(
            formulario.medidas.map(medida => medida.id).filter(Boolean)
        );

        const medidas = [];

        for (const medida of formulario.medidas) {
            const nombre = medida.nombre.trim();

            if (!nombre) {
                return { error: "Todas las medidas deben tener un nombre." };
            }

            if (!medida.solicitarCliente && !medida.registrarProducto) {
                return {
                    error: `La medida "${nombre}" debe solicitarse al cliente o registrarse en el producto.`
                };
            }

            medidas.push({
                id: medida.id || generarIdUnico(nombre, idsMedidas, "medida"),
                nombre,
                unidad: medida.unidad.trim() || "cm",
                solicitarCliente: medida.solicitarCliente,
                registrarProducto: medida.registrarProducto
            });
        }

        const nombresAtributos = atributos.map(a => crearSlug(a.nombre));
        const nombresMedidas = medidas.map(m => crearSlug(m.nombre));

        if (new Set(nombresAtributos).size !== nombresAtributos.length) {
            return { error: "No puede haber dos atributos con el mismo nombre." };
        }

        if (new Set(nombresMedidas).size !== nombresMedidas.length) {
            return { error: "No puede haber dos medidas con el mismo nombre." };
        }

        return { atributos, medidas };
    }

    function cancelarEdicion() {
        setEditandoId(null);
        setFormulario(crearFormularioVacio());
        setNuevaTalla("");
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

        const imagenValida =
            imagen.startsWith("data:image/") || Object.hasOwn(images, imagen);

        if (!imagenValida) {
            setMensaje("Selecciona una imagen válida.");
            return;
        }

        if (formulario.tallas.length === 0) {
            setMensaje(
                "Agrega al menos una talla (usa \"Única\" si la prenda no tiene tallas)."
            );
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

        const configuracion = prepararConfiguracion();

        if (configuracion.error) {
            setMensaje(configuracion.error);
            return;
        }

        const datos = {
            nombre,
            descripcion,
            imagen,
            tallas: formulario.tallas,
            atributos: configuracion.atributos,
            medidas: configuracion.medidas
        };

        if (editandoId !== null) {
            // Los productos se relacionan por categoriaId, por lo que
            // renombrar la categoría no afecta a sus productos.
            const actualizadas = categorias.map(categoria =>
                categoria.id === editandoId
                    ? { ...categoria, ...datos }
                    : categoria
            );

            if (!guardarCategorias(actualizadas)) {
                return;
            }

            setMensaje("Categoría modificada correctamente.");
        } else {
            const nuevoId = categorias.length > 0
                ? Math.max(...categorias.map(categoria => Number(categoria.id) || 0)) + 1
                : 1;

            if (!guardarCategorias([...categorias, { id: nuevoId, ...datos }])) {
                return;
            }

            setMensaje("Categoría agregada correctamente.");
        }

        cancelarEdicion();
    }

    function comenzarEdicion(categoria) {
        setEditandoId(categoria.id);
        setFormulario(crearFormulario(categoria));
        setMensaje("");
    }

    function eliminarCategoria(id) {
        const categoria = categorias.find(item => item.id === id);

        if (!categoria) {
            return;
        }

        const productos = cargarProductos(categorias);

        if (productos.some(producto => producto.categoriaId === id)) {
            setMensaje(
                `No puedes eliminar "${categoria.nombre}" porque hay productos que la utilizan.`
            );
            return;
        }

        if (!guardarCategorias(categorias.filter(item => item.id !== id))) {
            return;
        }

        if (editandoId === id) {
            cancelarEdicion();
        }

        setMensaje("Categoría eliminada correctamente.");
    }

    /* ---------------- Colores ---------------- */

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
        const productos = cargarProductos(categorias);

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

        guardarColores(colores.filter(color => color !== nombre));
        setMensaje("Color eliminado correctamente.");
    }

    return {
        categorias,
        colores,
        formulario,
        actualizarFormulario,
        subirImagen,
        nuevaTalla,
        setNuevaTalla,
        agregarTalla,
        eliminarTalla,
        agregarAtributo,
        actualizarAtributo,
        eliminarAtributo,
        agregarMedida,
        actualizarMedida,
        eliminarMedida,
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
