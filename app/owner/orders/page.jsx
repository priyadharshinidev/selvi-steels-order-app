"use client";

import AppHeader from "@/components/AppHeader";
import RequireUser from "@/components/RequireUser";
import { useEffect, useState } from "react";

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/owner/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders));
  }, []);

  return (
    <RequireUser ownerOnly>
      <AppHeader />
      <main className="page-shell">
        <section className="page-title-row">
          <div>
            <p className="eyebrow">Maintenance</p>
            <h1>Orders</h1>
          </div>
          <p className="muted">Review customer postpaid orders.</p>
        </section>

        <section className="owner-table">
          {orders.map((order) => (
            <article className="order-row" key={order.id}>
              <div>
                <p className="product-code">{order.id}</p>
                <h2>{order.customerName}</h2>
                <p>
                  {order.phone} / {order.createdAt} / {order.status}
                </p>
              </div>
              <strong>Rs. {order.total}</strong>
            </article>
          ))}
        </section>
      </main>
    </RequireUser>
  );
}
