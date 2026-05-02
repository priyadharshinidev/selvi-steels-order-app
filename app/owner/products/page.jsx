"use client";

import AppHeader from "@/components/AppHeader";
import ProductVisual from "@/components/ProductVisual";
import RequireUser from "@/components/RequireUser";
import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const emptyForm = {
  id: "",
  name: "",
  designCode: "",
  imageUrl: "",
  imageData: "",
  color: "#245a6b",
  accent: "#d9a441",
  variants: [{ id: "", size: "", weight: "", price: "" }]
};

export default function OwnerProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const response = await fetch("/api/owner/products", { cache: "no-store" });
    const data = await response.json();
    setProducts(data.products);
  }

  function editProduct(product) {
    setEditingId(product.id);
    setForm({
      ...product,
      variants: product.variants.map((variant) => ({ ...variant }))
    });
    setMessage("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function updateVariant(index, field, value) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      )
    }));
  }

  function addVariant() {
    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        { id: "", size: "", weight: "", price: "" }
      ]
    }));
  }

  async function selectImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        imageData: reader.result,
        imageUrl: ""
      }));
    };
    reader.readAsDataURL(file);

    const uploadData = new FormData();
    uploadData.append("file", file);
    setUploading(true);
    setMessage("");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadData
    });
    const data = await response.json();
    setUploading(false);

    if (!response.ok) {
      setMessage(data.message || "Image upload failed.");
      return;
    }

    setForm((current) => ({ ...current, imageUrl: data.url }));
    setMessage("Image uploaded and ready to save.");
  }

  function removeVariant(index) {
    setForm((current) => ({
      ...current,
      variants:
        current.variants.length === 1
          ? current.variants
          : current.variants.filter((_, variantIndex) => variantIndex !== index)
    }));
  }

  async function saveProduct(event) {
    event.preventDefault();

    const productId = editingId || null;
    const cleanedProduct = {
      id: productId,
      name: form.name.trim(),
      designCode: form.designCode.trim(),
      imageUrl: form.imageUrl.trim(),
      imageData: form.imageData,
      color: form.color,
      accent: form.accent,
      variants: form.variants.map((variant, index) => ({
        id: variant.id || `${form.designCode.trim() || productId}-${index + 1}`,
        size: variant.size.trim(),
        weight: variant.weight.trim(),
        price: Number(variant.price)
      }))
    };

    const response = await fetch("/api/owner/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanedProduct)
    });

    if (!response.ok) {
      setMessage("Product save failed.");
      return;
    }

    await loadProducts();
    resetForm();
    setMessage("Product saved. Customer order page will show the updated list.");
  }

  async function deleteProduct(productId) {
    const response = await fetch("/api/owner/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId })
    });

    if (!response.ok) {
      setMessage("Product delete failed.");
      return;
    }

    await loadProducts();
    if (editingId === productId) resetForm();
    setMessage("Product removed.");
  }

  return (
    <RequireUser ownerOnly>
      <AppHeader />
      <main className="page-shell">
        <section className="page-title-row">
          <div>
            <p className="eyebrow">Maintenance</p>
            <h1>Products</h1>
          </div>
          <p className="muted">Add designs and maintain size, weight and cost.</p>
        </section>

        <section className="maintenance-layout">
          <form className="owner-form" onSubmit={saveProduct}>
            <div className="form-title-row">
              <h2>{editingId ? "Edit product" : "Add product"}</h2>
              {editingId ? (
                <button type="button" className="icon-button" onClick={resetForm}>
                  <X size={16} />
                </button>
              ) : null}
            </div>

            <label>
              <span>Product Name</span>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Classic Straight Leg"
                required
              />
            </label>
            <label>
              <span>Design Code</span>
              <input
                value={form.designCode}
                onChange={(event) =>
                  setForm({ ...form, designCode: event.target.value })
                }
                placeholder="CL-01"
                required
              />
            </label>
            <label>
              <span>Select Image From System</span>
              <input type="file" accept="image/*" onChange={selectImage} />
            </label>
            {uploading ? <p className="muted">Uploading image...</p> : null}
            <label>
              <span>Image URL Optional</span>
              <input
                value={form.imageUrl}
                onChange={(event) =>
                  setForm({
                    ...form,
                    imageUrl: event.target.value,
                    imageData: event.target.value ? "" : form.imageData
                  })
                }
                placeholder="https://example.com/design.jpg"
              />
            </label>
            {form.imageData || form.imageUrl ? (
              <div className="form-preview">
                <ProductVisual product={form} />
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setForm({ ...form, imageData: "", imageUrl: "" })}
                >
                  <X size={16} />
                  Remove image
                </button>
              </div>
            ) : null}

            <div className="color-grid">
              <label>
                <span>Body Color</span>
                <input
                  type="color"
                  value={form.color}
                  onChange={(event) =>
                    setForm({ ...form, color: event.target.value })
                  }
                />
              </label>
              <label>
                <span>Accent Color</span>
                <input
                  type="color"
                  value={form.accent}
                  onChange={(event) =>
                    setForm({ ...form, accent: event.target.value })
                  }
                />
              </label>
            </div>

            <div className="variant-title-row">
              <h3>Sizes, weights and cost</h3>
              <button type="button" className="ghost-button" onClick={addVariant}>
                <Plus size={16} />
                Add row
              </button>
            </div>

            <div className="variant-editor">
              {form.variants.map((variant, index) => (
                <div className="variant-row" key={index}>
                  <input
                    value={variant.size}
                    onChange={(event) =>
                      updateVariant(index, "size", event.target.value)
                    }
                    placeholder="40*44"
                    required
                  />
                  <input
                    value={variant.weight}
                    onChange={(event) =>
                      updateVariant(index, "weight", event.target.value)
                    }
                    placeholder="3kg"
                    required
                  />
                  <input
                    value={variant.price}
                    onChange={(event) =>
                      updateVariant(index, "price", event.target.value)
                    }
                    placeholder="245"
                    inputMode="numeric"
                    required
                  />
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => removeVariant(index)}
                    aria-label="Remove variant"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button className="primary-button" type="submit">
              <Save size={17} />
              Save Product
            </button>
            {message ? <p className="success-message">{message}</p> : null}
          </form>

          <section className="owner-table">
            {products.map((product) => (
              <article className="owner-product-row" key={product.id}>
                <ProductVisual product={product} />
                <div>
                  <p className="product-code">{product.designCode}</p>
                  <h2>{product.name}</h2>
                  <div className="variant-list">
                    {product.variants.map((variant) => (
                      <span key={variant.id}>
                        {variant.size} / {variant.weight} / Rs. {variant.price}
                      </span>
                    ))}
                  </div>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => editProduct(product)}
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </section>
      </main>
    </RequireUser>
  );
}
