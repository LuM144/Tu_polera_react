import { images } from "./imagenes";

export const productosIniciales = [
    {
        id: 1,
        nombre: "Urban Red",
        categoria: "poleras",
        precio: 12990,
        color: "rojo",
        descuento: 50,
        tallas: ["S", "M", "L", "XL"],
        manga_corta: "si",
        descripcion: "Polera liviana y cómoda, ideal para un estilo casual y urbano.",
        imagen: images.imagen1    
    },
    {
        id: 2,
        nombre: "Black Street",
        categoria: "poleras",
        precio: 14990,
        color: "negro",
        descuento: 10,
        tallas: ["S", "M", "L", "XL"],
        manga_corta: "no",
        descripcion: "Diseño de manga larga pensado para complementar outfits modernos.",
        imagen: images.imagen2
    },
    {
        id: 3,
        nombre: "Black Hoodie",
        categoria: "polerones",
        precio: 24990,
        color: "negro",
        descuento: 25,
        tallas: ["S", "M", "L", "XL"],
        capucha: "si",
        descripcion: "Prenda abrigadora y versátil para disfrutar los días más fríos.",
        imagen: images.imagen3
    },
    {
        id: 4,
        nombre: "Red Classic",
        categoria: "polerones",
        precio: 22990,
        color: "rojo",
        descuento: 15,
        tallas: ["S", "M", "L", "XL"],
        capucha: "no",
        descripcion: "Estilo sencillo y cómodo que combina fácilmente con distintos looks.",
        imagen: images.imagen4
    },
    {
        id: 5,
        nombre: "Yellow Trucker",
        categoria: "gorras",
        precio: 8990,
        color: "amarillo",
        descuento: 20,
        tallas: ["Única"],
        tipo_gorro: "Trucker",
        descripcion: "Gorra fresca y llamativa, perfecta para complementar un look casual.",
        imagen: images.imagen5
    },
    {
        id: 6,
        nombre: "Black Jockey",
        categoria: "gorras",
        precio: 8990,
        color: "negro",
        descuento: 10,
        tallas: ["Única"],
        tipo_gorro: "Jockey",
        descripcion: "Diseño clásico y versátil para usar en cualquier ocasión.",
        imagen: images.imagen6
    }
];
