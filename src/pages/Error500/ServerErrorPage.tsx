import { AlertTriangle } from "lucide-react";

export default function ServerErrorPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] w-full overflow-hidden">
      
      <h1 className="absolute text-[25rem] font-black text-gray-100 select-none z-0">
        500
      </h1>

      {/* Contenido Principal */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        {/* Icono de Advertencia */}
        <AlertTriangle className="w-20 h-20 text-yellow-500 mb-4 drop-shadow-sm" />

        <h2 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          ¡Ups! Error de Servidor
        </h2>

        <p className="text-gray-600 max-w-md text-lg font-medium leading-relaxed mb-8">
          El servidor encontró un error interno o una configuración incorrecta 
          y no pudo completar su solicitud. Por favor, intenta recargar la página más tarde.
        </p>

        {/* Botón*/}
        <button 
          onClick={() => window.location.reload()}
          className="px-10 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
          Recargar página
        </button>
      </div>
    </div>
  );
}