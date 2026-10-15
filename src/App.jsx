import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import AdminInicio from "./pages/admin/AdminInicio";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminVerProducto from "./pages/admin/AdminVerProducto";
import AdminEditarProducto from "./pages/admin/AdminEditarProducto";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminEditarUsuario from "./pages/admin/AdminEditarUsuario";
import AdminVerUsuario from "./pages/admin/AdminVerUsuario";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/admin" replace />}
                />

                <Route
                    path="/admin"
                    element={<AdminInicio />}
                />

                <Route
                    path="/admin/productos"
                    element={<AdminProductos />}
                />

                <Route
                    path="/admin/productos/ver/:id"
                    element={<AdminVerProducto />}
                />

                <Route
                    path="/admin/productos/editar"
                    element={<AdminEditarProducto />}
                />

                <Route
                    path="/admin/productos/editar/:id"
                    element={<AdminEditarProducto />}
                />

                <Route
                    path="/admin/usuarios"
                    element={<AdminUsuarios />}
                />

                <Route
                    path="/admin/usuarios/editar"
                    element={<AdminEditarUsuario />}
                />

                <Route
                    path="/admin/usuarios/editar/:id"
                    element={<AdminEditarUsuario />}
                />

                <Route
                    path="/admin/usuarios/ver/:id"
                    element={<AdminVerUsuario />}
                />
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;
