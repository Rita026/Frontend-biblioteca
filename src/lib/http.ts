export type HttpStatus = 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 502 | 503 | number;

export interface HttpErrorShape {
  status?: HttpStatus;
  message?: string;
  error?: string;
  code?: string;
  details?: unknown;
  [key: string]: unknown;
}

export interface NormalizedHttpError {
  status: HttpStatus | null;
  message: string;
  code?: string;
  details?: unknown;
  raw: unknown;
  isUnauthorized: boolean;
  isForbidden: boolean;
  isValidation: boolean;
  isServerError: boolean;
  isNetworkError: boolean;
}

/**
 * Type guard for generic records.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Best-effort parser for fetch Response body.
 */
async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      return await response.json();
    }
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
}

/**
 * Detect if an error looks like an Axios error (without importing axios types).
 */
function isAxiosLikeError(error: unknown): error is {
  message?: string;
  code?: string;
  response?: { status?: number; data?: unknown };
  request?: unknown;
} {
  if (!isRecord(error)) return false;
  return "response" in error || "request" in error || "code" in error;
}

/**
 * Extract a readable message from backend payloads.
 */
function extractMessage(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.trim()) return data;

  if (isRecord(data)) {
    const candidates = [
      data.message,
      data.error,
      data.detail,
      data.title,
    ].filter((v) => typeof v === "string" && (v as string).trim()) as string[];

    if (candidates.length > 0) return candidates[0];
  }

  return fallback;
}

/**
 * Normalize unknown runtime errors from axios/fetch/custom throws
 * into one consistent shape for UI handling.
 */
export function normalizeHttpError(error: unknown): NormalizedHttpError {
  // 1) Axios-like error
  if (isAxiosLikeError(error)) {
    const status =
      typeof error.response?.status === "number" ? error.response.status : null;
    const data = error.response?.data;

    const message = extractMessage(
      data,
      typeof error.message === "string" && error.message.trim()
        ? error.message
        : "Request failed",
    );

    const code =
      typeof error.code === "string"
        ? error.code
        : isRecord(data) && typeof data.code === "string"
          ? data.code
          : undefined;

    const details =
      isRecord(data) && "details" in data ? (data as HttpErrorShape).details : data;

    return {
      status,
      message,
      code,
      details,
      raw: error,
      isUnauthorized: status === 401,
      isForbidden: status === 403,
      isValidation: status === 400 || status === 422,
      isServerError: typeof status === "number" ? status >= 500 : false,
      isNetworkError:
        status === null &&
        (code === "ERR_NETWORK" ||
          code === "ECONNABORTED" ||
          message.toLowerCase().includes("network")),
    };
  }

  // 2) Standard Error
  if (error instanceof Error) {
    const message = error.message?.trim() || "Unexpected error";
    return {
      status: null,
      message,
      raw: error,
      isUnauthorized: false,
      isForbidden: false,
      isValidation: false,
      isServerError: false,
      isNetworkError:
        message.toLowerCase().includes("network") ||
        message.toLowerCase().includes("failed to fetch"),
    };
  }

  // 3) Plain object or unknown
  if (isRecord(error)) {
    const status =
      typeof error.status === "number"
        ? (error.status as HttpStatus)
        : typeof error.statusCode === "number"
          ? (error.statusCode as HttpStatus)
          : null;

    const message = extractMessage(error, "Unexpected error");

    return {
      status,
      message,
      code: typeof error.code === "string" ? error.code : undefined,
      details: "details" in error ? error.details : undefined,
      raw: error,
      isUnauthorized: status === 401,
      isForbidden: status === 403,
      isValidation: status === 400 || status === 422,
      isServerError: typeof status === "number" ? status >= 500 : false,
      isNetworkError: status === null && message.toLowerCase().includes("network"),
    };
  }

  return {
    status: null,
    message: "Unexpected error",
    raw: error,
    isUnauthorized: false,
    isForbidden: false,
    isValidation: false,
    isServerError: false,
    isNetworkError: false,
  };
}

/**
 * Convenience helper to create a user-facing message for auth errors.
 */
export function getAuthErrorMessage(err: NormalizedHttpError): string {
  if (err.isUnauthorized) {
    return "Tu sesión expiró o fue cerrada en otro dispositivo. Inicia sesión nuevamente.";
  }
  if (err.isForbidden) {
    return "No tienes permisos para realizar esta acción.";
  }
  return err.message;
}

/**
 * Fetch helper: throws normalized error when response is not ok.
 */
export async function throwIfNotOk(response: Response): Promise<void> {
  if (response.ok) return;

  const body = await parseResponseBody(response);
  const normalized = normalizeHttpError({
    status: response.status,
    ...(isRecord(body) ? body : { message: typeof body === "string" ? body : undefined }),
  });

  throw normalized;
}
