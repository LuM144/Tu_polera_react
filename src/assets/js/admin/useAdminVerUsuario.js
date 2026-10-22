
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function cargarUsuario(id) {
    const usuariosGuardados = localStorage.getItem("usuarios");

    const usuarios = usuariosGuardados
        ? JSON.parse(usuariosGuardados)
        : [];

    return usuarios.find(function (usuario) {
        return usuario.id === Number(id);
    }) || null;
}

function useAdminVerUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [usuario] = useState(function () {
        return cargarUsuario(id);
    });

    const [mostrarModal, setMostrarModal] = useState(false);

    function abrirModal() {
        setMostrarModal(true);
    }

    function cerrarModal() {
        setMostrarModal(false);
    }

    function eliminarUsuario() {
        const usuariosGuardados = localStorage.getItem("usuarios");

        const usuarios = usuariosGuardados
            ? JSON.parse(usuariosGuardados)
            : [];

        const usuariosActualizados = usuarios.filter(function (usuarioActual) {
            return usuarioActual.id !== Number(id);
        });

        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuariosActualizados)
        );

        // Eliminar la sesión si pertenece al usuario eliminado.
        const sesionGuardada = localStorage.getItem("usuarioActual");

        if (sesionGuardada) {
            const usuarioActual = JSON.parse(sesionGuardada);

            if (usuarioActual.id === Number(id)) {
                localStorage.removeItem("usuarioActual");
            }
        }

        navigate("/admin/usuarios");
    }

    return {
        usuario,
        mostrarModal,
        abrirModal,
        cerrarModal,
        eliminarUsuario
    };
}

export default useAdminVerUsuario;
