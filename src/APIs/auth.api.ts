import apiClient from "./axios.config";

export const authApi = {
  login: async (data: any) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    } catch (error: any) {
      console.error("Error en login:", error);
      throw error.response?.data || error;
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
};
