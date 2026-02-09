import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from '../App';

// Mockeamos componentes complejos que no queremos testear aquí (opcional pero recomendado)
// Por ejemplo, si tus gráficas dan error en test, las mockeas.

describe('Navegación Principal de la App', () => {
  it('debería renderizar el Dashboard por defecto', () => {
    render(<App />);
    // Verifica que algo único del Home esté presente
    expect(screen.getByText(/biblioteca/i)).toBeInTheDocument(); 
  });

  it('debería navegar a la página de Actividad sin recargar', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Verificar que estamos en Home
    expect(window.location.pathname).toBe('/');

    // 2. Buscar el enlace en el Sidebar y hacer click
    // Nota: Asegúrate que tu Sidebar.tsx tenga textos accesibles o usa test-id si es difícil encontrar iconos
    const activityLink = screen.getByRole('link', { name: /actividad/i });
    await user.click(activityLink);

    // 3. Verificar que la URL cambió y el contenido nuevo aparece
    await waitFor(() => {
      expect(window.location.pathname).toBe('/actividad');
      // Aquí busca el H1 que te recomendé poner en ActivityPage
      expect(screen.getByRole('heading', { name: /actividad/i })).toBeInTheDocument();
    });
  });

  it('debería mostrar 404 en rutas desconocidas', () => {
    window.history.pushState({}, 'Test Page', '/ruta-inexistente');
    render(<App />);
    expect(screen.getByText(/404/i)).toBeInTheDocument(); // Asumiendo que tu NotFoundPage dice "404"
  });
});