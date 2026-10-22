
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



import Nosotros from"./pages/tienda/Nosotros";
import Blogs from "./pages/tienda/Blogs.jsx";
import Contacto from "./pages/tienda/Contacto.jsx";


import Home from "./pages/tienda/Home";
import Productos from "./pages/tienda/Productos.jsx";
import Registro from "./pages/tienda/Registro";
import Login from "./pages/tienda/Login";
import Usuario from "./pages/tienda/Usuario";
import Carrito from "./pages/tienda/Carrito";
import Index from "./pages/tienda/Index";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Tienda */}

               
                <Route
                 path="/"
                  element={<Index />}
                  />

                <Route 
                    path="/registro" 
                    element={<Registro />} 
                />

                <Route 
                    path="/login" 
                    element={<Login />} 
                />

                <Route 
                    path="/productos" 
                    element={<Productos />} 
                />


                <Route 
                    path="/usuario" 
                    element={<Usuario />} 
                />

                <Route 
                    path="/carrito" 
                    element={<Carrito />} 
                />
                
                

                <Route 
                    path="/nosotros"
                    element={<Nosotros/>}
                />

                <Route 
                    path="/blogs" 
                    element={<Blogs />} 
                />

                <Route 
                    path="/contacto" 
                    element={<Contacto />} 
                />
                
                
                {/* Panel de administracion */}
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
