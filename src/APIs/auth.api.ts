import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const authApi = {
    login: async (data: any) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, data, {
                withCredentials: true, // Importante para recibir cookies
            });
            return response.data;
        } catch (error: any) {
            console.error("Error en login:", error);
            throw error.response?.data || error;
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, {
                withCredentials: true,
            });
        } catch (error) {
            console.error("Error en logout:", error);
        }
    },

    me: async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Error obteniendo usuario:", error);
            throw error;
        }
    }
};
