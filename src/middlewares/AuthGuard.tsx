import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authApi } from "@/APIs/auth.api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authApi.me();
        setIsAuthenticated(true);
        
        // Sincronizar el rol desde la respuesta del backend
        if (user.data?.rol) {
          localStorage.setItem("role", user.data.rol);
        } else if (user.rol) {
          localStorage.setItem("role", user.rol);
        }
      } catch (error) {
        console.error("No autenticado:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("role");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mostrar un loader mientras verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
}
