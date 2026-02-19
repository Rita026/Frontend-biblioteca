import axios from "axios";

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
  }
);

// Interceptor de respuestas (opcional - para manejar errores globalmente)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo de errores global
    if (error.response?.status === 401) {
      // Token expirado o no autenticado
      console.warn("Sesión expirada o no autenticado");
      // Aquí podrías redirigir al login si es necesario
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
