import apiClient from "./axios.config";

export interface Usuario {
  id?: string;
  nombre_completo: string;
  rol: "admin" | "usuario";
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await apiClient.get("/usuarios");
    console.log("Respuesta de getUsuarios:", response.data);
    
    // Si la respuesta tiene estructura { success, data }
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Si la respuesta es directamente un array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // Si la respuesta tiene { data } sin success
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || "Error al obtener usuarios");
  } catch (error: any) {
    console.error("Error en getUsuarios:", error);
    throw error.response?.data || error.message || "Error al cargar usuarios";
  }
};

export const createUsuario = async (usuario: Omit<Usuario, "id" | "created_at" | "updated_at" | "created_by">) => {
  try {
    const response = await apiClient.post("/usuarios", usuario);
    console.log("Respuesta de createUsuario:", response.data);
    
    // Manejar diferentes formatos de respuesta
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data && !Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data._id || response.data.nombre_completo) {
      return response.data;
    }
    
    throw new Error(response.data.message || "Error al crear usuario");
  } catch (error: any) {
    console.error("Error en createUsuario:", error);
    throw error.response?.data || error.message || "Error al crear usuario";
  }
};