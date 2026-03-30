import { useEffect } from 'react';
import { toast } from 'sonner';

const authChannel = new BroadcastChannel('auth_channel');

export const useTabSync = (logoutFunction: () => void) => {
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data === 'LOGOUT') {
        // Alguien cerró sesión en otra pestaña
        toast.info('Sesión cerrada en otra pestaña', {
          description: 'Se ha cerrado la sesión por motivos de seguridad.',
        });
        logoutFunction(); // Limpia estado y redirige (sin llamar al backend de nuevo)
      }
    };

    authChannel.addEventListener('message', handleAuthMessage);

    return () => {
      authChannel.removeEventListener('message', handleAuthMessage);
    };
  }, [logoutFunction]);
};

// Función para emitir el evento cuando el usuario presiona "Cerrar sesión"
export const emitLogoutToOtherTabs = () => {
  authChannel.postMessage('LOGOUT');
};
