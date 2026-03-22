import { Home, Inbox, LogOut, User, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/APIs/auth.api";
import { emitLogoutToOtherTabs } from "@/hooks/useTabSync";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Actividad", url: "/actividad", icon: Inbox },
  { title: "Usuarios", url: "/usuarios", icon: Users },
  { title: "Perfil", url: "/perfil", icon: User },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Avisar al backend para destruir cookies y liberar el cupo en BD
      await authApi.logout();
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      // 2. Limpiar estado local
      localStorage.removeItem("role");

      // 3. Avisar a otras pestañas
      emitLogoutToOtherTabs();

      // 4. Redirigir
      navigate("/login", { replace: true });
    }
  };

  return (
    <Sidebar className="fade-in show">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="fade-in show">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} className="fade-in show">
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem className="fade-in show">
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
