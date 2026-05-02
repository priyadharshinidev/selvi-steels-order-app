"use client";

import { ArrowRight, Phone, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.message || "Login failed.");
      return;
    }

    window.localStorage.setItem("fm_user", JSON.stringify(data.user));
    router.push(data.user.role === "owner" ? "/owner/dashboard" : "/orders");
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <p className="eyebrow">Furniture Manufacturing</p>
        <h1>Selvi Steels</h1>
        <p className="login-copy">
          Sign in with the registered customer or owner details.
        </p>

        <form onSubmit={submitLogin} className="login-form">
          <label>
            <span>Name</span>
            <div className="field">
              <UserRound size={18} />
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Customer or owner name"
                required
              />
            </div>
          </label>
          <label>
            <span>Phone Number</span>
            <div className="field">
              <Phone size={18} />
              <input
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="10 digit phone number"
                inputMode="numeric"
                pattern="[0-9]{10}"
                required
              />
            </div>
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Checking..." : "Login"}
            <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}
