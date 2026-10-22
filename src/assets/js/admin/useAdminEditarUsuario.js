
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { regiones } from "../../../data/regionesComunas";

function cargarUsuarios() {
    const usuariosGuardados = localStorage.getItem("usuarios");
    return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
}

function obtenerUsuario(id) {
    if (!id) return null;

    const usuarios = cargarUsuarios();

    return usuarios.find(function (usuario) {
        return usuario.id === Number(id);
    }) || null;
}

function crearFormulario(usuario) {
    return {
        nombre: usuario?.nombre || "",
        correo: usuario?.correo || "",
        rut: usuario?.rut || "",
        region: usuario?.region || "",
        comuna: usuario?.comuna || "",
        password: "",
        rol: usuario?.rol || ""
    };
}

// Valida el formato y el dígito verificador del RUT chileno.
function validarRut(rut) {
    const rutLimpio = rut
        .trim()
        .replace(/\./g, "")
        .replace(/-/g, "")
        .toUpperCase();

    if (!/^\d{7,8}[0-9K]$/.test(rutLimpio)) {
        return false;
    }

    const cuerpo = rutLimpio.slice(0, -1);
    const digitoIngresado = rutLimpio.slice(-1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;

        multiplicador = multiplicador === 7
            ? 2
            : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);

    let digitoCalculado;

    if (resto === 11) {
        digitoCalculado = "0";
    } else if (resto === 10) {
        digitoCalculado = "K";
    } else {
        digitoCalculado = String(resto);
    }

    return digitoIngresado === digitoCalculado;
}

// Comprueba que el correo tenga un formato básico válido.
function validarCorreo(correo) {
    const correoLimpio = correo.trim();

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio);
}

function normalizarRut(rut) {
    return rut
        .trim()
        .replace(/[.\-\s]/g, "")
        .toUpperCase();
}

function useAdminEditarUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();

    const usuarioExistente = obtenerUsuario(id);

    const [formulario, setFormulario] = useState(
        () => crearFormulario(usuarioExistente)
    );

    const [errores, setErrores] = useState({});

    const esEdicion = Boolean(id);

    const comunas = formulario.region
        ? regiones[formulario.region] || []
        : [];

    function manejarCambio(evento) {
        const { name, value } = evento.target;

        setFormulario(function (anterior) {
            if (name === "region") {
                return {
                    ...anterior,
                    region: value,
                    comuna: ""
                };
            }

            return {
                ...anterior,
                [name]: value
            };
        });

        setErrores(function (anteriores) {
            return {
                ...anteriores,
                [name]: ""
            };
        });
    }

    function guardarUsuario(evento) {
        evento.preventDefault();

        const nuevosErrores = {};

        const nombre = formulario.nombre.trim();
        const correo = formulario.correo.trim();
        const rut = formulario.rut.trim();

        if (!nombre) {
            nuevosErrores.nombre = "Ingresa el nombre.";
        }

        if (!correo) {
            nuevosErrores.correo = "Ingresa el correo.";
        } else if (!validarCorreo(correo)) {
            nuevosErrores.correo = "Ingresa un correo electrónico válido.";
        }

        if (!rut) {
            nuevosErrores.rut = "Ingresa el RUT.";
        } else if (!validarRut(rut)) {
            nuevosErrores.rut = "El RUT no es válido. Revisa el número y su dígito verificador.";
        }

        if (!formulario.region) {
            nuevosErrores.region = "Selecciona una región.";
        }

        if (!formulario.comuna) {
            nuevosErrores.comuna = "Selecciona una comuna.";
        }

        if (!esEdicion && !formulario.password.trim()) {
            nuevosErrores.password = "Ingresa una contraseña.";
        }

        if (!formulario.rol) {
            nuevosErrores.rol = "Selecciona un rol.";
        }

        const usuarios = cargarUsuarios();

        const correoDuplicado = usuarios.some(function (usuario) {
            return usuario.correo.toLowerCase() === correo.toLowerCase() &&
                usuario.id !== Number(id);
        });

        if (correo && correoDuplicado) {
            nuevosErrores.correo = "Este correo ya está registrado.";
        }

        const rutNormalizado = normalizarRut(rut);

        const rutDuplicado = usuarios.some(function (usuario) {
            return normalizarRut(usuario.rut) === rutNormalizado &&
                usuario.id !== Number(id);
        });

        if (rut && rutDuplicado) {
            nuevosErrores.rut = "Este RUT ya está registrado.";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        let usuarioGuardado;

        if (esEdicion) {
            if (!usuarioExistente) {
                setErrores({
                    general: "No se encontró el usuario que intentas editar."
                });
                return;
            }

            usuarioGuardado = {
                ...usuarioExistente,
                nombre,
                correo,
                rut,
                region: formulario.region,
                comuna: formulario.comuna,
                rol: formulario.rol
            };

            // Si se ingresa una contraseña nueva, se actualiza.
            // Si se deja vacía, se conserva la anterior.
            if (formulario.password.trim()) {
                usuarioGuardado.password = formulario.password;
            }

            const usuariosActualizados = usuarios.map(function (usuario) {
                return usuario.id === Number(id)
                    ? usuarioGuardado
                    : usuario;
            });

            try {
                localStorage.setItem(
                    "usuarios",
                    JSON.stringify(usuariosActualizados)
                );
            } catch {
                setErrores({
                    general: "No se pudo guardar el usuario."
                });
                return;
            }
        } else {
            const nuevoId = usuarios.length > 0
                ? Math.max(...usuarios.map(function (usuario) {
                    return Number(usuario.id) || 0;
                })) + 1
                : 1;

            usuarioGuardado = {
                id: nuevoId,
                nombre,
                correo,
                rut,
                region: formulario.region,
                comuna: formulario.comuna,
                password: formulario.password,
                rol: formulario.rol
            };

            usuarios.push(usuarioGuardado);

            try {
                localStorage.setItem(
                    "usuarios",
                    JSON.stringify(usuarios)
                );
            } catch {
                setErrores({
                    general: "No se pudo guardar el usuario."
                });
                return;
            }
        }

        navigate("/admin/usuarios");
    }

    return {
        id,
        usuarioExistente,
        esEdicion,
        formulario,
        errores,
        regiones,
        comunas,
        manejarCambio,
        guardarUsuario
    };
}

export default useAdminEditarUsuario;
