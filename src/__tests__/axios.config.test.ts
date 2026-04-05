import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

type InterceptorHandler = {
  fulfilled?: (value: unknown) => unknown | Promise<unknown>;
  rejected?: (error: unknown) => unknown | Promise<unknown>;
};

const requestHandlers: InterceptorHandler[] = [];
const responseHandlers: InterceptorHandler[] = [];

const toastErrorMock = vi.fn();
const clearLocalAuthStateMock = vi.fn();
const emitUnauthorizedEventMock = vi.fn();
const getErrorMessageMock = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

vi.mock("@/lib/auth", () => ({
  clearLocalAuthState: (...args: unknown[]) => clearLocalAuthStateMock(...args),
  emitUnauthorizedEvent: (...args: unknown[]) =>
    emitUnauthorizedEventMock(...args),
  getErrorMessage: (...args: unknown[]) => getErrorMessageMock(...args),
}));

vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: {
            use: vi.fn(
              (
                fulfilled?: InterceptorHandler["fulfilled"],
                rejected?: InterceptorHandler["rejected"],
              ) => {
                requestHandlers.push({ fulfilled, rejected });
                return requestHandlers.length - 1;
              },
            ),
          },
          response: {
            use: vi.fn(
              (
                fulfilled?: InterceptorHandler["fulfilled"],
                rejected?: InterceptorHandler["rejected"],
              ) => {
                responseHandlers.push({ fulfilled, rejected });
                return responseHandlers.length - 1;
              },
            ),
          },
        },
      })),
    },
  };
});

describe("apiClient global handling (401/403)", () => {
  const originalLocation = window.location;
  const originalSetTimeout = globalThis.setTimeout;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    requestHandlers.length = 0;
    responseHandlers.length = 0;

    getErrorMessageMock.mockImplementation(
      (_error: unknown, fallback?: string) =>
        fallback ?? "Error de red o servidor",
    );

    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...originalLocation,
        pathname: "/",
        href: "/",
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    globalThis.setTimeout = originalSetTimeout;
  });

  function makeAxiosLikeError(params: {
    status?: number;
    data?: Record<string, unknown>;
    method?: string;
    url?: string;
  }) {
    return {
      config: {
        method: params.method ?? "get",
        url: params.url ?? "/libros",
      },
      response:
        typeof params.status === "number"
          ? {
              status: params.status,
              data: params.data ?? {},
            }
          : undefined,
    };
  }

  async function importConfigAndGetResponseRejectHandler() {
    await import("@/APIs/axios.config");
    expect(responseHandlers.length).toBeGreaterThan(0);
    const handler = responseHandlers[0]?.rejected;
    expect(handler).toBeTypeOf("function");
    return handler as (error: unknown) => Promise<unknown>;
  }

  it("401: clears local auth, emits unauthorized event, shows toast and redirects to /login", async () => {
    const rejectHandler = await importConfigAndGetResponseRejectHandler();

    const error = makeAxiosLikeError({
      status: 401,
      data: { message: "No autenticado" },
    });

    await expect(rejectHandler(error)).rejects.toBeDefined();

    expect(clearLocalAuthStateMock).toHaveBeenCalledTimes(1);
    expect(emitUnauthorizedEventMock).toHaveBeenCalledTimes(1);
    expect(emitUnauthorizedEventMock).toHaveBeenCalledWith(
      "Tu sesión expiró o fue cerrada en otro dispositivo. Inicia sesión nuevamente.",
    );

    expect(toastErrorMock).toHaveBeenCalledTimes(1);
    expect(toastErrorMock).toHaveBeenCalledWith(
      "Tu sesión expiró o fue cerrada en otro dispositivo. Inicia sesión nuevamente.",
      { duration: 5000 },
    );

    expect(window.location.href).toBe("/login");
  });

  it("403: keeps session (no auth clear), no redirect, shows forbidden toast message", async () => {
    const rejectHandler = await importConfigAndGetResponseRejectHandler();

    getErrorMessageMock.mockReturnValueOnce("Permisos insuficientes");

    const error = makeAxiosLikeError({
      status: 403,
      data: { message: "Permisos insuficientes" },
    });

    await expect(rejectHandler(error)).rejects.toBeDefined();

    expect(clearLocalAuthStateMock).not.toHaveBeenCalled();
    expect(emitUnauthorizedEventMock).not.toHaveBeenCalled();

    expect(toastErrorMock).toHaveBeenCalledTimes(1);
    expect(toastErrorMock).toHaveBeenCalledWith("Permisos insuficientes", {
      duration: 4500,
    });

    expect(window.location.href).toBe("/");
  });

  it("401 burst: prevents duplicate global handling while lock is active", async () => {
    const rejectHandler = await importConfigAndGetResponseRejectHandler();

    // Keep lock active by preventing timeout callback from running
    globalThis.setTimeout = vi.fn() as unknown as typeof setTimeout;

    const error = makeAxiosLikeError({
      status: 401,
      data: { message: "Unauthorized" },
    });

    await expect(rejectHandler(error)).rejects.toBeDefined();
    await expect(rejectHandler(error)).rejects.toBeDefined();

    expect(clearLocalAuthStateMock).toHaveBeenCalledTimes(1);
    expect(emitUnauthorizedEventMock).toHaveBeenCalledTimes(1);
    expect(toastErrorMock).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe("/login");
  });
});
