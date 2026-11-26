
import { useState } from "react";
import { UsuariosTest } from "../../../data/usuariosTest";
import {
    cargarCategorias,
    cargarProductos,
    cargarUmbralStock,
    obtenerProductosCriticos
} from "../tienda/catalogo";
import {
    obtenerCompras,
    calcularTotalCompra
} from "../tienda/compras";

function cargarUsuarios() {
    const usuariosGuardados = localStorage.getItem("usuarios");

    if (usuariosGuardados !== null) {
        try {
            const datosUsuarios = JSON.parse(usuariosGuardados);

            return Array.isArray(datosUsuarios)
                ? datosUsuarios
                : UsuariosTest;
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            return UsuariosTest;
        }
    }

    return UsuariosTest;
}

function useAdminInicio() {
    const [productos] = useState(() =>
        cargarProductos(cargarCategorias())
    );

    const [usuarios] = useState(() => cargarUsuarios());

    const [compras] = useState(() => obtenerCompras());

    // Variantes de talla agotadas o con stock bajo.
    const productosCriticos = obtenerProductosCriticos(
        productos,
        cargarCategorias(),
        cargarUmbralStock()
    );

    // Considerar solamente las compras exitosas.
    const comprasExitosas = compras.filter(
        (compra) => compra.estado === "exitosa"
    );

    // Contar las compras fallidas.
    const comprasFallidas = compras.filter(
        (compra) => compra.estado === "fallida"
    );

    // Calcular el dinero de las ventas exitosas.
    const totalVendido = comprasExitosas.reduce(
        (total, compra) => total + calcularTotalCompra(compra),
        0
    );

    // Calcular las unidades vendidas en compras exitosas.
    const unidadesVendidas = comprasExitosas.reduce(
        (total, compra) =>
            total +
            (compra.items || []).reduce(
                (cantidad, item) =>
                    cantidad + (Number(item.cantidad) || 0),
                0
            ),
        0
    );

    // Estadísticas que se mostrarán en las tarjetas del panel.
    const estadisticas = [
        {
            titulo: "Productos",
            cantidad: productos.length,
            descripcion: "Productos registrados en la tienda.",
            icono: "caja",
            color: "primary",
            ruta: "/admin/productos"
        },
        {
            titulo: "Productos críticos",
            cantidad: productosCriticos.length,
            descripcion: "Tallas agotadas o con stock bajo.",
            icono: "alerta",
            color: "danger",
            ruta: "/admin/productos-criticos"
        },
        {
            titulo: "Usuarios",
            cantidad: usuarios.length,
            descripcion: "Usuarios registrados en la tienda.",
            icono: "usuarios",
            color: "info",
            ruta: "/admin/usuarios"
        },
        {
            titulo: "Compras registradas",
            cantidad: compras.length,
            descripcion: "Total de intentos de compra registrados.",
            icono: "recibo",
            color: "secondary",
            ruta: "/admin/boletas"
        },
        {
            titulo: "Compras exitosas",
            cantidad: comprasExitosas.length,
            descripcion: "Compras que finalizaron correctamente.",
            icono: "check",
            color: "success",
            ruta: "/admin/boletas"
        },
        {
            titulo: "Compras fallidas",
            cantidad: comprasFallidas.length,
            descripcion: "Compras que no se completaron.",
            icono: "cerrar",
            color: "danger",
            ruta: "/admin/boletas"
        },
        {
            titulo: "Total vendido",
            cantidad: `$${totalVendido.toLocaleString("es-CL")}`,
            descripcion: "Ingresos de las compras exitosas.",
            icono: "dinero",
            color: "success",
            ruta: "/admin/reportes"
        },
        {
            titulo: "Unidades vendidas",
            cantidad: unidadesVendidas,
            descripcion: "Unidades incluidas en compras exitosas.",
            icono: "bolsa",
            color: "warning",
            ruta: "/admin/reportes"
        }
    ];

    // Accesos directos a las secciones de administración.
    const accesos = [
        {
            titulo: "Administrar productos",
            descripcion: "Agregar, editar y eliminar productos.",
            icono: "caja",
            ruta: "/admin/productos"
        },
        {
            titulo: "Productos críticos",
            descripcion: "Revisar tallas agotadas o con stock bajo.",
            icono: "alerta",
            ruta: "/admin/productos-criticos"
        },
        {
            titulo: "Categorías y atributos",
            descripcion: "Configurar tallas, atributos y medidas.",
            icono: "etiqueta",
            ruta: "/admin/categorias"
        },
        {
            titulo: "Centro de distribución",
            descripcion: "Configurar el origen y las tarifas de despacho.",
            icono: "camion",
            ruta: "/admin/despacho"
        },
        {
            titulo: "Administrar usuarios",
            descripcion: "Consultar y gestionar usuarios registrados.",
            icono: "usuarios",
            ruta: "/admin/usuarios"
        },
        {
            titulo: "Administrar boletas",
            descripcion: "Consultar pagos exitosos y fallidos.",
            icono: "recibo",
            ruta: "/admin/boletas"
        },
        {
            titulo: "Ver reportes",
            descripcion: "Consultar ventas y productos vendidos.",
            icono: "grafico",
            ruta: "/admin/reportes"
        }
    ];

    return {
        productos,
        productosCriticos,
        usuarios,
        compras,
        comprasExitosas,
        comprasFallidas,
        totalVendido,
        unidadesVendidas,
        estadisticas,
        accesos
    };
}

export default useAdminInicio;
