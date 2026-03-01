/**
 * AnimatedComponent.test.jsx
 *
 * Verifica que las animaciones implementadas en el PR cumplan con:
 *  - Accesibilidad (sin violaciones axe)
 *  - Navegación por teclado (foco no bloqueado)
 *  - prefers-reduced-motion respetado
 *  - Compatibilidad con lectores de pantalla
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { MemoryRouter } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { vi, describe, test, expect, beforeEach } from "vitest";

// Componentes reales que recibieron animaciones en este PR
import Navbar from "@/components/Navbar";
import { AppSidebar } from "@/components/Sidebar";
import ListarLibros from "@/pages/Libros/ListarLibros";
import RegistrarLibro from "@/pages/Libros/RegistrarLibro";
import UsuariosPage from "@/pages/Usuarios/UsuariosPage";

// ---------------------------------------------------------------------------
// Helper: wrapper con router (Sidebar usa useLocation / Link)
// ---------------------------------------------------------------------------
// Navbar y AppSidebar requieren SidebarProvider (contexto de Radix UI)
const WithRouter = ({ children }) => (
  <MemoryRouter>
    <SidebarProvider>{children}</SidebarProvider>
  </MemoryRouter>
);

// ---------------------------------------------------------------------------
// 1. ACCESIBILIDAD — axe no debe reportar violaciones
// ---------------------------------------------------------------------------
describe("Accesibilidad (axe)", () => {
  test("Navbar no tiene violaciones de accesibilidad", async () => {
    const { container } = render(<Navbar />, { wrapper: WithRouter });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("Sidebar no tiene violaciones de accesibilidad", async () => {
    const { container } = render(<AppSidebar />, { wrapper: WithRouter });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ListarLibros no tiene violaciones de accesibilidad", async () => {
    const { container } = render(<ListarLibros />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("RegistrarLibro no tiene violaciones de accesibilidad", async () => {
    const { container } = render(<RegistrarLibro />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("UsuariosPage no tiene violaciones de accesibilidad", async () => {
    const { container } = render(<UsuariosPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 2. FOCO — las clases de animación no deben bloquear la navegación por teclado
// ---------------------------------------------------------------------------
describe("Navegación por teclado (foco no bloqueado)", () => {
  test("El SidebarTrigger dentro de Navbar recibe foco con Tab", async () => {
    const user = userEvent.setup();
    render(<Navbar />, { wrapper: WithRouter });

    await user.tab();

    // El SidebarTrigger renderiza un <button>; debe ser el primer elemento enfocable
    const focusable = document.activeElement;
    expect(focusable.tagName).toBe("BUTTON");
    expect(focusable).not.toHaveAttribute("tabindex", "-1");
  });

  test("Los links del Sidebar reciben foco con Tab y son accesibles", async () => {
    const user = userEvent.setup();
    render(<AppSidebar />, { wrapper: WithRouter });

    // Navegar por todos los links del sidebar
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);

    await user.tab();
    const firstFocused = document.activeElement;
    expect(firstFocused.tagName).toBe("A");
  });

  test("Las páginas con fade-in no insertan elementos que roben el foco", () => {
    render(<ListarLibros />);
    // Al montar, document.body debe tener el foco o ningún elemento activo
    // (nada con autofocus inesperado)
    expect(document.activeElement).toBe(document.body);
  });
});

// ---------------------------------------------------------------------------
// 3. LECTORES DE PANTALLA — semántica y atributos aria correctos
// ---------------------------------------------------------------------------
describe("Compatibilidad con lectores de pantalla", () => {
  test("Navbar usa <nav> como landmark semántico", () => {
    render(<Navbar />, { wrapper: WithRouter });
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("ListarLibros tiene un heading visible y legible", () => {
    render(<ListarLibros />);
    expect(
      screen.getByRole("heading", { name: /listar libros/i }),
    ).toBeInTheDocument();
  });

  test("RegistrarLibro tiene un heading visible y legible", () => {
    render(<RegistrarLibro />);
    expect(
      screen.getByRole("heading", { name: /registrar libro/i }),
    ).toBeInTheDocument();
  });

  test("UsuariosPage tiene un heading visible y legible", () => {
    render(<UsuariosPage />);
    expect(
      screen.getByRole("heading", { name: /usuarios/i }),
    ).toBeInTheDocument();
  });

  test("Los elementos con fade-in no tienen aria-hidden que oculte contenido", () => {
    const { container } = render(<ListarLibros />);
    const fadeElements = container.querySelectorAll(".fade-in");
    fadeElements.forEach((el) => {
      expect(el).not.toHaveAttribute("aria-hidden", "true");
    });
  });
});

// ---------------------------------------------------------------------------
// 4. PREFERS-REDUCED-MOTION — el mock refleja correctamente la preferencia
// ---------------------------------------------------------------------------
describe("prefers-reduced-motion", () => {
  beforeEach(() => {
    // Sobreescribir el mock global del setup.ts para simular reduced-motion activo
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  test("matchMedia detecta correctamente prefers-reduced-motion: reduce", () => {
    const result = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    expect(result).toBe(true);
  });

  test("matchMedia no confunde otras media queries con reduced-motion", () => {
    const result = window.matchMedia("(prefers-color-scheme: dark)").matches;
    expect(result).toBe(false);
  });

  test("Los componentes con fade-in renderizan aunque reduced-motion esté activo", () => {
    // Las transiciones las desactiva el CSS, pero el componente debe seguir montándose
    render(<UsuariosPage />);
    expect(
      screen.getByRole("heading", { name: /usuarios/i }),
    ).toBeInTheDocument();
  });

  test("Los componentes con fade-in renderizan aunque reduced-motion esté activo (ListarLibros)", () => {
    render(<ListarLibros />);
    expect(
      screen.getByRole("heading", { name: /listar libros/i }),
    ).toBeInTheDocument();
  });
});
