// Medidas comunes de las prendas superiores.
const medidasPrendaSuperior = [
    {
        id: "contorno_pecho",
        nombre: "Contorno de pecho",
        unidad: "cm",
        solicitarCliente: true,
        registrarProducto: true
    },
    {
        id: "ancho_hombros",
        nombre: "Ancho de hombros",
        unidad: "cm",
        solicitarCliente: true,
        registrarProducto: true
    },
    {
        id: "largo_prenda",
        nombre: "Largo de prenda",
        unidad: "cm",
        solicitarCliente: false,
        registrarProducto: true
    }
];

// Cada categoría define sus propias tallas, atributos y medidas.
// Tipos de atributo: "texto", "numero", "seleccion" y "booleano".
export const categoriasIniciales = [
    {
        id: 1,
        nombre: "Poleras",
        descripcion: "Poleras básicas, cómodas y a precios accesibles.",
        imagen: "imagen1",
        tallas: ["S", "M", "L", "XL"],
        atributos: [
            {
                id: "tipo_manga",
                nombre: "Tipo de manga",
                tipo: "seleccion",
                opciones: ["Corta", "Larga"],
                obligatorio: true
            }
        ],
        medidas: medidasPrendaSuperior.map(medida => ({ ...medida }))
    },
    {
        id: 2,
        nombre: "Polerones",
        descripcion: "Polerones abrigadores para el día a día.",
        imagen: "imagen3",
        tallas: ["S", "M", "L", "XL"],
        atributos: [
            {
                id: "tipo_capucha",
                nombre: "Tipo de capucha",
                tipo: "seleccion",
                opciones: ["Con capucha", "Sin capucha"],
                obligatorio: true
            }
        ],
        medidas: medidasPrendaSuperior.map(medida => ({ ...medida }))
    },
    {
        id: 3,
        nombre: "Gorras",
        descripcion: "Gorras y gorros de uso diario en talla única.",
        imagen: "imagen5",
        tallas: ["Única"],
        atributos: [
            {
                id: "tipo_gorro",
                nombre: "Tipo de gorro",
                tipo: "seleccion",
                opciones: ["Jockey", "Trucker", "Beanie"],
                obligatorio: true
            }
        ],
        medidas: [
            {
                id: "contorno_cabeza",
                nombre: "Contorno de cabeza",
                unidad: "cm",
                solicitarCliente: true,
                registrarProducto: true
            },
            {
                id: "profundidad",
                nombre: "Profundidad",
                unidad: "cm",
                solicitarCliente: false,
                registrarProducto: true
            }
        ]
    }
];

export const coloresIniciales = [
    "rojo",
    "amarillo",
    "negro"
];
