import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

// Mapeo de rutas a nombres descriptivos
const routeNames: Record<string, string> = {
  "": "Inicio",
  actividad: "Actividad",
  usuarioss: "Usuarios",
  libros: "Libros",
  prestamos: "Préstamos",
  reservas: "Reservas",
  configuracion: "Configuración",
};

export default function DynamicBreadcrumb() {
  const location = useLocation();

  // No mostrar breadcrumb en login
  if (location.pathname === "/login") {
    return null;
  }

  // Dividir la ruta en segmentos
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Si estamos en la raíz, no mostrar breadcrumb o mostrar solo inicio
  if (pathnames.length === 0) {
    return (
      <div className="border-b bg-white px-6 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Inicio
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }

  return (
    <div className=" bg-white px-6 py-3">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Inicio siempre es el primer elemento */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Agregar separador después de Inicio */}
          {pathnames.length > 0 && <BreadcrumbSeparator />}

          {/* Generar breadcrumb para cada segmento */}
          {pathnames.map((segment, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const displayName =
              routeNames[segment] ||
              segment.charAt(0).toUpperCase() + segment.slice(1);

            return (
              <div key={routeTo} className="contents">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{displayName}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo}>{displayName}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
