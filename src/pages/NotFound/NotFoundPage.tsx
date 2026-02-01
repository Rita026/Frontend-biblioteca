import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div 
      className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FAFAFA] p-4 text-[#0A0A0A]"
      aria-live="assertive" 
    >
      <div className="flex max-w-md flex-col items-center text-center space-y-6 relative">
        
        {/* Icono animado */}
        <div className="bg-red-50 p-4 rounded-full animate-bounce">
          <AlertCircle className="w-16 h-16 text-red-600" aria-hidden="true" />
        </div>

        {/* Contenedor de Texto (Sin absolute para evitar encimamientos) */}
        <div className="flex flex-col items-center">
          <h1 className="text-9xl font-black tracking-tighter opacity-5 select-none">
            404
          </h1>
          
          <div className="mt-[-4rem]"> {/* Ajuste fino de posición */}
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Página no encontrada
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-medium px-2">
              Lo sentimos, no pudimos encontrar la página que buscas. Pudo haber
              sido eliminada o la URL es incorrecta.
            </p>
          </div>
        </div>

        {/* Botón de acción */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#0A0A0A] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Volver al Inicio
        </Link>
      </div>

      {/* Footer con el nombre de la institución */}
      <footer className="absolute bottom-8 text-sm text-gray-400">
        Biblioteca UTT &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}