import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  resolveUserRole,
  hasRole,
  hasAnyRole,
  canManageBooks,
  setStoredRole,
  getStoredRole,
  clearLocalAuthState,
  parseHttpStatus,
  isUnauthorizedError,
  isForbiddenError,
  getErrorMessage,
  normalizeAuthStateFromUser,
  AUTH_STORAGE_ROLE_KEY,
} from "@/lib/auth";

describe("auth helpers", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("resolveUserRole", () => {
    it("returns null for invalid input", () => {
      expect(resolveUserRole(null)).toBeNull();
      expect(resolveUserRole(undefined)).toBeNull();
      expect(resolveUserRole("admin")).toBeNull();
      expect(resolveUserRole(123)).toBeNull();
    });

    it("resolves direct rol property", () => {
      expect(resolveUserRole({ rol: "admin" })).toBe("admin");
      expect(resolveUserRole({ role: "bibliotecario" })).toBe("bibliotecario");
    });

    it("resolves nested role from data object", () => {
      expect(resolveUserRole({ data: { rol: "alumno" } })).toBe("alumno");
      expect(resolveUserRole({ data: { role: "admin" } })).toBe("admin");
    });

    it("returns null when role is empty", () => {
      expect(resolveUserRole({ rol: "" })).toBeNull();
      expect(resolveUserRole({ data: { role: "   " } })).toBeNull();
    });
  });

  describe("role checks", () => {
    it("hasRole validates exact membership", () => {
      expect(hasRole("admin", ["admin"])).toBe(true);
      expect(hasRole("alumno", ["admin", "bibliotecario"])).toBe(false);
      expect(hasRole(null, ["admin"])).toBe(false);
    });

    it("hasAnyRole uses default writable roles", () => {
      expect(hasAnyRole("admin")).toBe(true);
      expect(hasAnyRole("bibliotecario")).toBe(true);
      expect(hasAnyRole("alumno")).toBe(false);
      expect(hasAnyRole(undefined)).toBe(false);
    });

    it("hasAnyRole supports custom role arrays", () => {
      expect(hasAnyRole("alumno", ["alumno", "admin"])).toBe(true);
      expect(hasAnyRole("usuario", ["admin", "bibliotecario"])).toBe(false);
    });

    it("canManageBooks only allows admin and bibliotecario", () => {
      expect(canManageBooks("admin")).toBe(true);
      expect(canManageBooks("bibliotecario")).toBe(true);
      expect(canManageBooks("alumno")).toBe(false);
      expect(canManageBooks("usuario")).toBe(false);
      expect(canManageBooks(null)).toBe(false);
    });
  });

  describe("local auth storage", () => {
    it("setStoredRole and getStoredRole work as expected", () => {
      setStoredRole("admin");
      expect(getStoredRole()).toBe("admin");

      setStoredRole("bibliotecario");
      expect(getStoredRole()).toBe("bibliotecario");
    });

    it("setStoredRole clears key when role is null/undefined", () => {
      setStoredRole("admin");
      expect(localStorage.getItem(AUTH_STORAGE_ROLE_KEY)).toBe("admin");

      setStoredRole(null);
      expect(localStorage.getItem(AUTH_STORAGE_ROLE_KEY)).toBeNull();

      setStoredRole("admin");
      setStoredRole(undefined);
      expect(localStorage.getItem(AUTH_STORAGE_ROLE_KEY)).toBeNull();
    });

    it("clearLocalAuthState removes stored role", () => {
      localStorage.setItem(AUTH_STORAGE_ROLE_KEY, "admin");
      clearLocalAuthState();
      expect(localStorage.getItem(AUTH_STORAGE_ROLE_KEY)).toBeNull();
    });
  });

  describe("http/auth error helpers", () => {
    it("parseHttpStatus reads direct status", () => {
      expect(parseHttpStatus({ status: 401 })).toBe(401);
      expect(parseHttpStatus({ status: 403 })).toBe(403);
    });

    it("parseHttpStatus reads axios-like response status", () => {
      expect(parseHttpStatus({ response: { status: 401 } })).toBe(401);
      expect(parseHttpStatus({ response: { status: 500 } })).toBe(500);
    });

    it("parseHttpStatus returns null if not found", () => {
      expect(parseHttpStatus({})).toBeNull();
      expect(parseHttpStatus("error")).toBeNull();
      expect(parseHttpStatus(null)).toBeNull();
    });

    it("isUnauthorizedError and isForbiddenError detect status correctly", () => {
      expect(isUnauthorizedError({ status: 401 })).toBe(true);
      expect(isUnauthorizedError({ response: { status: 401 } })).toBe(true);
      expect(isUnauthorizedError({ status: 403 })).toBe(false);

      expect(isForbiddenError({ status: 403 })).toBe(true);
      expect(isForbiddenError({ response: { status: 403 } })).toBe(true);
      expect(isForbiddenError({ status: 401 })).toBe(false);
    });

    it("getErrorMessage extracts from common shapes", () => {
      expect(getErrorMessage("mensaje directo")).toBe("mensaje directo");
      expect(getErrorMessage({ message: "mensaje objeto" })).toBe("mensaje objeto");
      expect(getErrorMessage({ error: "mensaje error" })).toBe("mensaje error");
      expect(
        getErrorMessage({ response: { data: { message: "mensaje backend" } } }),
      ).toBe("mensaje backend");
      expect(
        getErrorMessage({ response: { data: { error: "error backend" } } }),
      ).toBe("error backend");
    });

    it("getErrorMessage returns fallback when no message exists", () => {
      expect(getErrorMessage({ foo: "bar" }, "fallback")).toBe("fallback");
      expect(getErrorMessage(null, "fallback")).toBe("fallback");
    });
  });

  describe("normalizeAuthStateFromUser", () => {
    it("returns authenticated true with resolved role", () => {
      const out = normalizeAuthStateFromUser({ data: { rol: "admin" } });
      expect(out.isAuthenticated).toBe(true);
      expect(out.role).toBe("admin");
    });

    it("returns authenticated false and null role for empty user", () => {
      const out = normalizeAuthStateFromUser(null);
      expect(out.isAuthenticated).toBe(false);
      expect(out.role).toBeNull();
    });
  });
});
