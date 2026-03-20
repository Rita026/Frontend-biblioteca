import { useEffect, useState } from "react";
import { getLibros, type Libro } from "@/APIs/libros.api";
import LibrosTable from "@/components/shadcn-studio/table/table-16";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon, PlusIcon, AlertCircle } from "lucide-react";
import { Loader, BookModal, BookStatusModal } from "@/components/common";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function HomePage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatusLibro, setSelectedStatusLibro] = useState<Libro | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [libroToDelete, setLibroToDelete] = useState<Libro | null>(null);

  const cargarLibros = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatusMessage("Cargando libros...");
      const data = await getLibros();
      setLibros(data);
      setStatusMessage(
        `${data.length} ${data.length === 1 ? "libro cargado" : "libros cargados"} exitosamente`,
      );
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (error) {
      console.error("Error al cargar libros:", error);
      setError(
        "No se pudieron cargar los libros. Por favor, intenta de nuevo.",
      );
      setStatusMessage("Error al cargar los libros");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const handleEdit = (libro: Libro) => {
    console.log("Editar libro:", libro);
    setStatusMessage(`Editando libro: ${libro.titulo}`);
    setSelectedLibro(libro);
    setIsModalOpen(true);
  };

  const handleDelete = (libro: Libro) => {
    setLibroToDelete(libro);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!libroToDelete) return;

    // Aquí implementarías la lógica de eliminación
    console.log("Eliminar libro:", libroToDelete.titulo);
    setStatusMessage(`Libro "${libroToDelete.titulo}" eliminado exitosamente`);
    setIsDeleteModalOpen(false);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleRefresh = () => {
    setStatusMessage("Actualizando lista de libros...");
    cargarLibros();
  };

  const handleAddNew = () => {
    console.log("Agregar nuevo libro");
    setStatusMessage("Abriendo formulario para agregar un nuevo libro");
    setSelectedLibro(null);
    setIsModalOpen(true);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleSaveLibro = (libroData: Partial<Libro>) => {
    console.log("Guardar libro:", libroData);
    setStatusMessage(`Guardando libro...`);
    // Aquí iría la llamada a la API para guardar
    setIsModalOpen(false);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  if (isLoading) {
    return <Loader fullScreen size="lg" text="Cargando libros..." />;
  }

  return (
    <section
      className="bg-gray-100 p-6 rounded-lg shadow-md"
      role="main"
      aria-label="Gestión de libros de la biblioteca"
    >
      {/* Screen reader announcements */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMessage}
      </div>

      <div className="mb-6">
        <nav
          className="flex items-center justify-end gap-2 mb-4"
          role="navigation"
          aria-label="Acciones principales"
        >
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="default"
            disabled={isLoading}
            aria-label="Actualizar lista de libros"
            aria-disabled={isLoading}
          >
            <RefreshCwIcon
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            Actualizar
          </Button>
          <Button
            onClick={handleAddNew}
            size="default"
            aria-label="Agregar nuevo libro a la biblioteca"
          >
            <PlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            Nuevo Libro
          </Button>
        </nav>

        {error && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <AlertCircle
              className="h-5 w-5 text-red-600 shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className="text-red-800 font-medium" id="error-title">
                Error
              </p>
              <p className="text-red-600 text-sm" id="error-description">
                {error}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
              aria-label="Reintentar cargar libros"
            >
              Reintentar
            </Button>
          </div>
        )}
      </div>

      <div
        className="bg-white rounded-lg shadow"
        role="region"
        aria-label="Contenido principal"
      >
        <LibrosTable
          libros={libros}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusClick={(libro) => {
            console.log("Ver estado:", libro);
            setStatusMessage(
              `Abriendo estado de: ${libro.titulo}, ${libro.total_copias} ${libro.total_copias === 1 ? "copia disponible" : "copias disponibles"}`,
            );
            setSelectedStatusLibro(libro);
            setIsStatusModalOpen(true);
            setTimeout(() => setStatusMessage(""), 3000);
          }}
          isLoading={isLoading}
        />
      </div>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        libro={selectedLibro}
        onSave={handleSaveLibro}
      />

      <BookStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        libro={selectedStatusLibro}
        onSave={(statuses) => {
          console.log("Estados actualizados:", statuses);
          setStatusMessage("Estados de copias actualizados");
          setTimeout(() => setStatusMessage(""), 3000);
        }}
      />

      {/* Modal Eliminar Libro */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Libro</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar{" "}
              <strong>{libroToDelete?.titulo}</strong>? Esta acción no se puede
              deshacer.
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
