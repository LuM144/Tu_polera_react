import {
    categoriasIniciales,
    coloresIniciales
} from "../../../data/categoriasIniciales";
import { productosIniciales } from "../../../data/productosIniciales";
import { images } from "../../../data/imagenes";

// Stock que se asigna a los productos antiguos guardados sin stock.
export const STOCK_INICIAL_MIGRACION = 10;

// Umbral inicial para considerar que una talla tiene stock bajo.
export const UMBRAL_STOCK_INICIAL = 5;

export const TIPOS_ATRIBUTO = [
    { valor: "texto", etiqueta: "Texto" },
    { valor: "numero", etiqueta: "Número" },
    { valor: "seleccion", etiqueta: "Selección" },
    { valor: "booleano", etiqueta: "Sí / No" }
];

/* ------------------------------------------------------------------ */
/* Utilidades generales                                                */
/* ------------------------------------------------------------------ */

export function crearSlug(texto = "") {
    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
}

// Crea un identificador interno estable a partir de un nombre.
export function crearIdentificador(texto = "") {
    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function copiar(valor) {
    return JSON.parse(JSON.stringify(valor));
}

export function leerJSON(clave, respaldo) {
    try {
        const guardado = localStorage.getItem(clave);

        if (guardado === null) {
            return respaldo;
        }

        return JSON.parse(guardado);
    } catch (error) {
        console.error(`Error al leer ${clave}:`, error);
        return respaldo;
    }
}

export function guardarJSON(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch (error) {
        console.error(`Error al guardar ${clave}:`, error);
        return false;
    }
}

export function formatearPrecio(precio) {
    return Number(precio || 0).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    });
}

export function obtenerPrecioFinal(producto) {
    const precio = Number(producto?.precio) || 0;

    const descuento = Math.min(
        100,
        Math.max(0, Number(producto?.descuento) || 0)
    );

    return Math.round(precio - (precio * descuento / 100));
}

/* ------------------------------------------------------------------ */
/* Imágenes                                                            */
/* ------------------------------------------------------------------ */

export function esImagenSubida(imagen) {
    return typeof imagen === "string" && imagen.startsWith("data:image/");
}

// Acepta: nombre de imagen importada, ruta antigua o imagen subida.
export function obtenerRutaImagen(imagen) {
    if (!imagen || typeof imagen !== "string") {
        return images.placeholder;
    }

    if (esImagenSubida(imagen)) {
        return imagen;
    }

    if (Object.hasOwn(images, imagen)) {
        return images[imagen];
    }

    const ruta = imagen.toLowerCase();
    const nombre = Object.keys(images).find(
        clave => ruta.includes(clave.toLowerCase())
    );

    return nombre ? images[nombre] : imagen;
}

/* ------------------------------------------------------------------ */
/* Categorías                                                          */
/* ------------------------------------------------------------------ */

function normalizarAtributo(atributo, indice) {
    const nombre = String(atributo?.nombre ?? "").trim();
    const tipoValido = TIPOS_ATRIBUTO.some(
        tipo => tipo.valor === atributo?.tipo
    );

    return {
        id: String(
            atributo?.id || crearIdentificador(nombre) || `atributo_${indice + 1}`
        ),
        nombre,
        tipo: tipoValido ? atributo.tipo : "texto",
        opciones: Array.isArray(atributo?.opciones)
            ? atributo.opciones.map(String).filter(Boolean)
            : [],
        obligatorio: Boolean(atributo?.obligatorio)
    };
}

function normalizarMedida(medida, indice) {
    const nombre = String(medida?.nombre ?? "").trim();

    return {
        id: String(
            medida?.id || crearIdentificador(nombre) || `medida_${indice + 1}`
        ),
        nombre,
        unidad: String(medida?.unidad ?? "cm").trim() || "cm",
        solicitarCliente: Boolean(medida?.solicitarCliente),
        registrarProducto: medida?.registrarProducto !== false
    };
}

export function normalizarCategoria(categoria, indice) {
    // Compatibilidad con categorías antiguas guardadas como texto.
    const origen = typeof categoria === "string"
        ? { nombre: categoria }
        : categoria || {};

    const nombre = String(origen.nombre ?? "");

    const inicial = categoriasIniciales.find(
        item => crearSlug(item.nombre) === crearSlug(nombre)
    );

    const imagenValida =
        typeof origen.imagen === "string" &&
        (esImagenSubida(origen.imagen) || Object.hasOwn(images, origen.imagen));

    const tallas = Array.isArray(origen.tallas)
        ? origen.tallas
        : inicial?.tallas ?? [];

    const atributos = Array.isArray(origen.atributos)
        ? origen.atributos
        : inicial?.atributos ?? [];

    const medidas = Array.isArray(origen.medidas)
        ? origen.medidas
        : inicial?.medidas ?? [];

    return {
        id: origen.id ?? inicial?.id ?? indice + 1,
        nombre,
        descripcion: origen.descripcion ?? inicial?.descripcion ?? "",
        imagen: imagenValida
            ? origen.imagen
            : inicial?.imagen ?? "placeholder",
        tallas: [...new Set(tallas.map(talla => String(talla).trim()).filter(Boolean))],
        atributos: atributos.map(normalizarAtributo),
        medidas: medidas.map(normalizarMedida)
    };
}

export function cargarCategorias() {
    const guardadas = leerJSON("categorias", null);

    if (!Array.isArray(guardadas)) {
        const iniciales = copiar(categoriasIniciales);
        guardarJSON("categorias", iniciales);
        return iniciales;
    }

    const categorias = guardadas.map(normalizarCategoria);
    guardarJSON("categorias", categorias);

    return categorias;
}

export function guardarCategorias(categorias) {
    return guardarJSON("categorias", categorias);
}

export function obtenerCategoria(categorias, categoriaId) {
    return categorias.find(
        categoria => String(categoria.id) === String(categoriaId)
    ) ?? null;
}

export function obtenerNombreCategoria(categorias, producto) {
    return obtenerCategoria(categorias, producto?.categoriaId)?.nombre
        ?? "Sin categoría";
}

/* ------------------------------------------------------------------ */
/* Colores                                                             */
/* ------------------------------------------------------------------ */

export function cargarColores() {
    const guardados = leerJSON("colores", null);

    if (Array.isArray(guardados)) {
        return guardados;
    }

    guardarJSON("colores", coloresIniciales);
    return [...coloresIniciales];
}

/* ------------------------------------------------------------------ */
/* Productos                                                           */
/* ------------------------------------------------------------------ */

function normalizarNumero(valor) {
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
}

function normalizarVariante(variante) {
    const stock = Math.max(0, Math.floor(Number(variante?.stock) || 0));
    const medidas = {};

    Object.entries(variante?.medidas ?? {}).forEach(([id, valor]) => {
        const numero = normalizarNumero(valor);

        if (numero !== null && valor !== "") {
            medidas[id] = numero;
        }
    });

    return { stock, medidas };
}

// Convierte los atributos sueltos de la estructura antigua
// (manga_corta, capucha y tipo_gorro) en atributos dinámicos.
function atributosDesdeEstructuraAntigua(producto, categoria) {
    const atributos = {};

    const existe = id => categoria?.atributos.some(atributo => atributo.id === id);

    if (producto.manga_corta !== undefined && existe("tipo_manga")) {
        atributos.tipo_manga = producto.manga_corta === "si" ? "Corta" : "Larga";
    }

    if (producto.capucha !== undefined && existe("tipo_capucha")) {
        atributos.tipo_capucha = producto.capucha === "si"
            ? "Con capucha"
            : "Sin capucha";
    }

    if (producto.tipo_gorro && existe("tipo_gorro")) {
        atributos.tipo_gorro = producto.tipo_gorro;
    }

    return atributos;
}

export function migrarProducto(producto, categorias) {
    // Relación con la categoría mediante categoriaId.
    let categoria = obtenerCategoria(categorias, producto.categoriaId);

    if (!categoria) {
        const nombreAntiguo = crearSlug(
            producto.categoriaNombre || producto.categoria || ""
        );

        categoria = categorias.find(
            item => crearSlug(item.nombre) === nombreAntiguo
        ) ?? null;
    }

    // Tallas: estructura antigua (lista) o nueva (objeto).
    let tallas = {};

    if (Array.isArray(producto.tallas)) {
        const inicial = productosIniciales.find(
            item => item.id === producto.id && item.nombre === producto.nombre
        );

        producto.tallas.forEach(talla => {
            tallas[talla] = normalizarVariante({
                stock: STOCK_INICIAL_MIGRACION,
                medidas: inicial?.tallas?.[talla]?.medidas ?? {}
            });
        });
    } else if (producto.tallas && typeof producto.tallas === "object") {
        Object.entries(producto.tallas).forEach(([talla, variante]) => {
            tallas[talla] = normalizarVariante(variante);
        });
    }

    const atributos = producto.atributos && typeof producto.atributos === "object"
        ? { ...producto.atributos }
        : atributosDesdeEstructuraAntigua(producto, categoria);

    return {
        id: producto.id,
        nombre: producto.nombre ?? "",
        categoriaId: categoria?.id ?? null,
        precio: Number(producto.precio) || 0,
        color: producto.color ?? "",
        descuento: Number(producto.descuento) || 0,
        tallas,
        atributos,
        descripcion: producto.descripcion ?? "",
        imagen: producto.imagen ?? ""
    };
}

export function cargarProductos(categorias = cargarCategorias()) {
    const guardados = leerJSON("productos", null);

    if (!Array.isArray(guardados)) {
        const iniciales = copiar(productosIniciales);
        guardarJSON("productos", iniciales);
        return iniciales;
    }

    const productos = guardados.map(
        producto => migrarProducto(producto, categorias)
    );

    guardarJSON("productos", productos);

    return productos;
}

export function guardarProductos(productos) {
    return guardarJSON("productos", productos);
}

/* ------------------------------------------------------------------ */
/* Stock y tallas                                                      */
/* ------------------------------------------------------------------ */

// Tallas del producto, en el orden definido por su categoría.
export function listarTallas(producto, categoria) {
    const tallas = Object.keys(producto?.tallas ?? {});
    const orden = categoria?.tallas ?? [];

    return tallas.sort((a, b) => {
        const posicionA = orden.indexOf(a);
        const posicionB = orden.indexOf(b);

        return (posicionA === -1 ? 999 : posicionA) -
            (posicionB === -1 ? 999 : posicionB);
    });
}

export function obtenerStockTalla(producto, talla) {
    return Number(producto?.tallas?.[talla]?.stock) || 0;
}

export function obtenerStockTotal(producto) {
    return Object.values(producto?.tallas ?? {}).reduce(
        (total, variante) => total + (Number(variante.stock) || 0),
        0
    );
}

export function cargarUmbralStock() {
    const umbral = Number(leerJSON("umbralStockCritico", UMBRAL_STOCK_INICIAL));

    return Number.isFinite(umbral) && umbral >= 0
        ? Math.floor(umbral)
        : UMBRAL_STOCK_INICIAL;
}

export function guardarUmbralStock(umbral) {
    return guardarJSON("umbralStockCritico", Math.max(0, Math.floor(umbral)));
}

// Devuelve las variantes agotadas o con stock bajo.
export function obtenerProductosCriticos(productos, categorias, umbral) {
    const criticos = [];

    productos.forEach(producto => {
        const categoria = obtenerCategoria(categorias, producto.categoriaId);

        listarTallas(producto, categoria).forEach(talla => {
            const stock = obtenerStockTalla(producto, talla);

            if (stock <= umbral) {
                criticos.push({
                    producto,
                    categoria,
                    talla,
                    stock,
                    agotado: stock === 0
                });
            }
        });
    });

    return criticos.sort((a, b) => a.stock - b.stock);
}

// Revisa que cada producto del carrito tenga stock suficiente.
export function revisarStockCarrito(items, productos = cargarProductos()) {
    const problemas = [];

    items.forEach(item => {
        const producto = productos.find(
            actual => String(actual.id) === String(item.id)
        );

        const disponible = producto
            ? obtenerStockTalla(producto, item.talla)
            : 0;

        const cantidad = Number(item.cantidad) || 0;

        if (cantidad > disponible) {
            problemas.push({
                item,
                disponible,
                mensaje: disponible === 0
                    ? `"${item.nombre}" (talla ${item.talla}) está agotado.`
                    : `"${item.nombre}" (talla ${item.talla}) solo tiene ${disponible} unidad(es) disponible(s).`
            });
        }
    });

    return problemas;
}

// Descuenta del stock las unidades de una compra confirmada.
export function descontarStock(items) {
    const productos = cargarProductos();

    const actualizados = productos.map(producto => {
        const comprados = items.filter(
            item => String(item.id) === String(producto.id)
        );

        if (comprados.length === 0) {
            return producto;
        }

        const tallas = { ...producto.tallas };

        comprados.forEach(item => {
            const variante = tallas[item.talla];

            if (variante) {
                tallas[item.talla] = {
                    ...variante,
                    stock: Math.max(
                        0,
                        variante.stock - (Number(item.cantidad) || 0)
                    )
                };
            }
        });

        return { ...producto, tallas };
    });

    if (!guardarProductos(actualizados)) {
        throw new Error("No se pudo actualizar el stock.");
    }

    return actualizados;
}

/* ------------------------------------------------------------------ */
/* Atributos y medidas dinámicos                                       */
/* ------------------------------------------------------------------ */

export function mostrarValorAtributo(atributo, valor) {
    if (valor === undefined || valor === null || valor === "") {
        return "No especificado";
    }

    if (atributo.tipo === "booleano") {
        return valor === true || valor === "si" ? "Sí" : "No";
    }

    return String(valor);
}

// Crea los datos vacíos de un producto según la configuración de su categoría.
export function crearTallasVacias(categoria) {
    const tallas = {};

    (categoria?.tallas ?? []).forEach(talla => {
        tallas[talla] = { stock: 0, medidas: {} };
    });

    return tallas;
}

// Compara las medidas del cliente con las de la prenda.
// La diferencia es: medida de la prenda - medida del cliente.
export function compararMedidas(categoria, variante, medidasCliente) {
    return (categoria?.medidas ?? [])
        .filter(medida => medida.solicitarCliente)
        .map(medida => {
            const prenda = normalizarNumero(variante?.medidas?.[medida.id]);

            const textoCliente = medidasCliente?.[medida.id];
            const cliente = textoCliente === "" || textoCliente === undefined
                ? null
                : normalizarNumero(textoCliente);

            return {
                medida,
                cliente,
                prenda,
                diferencia: prenda !== null && cliente !== null
                    ? Math.round((prenda - cliente) * 10) / 10
                    : null
            };
        });
}

/* ------------------------------------------------------------------ */
/* Subida de imágenes                                                  */
/* ------------------------------------------------------------------ */

// Lee una imagen del dispositivo, la reduce y la devuelve como data URL
// para guardarla en el mismo almacenamiento que usa el resto del proyecto.
export function leerImagenComoDataUrl(archivo, limite = 1000) {
    return new Promise((resolve, reject) => {
        if (!archivo || !archivo.type.startsWith("image/")) {
            reject(new Error("Selecciona un archivo de imagen válido."));
            return;
        }

        if (archivo.size > 8 * 1024 * 1024) {
            reject(new Error("La imagen no puede superar los 8 MB."));
            return;
        }

        const urlTemporal = URL.createObjectURL(archivo);
        const imagen = new Image();

        imagen.onload = () => {
            try {
                const escala = Math.min(
                    1,
                    limite / imagen.naturalWidth,
                    limite / imagen.naturalHeight
                );

                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(imagen.naturalWidth * escala));
                canvas.height = Math.max(1, Math.round(imagen.naturalHeight * escala));

                const contexto = canvas.getContext("2d");

                if (!contexto) {
                    throw new Error("No se pudo procesar la imagen.");
                }

                contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/webp", 0.75));
            } catch {
                reject(new Error("No se pudo procesar la imagen seleccionada."));
            } finally {
                URL.revokeObjectURL(urlTemporal);
            }
        };

        imagen.onerror = () => {
            URL.revokeObjectURL(urlTemporal);
            reject(new Error("No se pudo abrir la imagen seleccionada."));
        };

        imagen.src = urlTemporal;
    });
}
