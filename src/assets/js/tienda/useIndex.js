
import { useEffect, useState } from "react";
import { UsuariosTest } from "../../../data/usuariosTest";
import { images } from "../../../data/imagenes";
import {
    cargarCategorias,
    cargarProductos,
    obtenerRutaImagen as resolverImagen
} from "./catalogo";

const noticiasIniciales = [
    {
        id: 1,
        titulo: "Compara tus medidas",
        descripcion: "En cada producto puedes ingresar tus medidas y ver en cuánto se diferencian de las de la prenda.",
        imagen: images.imagen1,
        enlace: "/productos"
    },
    {
        id: 2,
        titulo: "Descuentos en prendas seleccionadas",
        descripcion: "Revisa los productos con descuento y encuentra básicos a mejor precio.",
        imagen: images.imagen3,
        enlace: "/productos?descuento=25"
    },
    {
        id: 3,
        titulo: "Despacho según tu dirección",
        descripcion: "Ingresa tu dirección en el carrito y conoce el costo estimado de despacho antes de pagar.",
        imagen: images.imagen5,
        enlace: "/carrito"
    }
];

const bannersIniciales = [
    {
        id: 1,
        titulo: "Básicos para todos los días",
        descripcion: "Poleras, polerones y gorras cómodas a precios accesibles.",
        imagen: images.imagen1
    },
    {
        id: 2,
        titulo: "Elige con información clara",
        descripcion: "Cada prenda indica sus tallas, medidas y unidades disponibles.",
        imagen: images.imagen3
    },
    {
        id: 3,
        titulo: "Despacho a todo Chile",
        descripcion: "Calcula el costo de envío según tu dirección antes de comprar.",
        imagen: images.imagen5
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

export default function useIndex() {
    const [productos, setProductos] = useState([]);
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [usuarioActual, setUsuarioActual] = useState(null);

    useEffect(() => {
        guardarSiNoExiste("usuarios", UsuariosTest);

        const usuarios = leerLocalStorage("usuarios", UsuariosTest);

        // Las categorías y los productos se cargan (y migran si es necesario)
        // desde el módulo compartido del catálogo.
        const categoriasNormalizadas = cargarCategorias();
        const productosGuardados = cargarProductos(categoriasNormalizadas);

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
        return resolverImagen(ruta);
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
