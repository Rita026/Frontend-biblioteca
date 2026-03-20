import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Libro } from "@/APIs/libros.api";
import { BookOpen, AlertCircle, CheckCircle2, Wrench } from "lucide-react";

interface BookStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  libro: Libro | null;
  onSave?: (statuses: string[]) => void;
}

const STATUS_OPTIONS = [
  {
    value: "disponible",
    label: "Disponible",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  {
    value: "prestado",
    label: "Prestado",
    icon: BookOpen,
    color: "text-blue-600",
  },
  {
    value: "reparacion",
    label: "En reparación",
    icon: Wrench,
    color: "text-yellow-600",
  },
  {
    value: "extraviado",
    label: "Extraviado",
    icon: AlertCircle,
    color: "text-red-600",
  },
];

export function BookStatusModal({
  isOpen,
  onClose,
  libro,
  onSave,
}: BookStatusModalProps) {
  const [statuses, setStatuses] = useState<string[]>([]);

  useEffect(() => {
    if (libro && libro.total_copias > 0) {
      // Initialize with 'disponible' or existing statuses if we had them
      setStatuses(Array(libro.total_copias).fill("disponible"));
    } else {
      setStatuses([]);
    }
  }, [libro, isOpen]);

  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedStatuses = [...statuses];
    updatedStatuses[index] = newStatus;
    setStatuses(updatedStatuses);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(statuses);
    }
    onClose();
  };

  if (!libro) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] max-h-[85vh] flex flex-col p-6 overflow-hidden bg-white border-0">
        <DialogHeader className="pb-4">
          <p className="text-base text-gray-700 text-left">
            Estados del libro:
          </p>
          <DialogTitle className="text-3xl font-bold text-black text-left mt-1">
            {libro.titulo}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-8 pb-4">
          {statuses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay copias registradas para este libro.
            </div>
          ) : (
            statuses.map((status, index) => (
              <div key={index} className="flex flex-col gap-4">
                <h3 className="font-bold text-black text-xl">
                  Copia {index + 1}
                </h3>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-black min-w-[60px]">
                    Estado
                  </span>
                  <Select
                    value={status}
                    onValueChange={(value) => handleStatusChange(index, value)}
                  >
                    <SelectTrigger className="flex-1 bg-gray-50 border-0 h-11 rounded-xl text-gray-500 focus:ring-2 focus:ring-gray-200 focus:ring-offset-0 text-base">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="cursor-pointer text-base"
                        >
                          <div className="flex items-center gap-2">
                            <span>{opt.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="pt-4 flex sm:justify-end gap-2">
          <Button
            variant="outline"
            className="border-0 bg-gray-100 hover:bg-gray-200 text-black rounded-xl px-6"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="bg-black text-white hover:bg-gray-900 rounded-xl px-6"
            onClick={handleSave}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
