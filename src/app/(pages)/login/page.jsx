"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "https://bar-bhangra-backend.vercel.app/api/v1/auth/admin/login",
        { email, password }
      );

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-400 to-orange-500">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl w-96 p-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          Bar Bhangra Admin Login
        </h2>

        {error && (
          <p className="mb-4 text-red-600 text-center font-medium">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`mt-6 w-full p-3 rounded-xl text-white font-semibold shadow-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-500"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
