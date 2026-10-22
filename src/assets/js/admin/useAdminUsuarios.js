import { useState } from "react";
import { UsuariosTest } from "../../../data/usuariosTest";

function cargarUsuarios() {
    const usuariosGuardados = localStorage.getItem("usuarios");

    if (usuariosGuardados !== null) {
        return JSON.parse(usuariosGuardados);
    }

    localStorage.setItem("usuarios", JSON.stringify(UsuariosTest));

    return UsuariosTest;
}

function useAdminUsuarios() {
    const [usuarios] = useState(cargarUsuarios);

    return {
        usuarios
    };
}

export default useAdminUsuarios;