import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FAFAFA] p-4 text-[#0A0A0A]">
      <div className="flex max-w-md flex-col items-center text-center space-y-6">
        {/* Icono animado o destacado */}
        <div className="bg-red-50 p-4 rounded-full animate-bounce-slow">
            <AlertCircle className="w-16 h-16 text-red-600" />
        </div>

        {/* Título Grande */}
        <h1 className="text-9xl font-black tracking-tighter opacity-10">
          404
        </h1>
        
        <div className="absolute mt-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Página no encontrada
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-medium">
            Lo sentimos, no pudimos encontrar la página que buscas. Pudo haber sido eliminada o la URL es incorrecta.
            </p>
        </div>

        {/* Espaciado para compensar el absolute */}
        <div className="h-24"></div>

        {/* Botón de acción */}
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg bg-[#0A0A0A] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A0A0A]"
        >
          Volver al Inicio
        </Link>
      </div>
      
      {/* Footer simple */}
      <footer className="absolute bottom-8 text-sm text-gray-400">
        Biblioteca UTT &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
