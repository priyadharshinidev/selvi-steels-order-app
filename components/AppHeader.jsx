"use client";

import Link from "next/link";
import { LogOut, Package, ShoppingCart, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = window.localStorage.getItem("fm_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  function logout() {
    window.localStorage.removeItem("fm_user");
    window.localStorage.removeItem("fm_cart");
    router.push("/login");
  }

  return (
    <header className="app-header">
      <Link className="brand" href="/orders">
        <span className="brand-mark">SS</span>
        <span>Selvi Steels</span>
      </Link>
      <nav>
        <Link href="/orders">
          <Package size={18} />
          Orders
        </Link>
        <Link href="/cart">
          <ShoppingCart size={18} />
          Cart
        </Link>
        {user?.role === "owner" ? (
          <Link href="/owner/dashboard">
            <Wrench size={18} />
            Owner
          </Link>
        ) : null}
        <button type="button" onClick={logout} aria-label="Logout">
          <LogOut size={18} />
        </button>
      </nav>
    </header>
  );
}
