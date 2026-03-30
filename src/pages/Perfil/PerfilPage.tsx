import { useEffect, useState } from "react";
import { authApi } from "@/APIs/auth.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Monitor, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PerfilPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authApi.me();
        // Dependiendo de cómo devuelva tu backend (response.data o directo response)
        setUserData(response.data || response);
      } catch (error) {
        toast.error("Error al cargar la información del perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6 text-center text-gray-500">
        No se pudo cargar la información del usuario.
      </div>
    );
  }

  const sesionesActivas = userData.sesiones_activas || [];
  const MAX_DISPOSITIVOS = 3;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Perfil de Usuario</h1>
      <p className="text-muted-foreground">
        Gestiona tu información personal y los dispositivos conectados a tu cuenta.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Detalles de tu cuenta actual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
              <p className="text-lg font-medium">{userData.nombre_completo || "Usuario"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Rol</p>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase mt-1">
                {userData.rol || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispositivos Activos</CardTitle>
            <CardDescription>
              Tienes {sesionesActivas.length} de {MAX_DISPOSITIVOS} dispositivos en uso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sesionesActivas.length === 0 ? (
              <p className="text-sm text-gray-500">No hay sesiones activas registradas.</p>
            ) : (
              <div className="space-y-3">
                {sesionesActivas.map((sesion: string | any, index: number) => {
                  // Si es UUID es string, si el backend evoluciona será objeto
                  const sessionId = typeof sesion === "string" ? sesion : sesion.id;

                  return (
                    <div
                      key={sessionId || index}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Dispositivo {index + 1}</p>
                          <p className="text-xs text-gray-500">
                            Sesión: {sessionId ? sessionId.substring(0, 8) + "..." : "Desconocida"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {sesionesActivas.length >= MAX_DISPOSITIVOS && (
              <div className="flex items-start gap-2 p-3 mt-4 text-sm text-amber-800 bg-amber-50 rounded-md border border-amber-100">
                <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
                <p>
                  Has alcanzado el límite de dispositivos simultáneos. Si inicias sesión en otro dispositivo,
                  la sesión más antigua será cerrada automáticamente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
