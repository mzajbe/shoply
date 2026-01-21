"use client";

import React, { useState, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: "Active" | "Draft" | "Archived";
  imageUrl?: string | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: 0,
    status: "Active",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/dashboard/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/dashboard/products?id=${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("sku", formData.sku);
      payload.append("category", formData.category);
      payload.append("price", formData.price);
      payload.append("stock", String(formData.stock));
      payload.append("status", formData.status);
      payload.append("imageUrl", formData.imageUrl || "");
      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (editingProduct) {
        // Update
        payload.append("id", editingProduct.id);
        await fetch("/api/dashboard/products", {
          method: "PUT",
          body: payload,
        });
      } else {
        // Create
        await fetch("/api/dashboard/products", {
          method: "POST",
          body: payload,
        });
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: "", sku: "", category: "", price: "", stock: 0, status: "Active", imageUrl: "" });
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch (error) {
      alert("Operation failed");
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      imageUrl: product.imageUrl || "",
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || null);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", sku: "", category: "", price: "", stock: 0, status: "Active", imageUrl: "" });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            All Products ({products.length})
          </h2>

          <input
            placeholder="Search products..."
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-3 text-left text-slate-600">Product</th>
              <th className="p-3 text-left text-slate-600">SKU</th>
              <th className="p-3 text-left text-slate-600">Category</th>
              <th className="p-3 text-left text-slate-600">Price</th>
              <th className="p-3 text-left text-slate-600">Stock</th>
              <th className="p-3 text-left text-slate-600">Status</th>
              <th className="p-3 text-center text-slate-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-200 hover:bg-slate-50"
              >
                <td className="p-3 font-medium">
                  <div className="flex items-center gap-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md border border-dashed border-slate-300 bg-slate-50" />
                    )}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="p-3 text-slate-500">{product.sku}</td>
                <td className="p-3 text-slate-500">{product.category}</td>
                <td className="p-3 font-medium">{product.price}</td>
                <td className="p-3">
                  <span
                    className={
                      product.stock === 0
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="p-3">
                  <StatusPill status={product.status} />
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-orange-600 hover:underline text-sm mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input
                  required
                  className="w-full mt-1 p-2 border rounded-md"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">SKU</label>
                  <input
                    required
                    className="w-full mt-1 p-2 border rounded-md"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <input
                    required
                    className="w-full mt-1 p-2 border rounded-md"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Price (e.g. $10)</label>
                  <input
                    required
                    className="w-full mt-1 p-2 border rounded-md"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Stock</label>
                  <input
                    type="number"
                    required
                    className="w-full mt-1 p-2 border rounded-md"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Product Image</label>
                <div className="mt-2 flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-16 w-16 rounded-md object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-md border border-dashed border-slate-300 bg-slate-50" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                      } else {
                        setImagePreview(formData.imageUrl || null);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------- Helper Components -------------------- */

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "Active"
      ? "bg-green-100 text-green-800"
      : status === "Draft"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";

  return (
    <span
      className={`${cls} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium`}
    >
      {status}
    </span>
  );
}

