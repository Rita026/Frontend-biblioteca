import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Pages
import HomePage from "./pages/Home/HomePage";
import ActivityPage from "./pages/Actividad/Activity";
import UsuariosPage from "./pages/Usuarios/UsuariosPage";
import LoginPage from "./pages/Login/LoginPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

// Middlewares
import AuthGuard from "./middlewares/AuthGuard";
import RoleMiddleware from "./middlewares/RoleMiddleware";

// Components
import Navbar from "./components/Navbar";
import { AppSidebar } from "./components/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Layout wrapper que decide si mostrar sidebar y navbar
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Si es la página de login, mostrar solo el contenido sin layout
  if (isLoginPage) {
    return <div className="min-h-screen w-full bg-bg-main">{children}</div>;
  }

  // Para todas las demás páginas, mostrar con sidebar y navbar
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-bg-main">
        <AppSidebar />

        <SidebarInset className="flex-1">
          <Navbar />

          <main className="p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<HomePage />} />

          <Route path="/actividad" element={<ActivityPage />} />

          <Route
            path="/usuarioss"
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
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
