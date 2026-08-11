import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SafeImage } from "./SafeImage";
import { formatPrice, type Product } from "@/lib/shop-api";
import { cn } from "@/lib/utils";

export function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product) => void;
}) {
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [product?.id]);

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        {product && (
          <>
            <DialogHeader>
              <DialogTitle className="pr-6 text-left text-lg">{product.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                  <SafeImage src={product.images[active]} alt={product.title} />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        aria-label={`Image ${i + 1}`}
                        className={cn(
                          "size-16 overflow-hidden rounded-lg border-2 bg-muted",
                          i === active ? "border-accent" : "border-transparent",
                        )}
                      >
                        <SafeImage src={img} alt={`${product.title} ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground">
                  {product.category?.name}
                </span>
                <p className="text-3xl font-extrabold text-foreground">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <Button size="lg" className="mt-auto gap-2" onClick={() => onAdd(product)}>
                  <ShoppingBag className="size-4" />
                  Ajouter au panier
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
