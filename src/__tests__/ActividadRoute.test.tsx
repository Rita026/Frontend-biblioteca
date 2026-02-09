import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("Layout general", () => {
  it("debería mostrar el Navbar", () => {
    render(<App />);

    const texto = screen.getByText(/biblioteca/i);
    expect(texto).toBeInTheDocument();
  });
});

