'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton({ className }: { className?: string }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            await fetch(`${apiUrl}/api/auth/logout`, { 
                method: 'POST',
                credentials: 'include'
            });
            router.push('/');
            router.refresh(); // Refresh to update auth state in UI
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={className || "px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"}
        >
            Log out
        </button>
    );
}
