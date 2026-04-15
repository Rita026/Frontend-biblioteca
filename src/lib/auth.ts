export type UserRole = "admin" | "bibliotecario" | "alumno" | "usuario";

export interface AuthUser {
  id?: string | number;
  email?: string;
  nombre_completo?: string;
  rol?: UserRole | string;
}

export interface ApiErrorLike {
  status?: number;
  message?: string;
  error?: string;
  data?: unknown;
  [key: string]: unknown;
}

export const AUTH_EVENT_UNAUTHORIZED = "auth:unauthorized";
export const AUTH_STORAGE_ROLE_KEY = "role";

export function getStoredRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_ROLE_KEY);
}

export function setStoredRole(role?: string | null): void {
  if (typeof window === "undefined") return;
  if (!role) {
    localStorage.removeItem(AUTH_STORAGE_ROLE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_ROLE_KEY, role);
}

export function clearLocalAuthState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_ROLE_KEY);
}

export function resolveUserRole(user: unknown): string | null {
  if (!user || typeof user !== "object") return null;

  const maybeUser = user as Record<string, unknown>;
  const directRole = maybeUser.rol ?? maybeUser.role;

  if (typeof directRole === "string" && directRole.trim().length > 0) {
    return directRole;
  }

  const data = maybeUser.data;
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    const nestedRole = nested.rol ?? nested.role;
    if (typeof nestedRole === "string" && nestedRole.trim().length > 0) {
      return nestedRole;
    }
  }

  return null;
}

export function hasRole(
  role: string | null | undefined,
  allowedRoles: readonly string[],
): boolean {
  if (!role) return false;
  return allowedRoles.includes(role);
}

export function hasAnyRole(
  role: string | null | undefined,
  allowedRoles: readonly string[] = ["admin", "bibliotecario"],
): boolean {
  return hasRole(role, allowedRoles);
}

export function canManageBooks(role: string | null | undefined): boolean {
  return hasAnyRole(role, ["admin", "bibliotecario"]);
}

export function parseHttpStatus(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;

  const err = error as Record<string, unknown>;

  const directStatus = err.status;
  if (typeof directStatus === "number") return directStatus;

  const response = err.response;
  if (response && typeof response === "object") {
    const responseStatus = (response as Record<string, unknown>).status;
    if (typeof responseStatus === "number") return responseStatus;
  }

  return null;
}

export function isUnauthorizedError(error: unknown): boolean {
  return parseHttpStatus(error) === 401;
}

export function isForbiddenError(error: unknown): boolean {
  return parseHttpStatus(error) === 403;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error inesperado.",
): string {
  if (typeof error === "string" && error.trim().length > 0) return error;

  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;

    if (typeof err.message === "string" && err.message.trim().length > 0) {
      return err.message;
    }

    if (typeof err.error === "string" && err.error.trim().length > 0) {
      return err.error;
    }

    const response = err.response;
    if (response && typeof response === "object") {
      const res = response as Record<string, unknown>;
      const data = res.data;

      if (data && typeof data === "object") {
        const payload = data as Record<string, unknown>;
        if (
          typeof payload.message === "string" &&
          payload.message.trim().length > 0
        ) {
          return payload.message;
        }
        if (
          typeof payload.error === "string" &&
          payload.error.trim().length > 0
        ) {
          return payload.error;
        }
      }
    }
  }

  return fallback;
}

export function emitUnauthorizedEvent(message?: string): void {
  if (typeof window === "undefined") return;

  const detail = {
    message:
      message ||
      "Tu sesión expiró o fue cerrada en otro dispositivo. Inicia sesión nuevamente.",
  };

  window.dispatchEvent(
    new CustomEvent(AUTH_EVENT_UNAUTHORIZED, {
      detail,
    }),
  );
}

export function handleUnauthorized(options?: {
  redirectTo?: string;
  message?: string;
  notify?: (message: string) => void;
}): void {
  if (typeof window === "undefined") return;

  const redirectTo = options?.redirectTo ?? "/login";
  const message =
    options?.message ||
    "Tu sesión expiró o fue cerrada en otro dispositivo. Inicia sesión nuevamente.";

  clearLocalAuthState();
  emitUnauthorizedEvent(message);

  if (typeof options?.notify === "function") {
    options.notify(message);
  }

  if (window.location.pathname !== redirectTo) {
    window.location.href = redirectTo;
  }
}

export function normalizeAuthStateFromUser(user: unknown): {
  isAuthenticated: boolean;
  role: string | null;
} {
  const role = resolveUserRole(user);
  return {
    isAuthenticated: Boolean(user),
    role,
  };
}
