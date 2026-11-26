import { useState } from "react";

import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";
import Icono from "../../components/Iconos";
import EditorTiptap from "../../components/EditorTipTap";
import DOMPurify from "dompurify";


import {
    guardarJSON,
    leerJSON
} from "../../assets/js/tienda/catalogo";

import "../../assets/styles/Contacto.css";

const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Obtener texto plano para validar el mensaje
function obtenerTextoPlano(html) {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .trim();
}

function validarFormulario(datos) {
    const errores = {};

    if (!datos.nombre.trim()) {
        errores.nombre = "El nombre es obligatorio.";
    } else if (!soloLetras.test(datos.nombre.trim())) {
        errores.nombre = "El nombre solo puede contener letras.";
    }

    if (!datos.apellido.trim()) {
        errores.apellido = "El apellido es obligatorio.";
    } else if (!soloLetras.test(datos.apellido.trim())) {
        errores.apellido = "El apellido solo puede contener letras.";
    }

    if (!formatoCorreo.test(datos.correo.trim())) {
        errores.correo = "Ingresa un correo válido.";
    }

    if (
        datos.telefono.trim() &&
        !/^\d{9}$/.test(datos.telefono.trim())
    ) {
        errores.telefono = "Ingresa un teléfono de 9 dígitos.";
    }

    const mensajePlano = obtenerTextoPlano(datos.mensaje);

    if (mensajePlano.length < 10) {
        errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
    }

    return errores;
}

const formularioVacio = {
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    mensaje: ""
};

function Contacto() {

    const [datos, setDatos] = useState(formularioVacio);
    const [errores, setErrores] = useState({});
    const [enviado, setEnviado] = useState(false);

    function manejarCambio(evento) {
        const { name, value } = evento.target;

        setDatos(actual => ({
            ...actual,
            [name]: value
        }));

        setErrores(actual => ({
            ...actual,
            [name]: ""
        }));

        setEnviado(false);
    }

    function manejarCambioMensaje(contenido) {
        setDatos(actual => ({
            ...actual,
            mensaje: contenido
        }));

        setErrores(actual => ({
            ...actual,
            mensaje: ""
        }));

        setEnviado(false);
    }

    function manejarEnvio(evento) {
        evento.preventDefault();

        const nuevosErrores = validarFormulario(datos);

        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            setEnviado(false);
            return;
        }

    // Sanitizar el contenido HTML del mensaje
    const mensajeSeguro = DOMPurify.sanitize(datos.mensaje, {
        ALLOWED_TAGS: [
            "p",
            "br",
            "strong",
            "b",
            "em",
            "i",
            "h2",
            "ul",
            "ol",
            "li"
        ],
        ALLOWED_ATTR: []
    });

    const mensajes = leerJSON("mensajesContacto", []);

        guardarJSON("mensajesContacto", [
            ...mensajes,
            {
                ...datos,
                mensaje: mensajeSeguro,
                fecha: new Date().toISOString()
            }
        ]);

        setDatos(formularioVacio);
        setEnviado(true);
    }

    function campo(nombre, etiqueta, tipo = "text") {
        return (
            <div className="col-md-6">

                <label
                    htmlFor={`contacto-${nombre}`}
                    className="form-label"
                >
                    {etiqueta}
                </label>

                <input
                    id={`contacto-${nombre}`}
                    name={nombre}
                    type={tipo}
                    className={`form-control${
                        errores[nombre] ? " is-invalid" : ""
                    }`}
                    value={datos[nombre]}
                    onChange={manejarCambio}
                />

                {errores[nombre] && (
                    <p className="mensaje-error">
                        {errores[nombre]}
                    </p>
                )}

            </div>
        );
    }

    return (
        <div className="pagina-tienda pagina-contacto">

            <NavbarTienda />

            <main>

                <section className="portada-pagina">
                    <div className="container">

                        <span className="etiqueta">
                            Contacto
                        </span>

                        <h1>
                            ¿Necesitas ayuda con tu pedido?
                        </h1>

                        <p>
                            Escríbenos tus dudas sobre tallas, medidas,
                            productos o despachos.
                        </p>

                    </div>
                </section>

                <section className="container seccion-pagina">

                    <div className="row g-4">

                        <div className="col-lg-4">

                            <aside className="contacto-info">

                                <h2>Información</h2>

                                <div className="contacto-dato">

                                    <Icono nombre="mensaje" tamano={22} />

                                    <div>
                                        <strong>Correo</strong>
                                        <span>contacto@tupolera.cl</span>
                                    </div>

                                </div>

                                <div className="contacto-dato">

                                    <Icono nombre="telefono" tamano={22} />

                                    <div>
                                        <strong>Teléfono</strong>
                                        <span>+56 2 0000 0000</span>
                                    </div>

                                </div>

                                <div className="contacto-dato">

                                    <Icono nombre="tienda" tamano={22} />

                                    <div>
                                        <strong>Tienda online</strong>

                                        <span>
                                            No tenemos local abierto al público.
                                            Los pedidos salen desde nuestro centro
                                            de distribución.
                                        </span>
                                    </div>

                                </div>

                                <p className="contacto-nota">
                                    Datos de contacto de ejemplo para esta versión
                                    del proyecto.
                                </p>

                            </aside>

                        </div>

                        <div className="col-lg-8">

                            <form
                                className="contacto-formulario"
                                onSubmit={manejarEnvio}
                                noValidate
                            >

                                <h2>Envíanos un mensaje</h2>

                                {enviado && (
                                    <div
                                        className="alert alert-success"
                                        role="status"
                                    >
                                        Tu mensaje quedó registrado.
                                        En esta versión no se envían correos reales.
                                    </div>
                                )}

                                <div className="row g-3">

                                    {campo("nombre", "Nombre")}

                                    {campo("apellido", "Apellido")}

                                    {campo(
                                        "correo",
                                        "Correo electrónico",
                                        "email"
                                    )}

                                    {campo(
                                        "telefono",
                                        "Teléfono (opcional)",
                                        "tel"
                                    )}

                                    <div className="col-12">

                                        <label className="form-label">
                                            ¿En qué te podemos ayudar?
                                        </label>

                                        <EditorTiptap
                                            contenido={datos.mensaje}
                                            onChange={manejarCambioMensaje}
                                        />

                                        {errores.mensaje && (
                                            <p className="mensaje-error">
                                                {errores.mensaje}
                                            </p>
                                        )}

                                    </div>

                                    <div className="col-12">

                                        <button
                                            type="submit"
                                            className="btn btn-tienda"
                                        >
                                            Enviar mensaje
                                        </button>

                                    </div>

                                </div>

                            </form>

                        </div>

                    </div>

                </section>

            </main>

            <FooterTienda />

        </div>
    );
}

export default Contacto;

