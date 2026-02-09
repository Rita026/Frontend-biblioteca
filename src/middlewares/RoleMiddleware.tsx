import React from "react";
import { Navigate } from "react-router-dom";

export default function RoleMiddleware({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const userRole = localStorage.getItem("role");

  if (userRole !== role) return <Navigate to="/" />;

  return children;
}
