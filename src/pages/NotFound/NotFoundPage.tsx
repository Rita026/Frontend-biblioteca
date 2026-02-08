import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    // 1. Usamos <section> porque técnicamente está dentro del <main> del AppLayout
    <section 
      className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-[#FAFAFA] p-4 text-[#0A0A0A]"
      aria-labelledby="not-found-title"
    >
      <div className="flex max-w-md flex-col items-center text-center space-y-6 relative">
        
        {/* Icono animado (Decorativo, oculto a lectores) */}
        <div className="bg-red-50 p-4 rounded-full animate-bounce" aria-hidden="true">
          <AlertCircle className="w-16 h-16 text-red-600" />
        </div>

        <div className="flex flex-col items-center">
          {/* 2. El "404" gigante es decorativo. 
             - Usamos <span> en vez de <h1>.
             - aria-hidden="true" para que el lector de pantalla no lea "cuatrocientos cuatro" antes del título real. 
          */}
          <span 
            className="text-9xl font-black tracking-tighter opacity-5 select-none"
            aria-hidden="true"
          >
            404
          </span>
          
          <div className="mt-[-4rem]">
            {/* 3. Este es el verdadero título de la página.
               - Lo cambiamos de <h2> a <h1>.
               - Le ponemos el ID para conectarlo con la <section>.
            */}
            <h1 
              id="not-found-title" 
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Página no encontrada
            </h1>
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

      {/* Footer */}
      <footer className="absolute bottom-8 text-sm text-gray-400">
        Biblioteca UTT &copy; {new Date().getFullYear()}
      </footer>
    </section>
  );
}