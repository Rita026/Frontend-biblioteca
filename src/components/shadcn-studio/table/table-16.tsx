import { BookCheckIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Libro } from "@/APIs/libros.api";
import { Loader } from "@/components/common";

interface LibrosTableProps {
  libros: Libro[];
  onEdit?: (libro: Libro) => void;
  onDelete?: (libro: Libro) => void;
  onStatusClick?: (libro: Libro) => void;
  isLoading?: boolean;
}

const LibrosTable = ({
  libros,
  onEdit,
  onDelete,
  onStatusClick,
  isLoading = false,
}: LibrosTableProps) => {
  const getEstadoColor = (totalCopias: number) => {
    if (totalCopias === 0) {
      return "text-red-600 hover:bg-red-50";
    } else if (totalCopias <= 2) {
      return "text-yellow-600 hover:bg-yellow-50";
    } else {
      return "text-green-600 hover:bg-green-50";
    }
  };

  const getEstadoText = (totalCopias: number) => {
    if (totalCopias === 0) {
      return "Agotado";
    } else if (totalCopias <= 2) {
      return "Pocas copias";
    } else {
      return "Disponible";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full" role="status" aria-live="polite" aria-busy="true">
        <div className="rounded-sm border bg-white">
          <div className="flex items-center justify-center p-12">
            <Loader size="md" text="Cargando libros..." />
          </div>
        </div>
      </div>
    );
  }

  if (libros.length === 0) {
    return (
      <div className="w-full" role="status" aria-live="polite">
        <div className="rounded-sm border bg-white">
          <div className="flex flex-col items-center justify-center p-12 gap-2">
            <p className="text-muted-foreground text-lg">
              No hay libros disponibles
            </p>
            <p className="text-muted-foreground text-sm">
              Agrega tu primer libro para comenzar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" role="region" aria-label="Tabla de libros">
      <div className="[&>div]:rounded-sm [&>div]:border">
        <Table role="table" aria-label="Lista de libros de la biblioteca">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead scope="col">Código</TableHead>
              <TableHead scope="col">Título</TableHead>
              <TableHead scope="col">Autor(es)</TableHead>
              <TableHead scope="col" className="text-center">
                Total
              </TableHead>
              <TableHead scope="col">ISBN</TableHead>
              <TableHead scope="col" className="text-center">
                Estado
              </TableHead>
              <TableHead scope="col" className="w-0">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody aria-live="polite" aria-relevant="additions removals">
            {libros.map((libro) => (
              <TableRow
                key={libro.codigo_biblioteca}
                className="has-data-[state=checked]:bg-muted/50"
                role="row"
              >
                <TableCell role="cell">
                  <div className="font-mono text-sm">
                    {libro.codigo_biblioteca}
                  </div>
                </TableCell>
                <TableCell role="cell">
                  <div
                    className="font-medium max-w-75 truncate"
                    title={libro.titulo}
                  >
                    {libro.titulo}
                  </div>
                </TableCell>
                <TableCell role="cell">
                  <div
                    className="text-sm max-w-50 truncate"
                    title={libro.autores}
                  >
                    {libro.autores}
                  </div>
                </TableCell>
                <TableCell role="cell">
                  <div
                    className="text-center font-medium"
                    aria-label={`Total de copias: ${libro.total_copias}`}
                  >
                    {libro.total_copias}
                  </div>
                </TableCell>
                <TableCell role="cell">
                  <div className="font-mono text-xs text-muted-foreground">
                    {libro.isbn}
                  </div>
                </TableCell>
                <TableCell role="cell">
                  <div className="flex items-center justify-center">
                    {onStatusClick ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-full ${getEstadoColor(libro.total_copias)}`}
                        onClick={() => onStatusClick(libro)}
                        title={getEstadoText(libro.total_copias)}
                        aria-label={`Ver estado del libro ${libro.titulo}: ${getEstadoText(libro.total_copias)}, ${libro.total_copias} ${libro.total_copias === 1 ? "copia" : "copias"}`}
                      >
                        <BookCheckIcon className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    ) : (
                      <div
                        className={`p-2 ${getEstadoColor(libro.total_copias).split(" ")[0]}`}
                        title={getEstadoText(libro.total_copias)}
                        role="status"
                        aria-label={`Estado: ${getEstadoText(libro.total_copias)}`}
                      >
                        <BookCheckIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell role="cell" className="flex items-center gap-1">
                  <div
                    role="group"
                    aria-label={`Acciones para ${libro.titulo}`}
                  >
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        aria-label={`Editar libro ${libro.titulo}`}
                        onClick={() => onEdit(libro)}
                        title="Editar libro"
                      >
                        <PencilIcon className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Eliminar libro ${libro.titulo}`}
                        onClick={() => onDelete(libro)}
                        title="Eliminar libro"
                      >
                        <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {libros.length === 1
          ? `Mostrando 1 libro en la tabla`
          : `Mostrando ${libros.length} libros en la tabla`}
      </div>
    </div>
  );
};

export default LibrosTable;
