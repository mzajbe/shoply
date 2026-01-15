export async function fetchStats() {
    const res = await fetch('http://localhost:3000/api/dashboard/stats', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function fetchOrders() {
    const res = await fetch('http://localhost:3000/api/dashboard/orders', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function fetchProducts() {
    const res = await fetch('http://localhost:3000/api/dashboard/products', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function fetchCampaigns() {
    const res = await fetch('http://localhost:3000/api/dashboard/marketing', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function fetchCustomers() {
    const res = await fetch('http://localhost:3000/api/dashboard/customers', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function fetchSettings() {
    const res = await fetch('http://localhost:3000/api/dashboard/settings', { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}
