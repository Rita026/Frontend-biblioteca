import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-bg-main">
          <AppSidebar />

          <SidebarInset className="flex-1">
            <Navbar />

            <main className="p-6">
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
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
