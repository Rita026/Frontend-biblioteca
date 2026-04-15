import React from "react";
import { Navigate } from "react-router-dom";
import { getStoredRole, hasAnyRole } from "@/lib/auth";

type RoleMiddlewareProps = {
  children: React.ReactNode;
  role?: string;
  roles?: readonly string[];
  redirectTo?: string;
};

/**
 * Middleware de autorización por rol.
 *
 * Soporta:
 * - `role`: un solo rol requerido (compatibilidad hacia atrás)
 * - `roles`: múltiples roles permitidos (recomendado)
 *
 * Comportamiento:
 * - Si el usuario no tiene un rol permitido, redirige a `redirectTo` (default `/`)
 * - Se usa estado local persistido del rol para control de UI/rutas
 */
export default function RoleMiddleware({
  children,
  role,
  roles,
  redirectTo = "/",
}: RoleMiddlewareProps) {
  const userRole = getStoredRole();

  const allowedRoles: readonly string[] =
    roles && roles.length > 0 ? roles : role ? [role] : [];

  // Si no se define ningún rol permitido, por seguridad bloqueamos acceso
  if (allowedRoles.length === 0) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!hasAnyRole(userRole, allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
