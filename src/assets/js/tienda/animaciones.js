
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Configuración y utilidades compartidas por las animaciones de la tienda
// (Home y Productos). Solo se animan opacity y transform.

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const DESPLAZAMIENTO = 20;
export const DURACION = 0.6;
export const DURACION_CORTA = 0.3;
export const ESCALONADO = 0.08;
export const EASE_ENTRADA = "power2.out";
export const INICIO_SCROLL = "top 88%";

// Se limpian también los estilos en línea que deja GSAP al terminar,
// para no dejar transformaciones residuales en los contenedores.
const LIMPIAR = "opacity,transform";

const CONSULTAS = {
    movimiento: "(prefers-reduced-motion: no-preference)",
    puntero: "(hover: hover) and (pointer: fine)"
};

/**
 * Crea una escena de animaciones asociada a un elemento raíz.
 *
 * - Usa gsap.context() para que todo lo creado se pueda revertir.
 * - Usa gsap.matchMedia(): con prefers-reduced-motion: reduce no se
 *   construye nada y el contenido queda visible de inmediato.
 * - Devuelve la función de limpieza (revert de animaciones y ScrollTriggers),
 *   pensada para retornarse desde un efecto. Es segura con StrictMode.
 *
 * construir({ elemento, buscar, puntero, enContexto }) puede devolver una
 * función de limpieza propia.
 */
export function crearEscena(raiz, construir) {
    const elemento = raiz?.current;

    if (!elemento) {
        return () => {};
    }

    let ctx = null;
    let mm = null;
    let activo = true;

    const limpiar = () => {
        activo = false;
        mm?.revert();
        ctx?.revert();
    };

    ctx = gsap.context(() => {
        mm = gsap.matchMedia();

        mm.add(CONSULTAS, (contexto) => {
            const { movimiento, puntero } = contexto.conditions;

            if (!movimiento) {
                return undefined;
            }

            try {
                return construir({
                    elemento,
                    puntero,
                    buscar: gsap.utils.selector(elemento),
                    // Permite crear animaciones más tarde y registrarlas
                    // en el contexto para que también se puedan limpiar.
                    enContexto: (funcion) => ctx.add(funcion)
                });
            } catch (error) {
                // Si algo falla, se deshace todo para no dejar contenido oculto.
                console.error("[animaciones] No se pudieron iniciar:", error);
                queueMicrotask(limpiar);
                return undefined;
            }
        });
    }, elemento);

    // Las fuentes web pueden cambiar la altura de la página.
    document.fonts?.ready?.then(() => {
        if (activo) {
            ScrollTrigger.refresh();
        }
    });

    return limpiar;
}

/**
 * Entrada gradual (opacity + desplazamiento corto). Los elementos quedan
 * ocultos de inmediato, antes del primer pintado.
 * Si recibe `disparador`, la animación espera a que entre en pantalla.
 */
export function aparecer(elementos, {
    disparador = null,
    y = DESPLAZAMIENTO,
    duracion = DURACION,
    escalonado = 0,
    retardo = 0,
    inicio = INICIO_SCROLL
} = {}) {
    const lista = gsap.utils.toArray(elementos);

    if (lista.length === 0) {
        return null;
    }

    return gsap.fromTo(
        lista,
        { opacity: 0, y },
        {
            opacity: 1,
            y: 0,
            duration: duracion,
            ease: EASE_ENTRADA,
            stagger: escalonado,
            delay: retardo,
            clearProps: LIMPIAR,
            scrollTrigger: disparador
                ? { trigger: disparador, start: inicio, once: true }
                : undefined
        }
    );
}

/**
 * Aparición escalonada de las tarjetas ([data-anim="tarjeta"]) de un
 * carrusel de Bootstrap. Solo se animan las de la diapositiva activa:
 * las demás tienen display: none y no se pueden medir.
 */
export function revelarTarjetasDeCarrusel(
    carrusel,
    enContexto = (funcion) => funcion()
) {
    if (!carrusel) {
        return;
    }

    const todas = Array.from(
        carrusel.querySelectorAll('[data-anim="tarjeta"]')
    );

    const esActiva = (el) =>
        Boolean(el.closest(".carousel-item.active"));

    const iniciales = todas.filter(esActiva);

    if (iniciales.length === 0) {
        return;
    }

    gsap.set(iniciales, {
        opacity: 0,
        y: DESPLAZAMIENTO
    });

    ScrollTrigger.create({
        trigger: carrusel,
        start: INICIO_SCROLL,
        once: true,
        onEnter: (self) => {
            self.kill();

            // La diapositiva activa puede haber cambiado mientras tanto.
            const visibles = todas.filter(esActiva);
            const resto = todas.filter(
                (el) => !visibles.includes(el)
            );

            // Registra las animaciones creadas después del evento.
            enContexto(() => {
                // Nada debe quedar oculto: las que ya no se ven se restauran.
                gsap.set(resto, {
                    clearProps: LIMPIAR
                });

                gsap.fromTo(
                    visibles,
                    {
                        opacity: 0,
                        y: DESPLAZAMIENTO
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: DURACION,
                        ease: EASE_ENTRADA,
                        stagger: ESCALONADO,
                        clearProps: LIMPIAR
                    }
                );
            });
        }
    });
}

/**
 * Hover de tarjetas con un único par de listeners delegados en la raíz
 * (sirve también para tarjetas que React agrega después).
 *
 * configuraciones: [{ selector, elevacion, imagen?, zoom? }]
 * Devuelve la función que quita los listeners y restablece la tarjeta activa.
 */
export function activarHoverTarjetas(
    raiz,
    configuraciones,
    enContexto = (funcion) => funcion()
) {
    const selectorTodas = configuraciones
        .map((c) => c.selector)
        .join(",");

    let activa = null;

    const configDe = (tarjeta) =>
        configuraciones.find((c) => tarjeta.matches(c.selector));

    function entrar(tarjeta) {
        const config = configDe(tarjeta);

        enContexto(() => {
            gsap.to(tarjeta, {
                y: -config.elevacion,
                duration: DURACION_CORTA,
                ease: EASE_ENTRADA,
                overwrite: "auto"
            });

            const imagen = config.zoom &&
                tarjeta.querySelector(config.imagen);

            if (imagen) {
                gsap.to(imagen, {
                    scale: config.zoom,
                    duration: 0.5,
                    ease: EASE_ENTRADA,
                    overwrite: "auto"
                });
            }
        });
    }

    function salir(tarjeta, inmediato = false) {
        const config = configDe(tarjeta);

        if (!config) {
            return;
        }

        const duracion = inmediato ? 0 : DURACION_CORTA;

        enContexto(() => {
            gsap.to(tarjeta, {
                y: 0,
                duration: duracion,
                ease: EASE_ENTRADA,
                overwrite: "auto"
            });

            const imagen = config.zoom &&
                tarjeta.querySelector(config.imagen);

            if (imagen) {
                gsap.to(imagen, {
                    scale: 1,
                    duration: inmediato ? 0 : 0.5,
                    ease: EASE_ENTRADA,
                    overwrite: "auto"
                });
            }
        });
    }

    function alEntrar(evento) {
        const tarjeta = evento.target.closest?.(selectorTodas);

        if (
            !tarjeta ||
            tarjeta === activa ||
            !raiz.contains(tarjeta)
        ) {
            return;
        }

        if (activa) {
            salir(activa);
        }

        activa = tarjeta;
        entrar(tarjeta);
    }

    function alSalir(evento) {
        if (!activa) {
            return;
        }

        if (
            evento.relatedTarget &&
            activa.contains(evento.relatedTarget)
        ) {
            return;
        }

        salir(activa);
        activa = null;
    }

    raiz.addEventListener("mouseover", alEntrar);
    raiz.addEventListener("mouseout", alSalir);

    return () => {
        raiz.removeEventListener("mouseover", alEntrar);
        raiz.removeEventListener("mouseout", alSalir);

        if (activa) {
            salir(activa, true);
            activa = null;
        }
    };
}
