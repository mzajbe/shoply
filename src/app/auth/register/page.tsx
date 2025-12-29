'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agree) {
      setError('You must agree to the Terms and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const payload: any = { name, password };
      if (activeTab === 'email') payload.email = email;
      else payload.phone = phone;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
              <p className="text-gray-600 mb-8">Start building your store with Shoply</p>

              <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                  onClick={() => {
                    setActiveTab('email');
                    setError('');
                  }}
                  className={`pb-3 font-semibold transition-colors ${
                    activeTab === 'email' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Email
                </button>
                <button
                  onClick={() => {
                    setActiveTab('phone');
                    setError('');
                  }}
                  className={`pb-3 font-semibold transition-colors ${
                    activeTab === 'phone' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Phone No.
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {activeTab === 'email' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link> & <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link></span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2"
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </button>
              </form>

              <p className="text-center text-gray-700 mt-6">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">Log in</Link>
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center items-center bg-gray-900 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
            <div className="relative z-10 text-center">
              <div className="mb-6 w-24 h-24 mx-auto rounded-full border-4 border-white overflow-hidden">
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-white text-4xl">🛍️</span>
                </div>
              </div>

              <p className="text-white text-xl leading-relaxed mb-6 max-w-sm">
                "Join Shoply and grow your business — everything you need to sell online, in one place."
              </p>

              <div>
                <p className="text-white font-semibold mb-1">Community</p>
                <p className="text-gray-300 text-sm">Thousands of stores trust Shoply</p>
              </div>

              <div className="flex gap-2 justify-center mt-8">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
