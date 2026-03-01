import { useEffect, useState } from "react";
import { getUsuarios, createUsuario, type Usuario } from "@/APIs/usuarios.api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/common";
import { RefreshCwIcon, PlusIcon, AlertCircle, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formSchema = z.object({
  nombre_completo: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido").optional(),
  rol: z.enum(["admin", "usuario"]),
});

type FormData = z.infer<typeof formSchema>;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    titulo: string;
    mensaje: string;
    accion: "delete" | "edit" | "disable" | null;
    usuario: Usuario | null;
  }>({
    isOpen: false,
    titulo: "",
    mensaje: "",
    accion: null,
    usuario: null,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { nombre_completo: "", email: "", rol: "usuario" },
  });

  const cargarUsuarios = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      await createUsuario(values);
      form.reset();
      setShowForm(false);
      await cargarUsuarios();
    } catch (error) {
      setError("Error al crear usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (tipo: "delete" | "edit" | "disable", usuario: Usuario) => {
    const mensajes = {
      delete: `¿Estás seguro de que deseas eliminar a ${usuario.nombre_completo}? Esta acción no se puede deshacer.`,
      edit: `¿Deseas editar la información de ${usuario.nombre_completo}?`,
      disable: `¿Deseas ${usuario.activo !== false ? "deshabilitar" : "habilitar"} a ${usuario.nombre_completo}?`,
    };

    const titulos = {
      delete: "Eliminar Usuario",
      edit: "Editar Usuario",
      disable: usuario.activo !== false ? "Deshabilitar Usuario" : "Habilitar Usuario",
    };

    setModal({
      isOpen: true,
      titulo: titulos[tipo],
      mensaje: mensajes[tipo],
      accion: tipo,
      usuario,
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, titulo: "", mensaje: "", accion: null, usuario: null });
  };

  const handleModalConfirm = async () => {
    const { accion, usuario } = modal;
    if (!usuario) return;

    try {
      if (accion === "delete") {
        console.log("Eliminar usuario:", usuario.id);
        // TODO: Implementar API de delete
        setError("Función de eliminar aún no implementada en el backend");
      } else if (accion === "edit") {
        console.log("Editar usuario:", usuario.id);
        // TODO: Implementar función de editar
        setError("Función de editar aún no implementada");
      } else if (accion === "disable") {
        console.log("Cambiar estado de usuario:", usuario.id);
        // TODO: Implementar API de disable
        setError("Función de deshabilitar aún no implementada en el backend");
      }
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      setError("Ocurrió un error al procesar la acción");
    }
  };

  if (isLoading) {
    return <Loader fullScreen size="lg" text="Cargando..." />;
  }

  return (
    <section className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <div className="flex gap-2">
            <Button onClick={cargarUsuarios} variant="outline">
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              {showForm ? "Cancelar" : "Nuevo Usuario"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600 inline mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Agregar nuevo usuario</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre_completo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <FormControl>
                        <select
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full px-3 py-2 border rounded-md"
                          title="Selecciona un rol"
                        >
                          <option value="usuario">Usuario</option>
                          <option value="admin">Admin</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Creando..." : "Crear usuario"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  Sin usuarios
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nombre_completo}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-sm ${
                      usuario.rol === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {usuario.rol}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openModal("edit", usuario)}
                        title="Editar usuario"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openModal("disable", usuario)}
                        title={usuario.activo !== false ? "Deshabilitar" : "Habilitar"}
                      >
                        {usuario.activo !== false ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openModal("delete", usuario)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-4">{modal.titulo}</h2>
            <p className="text-gray-700 mb-6">{modal.mensaje}</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button
                onClick={handleModalConfirm}
                className={
                  modal.accion === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              >
                {modal.accion === "delete" ? "Eliminar" : modal.accion === "edit" ? "Editar" : "Cambiar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}