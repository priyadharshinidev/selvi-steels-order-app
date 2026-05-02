import { products as defaultProducts } from "@/lib/mockData";

const catalogKey = "fm_products";

function normalizeProducts(products) {
  return products.map((product) => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product;
    }

    return {
      ...product,
      imageUrl: product.imageUrl || "",
      imageData: product.imageData || "",
      variants: [
        {
          id: `${product.designCode || product.id}-1`,
          size: product.size || "40*44",
          weight: product.weight || "2kg",
          price: Number(product.price || 0)
        }
      ]
    };
  });
}

export function getDefaultProducts() {
  return defaultProducts;
}

export function getStoredProducts() {
  if (typeof window === "undefined") return defaultProducts;

  const savedProducts = window.localStorage.getItem(catalogKey);
  if (!savedProducts) {
    window.localStorage.setItem(catalogKey, JSON.stringify(defaultProducts));
    return defaultProducts;
  }

  const products = normalizeProducts(JSON.parse(savedProducts));
  window.localStorage.setItem(catalogKey, JSON.stringify(products));
  return products;
}

export function saveStoredProducts(products) {
  window.localStorage.setItem(catalogKey, JSON.stringify(products));
}
