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

// Mock BroadcastChannel para pruebas de sincronización de pestañas
const channelListeners: Record<string, ((event: any) => void)[]> = {};

class MockBroadcastChannel {
  name: string;

  constructor(name: string) {
    this.name = name;
    if (!channelListeners[name]) {
      channelListeners[name] = [];
    }
  }

  addEventListener = vi.fn((event, callback) => {
    if (event === "message") {
      channelListeners[this.name].push(callback);
    }
  });

  removeEventListener = vi.fn((event, callback) => {
    if (event === "message") {
      channelListeners[this.name] = channelListeners[this.name].filter(
        (cb) => cb !== callback,
      );
    }
  });

  postMessage = vi.fn((message) => {
    channelListeners[this.name].forEach((callback) =>
      callback({ data: message }),
    );
  });
}

global.BroadcastChannel = MockBroadcastChannel as any;
