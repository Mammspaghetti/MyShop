import { Link } from "@tanstack/react-router";
import { Moon, Search, ShoppingBag, Sun, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/cart";
import { useTheme } from "@/lib/theme";
import type { Category } from "@/lib/shop-api";

type Props = {
  search?: string;
  onSearchChange?: (value: string) => void;
  categories?: Category[];
  categoryId?: string;
  onCategoryChange?: (value: string) => void;
};

export function Header({
  search,
  onSearchChange,
  categories = [],
  categoryId = "all",
  onCategoryChange,
}: Props) {
  const cart = useCart();
  const { theme, toggle } = useTheme();
  const showFilters = typeof onSearchChange === "function";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="size-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            Mini<span className="text-accent">Shop</span>
          </span>
        </Link>

        {showFilters && (
          <div className="order-3 flex w-full flex-1 items-center gap-2 md:order-none md:w-auto">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Rechercher un produit…"
                aria-label="Rechercher un produit"
                className="h-10 rounded-xl pl-9"
              />
            </div>
            <Select value={categoryId} onValueChange={(v) => onCategoryChange?.(v)}>
              <SelectTrigger className="h-10 w-40 rounded-xl" aria-label="Catégorie">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Changer de thème">
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => cart.setOpen(true)}
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag className="size-5" />
            {cart.count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                {cart.count}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
