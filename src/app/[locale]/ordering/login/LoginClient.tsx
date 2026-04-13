"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginClient() {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [successMsg, setSuccessMsg] = useState("");

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = `/${locale}/ordering/dashboard`;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setSuccessMsg("Account created! Check your email to verify.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSuccessMsg("Password reset email sent!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-lg shadow-amber-500/20">
            LIW
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            {mode === "login"
              ? "Sign in to your LIW account"
              : mode === "signup"
              ? "Join the LIW family"
              : "We'll send you a reset link"}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
          {successMsg ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-stone-700 font-medium">{successMsg}</p>
              <button
                onClick={() => { setSuccessMsg(""); setMode("login"); }}
                className="mt-4 text-amber-600 text-sm font-semibold hover:underline"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form
              onSubmit={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot}
              className="space-y-4"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              {mode !== "forgot" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      className={inputClass + " pr-12"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded border-stone-300 text-amber-500 focus:ring-amber-400"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn size={16} />
                )}
                {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-stone-100 text-center space-y-2">
            {mode === "login" ? (
              <>
                <p className="text-stone-500 text-sm">
                  New to LIW?{" "}
                  <button onClick={() => setMode("signup")} className="text-amber-600 font-semibold hover:underline">
                    Create account
                  </button>
                </p>
                <p className="text-stone-500 text-sm">
                  Want to order without signing in?{" "}
                  <Link href={`/${locale}/ordering/guest`} className="text-amber-600 font-semibold hover:underline">
                    Guest checkout
                  </Link>
                </p>
              </>
            ) : (
              <button onClick={() => setMode("login")} className="text-amber-600 font-semibold hover:underline text-sm">
                Back to Login
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
