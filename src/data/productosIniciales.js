import { images } from "./imagenes";

// Cada talla guarda su stock y sus medidas.
// Los atributos y las medidas se identifican con los ids definidos
// en la configuración de la categoría (categoriasIniciales.js).
export const productosIniciales = [
    {
        id: 1,
        nombre: "Urban Red",
        categoriaId: 1,
        precio: 12990,
        color: "rojo",
        descuento: 50,
        tallas: {
            S: {
                stock: 5,
                medidas: { contorno_pecho: 96, ancho_hombros: 42, largo_prenda: 66 }
            },
            M: {
                stock: 10,
                medidas: { contorno_pecho: 102, ancho_hombros: 44, largo_prenda: 68 }
            },
            L: {
                stock: 8,
                medidas: { contorno_pecho: 108, ancho_hombros: 46, largo_prenda: 70 }
            },
            XL: {
                stock: 3,
                medidas: { contorno_pecho: 114, ancho_hombros: 48, largo_prenda: 72 }
            }
        },
        atributos: { tipo_manga: "Corta" },
        descripcion: "Polera liviana y cómoda, ideal para un estilo casual y urbano.",
        imagen: images.imagen1
    },
    {
        id: 2,
        nombre: "Black Street",
        categoriaId: 1,
        precio: 14990,
        color: "negro",
        descuento: 10,
        tallas: {
            S: {
                stock: 6,
                medidas: { contorno_pecho: 97, ancho_hombros: 43, largo_prenda: 67 }
            },
            M: {
                stock: 12,
                medidas: { contorno_pecho: 103, ancho_hombros: 45, largo_prenda: 69 }
            },
            L: {
                stock: 4,
                medidas: { contorno_pecho: 109, ancho_hombros: 47, largo_prenda: 71 }
            },
            XL: {
                stock: 0,
                medidas: { contorno_pecho: 115, ancho_hombros: 49, largo_prenda: 73 }
            }
        },
        atributos: { tipo_manga: "Larga" },
        descripcion: "Diseño de manga larga pensado para complementar outfits modernos.",
        imagen: images.imagen2
    },
    {
        id: 3,
        nombre: "Black Hoodie",
        categoriaId: 2,
        precio: 24990,
        color: "negro",
        descuento: 25,
        tallas: {
            S: {
                stock: 2,
                medidas: { contorno_pecho: 108, ancho_hombros: 46, largo_prenda: 66 }
            },
            M: {
                stock: 9,
                medidas: { contorno_pecho: 114, ancho_hombros: 48, largo_prenda: 68 }
            },
            L: {
                stock: 7,
                medidas: { contorno_pecho: 120, ancho_hombros: 50, largo_prenda: 70 }
            },
            XL: {
                stock: 5,
                medidas: { contorno_pecho: 126, ancho_hombros: 52, largo_prenda: 72 }
            }
        },
        atributos: { tipo_capucha: "Con capucha" },
        descripcion: "Prenda abrigadora y versátil para disfrutar los días más fríos.",
        imagen: images.imagen3
    },
    {
        id: 4,
        nombre: "Red Classic",
        categoriaId: 2,
        precio: 22990,
        color: "rojo",
        descuento: 15,
        tallas: {
            S: {
                stock: 4,
                medidas: { contorno_pecho: 106, ancho_hombros: 45, largo_prenda: 65 }
            },
            M: {
                stock: 8,
                medidas: { contorno_pecho: 112, ancho_hombros: 47, largo_prenda: 67 }
            },
            L: {
                stock: 6,
                medidas: { contorno_pecho: 118, ancho_hombros: 49, largo_prenda: 69 }
            },
            XL: {
                stock: 1,
                medidas: { contorno_pecho: 124, ancho_hombros: 51, largo_prenda: 71 }
            }
        },
        atributos: { tipo_capucha: "Sin capucha" },
        descripcion: "Estilo sencillo y cómodo que combina fácilmente con distintos looks.",
        imagen: images.imagen4
    },
    {
        id: 5,
        nombre: "Yellow Trucker",
        categoriaId: 3,
        precio: 8990,
        color: "amarillo",
        descuento: 20,
        tallas: {
            "Única": {
                stock: 14,
                medidas: { contorno_cabeza: 58, profundidad: 11 }
            }
        },
        atributos: { tipo_gorro: "Trucker" },
        descripcion: "Gorra fresca y llamativa, perfecta para complementar un look casual.",
        imagen: images.imagen5
    },
    {
        id: 6,
        nombre: "Black Jockey",
        categoriaId: 3,
        precio: 8990,
        color: "negro",
        descuento: 10,
        tallas: {
            "Única": {
                stock: 3,
                medidas: { contorno_cabeza: 57, profundidad: 10 }
            }
        },
        atributos: { tipo_gorro: "Jockey" },
        descripcion: "Diseño clásico y versátil para usar en cualquier ocasión.",
        imagen: images.imagen6
    }
];
