'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const [nextPath, setNextPath] = useState('/dashboard');

    // useEffect(() => {
    //     if (searchParams) {
    //         const next = searchParams.get('next');
    //         if (next) {
    //             setNextPath(next);
    //         }
    //     }
    // }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // // get next path from URL or use default
        // const finalNextPath = searchParams?.get('next') ?? nextPath ?? '/dashboard';

        // // Demo credentials (no DB) — allow quick demo login
        // const DEMO_EMAIL = 'demo@shoply.test';
        // const DEMO_PASSWORD = 'demopassword';
        // if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        //     // mark demo user as logged in (client-side) and redirect
        //     console.log('Demo login - storing shoply_demo_user and redirecting to:', finalNextPath);
        //     try {
        //         localStorage.setItem('shoply_demo_user', JSON.stringify({ email: DEMO_EMAIL, demo: true }));
        //         console.log('localStorage set, item:', localStorage.getItem('shoply_demo_user'));
        //     } catch (e) {
        //         // ignore storage errors
        //     }
        //     console.log('Calling router.push with path:', finalNextPath);
        //     router.push(finalNextPath);
        //     setLoading(false);
        //     return;
        // }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed');
                return;
            }

            // try {
            //     localStorage.setItem('shoply_user', JSON.stringify(data.user ?? { email }));
            // } catch (e) {
            //     // ignore
            // }

            // router.push(finalNextPath);
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                            <p className="text-gray-600 mb-8">Sign in to your account to continue</p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    {error}
                                </div>
                            )}
                            {/* <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg mb-4 text-sm">
                                <p className="font-medium">Demo Credentials:</p>
                                <p>Email: <code className="bg-white px-1 rounded">demo@shoply.test</code></p>
                                <p>Password: <code className="bg-white px-1 rounded">demopassword</code></p>
                            </div> */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Input */}
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

                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    />
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">Remember me</span>
                                    </label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2"
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <p className="text-center text-gray-700 mt-6">
                                Don't have an account?{' '}
                                <Link
                                    href="/auth/register"
                                    className="text-orange-600 hover:text-orange-700 font-semibold"
                                >
                                    Sign up
                                </Link>
                            </p>

                            {/* Terms */}
                            <p className="text-xs text-gray-500 text-center mt-6">
                                By signing up you agree to the{' '}
                                <Link href="/terms" className="text-orange-600 hover:underline">
                                    Terms of Use
                                </Link>
                                {' '}&{' '}
                                <Link href="/privacy" className="text-orange-600 hover:underline">
                                    Privacy Policy
                                </Link>
                                {' '}of Shoply
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Testimonial */}
                    <div className="hidden lg:flex flex-col justify-center items-center bg-gray-900 p-8 relative overflow-hidden">
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                        
                        <div className="relative z-10 text-center">
                            {/* Testimonial Image */}
                            <div className="mb-6 w-24 h-24 mx-auto rounded-full border-4 border-white overflow-hidden">
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                    <span className="text-white text-4xl">👤</span>
                                </div>
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-white text-xl leading-relaxed mb-6 max-w-sm">
                                "With Shoply, our online sales have skyrocketed. It's more than just a platform; it's a partner in our growth, helping us reach goals we once only dreamed of."
                            </p>

                            {/* Author */}
                            <div>
                                <p className="text-white font-semibold mb-1">Rahat Ahmed</p>
                                <p className="text-gray-300 text-sm">Founder of Shoply</p>
                            </div>

                            {/* Dots Indicator */}
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
