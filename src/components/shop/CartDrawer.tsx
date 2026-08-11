import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SafeImage } from "./SafeImage";
import { useCart, TAX_RATE } from "@/lib/cart";
import { formatPrice } from "@/lib/shop-api";

export function CartDrawer() {
  const cart = useCart();

  return (
    <Sheet open={cart.isOpen} onOpenChange={cart.setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" /> Votre panier
          </SheetTitle>
          <SheetDescription>
            {cart.count > 0 ? `${cart.count} article(s)` : "Votre panier est vide"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag className="size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Ajoutez des produits pour commencer vos achats.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-xl border border-border p-3">
                  <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <SafeImage src={item.image} alt={item.title} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-2 text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          className="px-2 py-1 text-muted-foreground hover:text-foreground"
                          aria-label="Diminuer la quantité"
                          onClick={() => cart.setQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-7 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          className="px-2 py-1 text-muted-foreground hover:text-foreground"
                          aria-label="Augmenter la quantité"
                          onClick={() => cart.setQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => cart.remove(item.id)}
                          aria-label="Retirer du panier"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="space-y-3 border-t border-border p-5">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Sous-total</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>TVA ({Math.round(TAX_RATE * 100)}%)</span>
              <span>{formatPrice(cart.taxes)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold text-foreground">
              <span>Total</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
            <Button asChild className="w-full" size="lg">
              <Link to="/checkout" onClick={() => cart.setOpen(false)}>
                Passer commande
              </Link>
            </Button>
            <Button variant="ghost" className="w-full" onClick={cart.clear}>
              Vider le panier
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
