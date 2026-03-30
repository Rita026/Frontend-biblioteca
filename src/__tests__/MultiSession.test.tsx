import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Components to test
import PerfilPage from "@/pages/Perfil/PerfilPage";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useTabSync } from "@/hooks/useTabSync";
import { authApi } from "@/APIs/auth.api";

// Mocks
vi.mock("@/APIs/auth.api", () => ({
  authApi: {
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Control Multisesión y Seguridad", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. PerfilPage - Gestión de Dispositivos", () => {
    it("debería mostrar los dispositivos activos del usuario", async () => {
      const mockUserData = {
        nombre_completo: "Usuario de Prueba",
        rol: "admin",
        sesiones_activas: ["uuid-1", "uuid-2"],
      };

      (authApi.me as any).mockResolvedValueOnce({ data: mockUserData });

      render(
        <MemoryRouter>
          <PerfilPage />
        </MemoryRouter>,
      );

      // Esperar que cargue
      await waitFor(() => {
        expect(screen.getByText("Usuario de Prueba")).toBeInTheDocument();
      });

      expect(screen.getByText("Dispositivo 1")).toBeInTheDocument();
      expect(screen.getByText("Dispositivo 2")).toBeInTheDocument();
      // No debería mostrar la advertencia si hay menos de 3
      expect(
        screen.queryByText(/Has alcanzado el límite de dispositivos/i),
      ).not.toBeInTheDocument();
    });

    it("debería mostrar la advertencia si hay 3 dispositivos (Límite alcanzado)", async () => {
      const mockUserData = {
        nombre_completo: "Usuario al Límite",
        rol: "usuario",
        sesiones_activas: ["uuid-1", "uuid-2", "uuid-3"],
      };

      (authApi.me as any).mockResolvedValueOnce({ data: mockUserData });

      render(
        <MemoryRouter>
          <PerfilPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Usuario al Límite")).toBeInTheDocument();
      });

      // Validar que se muestre la advertencia visual
      expect(
        screen.getByText(/Has alcanzado el límite de dispositivos/i),
      ).toBeInTheDocument();
    });
  });

  describe("2. Cierre de sesión estricto (Sidebar)", () => {
    it("debería llamar al backend, limpiar localstorage al dar clic en Logout", async () => {
      const user = userEvent.setup();
      localStorage.setItem("role", "admin");

      render(
        <MemoryRouter>
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
        </MemoryRouter>,
      );

      const logoutBtn = screen.getByText("Log out");
      await user.click(logoutBtn);

      await waitFor(() => {
        // 1. Verifica llamada al API de logout
        expect(authApi.logout).toHaveBeenCalled();
        // 2. Verifica limpieza de local storage
        expect(localStorage.getItem("role")).toBeNull();
      });
    });
  });

  describe("3. Sincronización de Pestañas (useTabSync)", () => {
    // Componente de prueba para inyectar el hook
    const TestComponent = ({ logoutFn }: { logoutFn: () => void }) => {
      useTabSync(logoutFn);
      return <div>Testing Sync</div>;
    };

    it("debería ejecutar la función de logout al recibir el evento LOGOUT por BroadcastChannel", async () => {
      const logoutMock = vi.fn();
      render(<TestComponent logoutFn={logoutMock} />);

      // Simular que otra pestaña emitió un mensaje
      const channel = new BroadcastChannel("auth_channel");
      channel.postMessage("LOGOUT");

      // Validar que se disparó la protección y el cierre
      await waitFor(() => {
        expect(logoutMock).toHaveBeenCalled();
      });
    });
  });
});
