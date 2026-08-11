import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shop/Header";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductModal } from "@/components/shop/ProductModal";
import { ProductGridSkeleton } from "@/components/shop/ProductGridSkeleton";
import { ErrorState } from "@/components/shop/ErrorState";
import { fetchCategories, fetchProducts, type Product } from "@/lib/shop-api";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MiniShop — Boutique en ligne moderne" },
      {
        name: "description",
        content:
          "Découvrez des centaines de produits sur MiniShop : recherche instantanée, filtres par catégorie, tri par prix et panier persistant.",
      },
      { property: "og:title", content: "MiniShop — Boutique en ligne moderne" },
      {
        property: "og:description",
        content: "Catalogue complet, recherche instantanée, panier et checkout simplifiés.",
      },
    ],
  }),
  component: HomePage,
});

const PAGE_SIZE = 12;
type Sort = "default" | "asc" | "desc";

function HomePage() {
  const cart = useCart();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sort, setSort] = useState<Sort>("default");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const productsQuery = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const filtered = useMemo(() => {
    let list = productsQuery.data ?? [];
    if (categoryId !== "all") list = list.filter((p) => String(p.category?.id) === categoryId);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (sort !== "default") {
      list = [...list].sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
    }
    return list;
  }, [productsQuery.data, categoryId, search, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const addToCart = (product: Product) => {
    cart.add(product);
    toast.success("Ajouté au panier", { description: product.title });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          resetPage();
        }}
        categories={categoriesQuery.data ?? []}
        categoryId={categoryId}
        onCategoryChange={(v) => {
          setCategoryId(v);
          resetPage();
        }}
      />

      <section className="border-b border-border bg-[image:var(--gradient-hero)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Nouvelle collection
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            Tout ce qu'il vous faut, au meilleur prix.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Des centaines de produits soigneusement sélectionnés — livraison rapide, paiement
            sécurisé et retours gratuits sous 30 jours.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            {productsQuery.isLoading ? "Chargement…" : `${filtered.length} produit(s)`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={sort === "asc" ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={() => setSort(sort === "asc" ? "default" : "asc")}
            >
              <ArrowUpNarrowWide className="size-4" /> Prix croissant
            </Button>
            <Button
              variant={sort === "desc" ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={() => setSort(sort === "desc" ? "default" : "desc")}
            >
              <ArrowDownNarrowWide className="size-4" /> Prix décroissant
            </Button>
          </div>
        </div>

        {productsQuery.isLoading && <ProductGridSkeleton />}

        {productsQuery.isError && (
          <ErrorState
            message={(productsQuery.error as Error)?.message}
            onRetry={() => productsQuery.refetch()}
          />
        )}

        {productsQuery.isSuccess && filtered.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">
            Aucun produit ne correspond à votre recherche.
          </p>
        )}

        {productsQuery.isSuccess && filtered.length > 0 && (
          <>
            <div
              className={cn(
                "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              )}
            >
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={() => setSelected(product)}
                  onAdd={() => addToCart(product)}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() =>
                    setFavorites((prev) =>
                      prev.includes(product.id)
                        ? prev.filter((id) => id !== product.id)
                        : [...prev, product.id],
                    )
                  }
                />
              ))}
            </div>

            {visible.length < filtered.length && (
              <div className="mt-10 flex justify-center">
                <Button size="lg" variant="outline" onClick={() => setPage((p) => p + 1)}>
                  Afficher plus de produits
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} MiniShop — Démo propulsée par Platzi Fake Store API.
      </footer>

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onAdd={(p) => {
          addToCart(p);
          setSelected(null);
        }}
      />
      <CartDrawer />
    </div>
  );
}
