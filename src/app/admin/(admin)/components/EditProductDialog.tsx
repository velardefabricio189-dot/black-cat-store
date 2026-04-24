"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

// Tipos temporales, ajusta tu type Product global según sea necesario
type Color = { id: string; name: string; hex: string };
type Size = { id: string; name: string };

export default function EditProductDialog({ product }: { product: any }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const initialColors = product.product_colors?.map((pc: any) => pc.color_id) || [];
  const initialSizes = product.product_sizes?.map((ps: any) => ps.size_id) || [];
  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes);

  // Cargar catálogos al abrir
  useEffect(() => {
    if (open) {
      fetch("/api/colors").then(res => res.json()).then(data => setAvailableColors(data.data || []));
      fetch("/api/sizes").then(res => res.json()).then(data => setAvailableSizes(data.data || []));
      setSelectedColors(initialColors);
      setSelectedSizes(initialSizes);
    }
  }, [open, product]);

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
    const data = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string || "0", 10),
      description: formData.get("description") as string,
      color_ids: selectedColors, // Añadimos los colores al JSON
      size_ids: selectedSizes,   // Añadimos las tallas al JSON
    };

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al modificar producto");

      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile.size > 0) {
        const imgData = new FormData();
        imgData.append("image", imageFile);
        const imgRes = await fetch(`/api/products/${product.id}/image`, {
          method: "POST",
          body: imgData,
        });
        if (!imgRes.ok) throw new Error("Error al modificar la imagen");
      }

      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error al editar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs">
        Editar
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <Input name="name" defaultValue={product.name} required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Precio</label>
              <Input name="price" type="number" step="0.01" defaultValue={product.price} required />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Stock Global</label>
              <Input name="stock" type="number" defaultValue={product.stock} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Descripción</label>
            <Textarea name="description" rows={3} defaultValue={product.description || ""} />
          </div>

          {/* Selector de Colores */}
          <div>
            <label className="block text-sm mb-2 font-semibold">Colores disponibles</label>
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
            <label className="block text-sm mb-2 font-semibold">Tallas disponibles</label>
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

          <div className="border-t pt-4">
            <label className="block text-sm mb-1 font-semibold">Actualizar Imagen</label>
            <span className="text-xs text-gray-500 block mb-2">Selecciona un archivo si deseas reemplazar la imagen principal</span>
            <Input name="image" type="file" accept="image/*" />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}