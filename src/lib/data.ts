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
