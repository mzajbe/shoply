<<<<<<< HEAD
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to send reset email');
        return;
      }

      setSuccess('Password reset link sent to your email. Please check your inbox.');
      setEmail('');
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
          {/* Left Section - Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-600 mb-8">Enter your email address and we'll send you a link to reset your password</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              {/* Links */}
              <p className="text-center text-gray-700 mt-6">
                Remember your password?{' '}
                <Link
                  href="/auth/login"
                  className="text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Log in
                </Link>
              </p>

              <p className="text-center text-gray-700 mt-3">
                Don't have an account?{' '}
                <Link
                  href="/auth/register"
                  className="text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Right Section - Testimonial */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-gray-900 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
            
            <div className="relative z-10 text-center">
              <div className="mb-6 w-24 h-24 mx-auto rounded-full border-4 border-white overflow-hidden">
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-white text-4xl">🔐</span>
                </div>
              </div>

              <p className="text-white text-xl leading-relaxed mb-6 max-w-sm">
                "Security matters. Reset your password safely and get back to growing your business with Shoply."
              </p>

              <div>
                <p className="text-white font-semibold mb-1">Account Security</p>
                <p className="text-gray-300 text-sm">Protected by industry-leading encryption</p>
              </div>

              <div className="flex gap-2 justify-center mt-8">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
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
=======
import React from 'react';

const page = () => {
    return (
        <div>
            <h1>This is forgot password</h1>
        </div>
    );
};

export default page;
>>>>>>> 2e56554c84be31e943bba24bcd73cbd65b00da35
