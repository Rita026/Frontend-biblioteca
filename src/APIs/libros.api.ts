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

const API_BASE_URL = "http://localhost:3000/api";

/**
 * Obtiene la lista de libros desde la API
 * @returns Promise con la lista de libros
 */
export const getLibros = async (): Promise<Libro[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/libros`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener libros: ${response.statusText}`);
    }

    const result: ApiResponse<Libro[]> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Error al obtener los libros");
    }

    return result.data;
  } catch (error) {
    console.error("Error en getLibros:", error);
    throw error;
  }
};

/**
 * Obtiene un libro por su código
 * @param codigo - Código del libro
 * @returns Promise con el libro encontrado
 */
export const getLibroByCodigo = async (codigo: string): Promise<Libro> => {
  try {
    const response = await fetch(`${API_BASE_URL}/libros/${codigo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el libro: ${response.statusText}`);
    }

    const result: ApiResponse<Libro> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Error al obtener el libro");
    }

    return result.data;
  } catch (error) {
    console.error("Error en getLibroByCodigo:", error);
    throw error;
  }
};
