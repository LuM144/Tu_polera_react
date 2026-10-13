import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import AdminInicio from "./pages/admin/AdminInicio";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminVerProducto from "./pages/admin/AdminVerProducto";

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
            </Routes>
        </BrowserRouter>
    );
}

export default App;
