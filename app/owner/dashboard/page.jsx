"use client";

import AppHeader from "@/components/AppHeader";
import RequireUser from "@/components/RequireUser";
import { ClipboardList, PackageSearch, UsersRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OwnerDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/owner/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders));
    fetch("/api/owner/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.products));
  }, []);

  const pendingTotal = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <RequireUser ownerOnly>
      <AppHeader />
      <main className="page-shell">
        <section className="page-title-row">
          <div>
            <p className="eyebrow">Owner Maintenance</p>
            <h1>Dashboard</h1>
          </div>
          <p className="muted">Orders, products and customers in one place.</p>
        </section>

        <section className="metric-grid">
          <Link className="metric-card" href="/owner/orders">
            <ClipboardList size={24} />
            <span>{orders.length}</span>
            <p>Total orders</p>
          </Link>
          <Link className="metric-card" href="/owner/products">
            <PackageSearch size={24} />
            <span>{products.length}</span>
            <p>Product designs</p>
          </Link>
          <div className="metric-card">
            <UsersRound size={24} />
            <span>Rs. {pendingTotal}</span>
            <p>Pending value</p>
          </div>
        </section>
      </main>
    </RequireUser>
  );
}
