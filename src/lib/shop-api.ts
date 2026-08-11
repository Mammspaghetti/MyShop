export type Category = {
  id: number;
  name: string;
  image: string;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
};

const BASE = "https://api.escuelajs.co/api/v1";

export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#e9e5df"/><text x="50%" y="50%" font-family="sans-serif" font-size="22" fill="#a09a90" text-anchor="middle">Image indisponible</text></svg>`,
  );

/** The API returns messy image data: JSON-ish strings, quotes, brackets. */
export function cleanImages(images: unknown): string[] {
  const raw = Array.isArray(images) ? images : [];
  const out: string[] = [];
  for (const entry of raw) {
    if (typeof entry !== "string") continue;
    const cleaned = entry.replace(/[[\]"'\\]/g, "").trim();
    if (cleaned.startsWith("http")) out.push(cleaned);
  }
  return out.length ? out : [PLACEHOLDER_IMAGE];
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur réseau (${res.status})`);
  return (await res.json()) as T;
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await getJson<Product[]>(`${BASE}/products?offset=0&limit=180`);
  return data
    .filter((p) => p && typeof p.title === "string" && p.category)
    .map((p) => ({ ...p, images: cleanImages(p.images) }));
}

export async function fetchCategories(): Promise<Category[]> {
  const data = await getJson<Category[]>(`${BASE}/categories?limit=30`);
  return data.filter((c) => c && c.name);
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
