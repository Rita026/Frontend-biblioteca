import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";

// Mockear authApi completo para que AuthGuard no llame al backend real
vi.mock("@/APIs/auth.api", () => ({
  authApi: {
    me: vi
      .fn()
      .mockResolvedValue({ id: 1, email: "test@test.com", role: "admin" }),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

beforeEach(() => {
  // Resetear la URL antes de cada test
  window.history.pushState({}, "", "/");
});

describe("Navegación Principal de la App", () => {
  it("debería renderizar el Dashboard por defecto", async () => {
    render(<App />);

    // AuthGuard valida sesión (mockeada), esperar a que resuelva
    await waitFor(() => {
      expect(screen.getByText(/biblioteca/i)).toBeInTheDocument();
    });
  });

  it("debería navegar a la página de Actividad sin recargar", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que AuthGuard resuelva y el layout esté visible
    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /actividad/i }),
      ).toBeInTheDocument();
    });

    // Verificar que estamos en Home
    expect(window.location.pathname).toBe("/");

    // Click en el enlace del Sidebar
    const activityLink = screen.getByRole("link", { name: /actividad/i });
    await user.click(activityLink);

    // Verificar que la URL cambió y el heading de la página aparece
    await waitFor(() => {
      expect(window.location.pathname).toBe("/actividad");
      expect(
        screen.getByRole("heading", { name: /actividad/i }),
      ).toBeInTheDocument();
    });
  });

  it("debería mostrar 404 en rutas desconocidas", () => {
    window.history.pushState({}, "", "/ruta-inexistente");
    render(<App />);
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
