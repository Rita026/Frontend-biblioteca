import axios from "axios";
import { toast } from "sonner";
import {
  clearLocalAuthState,
  emitUnauthorizedEvent,
  getErrorMessage,
} from "@/lib/auth";

// URL base de la API desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const isDev = import.meta.env.DEV;

// Crear instancia de axios configurada
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enviar cookies en todas las peticiones (session/cookie auth)
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor de solicitudes
apiClient.interceptors.request.use(
  (config) => {
    // No agregar Authorization manual si backend usa cookie httpOnly
    return config;
  },
  (error) => {
    if (isDev) {
      console.error("[API][RequestError]", error);
    }
    return Promise.reject(error);
  },
);

// Evita múltiples redirecciones/toasts por oleadas de 401
let isHandlingUnauthorized = false;

function handleGlobalUnauthorized(error: unknown) {
  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;

  const message =
    "Tu sesión expiró o fue cerrada en otro dispositivo. Inicia sesión nuevamente.";

  // 1) Limpiar estado local
  clearLocalAuthState();

  // 2) Notificar al resto de la app
  emitUnauthorizedEvent(message);

  // 3) Feedback al usuario
  toast.error(message, { duration: 5000 });

  // 4) Redirigir solo si no estamos ya en login
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }

  // Permitir futuros manejos si vuelve a ocurrir en otro momento
  setTimeout(() => {
    isHandlingUnauthorized = false;
  }, 500);
}

function handleGlobalForbidden(error: unknown) {
  // 403 NO debe desloguear
  const message =
    getErrorMessage(error, "No tienes permisos para realizar esta acción.") ||
    "No tienes permisos para realizar esta acción.";

  toast.error(message, { duration: 4500 });
}

// Interceptor de respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status as number | undefined;

    if (status === 401) {
      handleGlobalUnauthorized(error);
    } else if (status === 403) {
      handleGlobalForbidden(error);
    } else if (isDev) {
      // Logs de trazas solo en desarrollo
      const method = error?.config?.method?.toUpperCase?.() || "UNKNOWN";
      const url = error?.config?.url || "unknown-url";
      const msg = getErrorMessage(error, "Error de red o servidor");
      console.error(
        `[API][${method}] ${url} -> ${status ?? "NO_STATUS"}: ${msg}`,
        {
          error,
        },
      );
    }

    return Promise.reject(error);
  },
);

export default apiClient;
