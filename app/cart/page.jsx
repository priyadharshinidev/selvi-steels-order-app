"use client";

import AppHeader from "@/components/AppHeader";
import RequireUser from "@/components/RequireUser";
import { CheckCircle2, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCart(JSON.parse(window.localStorage.getItem("fm_cart") || "[]"));
  }, []);

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      ),
    [cart]
  );

  function saveCart(nextCart) {
    setCart(nextCart);
    window.localStorage.setItem("fm_cart", JSON.stringify(nextCart));
  }

  function changeQuantity(cartId, change) {
    saveCart(
      cart.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  }

  function removeItem(cartId) {
    saveCart(cart.filter((item) => item.cartId !== cartId));
  }

  async function placeOrder() {
    const user = JSON.parse(window.localStorage.getItem("fm_user") || "{}");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: user.name,
        phone: user.phone,
        items: cart
      })
    });

    if (response.ok) {
      const data = await response.json();
      saveCart([]);
      setMessage(`Order ${data.order.id} created. Total Rs. ${data.order.total}`);
    }
  }

  return (
    <RequireUser>
      <AppHeader />
      <main className="page-shell narrow">
        <section className="page-title-row">
          <div>
            <p className="eyebrow">Postpaid Order</p>
            <h1>Cart summary</h1>
          </div>
          <p className="total-pill">Rs. {total}</p>
        </section>

        <section className="cart-list">
          {cart.length === 0 ? (
            <div className="empty-state">No items in cart.</div>
          ) : (
            cart.map((item) => (
              <article className="cart-row" key={item.cartId}>
                <div>
                  <h2>{item.name}</h2>
                  <p>
                    {item.designCode} / {item.size} / {item.weight} / Rs.{" "}
                    {item.price}
                  </p>
                </div>
                <div className="quantity-tools">
                  <button onClick={() => changeQuantity(item.cartId, -1)}>
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => changeQuantity(item.cartId, 1)}>
                    <Plus size={16} />
                  </button>
                  <button onClick={() => removeItem(item.cartId)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        {message ? (
          <p className="success-message">
            <CheckCircle2 size={18} />
            {message}
          </p>
        ) : null}

        <button
          className="primary-button wide-button"
          type="button"
          disabled={cart.length === 0}
          onClick={placeOrder}
        >
          Buy / Create Postpaid Order
        </button>
      </main>
    </RequireUser>
  );
}
