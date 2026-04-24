"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

type Props = {
  categoryId: string;
};

// Tipos para las opciones que vienen de la BD
type Color = { id: string; name: string; hex: string };
type Size = { id: string; name: string };

export default function AddProductDialog({ categoryId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para opciones disponibles
  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);

  // Estados para lo que selecciona el usuario
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Cargar colores y tallas cuando se abre el modal
  useEffect(() => {
    if (open) {
      fetch("/api/colors").then(res => res.json()).then(data => setAvailableColors(data.data || []));
      fetch("/api/sizes").then(res => res.json()).then(data => setAvailableSizes(data.data || []));
    } else {
      // Limpiar al cerrar
      setSelectedColors([]);
      setSelectedSizes([]);
    }
  }, [open]);

  const toggleSelection = (id: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (current.includes(id)) {
      setter(current.filter((item) => item !== id));
    } else {
      setter([...current, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("category_id", categoryId);
    
    // Adjuntamos las selecciones como strings JSON
    formData.append("color_ids", JSON.stringify(selectedColors));
    formData.append("size_ids", JSON.stringify(selectedSizes));

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al crear producto");

      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error al subir el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
        Agregar Producto
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <Input name="name" required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Precio</label>
              <Input name="price" type="number" step="0.01" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Stock</label>
              <Input name="stock" type="number" defaultValue="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Descripción</label>
            <Textarea name="description" rows={3} />
          </div>

          {/* Selector de Colores */}
          <div>
            <label className="block text-sm mb-2">Colores disponibles</label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  type="button"
                  key={color.id}
                  onClick={() => toggleSelection(color.id, selectedColors, setSelectedColors)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm transition-all ${
                    selectedColors.includes(color.id) ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-muted-foreground/30 hover:bg-muted"
                  }`}
                >
                  <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: color.hex }}></span>
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Tallas */}
          <div>
            <label className="block text-sm mb-2">Tallas disponibles</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  type="button"
                  key={size.id}
                  onClick={() => toggleSelection(size.id, selectedSizes, setSelectedSizes)}
                  className={`px-3 py-1 rounded-md border text-sm transition-all ${
                    selectedSizes.includes(size.id) ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 hover:bg-muted"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Crear Producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}