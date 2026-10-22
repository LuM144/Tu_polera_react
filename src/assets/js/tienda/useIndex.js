
import { useEffect, useState } from "react";
import { UsuariosTest } from "../../../data/usuariosTest";
import { productosIniciales } from "../../../data/productosIniciales";
import { categoriasIniciales } from "../../../data/categoriasIniciales";
import { images } from "../../../data/imagenes";

const noticiasIniciales = [
    {
        id: 1,
        titulo: "Nueva colección disponible",
        descripcion: "Ya puedes encontrar nuestra nueva colección.",
        imagen: images.placeholder,
        enlace: "/productos"
    },
    {
        id: 2,
        titulo: "¡Descuentos especiales!",
        descripcion: "Aprovecha nuestras ofertas por tiempo limitado.",
        imagen: images.placeholder,
        enlace: "/productos?descuento=25"
    },
    {
        id: 3,
        titulo: "Personaliza tus productos",
        descripcion: "Crea diseños únicos para tus productos favoritos.",
        imagen: images.placeholder,
        enlace: "/productos"
    }
];

const bannersIniciales = [
    {
        id: 1,
        titulo: "Diseña tu estilo",
        descripcion: "Crea prendas personalizadas a tu gusto.",
        imagen: images.placeholder
    },
    {
        id: 2,
        titulo: "Tu diseño, tu estilo",
        descripcion: "Personaliza tus prendas favoritas.",
        imagen: images.placeholder
    },
    {
        id: 3,
        titulo: "Productos únicos",
        descripcion: "Haz que cada producto sea especial.",
        imagen: images.placeholder
    }
];

function leerLocalStorage(clave, valorInicial) {
    try {
        const datoGuardado = localStorage.getItem(clave);

        if (datoGuardado === null) {
            return valorInicial;
        }

        return JSON.parse(datoGuardado);
    } catch (error) {
        console.error(`Error al leer ${clave}:`, error);
        return valorInicial;
    }
}

function guardarSiNoExiste(clave, datos) {
    if (localStorage.getItem(clave) === null) {
        localStorage.setItem(clave, JSON.stringify(datos));
    }
}

function obtenerId(producto) {
    return producto?.id ?? producto;
}

function normalizarCategorias(datos) {
    if (!Array.isArray(datos)) {
        return categoriasIniciales.map(categoria => ({ ...categoria }));
    }

    return datos.map((categoria, indice) => {
        // Convierte las categorías antiguas que eran solo texto.
        if (typeof categoria === "string") {
            const inicial = categoriasIniciales.find(
                item =>
                    item.nombre.toLowerCase() === categoria.toLowerCase()
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
    });
}

export default function useIndex() {
    const [productos, setProductos] = useState([]);
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [categorias, setCategorias] = useState(categoriasIniciales);
    const [usuarioActual, setUsuarioActual] = useState(null);

    useEffect(() => {
        guardarSiNoExiste("usuarios", UsuariosTest);
        guardarSiNoExiste("productos", productosIniciales);
        guardarSiNoExiste("categorias", categoriasIniciales);

        const usuarios = leerLocalStorage("usuarios", UsuariosTest);

        const productosGuardados = leerLocalStorage(
            "productos",
            productosIniciales
        );

        const categoriasGuardadas = leerLocalStorage(
            "categorias",
            categoriasIniciales
        );

        const categoriasNormalizadas = normalizarCategorias(
            categoriasGuardadas
        );

        // Guarda la estructura nueva para las siguientes visitas.
        localStorage.setItem(
            "categorias",
            JSON.stringify(categoriasNormalizadas)
        );

        const destacadosGuardados = leerLocalStorage(
            "productosDestacados",
            []
        );

        const sesionGuardada = leerLocalStorage("usuarioActual", null);

        let usuario = sesionGuardada;

        if (typeof usuario === "string") {
            try {
                usuario = JSON.parse(usuario);
            } catch {
                usuario =
                    usuarios.find(
                        item => item.correo === sesionGuardada
                    ) ?? null;
            }
        }

        setUsuarioActual(usuario);

        setProductos(
            Array.isArray(productosGuardados)
                ? productosGuardados
                : []
        );

        setCategorias(categoriasNormalizadas);

        let destacados = [];

        if (
            Array.isArray(destacadosGuardados) &&
            destacadosGuardados.length > 0
        ) {
            if (
                typeof destacadosGuardados[0] === "object" &&
                destacadosGuardados[0] !== null
            ) {
                destacados = destacadosGuardados.map(destacado =>
                    productosGuardados.find(
                        producto =>
                            String(producto.id) === String(destacado.id)
                    ) ?? destacado
                );
            } else {
                destacados = destacadosGuardados
                    .map(id =>
                        productosGuardados.find(
                            producto =>
                                String(producto.id) ===
                                String(obtenerId(id))
                        )
                    )
                    .filter(Boolean);
            }
        } else {
            destacados = productosGuardados.slice(0, 6);
        }

        setProductosDestacados(destacados.slice(0, 6));
    }, []);

    function obtenerPrecioFinal(producto) {
        const precio = Number(producto.precio) || 0;
        const descuento = Number(producto.descuento) || 0;

        return precio - (precio * descuento / 100);
    }

    function formatearPrecio(precio) {
        return Number(precio).toLocaleString("es-CL", {
            maximumFractionDigits: 0
        });
    }

    function obtenerRutaImagen(ruta) {
        if (!ruta) {
            return images.placeholder;
        }

        // Las categorías guardan claves como "imagen1".
        if (typeof ruta === "string" && Object.hasOwn(images, ruta)) {
            return images[ruta];
        }

        // Los productos ya usan imágenes importadas desde imagenes.js.
        return ruta;
    }

    return {
        productos,
        productosDestacados,
        categorias,
        bannersIniciales,
        noticiasIniciales,
        usuarioActual,
        obtenerPrecioFinal,
        formatearPrecio,
        obtenerRutaImagen
    };
}
