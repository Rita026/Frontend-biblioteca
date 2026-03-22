import axios from "axios";
import { toast } from "sonner";

// URL base de la API desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Crear instancia de axios configurada
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enviar cookies en todas las peticiones
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor de solicitudes (opcional - para agregar logs o tokens adicionales)
apiClient.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar headers adicionales si es necesario
    // Por ejemplo, un token CSRF si tu backend lo requiere
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de respuestas (opcional - para manejar errores globalmente)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo de errores global
    if (
      error.response?.status === 401 &&
      error.response?.data?.redirectToLogin
    ) {
      const errorMessage =
        error.response.data.error || "Tu sesión ha expirado.";

      // 1. Mostrar alerta visual al usuario
      toast.error(errorMessage, { duration: 5000 });

      // 2. Limpiar el estado local
      localStorage.removeItem("role");

      // 3. Redirigir al login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (error.response?.status === 401) {
      // Token expirado o no autenticado sin redirección forzada
      console.warn("Sesión expirada o no autenticado");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
