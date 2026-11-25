import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { images } from "../../data/imagenes";
import useAdminEditarProducto from "../../assets/js/admin/useAdminEditarProducto";
import { obtenerRutaImagen } from "../../assets/js/tienda/catalogo";

function mostrarNombre(nombre) {
    if (!nombre) return "";

    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

// Genera el campo de un atributo según su tipo de dato.
function CampoAtributo({ atributo, valor, alCambiar }) {
    const idCampo = `atributo-${atributo.id}`;

    if (atributo.tipo === "booleano") {
        return (
            <div className="form-check form-switch">
                <input
                    id={idCampo}
                    type="checkbox"
                    className="form-check-input"
                    role="switch"
                    checked={Boolean(valor)}
                    onChange={evento => alCambiar(evento.target.checked)}
                />

                <label htmlFor={idCampo} className="form-check-label">
                    {atributo.nombre}
                </label>
            </div>
        );
    }

    return (
        <>
            <label htmlFor={idCampo} className="form-label">
                {atributo.nombre}
                {atributo.obligatorio ? " *" : ""}
            </label>

            {atributo.tipo === "seleccion" ? (
                <select
                    id={idCampo}
                    className="form-select"
                    value={valor ?? ""}
                    onChange={evento => alCambiar(evento.target.value)}
                    required={atributo.obligatorio}
                >
                    <option value="">Seleccionar</option>

                    {atributo.opciones.map(opcion => (
                        <option key={opcion} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={idCampo}
                    type={atributo.tipo === "numero" ? "number" : "text"}
                    className="form-control"
                    value={valor ?? ""}
                    onChange={evento => alCambiar(evento.target.value)}
                    required={atributo.obligatorio}
                />
            )}
        </>
    );
}

function AdminEditarProducto() {
    const {
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
        guardarProducto
    } = useAdminEditarProducto();

    // Si el color guardado ya no está en la lista, se mantiene visible.
    const opcionesColor = formulario.color && !colores.includes(formulario.color)
        ? [...colores, formulario.color]
        : colores;

    const imagenExistente = Object.hasOwn(images, formulario.imagen)
        ? formulario.imagen
        : "";

    const medidasProducto = categoria
        ? categoria.medidas.filter(medida => medida.registrarProducto)
        : [];

    return (
        <div className="pagina-admin">
            <div className="container-fluid">
                <div className="row min-vh-100">

                    <AdminSidebar />

                    <main className="col-md-9 col-lg-10 admin-contenido p-4 p-md-5">

                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                            <div>
                                <h1 className="admin-titulo">
                                    {producto
                                        ? "Editar producto"
                                        : "Agregar producto"}
                                </h1>

                                <p className="admin-subtitulo mb-0">
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
                            <div className="admin-tarjeta">
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
                        ) : (
                            <div className="admin-tarjeta">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={guardarProducto}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="nombre" className="form-label">
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

                                        <div className="col-md-6">
                                            <label htmlFor="categoriaId" className="form-label">
                                                Categoría
                                            </label>

                                            <select
                                                className="form-select"
                                                id="categoriaId"
                                                name="categoriaId"
                                                value={formulario.categoriaId}
                                                onChange={actualizarCategoria}
                                                required
                                            >
                                                <option value="">
                                                    Seleccionar categoría
                                                </option>

                                                {categorias.map(opcion => (
                                                    <option
                                                        key={opcion.id}
                                                        value={String(opcion.id)}
                                                    >
                                                        {opcion.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label htmlFor="precio" className="form-label">
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

                                        <div className="col-md-4">
                                            <label htmlFor="color" className="form-label">
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

                                                {opcionesColor.map(color => (
                                                    <option key={color} value={color}>
                                                        {mostrarNombre(color)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label htmlFor="descuento" className="form-label">
                                                Descuento (%)
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                id="descuento"
                                                name="descuento"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value={formulario.descuento}
                                                onChange={actualizarCampo}
                                            />
                                        </div>
                                    </div>

                                    {!categoria && (
                                        <p className="admin-ayuda mt-4 mb-0">
                                            Selecciona una categoría para ver sus
                                            atributos, tallas y medidas.
                                        </p>
                                    )}

                                    {/* ATRIBUTOS DE LA CATEGORÍA */}
                                    {categoria && categoria.atributos.length > 0 && (
                                        <fieldset className="admin-bloque mt-4">
                                            <legend className="admin-bloque-titulo">
                                                Atributos de {categoria.nombre}
                                            </legend>

                                            <div className="row g-3">
                                                {categoria.atributos.map(atributo => (
                                                    <div
                                                        key={atributo.id}
                                                        className="col-md-6"
                                                    >
                                                        <CampoAtributo
                                                            atributo={atributo}
                                                            valor={formulario.atributos[atributo.id]}
                                                            alCambiar={valor =>
                                                                actualizarAtributo(
                                                                    atributo.id,
                                                                    valor
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </fieldset>
                                    )}

                                    {/* TALLAS, STOCK Y MEDIDAS */}
                                    {categoria && (
                                        <fieldset className="admin-bloque mt-4">
                                            <legend className="admin-bloque-titulo">
                                                Tallas, stock y medidas
                                            </legend>

                                            {tallasDisponibles.length === 0 ? (
                                                <p className="text-danger mb-0">
                                                    Esta categoría no tiene tallas.
                                                    Agrégalas desde la página de categorías.
                                                </p>
                                            ) : (
                                                <>
                                                    {!tallaUnica && (
                                                        <div className="admin-tallas-selector">
                                                            {tallasDisponibles.map(talla => (
                                                                <div
                                                                    key={talla}
                                                                    className="form-check form-check-inline"
                                                                >
                                                                    <input
                                                                        id={`talla-${talla}`}
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        checked={Boolean(formulario.tallas[talla])}
                                                                        onChange={() =>
                                                                            alternarTalla(talla)
                                                                        }
                                                                    />

                                                                    <label
                                                                        htmlFor={`talla-${talla}`}
                                                                        className="form-check-label"
                                                                    >
                                                                        {talla}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {Object.keys(formulario.tallas).length === 0 && (
                                                        <p className="admin-ayuda mb-0">
                                                            Selecciona las tallas que tendrá el producto.
                                                        </p>
                                                    )}

                                                    <div className="row g-3">
                                                        {tallasDisponibles
                                                            .filter(talla => formulario.tallas[talla])
                                                            .map(talla => (
                                                                <div
                                                                    key={talla}
                                                                    className="col-lg-6"
                                                                >
                                                                    <div className="admin-variante">
                                                                        <h3 className="admin-variante-titulo">
                                                                            Talla {talla}
                                                                        </h3>

                                                                        <div className="mb-2">
                                                                            <label
                                                                                htmlFor={`stock-${talla}`}
                                                                                className="form-label"
                                                                            >
                                                                                Stock (unidades)
                                                                            </label>

                                                                            <input
                                                                                id={`stock-${talla}`}
                                                                                type="number"
                                                                                min="0"
                                                                                step="1"
                                                                                className="form-control"
                                                                                value={formulario.tallas[talla].stock}
                                                                                onChange={evento =>
                                                                                    actualizarStock(
                                                                                        talla,
                                                                                        evento.target.value
                                                                                    )
                                                                                }
                                                                                required
                                                                            />
                                                                        </div>

                                                                        {medidasProducto.map(medida => (
                                                                            <div
                                                                                key={medida.id}
                                                                                className="mb-2"
                                                                            >
                                                                                <label
                                                                                    htmlFor={`medida-${talla}-${medida.id}`}
                                                                                    className="form-label"
                                                                                >
                                                                                    {medida.nombre} ({medida.unidad})
                                                                                </label>

                                                                                <input
                                                                                    id={`medida-${talla}-${medida.id}`}
                                                                                    type="number"
                                                                                    min="0"
                                                                                    step="0.1"
                                                                                    className="form-control"
                                                                                    value={
                                                                                        formulario.tallas[talla]
                                                                                            .medidas[medida.id] ?? ""
                                                                                    }
                                                                                    onChange={evento =>
                                                                                        actualizarMedida(
                                                                                            talla,
                                                                                            medida.id,
                                                                                            evento.target.value
                                                                                        )
                                                                                    }
                                                                                    required
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </>
                                            )}
                                        </fieldset>
                                    )}

                                    {/* IMAGEN */}
                                    <fieldset className="admin-bloque mt-4">
                                        <legend className="admin-bloque-titulo">
                                            Imagen del producto
                                        </legend>

                                        <div className="row g-3 align-items-start">
                                            <div className="col-md-7">
                                                <label htmlFor="imagenArchivo" className="form-label">
                                                    Subir desde tu dispositivo
                                                </label>

                                                <input
                                                    id="imagenArchivo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control mb-3"
                                                    onChange={subirImagen}
                                                />

                                                <label htmlFor="imagen" className="form-label">
                                                    O usar una imagen existente
                                                </label>

                                                <select
                                                    className="form-select"
                                                    id="imagen"
                                                    name="imagen"
                                                    value={imagenExistente}
                                                    onChange={actualizarCampo}
                                                >
                                                    <option value="">
                                                        Seleccionar imagen
                                                    </option>

                                                    {Object.keys(images)
                                                        .filter(nombre => nombre !== "placeholder")
                                                        .map(nombre => (
                                                            <option key={nombre} value={nombre}>
                                                                {mostrarNombre(nombre)}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            <div className="col-md-5">
                                                <p className="form-label">Vista previa</p>

                                                {formulario.imagen ? (
                                                    <img
                                                        src={obtenerRutaImagen(formulario.imagen)}
                                                        alt="Vista previa del producto"
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

                                    <div className="mt-4">
                                        <label htmlFor="descripcion" className="form-label">
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
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminEditarProducto;
