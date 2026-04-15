import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getLibros,
  createLibro,
  updateLibro,
  deleteLibro,
  type Libro,
  type LibroPayload,
  type UpdateLibroPayload,
  type LibrosApiError,
} from "@/APIs/libros.api";
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
import { toast } from "sonner";
import { canManageBooks, getStoredRole } from "@/lib/auth";

type UiErrorKind =
  | "unauthorized"
  | "forbidden"
  | "server"
  | "validation"
  | "generic";

function getUiErrorMessage(error: unknown): {
  kind: UiErrorKind;
  message: string;
} {
  const e = error as LibrosApiError | undefined;

  if (e?.isUnauthorized || e?.status === 401) {
    return {
      kind: "unauthorized",
      message:
        "Tu sesión expiró o fue cerrada en otro dispositivo. Inicia sesión nuevamente.",
    };
  }

  if (e?.isForbidden || e?.status === 403) {
    return {
      kind: "forbidden",
      message: "No tienes permisos para realizar esta acción.",
    };
  }

  if (e?.isServerError || (typeof e?.status === "number" && e.status >= 500)) {
    return {
      kind: "server",
      message: "Ocurrió un error del servidor. Intenta nuevamente.",
    };
  }

  if (e?.isValidation || e?.status === 400 || e?.status === 422) {
    return {
      kind: "validation",
      message: e.message || "Los datos enviados no son válidos.",
    };
  }

  return {
    kind: "generic",
    message: e?.message || "Ocurrió un error inesperado.",
  };
}

function toLibroPayload(input: Partial<Libro>): LibroPayload {
  return {
    codigo_biblioteca: (input.codigo_biblioteca ?? "").trim(),
    titulo: (input.titulo ?? "").trim(),
    autores: (input.autores ?? "").trim(),
    total_copias: Number(input.total_copias ?? 0),
    isbn: (input.isbn ?? "").trim(),
  };
}

function toUpdatePayload(input: Partial<Libro>): UpdateLibroPayload {
  const out: UpdateLibroPayload = {};
  if (typeof input.titulo === "string") out.titulo = input.titulo.trim();
  if (typeof input.autores === "string") out.autores = input.autores.trim();
  if (typeof input.total_copias === "number")
    out.total_copias = Number(input.total_copias);
  if (typeof input.isbn === "string") out.isbn = input.isbn.trim();
  return out;
}

export default function HomePage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const role = useMemo(() => getStoredRole(), []);
  const canWrite = useMemo(() => canManageBooks(role), [role]);

  const loadLibros = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatusMessage("Cargando libros...");

      const data = await getLibros();
      setLibros(data);

      setStatusMessage(
        `${data.length} ${data.length === 1 ? "libro cargado" : "libros cargados"} exitosamente`,
      );
      setTimeout(() => setStatusMessage(""), 2500);
    } catch (rawError) {
      const parsed = getUiErrorMessage(rawError);
      setStatusMessage(parsed.message);

      // 401 se maneja globalmente en el cliente HTTP (redirección/login)
      // Aquí dejamos feedback por robustez.
      if (parsed.kind === "unauthorized") {
        setError(parsed.message);
        return;
      }

      if (parsed.kind === "forbidden") {
        setError(
          "Tu cuenta no tiene permisos para acceder a esta información en este momento.",
        );
        return;
      }

      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLibros();
  }, [loadLibros]);

  const handleRefresh = () => {
    setStatusMessage("Actualizando lista de libros...");
    void loadLibros();
  };

  const handleAddNew = () => {
    if (!canWrite) {
      toast.error("No tienes permisos para crear libros.");
      return;
    }
    setSelectedLibro(null);
    setIsModalOpen(true);
  };

  const handleEdit = (libro: Libro) => {
    if (!canWrite) {
      toast.error("No tienes permisos para editar libros.");
      return;
    }
    setSelectedLibro(libro);
    setIsModalOpen(true);
  };

  const handleDelete = (libro: Libro) => {
    if (!canWrite) {
      toast.error("No tienes permisos para eliminar libros.");
      return;
    }
    setLibroToDelete(libro);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!libroToDelete) return;
    if (!canWrite) {
      toast.error("No tienes permisos para eliminar libros.");
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await deleteLibro(libroToDelete.codigo_biblioteca);

      setLibros((prev) =>
        prev.filter(
          (b) => b.codigo_biblioteca !== libroToDelete.codigo_biblioteca,
        ),
      );

      toast.success(`Libro "${libroToDelete.titulo}" eliminado correctamente.`);
      setStatusMessage(
        `Libro "${libroToDelete.titulo}" eliminado exitosamente`,
      );
      setIsDeleteModalOpen(false);
      setLibroToDelete(null);
      setTimeout(() => setStatusMessage(""), 2500);
    } catch (rawError) {
      const parsed = getUiErrorMessage(rawError);

      if (parsed.kind === "forbidden") {
        toast.error("No tienes permisos para eliminar este libro.");
      } else if (parsed.kind === "unauthorized") {
        // Manejo global ya realizado por cliente HTTP
      } else {
        toast.error(parsed.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveLibro = async (libroData: Partial<Libro>) => {
    if (!canWrite) {
      toast.error("No tienes permisos para guardar libros.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (selectedLibro) {
        const payload = toUpdatePayload(libroData);
        const updated = await updateLibro(
          selectedLibro.codigo_biblioteca,
          payload,
        );

        setLibros((prev) =>
          prev.map((b) =>
            b.codigo_biblioteca === selectedLibro.codigo_biblioteca
              ? updated
              : b,
          ),
        );

        toast.success(`Libro "${updated.titulo}" actualizado correctamente.`);
        setStatusMessage(`Libro "${updated.titulo}" actualizado exitosamente`);
      } else {
        const payload = toLibroPayload(libroData);
        const created = await createLibro(payload);

        setLibros((prev) => [created, ...prev]);
        toast.success(`Libro "${created.titulo}" creado correctamente.`);
        setStatusMessage(`Libro "${created.titulo}" creado exitosamente`);
      }

      setIsModalOpen(false);
      setSelectedLibro(null);
      setTimeout(() => setStatusMessage(""), 2500);
    } catch (rawError) {
      const parsed = getUiErrorMessage(rawError);

      if (parsed.kind === "forbidden") {
        toast.error("No tienes permisos para realizar esta acción.");
      } else if (parsed.kind === "validation") {
        toast.error(parsed.message);
      } else if (parsed.kind === "unauthorized") {
        // Manejo global ya realizado por cliente HTTP
      } else {
        toast.error(parsed.message);
      }
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isLoading || isSubmitting}
            aria-label="Actualizar lista de libros"
            aria-disabled={isLoading || isSubmitting}
          >
            <RefreshCwIcon
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            Actualizar
          </Button>

          {canWrite && (
            <Button
              onClick={handleAddNew}
              size="default"
              disabled={isSubmitting}
              aria-label="Agregar nuevo libro a la biblioteca"
            >
              <PlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
              Nuevo Libro
            </Button>
          )}
        </nav>

        {!canWrite && (
          <div
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4"
            role="status"
            aria-live="polite"
          >
            <p className="text-amber-800 text-sm">
              Estás en modo solo lectura. No tienes permisos para crear, editar
              o eliminar libros.
            </p>
          </div>
        )}

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
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
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
          onEdit={canWrite ? handleEdit : undefined}
          onDelete={canWrite ? handleDelete : undefined}
          onStatusClick={(libro) => {
            setStatusMessage(
              `Abriendo estado de: ${libro.titulo}, ${libro.total_copias} ${libro.total_copias === 1 ? "copia disponible" : "copias disponibles"}`,
            );
            setSelectedStatusLibro(libro);
            setIsStatusModalOpen(true);
            setTimeout(() => setStatusMessage(""), 2500);
          }}
          isLoading={isLoading}
        />
      </div>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => {
          if (isSubmitting) return;
          setIsModalOpen(false);
          setSelectedLibro(null);
        }}
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
          setTimeout(() => setStatusMessage(""), 2500);
        }}
      />

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          if (isSubmitting) return;
          setIsDeleteModalOpen(open);
        }}
      >
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
