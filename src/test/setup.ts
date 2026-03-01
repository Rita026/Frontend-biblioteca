import "@testing-library/jest-dom";
import { vi, expect } from "vitest";
import { configureAxe } from "vitest-axe";
import * as vitestAxeMatchers from "vitest-axe/matchers";

const { toHaveNoViolations } = vitestAxeMatchers as any;

// Extender expect con el matcher de accesibilidad
expect.extend({ toHaveNoViolations });

// Configuración global de axe (deshabilita color-contrast porque JSDOM no calcula estilos reales)
configureAxe({
  globalOptions: {
    rules: [{ id: "color-contrast", enabled: false }],
  },
});

// Mockear matchMedia para que JSDOM no se rompa
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated pero algunos libs aún lo usan
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
