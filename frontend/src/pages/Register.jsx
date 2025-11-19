import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");

    if (name === "password") {
      let strength = 0;
      if (value.length >= 6) strength++;
      if (value.length >= 10) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔄 Attempting registration...", form.email);
      const res = await api.post("/auth/register", form);
      console.log("✅ Registration Response:", res.data);
      
      if (res.data.message?.toLowerCase().includes("success")) {
        setTimeout(() => {
          console.log("🚀 Redirecting to login");
          navigate("/login");
        }, 1000);
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(
        err.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Register Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Welcome Section */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Join BookHub
          </h1>
          <p className="text-gray-300 text-lg">
            Start your literary journey today
          </p>
        </div>

        {/* Register Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 animate-slideInUp">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-white/60 text-xl">
                    👤
                  </span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
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
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-white/60 text-xl">
                    🔒
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
              </div>
              
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          level <= passwordStrength ? getStrengthColor() : "bg-white/20"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-white/80">
                    Strength: <span className="font-semibold">{getStrengthText()}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 text-white px-4 py-3 rounded-xl animate-shake">
                <p className="flex items-center gap-2 text-sm">
                  <span className="text-lg">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
              <div className="relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-white transform group-hover:scale-105 transition-transform flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="text-xl">✓</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-white font-semibold hover:text-purple-300 transition-colors underline decoration-2 underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>

          {/* Footer Text */}
          <p className="mt-6 text-center text-white/60 text-xs">
            By signing up, you agree to our Terms & Conditions
          </p>
        </div>

        {/* Bottom Tagline */}
        <p className="text-center text-white/70 text-sm mt-6 animate-fadeIn">
          "The only thing you absolutely have to know is the location of the library"
        </p>
      </div>
    </div>
  );
};

export default Register;