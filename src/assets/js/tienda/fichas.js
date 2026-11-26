import { crearIdentificador, esImagenSubida } from "./catalogo";

// Versión de la estructura de la instantánea histórica de cada ítem.
export const VERSION_INSTANTANEA = 1;

/* ------------------------------------------------------------------ */
/* Instantánea histórica (se crea al registrar la compra)              */
/* ------------------------------------------------------------------ */

function textoONulo(valor) {
    const texto = String(valor ?? "").trim();
    return texto === "" ? null : texto;
}

// Medidas de la talla comprada, con el nombre y la unidad que definía la
// categoría en ese momento. Solo se incluyen medidas que tengan un valor
// numérico real: no se inventan ni se completan datos.
function reunirMedidas(producto, categoria, talla) {
    const valores = producto?.tallas?.[talla]?.medidas;

    if (!valores || typeof valores !== "object") {
        return [];
    }

    return (categoria?.medidas ?? [])
        .filter(medida => medida.registrarProducto !== false)
        .map(medida => {
            const bruto = valores[medida.id];
            const valor =
                bruto === "" || bruto === null || bruto === undefined
                    ? NaN
                    : Number(bruto);

            return {
                id: medida.id,
                nombre: medida.nombre,
                unidad: medida.unidad,
                valor
            };
        })
        .filter(medida => Number.isFinite(medida.valor));
}

// Atributos reales del producto (por ejemplo, tipo de manga), con el nombre
// definido por su categoría. Se guarda el valor ya legible.
function reunirAtributos(producto, categoria) {
    const valores = producto?.atributos;

    if (!valores || typeof valores !== "object") {
        return [];
    }

    return (categoria?.atributos ?? [])
        .map(atributo => {
            const bruto = valores[atributo.id];

            if (bruto === undefined || bruto === null || bruto === "") {
                return null;
            }

            const valor =
                atributo.tipo === "booleano"
                    ? bruto === true || bruto === "si" ? "Sí" : "No"
                    : String(bruto);

            return { id: atributo.id, nombre: atributo.nombre, valor };
        })
        .filter(Boolean);
}

// Crea la instantánea de un ítem a partir de los datos reales que existen en
// el momento de la compra:
//   item       ítem del carrito (lo que realmente se compra).
//   producto   producto del catálogo en ese momento (o null si ya no existe).
//   categoria  categoría de ese producto (o null).
//
// Se guarda dentro de la compra, de modo que cambios posteriores en el
// catálogo no alteran la ficha de una compra ya realizada.
export function crearInstantaneaItem(
    item,
    producto = null,
    categoria = null,
    capturadaEn = new Date().toISOString()
) {
    const talla = textoONulo(item?.talla);

    // Las imágenes subidas (data URL) ya están guardadas en el propio ítem;
    // no se duplican aquí para no agotar el almacenamiento del navegador.
    const imagen = esImagenSubida(item?.imagen) ? null : item?.imagen || null;

    return {
        version: VERSION_INSTANTANEA,
        capturadaEn,
        productoId: item?.id ?? producto?.id ?? null,
        nombre: textoONulo(item?.nombre) ?? textoONulo(producto?.nombre),
        categoria: categoria
            ? { id: categoria.id, nombre: categoria.nombre }
            : null,
        imagen,
        color: textoONulo(producto?.color),
        talla,
        cantidad: Math.max(1, Number(item?.cantidad) || 1),
        medidas: talla ? reunirMedidas(producto, categoria, talla) : [],
        atributos: reunirAtributos(producto, categoria)
    };
}

/* ------------------------------------------------------------------ */
/* Datos de la ficha (se leen SOLO desde la compra guardada)           */
/* ------------------------------------------------------------------ */

function esInstantaneaValida(instantanea) {
    return (
        instantanea !== null &&
        typeof instantanea === "object" &&
        Array.isArray(instantanea.medidas)
    );
}

// Prepara lo que muestra una ficha. No consulta el catálogo: si la compra no
// tiene instantánea (compras anteriores a esta función), la ficha lo indica y
// solo muestra los datos que la propia compra guardó.
export function obtenerDatosFicha(compra, item, indice = 0) {
    const instantanea = esInstantaneaValida(item?.instantanea)
        ? item.instantanea
        : null;

    const pedido = {
        id: compra?.id ?? null,
        numero: compra?.numero ?? "",
        fecha: compra?.fecha ?? ""
    };

    if (!instantanea) {
        return {
            clave: `${pedido.id}-${indice}`,
            historicaDisponible: false,
            nombre: textoONulo(item?.nombre) ?? "Producto",
            categoria: null,
            productoId: item?.id ?? null,
            imagen: item?.imagen || null,
            color: null,
            talla: textoONulo(item?.talla),
            cantidad: Math.max(1, Number(item?.cantidad) || 1),
            medidas: [],
            atributos: [],
            pedido
        };
    }

    return {
        clave: `${pedido.id}-${indice}`,
        historicaDisponible: true,
        nombre:
            textoONulo(instantanea.nombre) ??
            textoONulo(item?.nombre) ??
            "Producto",
        categoria: instantanea.categoria?.nombre ?? null,
        productoId: instantanea.productoId ?? null,
        // La referencia de imagen se conserva en la instantánea o, para
        // imágenes subidas, en el propio ítem de la compra.
        imagen: instantanea.imagen || item?.imagen || null,
        color: textoONulo(instantanea.color),
        talla: textoONulo(instantanea.talla),
        cantidad: Math.max(1, Number(instantanea.cantidad) || 1),
        medidas: instantanea.medidas,
        atributos: Array.isArray(instantanea.atributos)
            ? instantanea.atributos
            : [],
        pedido
    };
}

/* ------------------------------------------------------------------ */
/* Nombre del archivo PNG                                              */
/* ------------------------------------------------------------------ */

function crearSlug(texto) {
    return crearIdentificador(texto).replace(/_/g, "-");
}

function crearNombreBase(datos) {
    return [
        "ficha",
        crearSlug(datos.nombre) || "prenda",
        datos.talla ? `talla-${crearSlug(datos.talla)}` : "",
        `pedido-${crearSlug(String(datos.pedido.id ?? "")) || "sin-numero"}`
    ]
        .filter(Boolean)
        .join("-");
}

// Ejemplo: ficha-urban-red-talla-m-pedido-4.png
// Si el pedido tiene dos fichas que darían el mismo nombre, se agrega el
// número de la ficha para evitar archivos duplicados.
export function crearNombreArchivoFicha(datos, indice = 0, todas = []) {
    const base = crearNombreBase(datos);

    const repetidas = todas.filter(
        otra => crearNombreBase(otra) === base
    );

    return repetidas.length > 1
        ? `${base}-${indice + 1}.png`
        : `${base}.png`;
}
