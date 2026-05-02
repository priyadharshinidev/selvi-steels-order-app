"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequireUser({ ownerOnly = false, children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedUser = window.localStorage.getItem("fm_user");

    if (!savedUser) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(savedUser);
    if (ownerOnly && user.role !== "owner") {
      router.replace("/orders");
      return;
    }

    setReady(true);
  }, [ownerOnly, router]);

  if (!ready) return null;

  return children;
}
