
import AdminSidebar from "../../components/admin/AdminSidebar";
import useAdminCategorias from "../../assets/js/admin/useAdminCategorias";
import {
    TIPOS_ATRIBUTO,
    obtenerRutaImagen
} from "../../assets/js/tienda/catalogo";
import { images } from "../../data/imagenes";

function mostrarNombre(nombre) {
    if (!nombre) return "";

    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

function AdminCategorias() {
    const {
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
    } = useAdminCategorias();

    // Evita enviar el formulario al presionar Enter dentro del campo de tallas.
    function manejarTeclaTalla(evento) {
        if (evento.key === "Enter") {
            agregarTalla(evento);
        }
    }

    const imagenSeleccionada = formulario.imagen
        && Object.hasOwn(images, formulario.imagen)
        ? formulario.imagen
        : "";

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 admin-contenido p-4 p-md-5">
                        <h1 className="admin-titulo">
                            Categorías y colores
                        </h1>

                        <p className="admin-subtitulo mb-4">
                            Define cada categoría con sus tallas, atributos y
                            medidas. Los formularios de productos se generan
                            automáticamente a partir de esta configuración.
                        </p>

                        {mensaje && (
                            <div className="alert alert-info" role="status">
                                {mensaje}
                            </div>
                        )}

                        <div className="row">
                            <div className="col-xl-7">
                                <form
                                    className="admin-tarjeta mb-4"
                                    onSubmit={guardarCategoria}
                                >
                                    <h2 className="admin-tarjeta-titulo">
                                        {editandoId !== null
                                            ? "Editar categoría"
                                            : "Agregar categoría"}
                                    </h2>

                                    {/* DATOS GENERALES */}
                                    <div className="mb-3">
                                        <label
                                            htmlFor="categoriaNombre"
                                            className="form-label"
                                        >
                                            Nombre
                                        </label>

                                        <input
                                            id="categoriaNombre"
                                            type="text"
                                            className="form-control"
                                            placeholder="Ej.: Pantalones"
                                            value={formulario.nombre}
                                            onChange={evento =>
                                                actualizarFormulario(
                                                    "nombre",
                                                    evento.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="categoriaDescripcion"
                                            className="form-label"
                                        >
                                            Descripción
                                        </label>

                                        <textarea
                                            id="categoriaDescripcion"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Describe esta categoría"
                                            value={formulario.descripcion}
                                            onChange={evento =>
                                                actualizarFormulario(
                                                    "descripcion",
                                                    evento.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    {/* IMAGEN */}
                                    <fieldset className="admin-bloque mb-3">
                                        <legend className="admin-bloque-titulo">
                                            Imagen de la categoría
                                        </legend>

                                        <div className="row g-3 align-items-start">
                                            <div className="col-sm-7">
                                                <label
                                                    htmlFor="categoriaArchivo"
                                                    className="form-label"
                                                >
                                                    Subir desde tu dispositivo
                                                </label>

                                                <input
                                                    id="categoriaArchivo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control mb-3"
                                                    onChange={subirImagen}
                                                />

                                                <label
                                                    htmlFor="categoriaImagen"
                                                    className="form-label"
                                                >
                                                    O usar una imagen existente
                                                </label>

                                                <select
                                                    id="categoriaImagen"
                                                    className="form-select"
                                                    value={imagenSeleccionada}
                                                    onChange={evento =>
                                                        actualizarFormulario(
                                                            "imagen",
                                                            evento.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Selecciona una imagen
                                                    </option>

                                                    {Object.keys(images).map(nombre => (
                                                        <option
                                                            key={nombre}
                                                            value={nombre}
                                                        >
                                                            {mostrarNombre(nombre)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-sm-5">
                                                <p className="form-label">
                                                    Vista previa
                                                </p>

                                                {formulario.imagen ? (
                                                    <img
                                                        src={obtenerRutaImagen(
                                                            formulario.imagen
                                                        )}
                                                        alt="Vista previa de la categoría"
                                                        className="admin-vista-previa"
                                                    />
                                                ) : (
                                                    <div className="admin-vista-previa admin-vista-previa-vacia">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </fieldset>

                                    {/* TALLAS */}
                                    <fieldset className="admin-bloque mb-3">
                                        <legend className="admin-bloque-titulo">
                                            Tallas disponibles
                                        </legend>

                                        <p className="admin-ayuda">
                                            Puedes usar cualquier sistema: XS, S, M;
                                            38, 40, 42; 35-38; o &quot;Única&quot;.
                                            Separa varias tallas con coma.
                                        </p>

                                        {formulario.tallas.length === 0 ? (
                                            <p className="text-muted small">
                                                Aún no hay tallas.
                                            </p>
                                        ) : (
                                            <ul className="admin-chips">
                                                {formulario.tallas.map(talla => (
                                                    <li
                                                        key={talla}
                                                        className="admin-chip"
                                                    >
                                                        {talla}

                                                        <button
                                                            type="button"
                                                            className="admin-chip-quitar"
                                                            aria-label={`Quitar talla ${talla}`}
                                                            onClick={() =>
                                                                eliminarTalla(talla)
                                                            }
                                                        >
                                                            ×
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ej.: XL o 39-42"
                                                aria-label="Nueva talla"
                                                value={nuevaTalla}
                                                onChange={evento =>
                                                    setNuevaTalla(evento.target.value)
                                                }
                                                onKeyDown={manejarTeclaTalla}
                                            />

                                            <button
                                                type="button"
                                                className="btn btn-outline-dark"
                                                onClick={agregarTalla}
                                            >
                                                Agregar talla
                                            </button>
                                        </div>
                                    </fieldset>

                                    {/* ATRIBUTOS */}
                                    <fieldset className="admin-bloque mb-3">
                                        <legend className="admin-bloque-titulo">
                                            Atributos de la categoría
                                        </legend>

                                        <p className="admin-ayuda">
                                            Características propias de esta categoría,
                                            como el tipo de manga o el tipo de corte.
                                        </p>

                                        {formulario.atributos.length === 0 && (
                                            <p className="text-muted small">
                                                Esta categoría no tiene atributos.
                                            </p>
                                        )}

                                        {formulario.atributos.map(atributo => (
                                            <div
                                                key={atributo.clave}
                                                className="admin-fila-config"
                                            >
                                                <div className="row g-2">
                                                    <div className="col-md-6">
                                                        <label className="form-label">
                                                            Nombre del atributo
                                                        </label>

                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Ej.: Tipo de corte"
                                                            value={atributo.nombre}
                                                            onChange={evento =>
                                                                actualizarAtributo(
                                                                    atributo.clave,
                                                                    "nombre",
                                                                    evento.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label className="form-label">
                                                            Tipo de dato
                                                        </label>

                                                        <select
                                                            className="form-select"
                                                            value={atributo.tipo}
                                                            onChange={evento =>
                                                                actualizarAtributo(
                                                                    atributo.clave,
                                                                    "tipo",
                                                                    evento.target.value
                                                                )
                                                            }
                                                        >
                                                            {TIPOS_ATRIBUTO.map(tipo => (
                                                                <option
                                                                    key={tipo.valor}
                                                                    value={tipo.valor}
                                                                >
                                                                    {tipo.etiqueta}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {atributo.tipo === "seleccion" && (
                                                        <div className="col-12">
                                                            <label className="form-label">
                                                                Opciones (separadas por coma)
                                                            </label>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Ej.: Recto, Slim, Ancho"
                                                                value={atributo.opcionesTexto}
                                                                onChange={evento =>
                                                                    actualizarAtributo(
                                                                        atributo.clave,
                                                                        "opcionesTexto",
                                                                        evento.target.value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="col-12 d-flex justify-content-between align-items-center">
                                                        <div className="form-check">
                                                            <input
                                                                id={`obligatorio-${atributo.clave}`}
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={atributo.obligatorio}
                                                                onChange={evento =>
                                                                    actualizarAtributo(
                                                                        atributo.clave,
                                                                        "obligatorio",
                                                                        evento.target.checked
                                                                    )
                                                                }
                                                            />

                                                            <label
                                                                htmlFor={`obligatorio-${atributo.clave}`}
                                                                className="form-check-label"
                                                            >
                                                                Obligatorio
                                                            </label>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() =>
                                                                eliminarAtributo(atributo.clave)
                                                            }
                                                        >
                                                            Eliminar atributo
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            className="btn btn-outline-dark btn-sm"
                                            onClick={agregarAtributo}
                                        >
                                            + Agregar atributo
                                        </button>
                                    </fieldset>

                                    {/* MEDIDAS */}
                                    <fieldset className="admin-bloque mb-4">
                                        <legend className="admin-bloque-titulo">
                                            Medidas de la categoría
                                        </legend>

                                        <p className="admin-ayuda">
                                            Indica qué medidas se registran en cada talla
                                            del producto y cuáles se solicitan al cliente
                                            para el comparador.
                                        </p>

                                        {formulario.medidas.length === 0 && (
                                            <p className="text-muted small">
                                                Esta categoría no tiene medidas.
                                            </p>
                                        )}

                                        {formulario.medidas.map(medida => (
                                            <div
                                                key={medida.clave}
                                                className="admin-fila-config"
                                            >
                                                <div className="row g-2">
                                                    <div className="col-md-8">
                                                        <label className="form-label">
                                                            Nombre de la medida
                                                        </label>

                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Ej.: Contorno de cintura"
                                                            value={medida.nombre}
                                                            onChange={evento =>
                                                                actualizarMedida(
                                                                    medida.clave,
                                                                    "nombre",
                                                                    evento.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label">
                                                            Unidad
                                                        </label>

                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="cm"
                                                            value={medida.unidad}
                                                            onChange={evento =>
                                                                actualizarMedida(
                                                                    medida.clave,
                                                                    "unidad",
                                                                    evento.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-12 d-flex flex-wrap justify-content-between align-items-center gap-2">
                                                        <div className="d-flex flex-wrap gap-3">
                                                            <div className="form-check">
                                                                <input
                                                                    id={`cliente-${medida.clave}`}
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={medida.solicitarCliente}
                                                                    onChange={evento =>
                                                                        actualizarMedida(
                                                                            medida.clave,
                                                                            "solicitarCliente",
                                                                            evento.target.checked
                                                                        )
                                                                    }
                                                                />

                                                                <label
                                                                    htmlFor={`cliente-${medida.clave}`}
                                                                    className="form-check-label"
                                                                >
                                                                    Solicitar al cliente
                                                                </label>
                                                            </div>

                                                            <div className="form-check">
                                                                <input
                                                                    id={`producto-${medida.clave}`}
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={medida.registrarProducto}
                                                                    onChange={evento =>
                                                                        actualizarMedida(
                                                                            medida.clave,
                                                                            "registrarProducto",
                                                                            evento.target.checked
                                                                        )
                                                                    }
                                                                />

                                                                <label
                                                                    htmlFor={`producto-${medida.clave}`}
                                                                    className="form-check-label"
                                                                >
                                                                    Registrar en cada producto
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() =>
                                                                eliminarMedida(medida.clave)
                                                            }
                                                        >
                                                            Eliminar medida
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            className="btn btn-outline-dark btn-sm"
                                            onClick={agregarMedida}
                                        >
                                            + Agregar medida
                                        </button>
                                    </fieldset>

                                    <button
                                        type="submit"
                                        className="btn btn-primary me-2"
                                    >
                                        {editandoId !== null
                                            ? "Guardar cambios"
                                            : "Agregar categoría"}
                                    </button>

                                    {editandoId !== null && (
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={cancelarEdicion}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </form>
                            </div>

                            <div className="col-xl-5">
                                <div className="admin-tarjeta mb-4">
                                    <h2 className="admin-tarjeta-titulo">
                                        Categorías registradas
                                    </h2>

                                    {categorias.length === 0 ? (
                                        <p className="text-muted">
                                            No hay categorías registradas.
                                        </p>
                                    ) : (
                                        <ul className="admin-lista-categorias">
                                            {categorias.map(categoria => (
                                                <li
                                                    key={categoria.id}
                                                    className="admin-categoria-item"
                                                >
                                                    <img
                                                        src={obtenerRutaImagen(
                                                            categoria.imagen
                                                        )}
                                                        alt={categoria.nombre}
                                                        className="admin-categoria-imagen"
                                                    />

                                                    <div className="admin-categoria-info">
                                                        <h3>{categoria.nombre}</h3>

                                                        <p>{categoria.descripcion}</p>

                                                        <small>
                                                            {categoria.tallas.length} talla(s) ·{" "}
                                                            {categoria.atributos.length} atributo(s) ·{" "}
                                                            {categoria.medidas.length} medida(s)
                                                        </small>
                                                    </div>

                                                    <div className="admin-categoria-acciones">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={() =>
                                                                comenzarEdicion(categoria)
                                                            }
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() =>
                                                                eliminarCategoria(categoria.id)
                                                            }
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="admin-tarjeta mb-4">
                                    <h2 className="admin-tarjeta-titulo">
                                        Colores registrados
                                    </h2>

                                    {colores.length === 0 ? (
                                        <p className="text-muted">
                                            No hay colores registrados.
                                        </p>
                                    ) : (
                                        <ul className="list-group list-group-flush mb-3">
                                            {colores.map(color => (
                                                <li
                                                    key={color}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                >
                                                    {mostrarNombre(color)}

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() =>
                                                            eliminarColor(color)
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <form onSubmit={agregarColor}>
                                        <label
                                            htmlFor="nuevoColor"
                                            className="form-label"
                                        >
                                            Nuevo color
                                        </label>

                                        <input
                                            id="nuevoColor"
                                            type="text"
                                            className="form-control mb-3"
                                            placeholder="Ej.: azul"
                                            value={nuevoColor}
                                            onChange={evento =>
                                                setNuevoColor(evento.target.value)
                                            }
                                            required
                                        />

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Agregar color
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminCategorias;
