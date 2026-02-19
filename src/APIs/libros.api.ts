import apiClient from "./axios.config";

export interface Libro {
  codigo_biblioteca: string;
  titulo: string;
  autores: string;
  total_copias: number;
  isbn: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Obtiene la lista de libros desde la API
 * @returns Promise con la lista de libros
 */
export const getLibros = async (): Promise<Libro[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Libro[]>>("/libros");

    if (!response.data.success) {
      throw new Error(response.data.message || "Error al obtener los libros");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error en getLibros:", error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene un libro por su código
 * @param codigo - Código del libro
 * @returns Promise con el libro encontrado
 */
export const getLibroByCodigo = async (codigo: string): Promise<Libro> => {
  try {
    const response = await apiClient.get<ApiResponse<Libro>>(
      `/libros/${codigo}`,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Error al obtener el libro");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error en getLibroByCodigo:", error);
    throw error.response?.data || error;
  }
};
