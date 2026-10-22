import { useEffect, useState } from "react";
import { productosIniciales } from "../../../data/productosIniciales";
import { UsuariosTest } from "../../../data/usuariosTest";
import {
    obtenerCompras,
    calcularTotalCompra
} from "../tienda/compras";

function useAdminInicio() {
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [compras, setCompras] = useState([]);

    useEffect(() => {
        // Obtener productos guardados o utilizar los iniciales.
        const productosGuardados = localStorage.getItem("productos");

        if (productosGuardados !== null) {
            try {
                const datosProductos = JSON.parse(productosGuardados);

                setProductos(
                    Array.isArray(datosProductos)
                        ? datosProductos
                        : productosIniciales
                );
            } catch (error) {
                console.error("Error al obtener los productos:", error);
                setProductos(productosIniciales);
            }
        } else {
            setProductos(productosIniciales);
        }

        // Obtener usuarios guardados o utilizar los usuarios de prueba.
        const usuariosGuardados = localStorage.getItem("usuarios");

        if (usuariosGuardados !== null) {
            try {
                const datosUsuarios = JSON.parse(usuariosGuardados);

                setUsuarios(
                    Array.isArray(datosUsuarios)
                        ? datosUsuarios
                        : UsuariosTest
                );
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
                setUsuarios(UsuariosTest);
            }
        } else {
            setUsuarios(UsuariosTest);
        }

        // Obtener todas las compras, exitosas y fallidas.
        setCompras(obtenerCompras());
    }, []);

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
            icono: "bi bi-box-seam",
            color: "primary",
            ruta: "/admin/productos"
        },
        {
            titulo: "Usuarios",
            cantidad: usuarios.length,
            descripcion: "Usuarios registrados en la tienda.",
            icono: "bi bi-people",
            color: "info",
            ruta: "/admin/usuarios"
        },
        {
            titulo: "Compras registradas",
            cantidad: compras.length,
            descripcion: "Total de intentos de compra registrados.",
            icono: "bi bi-receipt",
            color: "secondary",
            ruta: "/admin/boletas"
        },
        {
            titulo: "Compras exitosas",
            cantidad: comprasExitosas.length,
            descripcion: "Compras que finalizaron correctamente.",
            icono: "bi bi-check-circle",
            color: "success",
            ruta: "/admin/boletas"
        },
        {
            titulo: "Compras fallidas",
            cantidad: comprasFallidas.length,
            descripcion: "Compras que no se completaron.",
            icono: "bi bi-x-circle",
            color: "danger",
            ruta: "/admin/boletas"
        },
        {
            titulo: "Total vendido",
            cantidad: `$${totalVendido.toLocaleString("es-CL")}`,
            descripcion: "Ingresos de las compras exitosas.",
            icono: "bi bi-currency-dollar",
            color: "success",
            ruta: "/admin/reportes"
        },
        {
            titulo: "Unidades vendidas",
            cantidad: unidadesVendidas,
            descripcion: "Unidades incluidas en compras exitosas.",
            icono: "bi bi-bag-check",
            color: "warning",
            ruta: "/admin/reportes"
        }
    ];

    // Accesos directos a las secciones de administración.
    const accesos = [
        {
            titulo: "Administrar productos",
            descripcion: "Agregar, editar y eliminar productos.",
            icono: "bi bi-box-seam",
            ruta: "/admin/productos"
        },
        {
            titulo: "Administrar usuarios",
            descripcion: "Consultar y gestionar usuarios registrados.",
            icono: "bi bi-people",
            ruta: "/admin/usuarios"
        },
        {
            titulo: "Administrar boletas",
            descripcion: "Consultar pagos exitosos y fallidos.",
            icono: "bi bi-receipt",
            ruta: "/admin/boletas"
        },
        {
            titulo: "Ver reportes",
            descripcion: "Consultar ventas y productos vendidos.",
            icono: "bi bi-bar-chart",
            ruta: "/admin/reportes"
        }
    ];

    return {
        productos,
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