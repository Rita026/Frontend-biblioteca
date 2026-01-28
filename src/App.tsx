import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/Home/HomePage";
import ListarLibros from "./pages/Libros/ListarLibros";
import RegistrarLibro from "./pages/Libros/RegistrarLibro";
import PrestamosPage from "./pages/Prestamos/PrestamosPage";
import UsuariosPage from "./pages/Usuarios/UsuariosPage";
import LoginPage from "./pages/Login/LoginPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

// Middlewares
import AuthGuard from "./middlewares/AuthGuard";
import RoleMiddleware from "./middlewares/RoleMiddleware";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <BrowserRouter>
      {/* "flex" reemplaza al display:flex. "bg-bg-main" usa tu color personalizado */}
      <div className="flex min-h-screen bg-bg-main">
        
        <Sidebar />
        
        {/* "flex-1" hace que ocupe todo el ancho restante */}
        <div className="flex-1">
          <Navbar />

          {/* "p-6" añade espacio interno para que el contenido no pegue a las orillas */}
          <main className="p-6">
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/"
                element={
                  <AuthGuard>
                    <HomePage />
                  </AuthGuard>
                }
              />

              <Route
                path="/libros"
                element={
                  <AuthGuard>
                    <ListarLibros />
                  </AuthGuard>
                }
              />

              <Route
                path="/libros/registrar"
                element={
                  <AuthGuard>
                    <RoleMiddleware role="admin">
                      <RegistrarLibro />
                    </RoleMiddleware>
                  </AuthGuard>
                }
              />

              <Route
                path="/prestamos"
                element={
                  <AuthGuard>
                    <PrestamosPage />
                  </AuthGuard>
                }
              />

              <Route
                path="/usuarios"
                element={
                  <AuthGuard>
                    <RoleMiddleware role="admin">
                      <UsuariosPage />
                    </RoleMiddleware>
                  </AuthGuard>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;