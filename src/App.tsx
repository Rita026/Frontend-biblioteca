import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Pages
import HomePage from "./pages/Home/HomePage";
import ActivityPage from "./pages/Actividad/Activity";
import UsuariosPage from "./pages/Usuarios/UsuariosPage";
import PerfilPage from "./pages/Perfil/PerfilPage";
import LoginPage from "./pages/Login/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import ServerErrorPage from "./pages/Error500/ServerErrorPage";

// Middlewares
import AuthGuard from "./middlewares/AuthGuard";
import RoleMiddleware from "./middlewares/RoleMiddleware";

// Components
import Navbar from "./components/Navbar";
import { AppSidebar } from "./components/Sidebar";
import DynamicBreadcrumb from "./components/DynamicBreadcrumb";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useTabSync } from "./hooks/useTabSync";

// Layout wrapper que decide si mostrar sidebar y navbar
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  useTabSync(() => {
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  });

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
          <DynamicBreadcrumb />

          <main className="p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <AppLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/"
            element={
              <AuthGuard>
                <HomePage />
              </AuthGuard>
            }
          />

          <Route
            path="/actividad"
            element={
              <AuthGuard>
                <ActivityPage />
              </AuthGuard>
            }
          />

          <Route path="/500" element={<ServerErrorPage />} />

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

          <Route
            path="/perfil"
            element={
              <AuthGuard>
                <PerfilPage />
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
