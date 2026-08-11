import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "./SafeImage";
import { formatPrice, type Product } from "@/lib/shop-api";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  onOpen,
  onAdd,
  isFavorite,
  onToggleFavorite,
}: {
  product: Product;
  onOpen: () => void;
  onAdd: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
      <button
        type="button"
        onClick={onOpen}
        className="relative aspect-4/3 overflow-hidden bg-muted text-left"
        aria-label={`Voir ${product.title}`}
      >
        <SafeImage
          src={product.images[0]}
          alt={product.title}
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </button>
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-label="Ajouter aux favoris"
        className="absolute right-3 top-3 hidden"
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-secondary-foreground">
            {product.category?.name}
          </span>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label="Favori"
            className="text-muted-foreground transition-colors hover:text-accent"
          >
            <Heart className={cn("size-4", isFavorite && "fill-accent text-accent")} />
          </button>
        </div>
        <h3
          onClick={onOpen}
          className="line-clamp-2 cursor-pointer text-sm font-semibold leading-snug text-foreground"
        >
          {product.title}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
          <Button size="sm" onClick={onAdd} className="gap-1.5">
            <Plus className="size-4" />
            Panier
          </Button>
        </div>
      </div>
    </article>
  );
}
