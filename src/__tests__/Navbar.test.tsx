import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navbar from '../components/Navbar'; // Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import { SidebarProvider } from '@/components/ui/sidebar'; // Importante!

describe('Navbar Component', () => {
  it('debería mostrar el título de la Biblioteca', () => {
    // Como tu Navbar usa "SidebarTrigger", necesita estar dentro de un SidebarProvider
    // Si no lo pones, el test fallará diciendo que falta el contexto.
    render(
      <SidebarProvider>
        <Navbar />
      </SidebarProvider>
    );

    // Verifica que el título existe
    expect(screen.getByText('Biblioteca')).toBeInTheDocument();
    
    // Verifica que el botón del trigger (menú hamburguesa) existe
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});