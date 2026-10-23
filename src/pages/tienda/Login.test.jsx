import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import Login from "./Login"; // Ajusta la ruta según tu estructura

// Mocks de dependencias externas usando 'vi'
import { obtenerUsuarios, validarCorreo } from "../../assets/js/tienda/validacionesAuth";

const mockedNavigate = vi.fn();

// Mock de react-router-dom para controlar la navegación y la ubicación
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
        useLocation: () => ({
            state: { mensaje: "¡Registro exitoso! Por favor inicia sesión." }
        })
    };
});

// Mock de las funciones de validación y obtención de usuarios
vi.mock("../../assets/js/tienda/validacionesAuth", () => ({
    validarCorreo: vi.fn(),
    obtenerUsuarios: vi.fn()
}));

const renderLogin = () => {
    return render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
};

describe("Componente Login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    // --- PRUEBA 1 ---
    test("1. Renderiza correctamente los elementos principales del formulario", () => {
        renderLogin();

        expect(screen.getByRole("heading", { name: /iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByText(/¡registro exitoso! por favor inicia sesión/i)).toBeInTheDocument();
    });

    // --- PRUEBA 2 ---
    test("2. Muestra errores de validación si se intenta enviar el formulario vacío", async () => {
        renderLogin();

        const botonSubmit = screen.getByRole("button", { name: /iniciar sesión/i });
        fireEvent.click(botonSubmit);

        expect(await screen.findByText(/ingresa tu correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByText(/ingresa tu contraseña/i)).toBeInTheDocument();
    });

    // --- PRUEBA 3 ---
    test("3. Muestra error si el correo electrónico no se encuentra registrado", async () => {
        validarCorreo.mockReturnValue(true);
        obtenerUsuarios.mockReturnValue([]); // No hay usuarios registrados

        renderLogin();

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), "noexiste@correo.com");
        await userEvent.type(screen.getByLabelText(/contraseña/i), "password123");

        fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

        expect(await screen.findByText(/no existe una cuenta con este correo/i)).toBeInTheDocument();
    });

    // --- PRUEBA 4 ---
    test("4. Muestra error si la contraseña ingresada es incorrecta", async () => {
        validarCorreo.mockReturnValue(true);
        obtenerUsuarios.mockReturnValue([
            { correo: "test@correo.com", password: "passwordCorrecta", rol: "usuario" }
        ]);

        renderLogin();

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), "test@correo.com");
        await userEvent.type(screen.getByLabelText(/contraseña/i), "passwordIncorrecta");

        fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

        expect(await screen.findByText(/la contraseña es incorrecta/i)).toBeInTheDocument();
    });

    // --- PRUEBA 5 ---
    test("5. Realiza el inicio de sesión exitoso, guarda en localStorage y redirige al administrador", async () => {
        validarCorreo.mockReturnValue(true);
        const usuarioMock = {
            id: 1,
            correo: "admin@correo.com",
            password: "adminPassword",
            rol: "administrador",
            nombre: "Admin"
        };
        obtenerUsuarios.mockReturnValue([usuarioMock]);

        renderLogin();

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), "admin@correo.com");
        await userEvent.type(screen.getByLabelText(/contraseña/i), "adminPassword");

        fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

        await waitFor(() => {
            const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioActual"));
            expect(usuarioGuardado).toEqual({
                id: 1,
                correo: "admin@correo.com",
                rol: "administrador",
                nombre: "Admin"
            });
            expect(usuarioGuardado.password).toBeUndefined();

            expect(mockedNavigate).toHaveBeenCalledWith("/admin");
        });
    });

    // --- PRUEBA 6 ---
    test("6. Valida formato de correo incorrecto utilizando la función mockeada", async () => {
        validarCorreo.mockReturnValue(false);
        obtenerUsuarios.mockReturnValue([]);

        renderLogin();

        await userEvent.type(screen.getByLabelText(/correo electrónico/i), "correo-invalido");
        await userEvent.type(screen.getByLabelText(/contraseña/i), "123456");

        fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

        expect(await screen.findByText(/ingresa un correo electrónico válido/i)).toBeInTheDocument();
    });
});
