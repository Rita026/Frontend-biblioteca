import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authApi } from "@/APIs/auth.api";
import {
  getErrorMessage,
  isUnauthorizedError,
  normalizeAuthStateFromUser,
  setStoredRole,
  clearLocalAuthState,
} from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const user = await authApi.me();
        const normalized = normalizeAuthStateFromUser(user);

        if (!isMounted) return;

        setIsAuthenticated(normalized.isAuthenticated);
        setStoredRole(normalized.role);
      } catch (error) {
        if (!isMounted) return;

        if (import.meta.env.DEV) {
          console.warn("AuthGuard: sesión no válida", getErrorMessage(error));
        }

        setIsAuthenticated(false);

        if (isUnauthorizedError(error)) {
          clearLocalAuthState();
        } else {
          // También limpiamos por robustez ante errores inesperados de sesión
          clearLocalAuthState();
        }
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Mostrar loader mientras se valida sesión
  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
