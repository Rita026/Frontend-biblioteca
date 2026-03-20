import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Libro } from "@/APIs/libros.api";
import { ScanLine } from "lucide-react";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  libro?: Libro | null;
  onSave: (libro: Partial<Libro>) => void;
}

export function BookModal({ isOpen, onClose, libro, onSave }: BookModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    autores: "",
    total_copias: "",
    codigo_biblioteca: "",
    isbn: "",
    editorial: "",
    notas: "",
  });

  useEffect(() => {
    if (libro) {
      setFormData({
        titulo: libro.titulo || "",
        autores: libro.autores || "",
        total_copias: libro.total_copias?.toString() || "",
        codigo_biblioteca: libro.codigo_biblioteca || "",
        isbn: libro.isbn || "",
        editorial: "", // Not in Libro interface currently, but in UI
        notas: "", // Not in Libro interface currently, but in UI
      });
    } else {
      setFormData({
        titulo: "",
        autores: "",
        total_copias: "",
        codigo_biblioteca: "",
        isbn: "",
        editorial: "",
        notas: "",
      });
    }
  }, [libro, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      total_copias: formData.total_copias
        ? parseInt(formData.total_copias, 10)
        : 0,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="sr-only">
          <DialogTitle>{libro ? "Editar Libro" : "Nuevo Libro"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="datos" className="w-full mt-4">
          <TabsList className="flex w-full justify-start bg-transparent p-0 space-x-2 mb-6 h-auto">
            <TabsTrigger
              value="escaneo"
              className="data-[state=active]:border-gray-200 data-[state=active]:shadow-sm border border-transparent text-base px-4 py-2"
            >
              Escaneo
            </TabsTrigger>
            <TabsTrigger
              value="datos"
              className="data-[state=active]:border-gray-200 data-[state=active]:shadow-sm border border-transparent text-base px-4 py-2"
            >
              Datos
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="escaneo"
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <div className="p-8 bg-gray-100 rounded-full">
              <ScanLine className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-500">Escanear código</p>
          </TabsContent>

          <TabsContent
            value="datos"
            className="space-y-4 max-h-[60vh] overflow-y-auto px-1"
          >
            <div className="space-y-2">
              <Label htmlFor="titulo">Titulo</Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Ej. El Quijote"
                value={formData.titulo}
                onChange={handleChange}
                className="bg-gray-50 border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="autores">Autor</Label>
              <Input
                id="autores"
                name="autores"
                placeholder="Ej. Miguel de Cervantes"
                value={formData.autores}
                onChange={handleChange}
                className="bg-gray-50 border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_copias">Cantidad</Label>
              <Input
                id="total_copias"
                name="total_copias"
                type="number"
                placeholder="Ej. 10"
                value={formData.total_copias}
                onChange={handleChange}
                className="bg-gray-50 border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo_biblioteca">Codigo</Label>
              <Input
                id="codigo_biblioteca"
                name="codigo_biblioteca"
                placeholder="Ej. D51R8YT"
                value={formData.codigo_biblioteca}
                onChange={handleChange}
                className="bg-gray-50 border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                placeholder="Ej. 978-0-12-345678-9"
                value={formData.isbn}
                onChange={handleChange}
                className="bg-gray-50 border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editorial">Editorial</Label>
              <Input
                id="editorial"
                name="editorial"
                placeholder="Ej. Garritas"
                value={formData.editorial}
                onChange={handleChange}
                className="bg-gray-50 border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                name="notas"
                placeholder="Agrega notas adicionales"
                value={formData.notas}
                onChange={handleChange}
                className="bg-gray-50 border-0"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 flex sm:justify-end gap-2">
          <Button
            variant="secondary"
            className="bg-gray-100 hover:bg-gray-200 text-gray-900"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="bg-[#18181b] text-white hover:bg-[#27272a]"
            onClick={handleSave}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
