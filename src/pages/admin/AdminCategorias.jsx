
import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
    categoriasIniciales,
    coloresIniciales
} from "../../data/categoriasIniciales";

function cargarOpciones(clave, iniciales) {
    const guardadas = localStorage.getItem(clave);

    if (guardadas !== null) {
        return JSON.parse(guardadas);
    }

    localStorage.setItem(clave, JSON.stringify(iniciales));
    return iniciales;
}

function AdminCategorias() {
    const [categorias, setCategorias] = useState(
        () => cargarOpciones("categorias", categoriasIniciales)
    );

    const [colores, setColores] = useState(
        () => cargarOpciones("colores", coloresIniciales)
    );

    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [nuevoColor, setNuevoColor] = useState("");
    const [editando, setEditando] = useState(null);
    const [nombreEdicion, setNombreEdicion] = useState("");
    const [mensaje, setMensaje] = useState("");

    function guardarOpciones(clave, opciones) {
        localStorage.setItem(clave, JSON.stringify(opciones));
    }

    function agregarOpcion(tipo) {
        const esCategoria = tipo === "categorias";
        const nombre = (
            esCategoria ? nuevaCategoria : nuevoColor
        ).trim().toLowerCase();

        const opciones = esCategoria ? categorias : colores;

        if (!nombre) {
            setMensaje("Escribe un nombre antes de agregar.");
            return;
        }

        if (opciones.some(opcion => opcion.toLowerCase() === nombre)) {
            setMensaje("Esa opción ya existe.");
            return;
        }

        const actualizadas = [...opciones, nombre];

        if (esCategoria) {
            setCategorias(actualizadas);
            setNuevaCategoria("");
        } else {
            setColores(actualizadas);
            setNuevoColor("");
        }

        guardarOpciones(tipo, actualizadas);
        setMensaje("Opción agregada correctamente.");
    }

    function comenzarEdicion(tipo, nombre) {
        setEditando({ tipo, nombre });
        setNombreEdicion(nombre);
        setMensaje("");
    }

    function guardarEdicion() {
        if (!editando) return;

        const nuevoNombre = nombreEdicion.trim().toLowerCase();

        if (!nuevoNombre) {
            setMensaje("El nombre no puede estar vacío.");
            return;
        }

        const opciones = editando.tipo === "categorias"
            ? categorias
            : colores;

        if (
            opciones.some(opcion =>
                opcion !== editando.nombre &&
                opcion.toLowerCase() === nuevoNombre
            )
        ) {
            setMensaje("Ya existe una opción con ese nombre.");
            return;
        }

        if (nuevoNombre === editando.nombre) {
            setEditando(null);
            return;
        }

        const productos = JSON.parse(
            localStorage.getItem("productos") || "[]"
        );

        const campo = editando.tipo === "categorias"
            ? "categoria"
            : "color";

        const productosActualizados = productos.map(producto => {
            if (producto[campo] === editando.nombre) {
                return { ...producto, [campo]: nuevoNombre };
            }

            return producto;
        });

        localStorage.setItem(
            "productos",
            JSON.stringify(productosActualizados)
        );

        const actualizadas = opciones.map(opcion =>
            opcion === editando.nombre ? nuevoNombre : opcion
        );

        if (editando.tipo === "categorias") {
            setCategorias(actualizadas);
        } else {
            setColores(actualizadas);
        }

        guardarOpciones(editando.tipo, actualizadas);
        setEditando(null);
        setMensaje("Opción modificada correctamente.");
    }

    function eliminarOpcion(tipo, nombre) {
        const productos = JSON.parse(
            localStorage.getItem("productos") || "[]"
        );

        const campo = tipo === "categorias" ? "categoria" : "color";

        const estaEnUso = productos.some(
            producto => producto[campo] === nombre
        );

        if (estaEnUso) {
            setMensaje(
                `No puedes eliminar "${nombre}" porque hay productos que la utilizan.`
            );
            return;
        }

        const opciones = tipo === "categorias" ? categorias : colores;

        const actualizadas = opciones.filter(
            opcion => opcion !== nombre
        );

        if (tipo === "categorias") {
            setCategorias(actualizadas);
        } else {
            setColores(actualizadas);
        }

        guardarOpciones(tipo, actualizadas);
        setMensaje("Opción eliminada correctamente.");
    }

    function mostrarNombre(nombre) {
        return nombre.charAt(0).toUpperCase() + nombre.slice(1);
    }

    function mostrarLista(tipo, opciones) {
        return (
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        {tipo === "categorias" ? "Categorías" : "Colores"}
                    </h5>

                    {opciones.length === 0 ? (
                        <p className="text-muted">
                            No hay opciones registradas.
                        </p>
                    ) : (
                        <ul className="list-group list-group-flush">
                            {opciones.map(nombre => (
                                <li
                                    key={nombre}
                                    className="list-group-item d-flex justify-content-between align-items-center gap-2"
                                >
                                    <span>{mostrarNombre(nombre)}</span>

                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() =>
                                                comenzarEdicion(tipo, nombre)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() =>
                                                eliminarOpcion(tipo, nombre)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {editando && editando.tipo === tipo && (
                        <div className="mt-3">
                            <label className="form-label">
                                Nuevo nombre
                            </label>

                            <input
                                className="form-control mb-2"
                                value={nombreEdicion}
                                onChange={evento =>
                                    setNombreEdicion(evento.target.value)
                                }
                            />

                            <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={guardarEdicion}
                            >
                                Guardar
                            </button>

                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEditando(null)}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 bg-light p-4 p-md-5">
                        <h1 className="fw-bold">Categorías y colores</h1>

                        <p className="text-muted mb-4">
                            Administra las opciones disponibles para los
                            productos y los filtros de la tienda.
                        </p>

                        {mensaje && (
                            <div className="alert alert-info" role="status">
                                {mensaje}
                            </div>
                        )}

                        <div className="row">
                            <div className="col-lg-6">
                                {mostrarLista("categorias", categorias)}

                                <form
                                    className="card border-0 shadow-sm mb-4"
                                    onSubmit={evento => {
                                        evento.preventDefault();
                                        agregarOpcion("categorias");
                                    }}
                                >
                                    <div className="card-body">
                                        <h5>Agregar categoría</h5>

                                        <label className="form-label">
                                            Nombre
                                        </label>

                                        <input
                                            className="form-control mb-3"
                                            placeholder="Ej.: calcetines"
                                            value={nuevaCategoria}
                                            onChange={evento =>
                                                setNuevaCategoria(evento.target.value)
                                            }
                                        />

                                        <button className="btn btn-primary">
                                            Agregar categoría
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="col-lg-6">
                                {mostrarLista("colores", colores)}

                                <form
                                    className="card border-0 shadow-sm mb-4"
                                    onSubmit={evento => {
                                        evento.preventDefault();
                                        agregarOpcion("colores");
                                    }}
                                >
                                    <div className="card-body">
                                        <h5>Agregar color</h5>

                                        <label className="form-label">
                                            Nombre
                                        </label>

                                        <input
                                            className="form-control mb-3"
                                            placeholder="Ej.: azul"
                                            value={nuevoColor}
                                            onChange={evento =>
                                                setNuevoColor(evento.target.value)
                                            }
                                        />

                                        <button className="btn btn-primary">
                                            Agregar color
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminCategorias;
