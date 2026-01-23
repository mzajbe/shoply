"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      try {
        localStorage.setItem("shoply_user", JSON.stringify(data.user ?? { name, email }));
      } catch (err) {
        // ignore storage errors
      }

      router.push("/dashboard/v1/theme");
    } catch (err) {
      setError("An error occurred. Please try again.");
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-600 mb-8">Start building your storefront today</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder:text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder:text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder:text-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2 shadow-md"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="text-center text-gray-700 mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Sign in
                </Link>
              </p>

              <p className="text-xs text-gray-500 text-center mt-6">
                By signing up you agree to the{" "}
                <Link href="/terms" className="text-orange-600 hover:underline">
                  Terms of Use
                </Link>{" "}
                &{" "}
                <Link href="/privacy" className="text-orange-600 hover:underline">
                  Privacy Policy
                </Link>{" "}
                of Shoply
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center items-center bg-gray-900 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>

            <div className="relative z-10 text-center">
              <div className="mb-6 w-24 h-24 mx-auto rounded-full border-4 border-white overflow-hidden shadow-xl">
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-white text-3xl font-semibold">S</span>
                </div>
              </div>

              <p className="text-white text-xl leading-relaxed mb-6 max-w-sm italic">
                "Launch a beautiful storefront in minutes and keep your focus on what matters most: your customers."
              </p>

              <div>
                <p className="text-white font-semibold mb-1">Shoply Team</p>
                <p className="text-gray-300 text-sm">Commerce Platform</p>
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

