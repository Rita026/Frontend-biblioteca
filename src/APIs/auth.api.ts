import apiClient from "./axios.config";

export const authApi = {
  login: async (data: Record<string, unknown>) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    } catch (error: unknown) {
      console.error("Error en login:", error);
      if (error instanceof Error && "response" in error) {
        const axiosError = error as Record<string, unknown>;
        throw (axiosError.response as Record<string, unknown>)?.data || error;
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout", {});
    } catch (error) {
      console.error("Error en logout:", error);
    }
  },

  me: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      throw error;
    }
  },

  // Nueva función: Solicitar recuperación de contraseña
  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error: unknown) {
      console.error("Error en forgot password:", error);
      if (error instanceof Error && "response" in error) {
        const axiosError = error as Record<string, unknown>;
        throw (axiosError.response as Record<string, unknown>)?.data || error;
      }
      throw error;
    }
  },

  // Nueva función: Resetear contraseña con token
  resetPassword: async (data: {
    email: string;
    token: string;
    newPassword: string;
  }) => {
    try {
      const response = await apiClient.post("/auth/reset-password", data);
      return response.data;
    } catch (error: unknown) {
      console.error("Error en reset password:", error);
      if (error instanceof Error && "response" in error) {
        const axiosError = error as Record<string, unknown>;
        throw (axiosError.response as Record<string, unknown>)?.data || error;
      }
      throw error;
    }
  },
};
