
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarCompra } from "./compras";
import {
    cargarCategorias,
    descontarStock,
    obtenerCategoria,
    obtenerStockTalla,
    cargarProductos,
    revisarStockCarrito
} from "./catalogo";
import { crearInstantaneaItem } from "./fichas";
import {
    calcularPrecioDespacho,
    cargarConfiguracionDespacho,
    cargarDestinoDespacho,
    guardarDestinoDespacho,
    esDestinoDespachoValido
} from "./despacho";

// Leer y validar la sesión guardada.
function cargarUsuarioActual() {
    const usuarioGuardado = localStorage.getItem("usuarioActual");

    if (!usuarioGuardado) {
        return null;
    }

    try {
        const usuario = JSON.parse(usuarioGuardado);

        if (
            !usuario ||
            !usuario.nombre ||
            !usuario.rol
        ) {
            return null;
        }

        return usuario;
    } catch {
        return null;
    }
}

// Leer el carrito guardado.
function cargarCarritoGuardado() {
    try {
        const carritoGuardado = JSON.parse(
            localStorage.getItem("carrito") || "[]"
        );

        return Array.isArray(carritoGuardado)
            ? carritoGuardado
            : [];
    } catch (error) {
        console.error("Error al cargar el carrito:", error);
        return [];
    }
}

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

    const [usuario] = useState(() => cargarUsuarioActual());
    const [carrito, setCarrito] = useState(() =>
        cargarCarritoGuardado()
    );
    const [mostrarPago, setMostrarPago] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [cargando] = useState(false);

    // Despacho: destino elegido y costo calculado.
    const [configuracionDespacho] = useState(cargarConfiguracionDespacho);
    const [destino, setDestino] = useState(null);
    const [calculoDespacho, setCalculoDespacho] = useState(null);
    const [calculandoDespacho, setCalculandoDespacho] = useState(false);
    const [errorDespacho, setErrorDespacho] = useState("");

    // Comprobar la sesión. Si no existe o es inválida, redirigir al login.
    useEffect(() => {
        if (!usuario) {
            localStorage.removeItem("usuarioActual");
            navigate("/login", { replace: true });
        }
    }, [navigate, usuario]);

    // Recuperar el destino guardado y calcular la tarifa de prueba.
    useEffect(() => {
        const destinoGuardado = cargarDestinoDespacho();

        if (!destinoGuardado) {
            return;
        }

        aplicarDestino(destinoGuardado);
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

    // Calcula el despacho utilizando la tarifa fija de prueba.
    // No necesita coordenadas ni servicios externos.
    function calcularDespacho(datosDestino) {
        const precio = calcularPrecioDespacho(
            0,
            configuracionDespacho
        );

        setDestino(datosDestino);

        setCalculoDespacho({
            distanciaKm: null,
            tipo: "tarifa_fija",
            precio
        });

        setCalculandoDespacho(false);
        setErrorDespacho("");
    }

    // Aplica la dirección y calcula inmediatamente el precio fijo.
    function aplicarDestino(nuevoDestino) {
        setCalculoDespacho(null);
        calcularDespacho(nuevoDestino);
    }

    // Recibe una dirección manual o una dirección previamente verificada.
    function seleccionarDestino(nuevoDestino) {
        if (!esDestinoDespachoValido(nuevoDestino)) {
            setErrorDespacho(
                "La dirección ingresada no es válida. Revisa sus datos."
            );
            return;
        }

        aplicarDestino(nuevoDestino);

        if (!guardarDestinoDespacho(nuevoDestino)) {
            setErrorDespacho(
                "No fue posible guardar la dirección en este navegador. Podrías tener que ingresarla de nuevo si recargas la página."
            );
        }
    }

    // Eliminar la dirección y su cálculo.
    function cambiarDireccion() {
        guardarDestinoDespacho(null);
        setDestino(null);
        setCalculoDespacho(null);
        setCalculandoDespacho(false);
        setErrorDespacho("");
    }

    // Registrar tanto los pagos aprobados como los rechazados.
    function procesarPago(estadoPago) {
        if (!usuario || carrito.length === 0) {
            return;
        }

        if (calculandoDespacho) {
            setMensaje(
                "Espera a que termine el cálculo de la estimación de despacho."
            );
            setTipoMensaje("warning");
            return;
        }

        // Se necesita una dirección válida y una estimación de despacho.
        if (!esDestinoDespachoValido(destino) || !calculoDespacho) {
            setMensaje(
                "Ingresa una dirección de despacho válida antes de pagar."
            );
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

        // Catálogo vigente en el momento de la compra.
        let catalogoActual;

        try {
            const categorias = cargarCategorias();

            catalogoActual = {
                categorias,
                productos: cargarProductos(categorias)
            };
        } catch (error) {
            console.error("Error al leer el catálogo:", error);

            setMensaje(
                "No se pudo preparar el registro de los productos. Inténtalo nuevamente."
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

            const itemComprado = {
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

            const productoCatalogo = catalogoActual.productos.find(
                actual => String(actual.id) === String(producto.id)
            );

            const categoriaProducto = productoCatalogo
                ? obtenerCategoria(
                    catalogoActual.categorias,
                    productoCatalogo.categoriaId
                )
                : null;

            // Instantánea histórica de los datos del producto.
            return {
                ...itemComprado,
                instantanea: crearInstantaneaItem(
                    itemComprado,
                    productoCatalogo ?? null,
                    categoriaProducto,
                    fecha
                )
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
            // Dirección ingresada por el cliente y estimación local de prueba.
            // El backend deberá validar la dirección y confirmar el costo definitivo.
            despacho: {
                ...destino,
                distanciaKm: calculoDespacho.distanciaKm,
                tipoCalculo: calculoDespacho.tipo,
                estimacionDePrueba: true,
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

            // El identificador que devuelve registrarCompra() es la única
            // fuente de verdad para abrir el detalle de la compra.
            const idCompra = Number(compraRegistrada?.id);

            if (!Number.isSafeInteger(idCompra) || idCompra <= 0) {
                throw new Error(
                    "El identificador de la compra registrada no es válido."
                );
            }

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

                // Abrir el detalle de la compra recién creada.
                navigate(`/usuario/compras/${idCompra}`);
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
        destino,
        calculoDespacho,
        calculandoDespacho,
        errorDespacho,
        seleccionarDestino,
        cambiarDireccion,
        configuracionDespacho,
        sumarCantidad,
        restarCantidad,
        eliminarProducto,
        procesarPago
    };
}

export default useCarrito;
