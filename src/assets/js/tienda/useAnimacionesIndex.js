import { useLayoutEffect, useRef } from "react";
import {
    activarHoverTarjetas,
    aparecer,
    crearEscena,
    DESPLAZAMIENTO,
    EASE_ENTRADA,
    gsap,
    revelarTarjetasDeCarrusel
} from "./animaciones";

/**
 * Animaciones GSAP de la página de inicio.
 *
 * Devuelve un ref que se asigna al elemento raíz de la página; los
 * elementos animables se marcan con atributos data-anim.
 *
 * Las categorías y los destacados se cargan después del primer render,
 * por eso sus tarjetas tienen su propio efecto, que depende de su cantidad.
 */
export default function useAnimacionesIndex({
    totalCategorias = 0,
    totalDestacados = 0
} = {}) {
    const raiz = useRef(null);

    // Banner, encabezados, noticias y hover (elementos que existen desde
    // el primer render). useLayoutEffect evita el parpadeo inicial.
    useLayoutEffect(() => {
        return crearEscena(raiz, ({ elemento, buscar, puntero }) => {
            // Banner principal: el carrusel entra y la leyenda va escalonada.
            const banner = buscar('[data-anim="banner"]');
            const leyenda = buscar(
                '.carousel-item.active [data-anim="banner-texto"]'
            );

            if (banner.length > 0) {
                const linea = gsap.timeline({
                    defaults: { ease: EASE_ENTRADA }
                });

                linea.fromTo(
                    banner,
                    { opacity: 0, y: DESPLAZAMIENTO },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        clearProps: "opacity,transform"
                    }
                );

                if (leyenda.length > 0) {
                    linea.fromTo(
                        leyenda,
                        { opacity: 0, y: 16 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            stagger: 0.1,
                            clearProps: "opacity,transform"
                        },
                        "-=0.35"
                    );
                }
            }

            // Encabezados de sección: etiqueta, título y subtítulo.
            buscar('[data-anim="encabezado"]').forEach((encabezado) => {
                aparecer(Array.from(encabezado.children), {
                    disparador: encabezado,
                    escalonado: 0.1
                });
            });

            // Noticias: aparición gradual al entrar en pantalla.
            aparecer(buscar('[data-anim="noticias"]'), {
                disparador: buscar('[data-anim="noticias"]')[0]
            });

            // Hover solo en dispositivos con cursor.
            if (!puntero) {
                return undefined;
            }

            return activarHoverTarjetas(elemento, [
                {
                    selector: ".tarjeta-categoria",
                    elevacion: 5,
                    imagen: ".imagen-categoria",
                    zoom: 1.04
                },
                {
                    selector: ".tarjeta-producto",
                    elevacion: 4
                }
            ]);
        });
    }, []);

    // Tarjetas de categorías (llegan después del primer render).
    useLayoutEffect(() => {
        if (totalCategorias === 0) {
            return undefined;
        }

        return crearEscena(raiz, ({ buscar }) => {
            revelarTarjetasDeCarrusel(
                buscar('[data-anim="carrusel-categorias"]')[0]
            );
        });
    }, [totalCategorias]);

    // Tarjetas de productos destacados.
    useLayoutEffect(() => {
        if (totalDestacados === 0) {
            return undefined;
        }

        return crearEscena(raiz, ({ buscar }) => {
            revelarTarjetasDeCarrusel(
                buscar('[data-anim="carrusel-destacados"]')[0]
            );
        });
    }, [totalDestacados]);

    return raiz;
}
