"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type Campaign = {
  id: string;
  name: string;
  type: "Email" | "Social" | "Ads";
  status: "Active" | "Scheduled" | "Ended";
  reach: string;
  conversions: string;
  roi: string;
};

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "Email",
    status: "Active",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/dashboard/marketing");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await fetch(`/api/dashboard/marketing?id=${id}`, { method: "DELETE" });
      fetchCampaigns();
    } catch (error) {
      alert("Failed to delete campaign");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCampaign) {
        // Update
        await fetch("/api/dashboard/marketing", {
          method: "PUT",
          body: JSON.stringify({ ...formData, id: editingCampaign.id }),
        });
      } else {
        // Create
        await fetch("/api/dashboard/marketing", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      setShowModal(false);
      setEditingCampaign(null);
      setFormData({ name: "", type: "Email", status: "Active" });
      fetchCampaigns();
    } catch (error) {
      alert("Operation failed");
    }
  };

  const openEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      type: campaign.type as string,
      status: campaign.status as string,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingCampaign(null);
    setFormData({ name: "", type: "Email", status: "Active" });
    setShowModal(true);
  };

  if (loading) return <div className="p-8">Loading campaigns...</div>;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Marketing</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your marketing campaigns and promotions</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition"
        >
          + New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Campaigns" value={campaigns.filter(c => c.status === "Active").length.toString()} color="blue" />
        <StatCard label="Total Reach" value="228,924" color="green" />
        <StatCard label="Total Conversions" value="13,611" color="orange" />
        <StatCard label="Avg ROI" color="purple" value="236%" />
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-medium">All Campaigns ({campaigns.length})</h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-3 text-left text-slate-600">Campaign</th>
              <th className="p-3 text-left text-slate-600">Type</th>
              <th className="p-3 text-left text-slate-600">Status</th>
              <th className="p-3 text-left text-slate-600">Reach</th>
              <th className="p-3 text-left text-slate-600">Conversions</th>
              <th className="p-3 text-left text-slate-600">ROI</th>
              <th className="p-3 text-center text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 font-medium">{campaign.name}</td>
                <td className="p-3 text-slate-500">{campaign.type}</td>
                <td className="p-3">
                  <StatusPill status={campaign.status} />
                </td>
                <td className="p-3">{campaign.reach}</td>
                <td className="p-3">{campaign.conversions}</td>
                <td className="p-3 font-medium text-green-600">{campaign.roi}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => openEditModal(campaign)}
                    className="text-orange-600 hover:underline text-sm mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id)}
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
            <h2 className="text-xl font-bold mb-4">{editingCampaign ? 'Edit Campaign' : 'New Campaign'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Campaign Name</label>
                <input
                  required
                  className="w-full mt-1 p-2 border rounded-md"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Type</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Email">Email</option>
                  <option value="Social">Social</option>
                  <option value="Ads">Ads</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Ended">Ended</option>
                </select>
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
                  {editingCampaign ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    orange: "bg-orange-100 text-orange-800",
    purple: "bg-purple-100 text-purple-800",
  };
  return (
    <div className={`${colorMap[color as keyof typeof colorMap]} rounded-lg p-4`}>
      <div className="text-sm opacity-75">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: Campaign["status"] }) {
  const cls = status === "Active" ? "bg-green-100 text-green-800" : status === "Scheduled" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
  return <span className={`${cls} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium`}>{status}</span>;
}

