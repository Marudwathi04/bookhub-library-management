import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import libraryBg from "../assets/BookHub-bg.png"; // 1. Import the local image


const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔄 Attempting login...", form.email);
      const res = await api.post("/auth/login", form);
      console.log("✅ Login Response:", res.data);

      if (res.data.token && res.data.role) {
        login(
          { 
            email: res.data.email || form.email, 
            role: res.data.role,
            username: res.data.username 
          }, 
          res.data.token
        );
        
        setTimeout(() => {
          if (res.data.role === "ADMIN") {
            console.log("🚀 Redirecting to Admin Dashboard");
            navigate("/admin");
          } else {
            console.log("🚀 Redirecting to Home");
            navigate("/home");
          }
        }, 500);
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(
        err.response?.data?.message || 
        "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${libraryBg})`, // 2. Use the imported image
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Animated Particles/Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Welcome Section */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Welcome to BookHub
          </h1>
          <p className="text-gray-300 text-lg">
            Your literary journey starts here
          </p>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 animate-slideInUp text-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 text-left">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-white/60 text-xl">
                    📧
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 text-left">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-white/60 text-xl">
                    🔒
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/30 backdrop-blur-md border border-red-500/60 text-white px-4 py-3 rounded-xl animate-shake text-left">
                <p className="flex items-center gap-2 text-sm">
                  <span className="text-lg">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
              <div className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-white transform group-hover:scale-105 transition-transform flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="text-xl">→</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm ">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-white font-semibold hover:text-blue-300 transition-colors underline decoration-2 underline-offset-4"
              >
                Create One
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>

          {/* Footer Text */}
          <p className="mt-6 text-center text-white/60 text-xs">
            Secure login powered by BookHub
          </p>
        </div>

        {/* Bottom Tagline */}
        <p className="text-center text-white/70 text-sm mt-6 animate-fadeIn">
          "A room without books is like a body without a soul"
        </p>
      </div>
    </div>
  );
};

export default Login;