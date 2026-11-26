import { useLayoutEffect, useRef } from "react";
import {
    activarHoverTarjetas,
    aparecer,
    crearEscena,
    DESPLAZAMIENTO,
    DURACION,
    EASE_ENTRADA,
    ESCALONADO,
    gsap,
    ScrollTrigger
} from "./animaciones";

/**
 * Animaciones GSAP de la página de productos.
 *
 * Devuelve un ref para el elemento raíz de la página.
 * `clavesProductos` es un texto que cambia solo cuando cambia la lista de
 * productos mostrados (por ejemplo, los ids unidos). Un re-render normal o
 * abrir el modal no lo cambian, así que no se repite ninguna animación.
 */
export default function useAnimacionesProductos(clavesProductos) {
    const raiz = useRef(null);

    // Función que anima las tarjetas nuevas; null si no hay movimiento.
    const animarNuevas = useRef(null);

    // Tarjetas (elementos del DOM) que ya se mostraron.
    const mostradas = useRef(new WeakSet());

    // Portada, filtros, hover y preparación de las tarjetas.
    useLayoutEffect(() => {
        const limpiar = crearEscena(raiz, ({
            elemento,
            buscar,
            puntero,
            enContexto
        }) => {
            // Portada: etiqueta, título y texto, escalonados.
            aparecer(buscar('[data-anim="portada-item"]'), {
                escalonado: 0.1,
                duracion: 0.6
            });

            // Filtros: aparición gradual, sin tocar su funcionamiento.
            aparecer(buscar('[data-anim="filtros"]'), {
                y: 12,
                retardo: 0.2
            });

            let disparadores = [];

            animarNuevas.current = () => enContexto(() => {
                const tarjetas = buscar('[data-anim="tarjeta"]');
                const pendientes = tarjetas.filter(
                    (tarjeta) => !mostradas.current.has(tarjeta)
                );

                // Se reemplazan los disparadores anteriores; las tarjetas que
                // seguían pendientes vuelven a incluirse en este.
                disparadores.forEach((disparador) => disparador.kill());
                disparadores = [];

                if (pendientes.length === 0) {
                    return;
                }

                gsap.set(pendientes, { opacity: 0, y: DESPLAZAMIENTO });

                disparadores = ScrollTrigger.batch(pendientes, {
                    start: "top 92%",
                    once: true,
                    interval: 0.1,
                    batchMax: 6,
                    onEnter: (lote) => {
                        const nuevas = lote.filter(
                            (tarjeta) => !mostradas.current.has(tarjeta)
                        );

                        nuevas.forEach((tarjeta) =>
                            mostradas.current.add(tarjeta)
                        );

                        gsap.to(nuevas, {
                            opacity: 1,
                            y: 0,
                            duration: DURACION,
                            ease: EASE_ENTRADA,
                            stagger: ESCALONADO,
                            overwrite: "auto",
                            clearProps: "opacity,transform"
                        });
                    }
                });
            });

            const quitarHover = puntero
                ? activarHoverTarjetas(elemento, [
                    {
                        selector: ".tarjeta-producto",
                        elevacion: 4,
                        imagen: ".imagen-producto",
                        zoom: 1.04
                    }
                ])
                : null;

            return () => {
                animarNuevas.current = null;
                disparadores.forEach((disparador) => disparador.kill());
                quitarHover?.();
            };
        });

        return () => {
            limpiar();

            // Con StrictMode el efecto se monta dos veces: al volver a
            // montarse las tarjetas deben contarse como nuevas.
            mostradas.current = new WeakSet();
        };
    }, []);

    // Solo cuando cambia la lista mostrada: anima únicamente las tarjetas
    // nuevas (las que se mantienen conservan su elemento y no se repiten).
    useLayoutEffect(() => {
        animarNuevas.current?.();
    }, [clavesProductos]);

    return raiz;
}
