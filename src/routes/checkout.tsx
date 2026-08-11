import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, MapPin, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Header } from "@/components/shop/Header";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { useCart, TAX_RATE } from "@/lib/cart";
import { formatPrice } from "@/lib/shop-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Commande — MiniShop" },
      {
        name: "description",
        content: "Finalisez votre commande MiniShop : adresse de livraison et paiement simulé.",
      },
      { property: "og:title", content: "Commande — MiniShop" },
      {
        property: "og:description",
        content: "Tunnel de commande en deux étapes avec récapitulatif détaillé.",
      },
    ],
  }),
  component: CheckoutPage,
});

type Address = { fullName: string; address: string; zip: string; city: string; email: string };

function CheckoutPage() {
  const cart = useCart();
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState<Address>({
    fullName: "",
    address: "",
    zip: "",
    city: "",
    email: "",
  });

  const update = (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((prev) => ({ ...prev, [key]: e.target.value }));

  const addressValid = Object.values(address).every((v) => v.trim().length > 1);

  const submitOrder = () => {
    const ref = `MS-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;
    setOrderId(ref);
    cart.clear();
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {orderId ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent">
              <CheckCircle2 className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-bold text-foreground">Commande confirmée !</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Merci pour votre achat. Vous recevrez un e-mail de confirmation sous peu.
            </p>
            <p className="mt-6 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground">
              Numéro de suivi : {orderId}
            </p>
            <Button asChild className="mt-6 w-full" size="lg">
              <Link to="/">Retour à la boutique</Link>
            </Button>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="py-24 text-center">
            <PackageCheck className="mx-auto size-10 text-muted-foreground" />
            <h1 className="mt-4 text-xl font-semibold text-foreground">Votre panier est vide</h1>
            <Button asChild className="mt-6">
              <Link to="/">Parcourir le catalogue</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Finaliser la commande</h1>
              <div className="mt-6 flex items-center gap-3">
                {[1, 2].map((s) => (
                  <div key={s} className="flex flex-1 items-center gap-2">
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                        step >= s
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {s}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {s === 1 ? "Livraison" : "Paiement"}
                    </span>
                    {s === 1 && <div className="h-px flex-1 bg-border" />}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                {step === 1 ? (
                  <>
                    <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                      <MapPin className="size-4" /> Adresse de livraison
                    </h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label htmlFor="fullName">Nom complet</Label>
                        <Input
                          id="fullName"
                          value={address.fullName}
                          onChange={update("fullName")}
                          className="mt-1.5"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={address.email}
                          onChange={update("email")}
                          className="mt-1.5"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Input
                          id="address"
                          value={address.address}
                          onChange={update("address")}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">Code postal</Label>
                        <Input
                          id="zip"
                          value={address.zip}
                          onChange={update("zip")}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={address.city}
                          onChange={update("city")}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <Button
                      className="mt-6 w-full"
                      size="lg"
                      disabled={!addressValid}
                      onClick={() => setStep(2)}
                    >
                      Continuer vers le paiement
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                      <CreditCard className="size-4" /> Mode de paiement (simulé)
                    </h2>
                    <RadioGroup value={payment} onValueChange={setPayment} className="mt-5 gap-3">
                      {[
                        { id: "card", label: "Carte bancaire" },
                        { id: "paypal", label: "PayPal" },
                        { id: "delivery", label: "Paiement à la livraison" },
                      ].map((option) => (
                        <label
                          key={option.id}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 text-sm font-medium text-foreground"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          {option.label}
                        </label>
                      ))}
                    </RadioGroup>
                    {payment === "card" && (
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Label htmlFor="card">Numéro de carte</Label>
                          <Input id="card" placeholder="4242 4242 4242 4242" className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="exp">Expiration</Label>
                          <Input id="exp" placeholder="12/29" className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" className="mt-1.5" />
                        </div>
                      </div>
                    )}
                    <div className="mt-6 flex gap-3">
                      <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                        Retour
                      </Button>
                      <Button className="flex-1" size="lg" onClick={submitOrder}>
                        Valider la commande
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Récapitulatif
              </h2>
              <ul className="mt-4 space-y-3">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 text-sm">
                    <span className="line-clamp-1 text-foreground">
                      {item.quantity} × {item.title}
                    </span>
                    <span className="shrink-0 font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA ({Math.round(TAX_RATE * 100)}%)</span>
                  <span>{formatPrice(cart.taxes)}</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </aside>
          </div>
        )}
      </main>
      <CartDrawer />
    </div>
  );
}
