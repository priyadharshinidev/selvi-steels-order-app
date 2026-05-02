"use client";

import AppHeader from "@/components/AppHeader";
import ProductVisual from "@/components/ProductVisual";
import RequireUser from "@/components/RequireUser";
import { CheckCircle2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setSelectedVariants(
          data.products.reduce((current, product) => {
            current[product.id] = product.variants?.[0]?.id || "";
            return current;
          }, {})
        );
      });
  }, []);

  function setQuantity(productId, value) {
    setQuantities((current) => ({
      ...current,
      [productId]: Math.max(1, Number(value) || 1)
    }));
  }

  function setVariant(productId, variantId) {
    setSelectedVariants((current) => ({ ...current, [productId]: variantId }));
  }

  function addToCart(product) {
    const cart = JSON.parse(window.localStorage.getItem("fm_cart") || "[]");
    const quantity = quantities[product.id] || 1;
    const variant = product.variants.find(
      (item) => item.id === selectedVariants[product.id]
    );
    const cartId = `${product.id}-${variant.id}`;
    const existing = cart.find((item) => item.cartId === cartId);

    const nextCart = existing
      ? cart.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [
          ...cart,
          {
            cartId,
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            designCode: product.designCode,
            size: variant.size,
            weight: variant.weight,
            price: variant.price,
            quantity
          }
        ];

    window.localStorage.setItem("fm_cart", JSON.stringify(nextCart));
    setNotice(
      `${quantity} x ${product.name} (${variant.size}, ${variant.weight}) added to cart`
    );
    window.setTimeout(() => setNotice(""), 2400);
  }

  return (
    <RequireUser>
      <AppHeader />
      {notice ? (
        <div className="toast-notice" role="status" aria-live="polite">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      ) : null}
      <main className="page-shell">
        <section className="page-title-row">
          <div>
            <p className="eyebrow">Customer Order</p>
            <h1>Steel cot leg designs</h1>
          </div>
          <p className="muted">Choose design, size, weight and quantity.</p>
        </section>

        <section className="product-grid">
          {products.map((product) => {
            const selectedVariant = product.variants.find(
              (item) => item.id === selectedVariants[product.id]
            );

            return (
              <article className="product-card" key={product.id}>
                <ProductVisual product={product} />
                <div className="product-body">
                  <p className="product-code">{product.designCode}</p>
                  <h2>{product.name}</h2>
                  <label className="select-field">
                    <span>Size and weight</span>
                    <select
                      value={selectedVariants[product.id] || ""}
                      onChange={(event) =>
                        setVariant(product.id, event.target.value)
                      }
                    >
                      {product.variants.map((variant) => (
                        <option value={variant.id} key={variant.id}>
                          {variant.size} / {variant.weight} / Rs. {variant.price}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="spec-row">
                    <span>Size {selectedVariant?.size}</span>
                    <span>{selectedVariant?.weight}</span>
                    <span>Rs. {selectedVariant?.price}</span>
                  </div>
                  <div className="cart-actions">
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() =>
                        setQuantity(
                          product.id,
                          (quantities[product.id] || 1) - 1
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      value={quantities[product.id] || 1}
                      onChange={(event) =>
                        setQuantity(product.id, event.target.value)
                      }
                      inputMode="numeric"
                      aria-label="Quantity"
                    />
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() =>
                        setQuantity(
                          product.id,
                          (quantities[product.id] || 1) + 1
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart size={17} />
                      Add
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </RequireUser>
  );
}
