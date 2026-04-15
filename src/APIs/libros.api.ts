import apiClient from "./axios.config";
import { normalizeHttpError, type NormalizedHttpError } from "@/lib/http";

export interface Libro {
  codigo_biblioteca: string;
  titulo: string;
  autores: string;
  total_copias: number;
  isbn: string;
}

export interface LibroPayload {
  codigo_biblioteca: string;
  titulo: string;
  autores: string;
  total_copias: number;
  isbn: string;
}

export interface UpdateLibroPayload {
  titulo?: string;
  autores?: string;
  total_copias?: number;
  isbn?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type LibrosApiError = NormalizedHttpError;

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    "data" in value
  );
}

function extractDataOrThrow<T>(payload: unknown, fallbackMessage: string): T {
  if (isApiResponse<T>(payload)) {
    if (!payload.success) {
      throw normalizeHttpError({
        status: 400,
        message: payload.message || fallbackMessage,
      });
    }
    return payload.data;
  }

  // Backward compatibility: some endpoints may return raw data
  return payload as T;
}

function handleApiError(error: unknown): never {
  throw normalizeHttpError(error);
}

/**
 * Obtiene la lista de libros desde la API
 * Auth requerida por cookie (withCredentials se configura globalmente en apiClient)
 */
export const getLibros = async (): Promise<Libro[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Libro[]> | Libro[]>(
      "/libros",
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    return extractDataOrThrow<Libro[]>(
      response.data,
      "Error al obtener los libros",
    );
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Obtiene un libro por su código
 */
export const getLibroByCodigo = async (codigo: string): Promise<Libro> => {
  try {
    const response = await apiClient.get<ApiResponse<Libro> | Libro>(
      `/libros/${codigo}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    return extractDataOrThrow<Libro>(
      response.data,
      "Error al obtener el libro",
    );
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Crea un libro nuevo
 * Requiere rol admin o bibliotecario en backend
 */
export const createLibro = async (payload: LibroPayload): Promise<Libro> => {
  try {
    const response = await apiClient.post<ApiResponse<Libro> | Libro>(
      "/libros",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    return extractDataOrThrow<Libro>(response.data, "Error al crear el libro");
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Actualiza un libro existente por código
 * Requiere rol admin o bibliotecario en backend
 */
export const updateLibro = async (
  codigo: string,
  payload: UpdateLibroPayload,
): Promise<Libro> => {
  try {
    // Preferimos PATCH por semántica de actualización parcial.
    // Si tu backend usa PUT, cambia este método a apiClient.put.
    const response = await apiClient.patch<ApiResponse<Libro> | Libro>(
      `/libros/${codigo}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    return extractDataOrThrow<Libro>(
      response.data,
      "Error al actualizar el libro",
    );
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Elimina un libro por código
 * Requiere rol admin o bibliotecario en backend
 */
export const deleteLibro = async (
  codigo: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.delete<
      ApiResponse<null> | { success?: boolean; message?: string }
    >(`/libros/${codigo}`, {
      headers: {
        Accept: "application/json",
      },
    });

    // Si viene en contrato estándar
    if (isApiResponse<null>(response.data)) {
      if (!response.data.success) {
        throw normalizeHttpError({
          status: 400,
          message: response.data.message || "Error al eliminar el libro",
        });
      }
      return {
        success: true,
        message: response.data.message,
      };
    }

    // Contrato flexible
    return {
      success: (response.data as { success?: boolean })?.success ?? true,
      message: (response.data as { message?: string })?.message,
    };
  } catch (error) {
    handleApiError(error);
  }
};
