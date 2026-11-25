
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarCompra } from "./compras";
import {
    descontarStock,
    obtenerStockTalla,
    cargarProductos,
    revisarStockCarrito
} from "./catalogo";
import {
    calcularPrecioDespacho,
    cargarConfiguracionDespacho,
    cargarDestinoDespacho,
    guardarDestinoDespacho
} from "./despacho";
import {
    calcularDistanciaRuta,
    geocodificarDireccion,
    mapasConfigurado
} from "../../../services/googleMaps";

function formatearPrecio(precio) {
    return "$" + Number(precio || 0).toLocaleString("es-CL");
}

function obtenerPrecioFinal(producto) {
    const precio = Number(producto.precio) || 0;

    const descuento = Math.min(
        100,
        Math.max(0, Number(producto.descuento) || 0)
    );

    return Math.round(precio - (precio * descuento / 100));
}

function useCarrito() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [mostrarPago, setMostrarPago] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [cargando, setCargando] = useState(true);

    // Despacho: destino elegido y costo calculado.
    const [configuracionDespacho] = useState(cargarConfiguracionDespacho);
    const [direccionTexto, setDireccionTexto] = useState("");
    const [destino, setDestino] = useState(null);
    const [calculoDespacho, setCalculoDespacho] = useState(null);
    const [calculandoDespacho, setCalculandoDespacho] = useState(false);
    const [errorDespacho, setErrorDespacho] = useState("");

    // Comprobar la sesión y cargar los productos.
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuarioActual");

        if (!usuarioGuardado) {
            navigate("/login", { replace: true });
            return;
        }

        let usuarioActual;

        try {
            usuarioActual = JSON.parse(usuarioGuardado);
        } catch {
            localStorage.removeItem("usuarioActual");
            navigate("/login", { replace: true });
            return;
        }

        if (
            !usuarioActual ||
            !usuarioActual.nombre ||
            !usuarioActual.rol
        ) {
            localStorage.removeItem("usuarioActual");
            navigate("/login", { replace: true });
            return;
        }

        setUsuario(usuarioActual);

        // Un carrito inválido no debería cerrar la sesión.
        try {
            const carritoGuardado = JSON.parse(
                localStorage.getItem("carrito") || "[]"
            );

            setCarrito(
                Array.isArray(carritoGuardado)
                    ? carritoGuardado
                    : []
            );
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            setCarrito([]);
        }

        setCargando(false);
    }, [navigate]);

    // Recupera el destino guardado y recalcula su costo con la
    // configuración vigente del centro de distribución.
    useEffect(() => {
        const destinoGuardado = cargarDestinoDespacho();

        if (!destinoGuardado) {
            return;
        }

        setDireccionTexto(destinoGuardado.direccion);
        calcularDespacho(destinoGuardado);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Guardar los cambios realizados en el carrito.
    function guardarCarrito(nuevoCarrito) {
        try {
            localStorage.setItem(
                "carrito",
                JSON.stringify(nuevoCarrito)
            );

            setCarrito(nuevoCarrito);
            setMensaje("");
            setMostrarPago(false);
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
            setMensaje(
                "No fue posible guardar los cambios del carrito."
            );
            setTipoMensaje("danger");
        }
    }

    // Aumentar la cantidad de un producto.
    function sumarCantidad(indice) {
        const productos = cargarProductos();
        const item = carrito[indice];

        const producto = productos.find(
            actual => String(actual.id) === String(item?.id)
        );

        const disponible = producto
            ? obtenerStockTalla(producto, item.talla)
            : 0;

        if ((Number(item?.cantidad) || 1) + 1 > disponible) {
            setMensaje(
                disponible === 0
                    ? "Este producto ya no tiene stock disponible."
                    : `Solo hay ${disponible} unidad(es) disponible(s) de este producto.`
            );
            setTipoMensaje("warning");
            return;
        }

        const nuevoCarrito = carrito.map((producto, i) => {
            if (i === indice) {
                return {
                    ...producto,
                    cantidad: (Number(producto.cantidad) || 1) + 1
                };
            }

            return producto;
        });

        guardarCarrito(nuevoCarrito);
    }

    // Disminuir la cantidad sin bajar de uno.
    function restarCantidad(indice) {
        const nuevoCarrito = carrito.map((producto, i) => {
            if (i === indice) {
                return {
                    ...producto,
                    cantidad: Math.max(
                        1,
                        (Number(producto.cantidad) || 1) - 1
                    )
                };
            }

            return producto;
        });

        guardarCarrito(nuevoCarrito);
    }

    // Eliminar un producto del carrito.
    function eliminarProducto(indice) {
        const nuevoCarrito = carrito.filter(
            (_, i) => i !== indice
        );

        guardarCarrito(nuevoCarrito);
    }

    // Calcular el subtotal aplicando los descuentos.
    const subtotal = carrito.reduce((acumulado, producto) => {
        const cantidad = Math.max(
            1,
            Number(producto.cantidad) || 1
        );

        return acumulado + obtenerPrecioFinal(producto) * cantidad;
    }, 0);

    // El envío se cobra solo cuando hay productos y un destino calculado.
    const envio = carrito.length > 0 && calculoDespacho
        ? calculoDespacho.precio
        : 0;

    const total = subtotal + envio;

    // Calcula la distancia por ruta y el precio del despacho.
    async function calcularDespacho(datosDestino) {
        setCalculandoDespacho(true);
        setErrorDespacho("");

        try {
            const { distanciaKm, tipo } = await calcularDistanciaRuta(
                {
                    latitud: configuracionDespacho.latitud,
                    longitud: configuracionDespacho.longitud
                },
                datosDestino
            );

            setDestino(datosDestino);

            setCalculoDespacho({
                distanciaKm,
                tipo,
                precio: calcularPrecioDespacho(distanciaKm, configuracionDespacho)
            });
        } catch (error) {
            setErrorDespacho(error.message);
        } finally {
            setCalculandoDespacho(false);
        }
    }

    // Busca la dirección escrita, valida que esté en Chile y calcula el costo.
    async function buscarDireccion(evento) {
        evento?.preventDefault();

        setErrorDespacho("");
        setCalculoDespacho(null);
        setDestino(null);
        setCalculandoDespacho(true);

        try {
            const resultado = await geocodificarDireccion(direccionTexto);

            guardarDestinoDespacho(resultado);
            setDireccionTexto(resultado.direccion);

            await calcularDespacho(resultado);
        } catch (error) {
            setErrorDespacho(error.message);
            setCalculandoDespacho(false);
        }
    }

    // Sin servicio de mapas solo se puede aplicar la tarifa base,
    // y se informa claramente al cliente.
    function usarTarifaBase() {
        const direccion = direccionTexto.trim();

        if (direccion.length < 5) {
            setErrorDespacho("Escribe una dirección con calle y número.");
            return;
        }

        setErrorDespacho("");
        setDestino({ direccion, latitud: null, longitud: null });

        setCalculoDespacho({
            distanciaKm: null,
            tipo: "tarifa_base",
            precio: calcularPrecioDespacho(0, configuracionDespacho)
        });
    }

    function cambiarDireccion() {
        guardarDestinoDespacho(null);
        setDestino(null);
        setCalculoDespacho(null);
        setErrorDespacho("");
    }

    // Registrar tanto los pagos aprobados como los rechazados.
    function procesarPago(estadoPago) {
        if (!usuario || carrito.length === 0) {
            return;
        }

        if (!destino || !calculoDespacho) {
            setMensaje("Ingresa la dirección de despacho antes de pagar.");
            setTipoMensaje("danger");
            return;
        }

        const pagoAprobado = estadoPago === "Aprobado";

        // Se revisa el stock justo antes de confirmar la compra.
        if (pagoAprobado) {
            const problemas = revisarStockCarrito(carrito);

            if (problemas.length > 0) {
                setMensaje(
                    `No se pudo confirmar la compra. ${problemas
                        .map(problema => problema.mensaje)
                        .join(" ")}`
                );
                setTipoMensaje("danger");
                return;
            }
        }

        const fecha = new Date().toISOString();
        const numeroOperacion = `TP-${Date.now()}`;

        const identificadorUsuario =
            usuario.id ?? usuario.correo?.toLowerCase();

        if (
            identificadorUsuario === null ||
            identificadorUsuario === undefined ||
            identificadorUsuario === ""
        ) {
            setMensaje(
                "No se pudo identificar al usuario para registrar la compra."
            );
            setTipoMensaje("danger");
            return;
        }

        // Copiar los datos de los productos para conservar el historial.
        const productosComprados = carrito.map((producto) => {
            const precioOriginal = Number(producto.precio) || 0;

            const descuento = Math.min(
                100,
                Math.max(0, Number(producto.descuento) || 0)
            );

            const cantidad = Math.max(
                1,
                Number(producto.cantidad) || 1
            );

            const precioFinal = obtenerPrecioFinal(producto);

            return {
                id: producto.id ?? null,
                nombre: producto.nombre || "Producto",
                imagen: producto.imagen || "",
                talla: producto.talla || "Única",
                precio: precioFinal,
                precioOriginal,
                descuento,
                cantidad,
                subtotal: precioFinal * cantidad
            };
        });

        const compra = {
            numero: numeroOperacion,
            fecha,
            estado: pagoAprobado ? "exitosa" : "fallida",
            estadoPago,
            subtotal,
            envio,
            total,
            despacho: {
                direccion: destino.direccion,
                latitud: destino.latitud,
                longitud: destino.longitud,
                distanciaKm: calculoDespacho.distanciaKm,
                tipoCalculo: calculoDespacho.tipo,
                origen: configuracionDespacho.direccion
            },
            items: productosComprados,
            operacion: numeroOperacion
        };

        const claveCompras = `compras_${identificadorUsuario}`;

        try {
            // Comprobar el historial individual antes de registrar.
            const comprasGuardadas = JSON.parse(
                localStorage.getItem(claveCompras) || "[]"
            );

            if (!Array.isArray(comprasGuardadas)) {
                throw new Error(
                    "El historial de compras no es válido."
                );
            }

            // Registrar la compra general que consulta la administración.
            const compraRegistrada = registrarCompra(compra, {
                ...usuario,
                id: identificadorUsuario
            });

            // Mantener el historial individual del usuario.
            const compraUsuario = {
                ...compraRegistrada,
                id: numeroOperacion,
                usuarioId: identificadorUsuario,
                nombreUsuario: usuario.nombre,
                correoUsuario: usuario.correo || "",
                fecha,
                productos: productosComprados,
                estadoPago,
                boleta: {
                    numero: numeroOperacion,
                    fecha,
                    cliente: usuario.nombre,
                    correo: usuario.correo || "",
                    productos: productosComprados,
                    subtotal,
                    envio,
                    total,
                    estado: estadoPago
                }
            };

            localStorage.setItem(
                claveCompras,
                JSON.stringify([
                    ...comprasGuardadas,
                    compraUsuario
                ])
            );

            if (pagoAprobado) {
                // Descontar las unidades vendidas del stock de cada talla.
                descontarStock(productosComprados);

                // Vaciar el carrito solamente si el pago fue aprobado.
                localStorage.setItem("carrito", JSON.stringify([]));

                setCarrito([]);
                setMostrarPago(false);

                setMensaje(
                    `Pago aprobado. Tu compra quedó registrada. Número de operación: ${numeroOperacion}`
                );
                setTipoMensaje("success");
            } else {
                // Conservar los productos para permitir otro intento.
                setMensaje(
                    `Pago rechazado. El intento quedó registrado con el número ${numeroOperacion}. Puedes volver a intentarlo.`
                );
                setTipoMensaje("danger");
            }
        } catch (error) {
            console.error("Error al registrar el pago:", error);

            setMensaje(
                "No se pudo guardar el registro del pago. Revisa el historial de compras e inténtalo nuevamente."
            );
            setTipoMensaje("danger");
        }
    }

    return {
        usuario,
        carrito,
        mostrarPago,
        setMostrarPago,
        mensaje,
        tipoMensaje,
        cargando,
        subtotal,
        envio,
        total,
        formatearPrecio,
        obtenerPrecioFinal,
        direccionTexto,
        setDireccionTexto,
        destino,
        calculoDespacho,
        calculandoDespacho,
        errorDespacho,
        buscarDireccion,
        usarTarifaBase,
        cambiarDireccion,
        configuracionDespacho,
        mapasConfigurado: mapasConfigurado(),
        sumarCantidad,
        restarCantidad,
        eliminarProducto,
        procesarPago
    };
}

export default useCarrito;
