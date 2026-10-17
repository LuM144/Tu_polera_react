
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

import AdminProductosDestacados from "./pages/admin/AdminProductosDestacados";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminBoletas from "./pages/admin/AdminBoletas";
import AdminVerBoleta from "./pages/admin/AdminVerBoleta";
import AdminReportes from "./pages/admin/AdminReportes";

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

                {/* Productos */}
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

                {/* Usuarios */}
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


                <Route
                    path="/admin/productos-destacados"
                    element={<AdminProductosDestacados />}
                />

                <Route
                    path="/admin/categorias"
                    element={<AdminCategorias />}
                />

                <Route 
                    path="/admin/boletas" 
                    element={<AdminBoletas />} 
                />

                <Route
                    path="/admin/boletas/ver/:id"
                    element={<AdminVerBoleta />}
                />

                <Route
                    path="/admin/reportes"
                    element={<AdminReportes />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
