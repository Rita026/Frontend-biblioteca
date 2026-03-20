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
import {
  RefreshCwIcon,
  PlusIcon,
  AlertCircle,
  Trash2,
  Edit,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [editRol, setEditRol] = useState<"admin" | "usuario">("usuario");
  const [editActivo, setEditActivo] = useState(true);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

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

  // Create User Submit
  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      await createUsuario(values);
      form.reset();
      setIsCreateModalOpen(false);
      await cargarUsuarios();
    } catch (error) {
      setError("Error al crear usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleEditClick = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setEditRol(usuario.rol);
    setEditActivo(usuario.activo !== false); // Default to true if undefined
    setIsEditModalOpen(true);
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      console.log("Guardando edición para usuario:", selectedUser.id, {
        rol: editRol,
        activo: editActivo,
      });
      // TODO: Implement API call to update user (e.g., updateUsuario(selectedUser.id, { rol: editRol, activo: editActivo }))

      // Update local state temporarily for UX
      setUsuarios(
        usuarios.map((u) =>
          u.id === selectedUser.id
            ? { ...u, rol: editRol, activo: editActivo }
            : u,
        ),
      );

      setIsEditModalOpen(false);
    } catch (error) {
      setError("Error al actualizar el usuario");
    }
  };

  // Open Delete Modal
  const handleDeleteClick = (usuario: Usuario) => {
    setUserToDelete(usuario);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      console.log("Eliminar usuario:", userToDelete.id);
      // TODO: Implement API call to delete user

      setIsDeleteModalOpen(false);
      setError("Función de eliminar aún no implementada en el backend");
    } catch (error) {
      setError("Ocurrió un error al eliminar");
    }
  };

  if (isLoading) {
    return <Loader fullScreen size="lg" text="Cargando usuarios..." />;
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
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 shrink-0" />
            <span className="text-red-800">{error}</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  Sin usuarios
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow
                  key={usuario.id}
                  className={usuario.activo === false ? "opacity-60" : ""}
                >
                  <TableCell className="font-medium">
                    {usuario.nombre_completo}
                  </TableCell>
                  <TableCell>
                    {usuario.activo === false ? (
                      <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-600">
                        Inactivo
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                        Activo
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        usuario.rol === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {usuario.rol}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(usuario)}
                        title="Editar usuario"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(usuario)}
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

      {/* Modal Crear Usuario */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo usuario</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
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
                      <Input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        {...field}
                      />
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creando..." : "Crear usuario"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Usuario */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Usuario
                </Label>
                <p className="text-lg font-semibold">
                  {selectedUser.nombre_completo}
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="edit-rol">Tipo de Usuario</Label>
                <select
                  id="edit-rol"
                  value={editRol}
                  onChange={(e) =>
                    setEditRol(e.target.value as "admin" | "usuario")
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="active-toggle"
                    className="text-base font-medium"
                  >
                    Usuario Activo
                  </Label>
                  <p className="text-sm text-gray-500">
                    Permitir al usuario acceder al sistema.
                  </p>
                </div>
                <Switch
                  id="active-toggle"
                  checked={editActivo}
                  onCheckedChange={setEditActivo}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Eliminar Usuario */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar a{" "}
              <strong>{userToDelete?.nombre_completo}</strong>? Esta acción no
              se puede deshacer.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
