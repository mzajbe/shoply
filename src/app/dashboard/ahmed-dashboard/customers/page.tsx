"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type Customer = {
  id: string;
  name: string;
  email: string;
  spent: string;
  joined: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", spent: "$0.00", joined: new Date().toLocaleDateString() });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/dashboard/customers");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete customer?")) return;
    try {
      await fetch(`/api/dashboard/customers?id=${id}`, { method: "DELETE" });
      fetchCustomers();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/dashboard/customers", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setShowModal(false);
      setFormData({ name: "", email: "", spent: "$0.00", joined: new Date().toLocaleDateString() });
      fetchCustomers();
    } catch (error) {
      alert("Failed to create customer");
    }
  };

  if (loading) return <div className="p-8">Loading customers...</div>;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Customers</h1>
          <p className="text-sm text-slate-600 mt-1">View and manage customer details</p>
        </div>
        {/* <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition"
        >
          + Add Customer
        </button> */}
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-medium">All Customers ({customers.length})</h2>
          <input placeholder="Search..." className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-3 text-left text-slate-600">Name</th>
              <th className="p-3 text-left text-slate-600">Email</th>
              <th className="p-3 text-left text-slate-600">Total Spent</th>
              <th className="p-3 text-left text-slate-600">Joined</th>
              <th className="p-3 text-center text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-slate-500">{c.email}</td>
                <td className="p-3">{c.spent}</td>
                <td className="p-3 text-slate-500">{c.joined}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input required className="w-full mt-1 p-2 border rounded-md" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input required type="email" className="w-full mt-1 p-2 border rounded-md" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

