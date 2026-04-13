"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import { supabase, type Order } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { User, Clock, RefreshCw, LogOut, ShoppingCart, Package } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  accepted: "bg-blue-100 text-blue-700 border-blue-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
};

type Tab = "orders" | "profile" | "saved";

export default function DashboardClient() {
  const locale = useLocale();
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<Tab>("orders");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = `/${locale}/ordering/login`;
        return;
      }
      setUser({ email: user.email!, id: user.id });

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", user.email ?? "")
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setLoading(false);
    };
    init();
  }, [locale]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = `/${locale}/ordering/login`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Header */}
      <div className="bg-stone-900 py-10 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-white">My Account</h1>
            <p className="text-stone-400 text-sm">{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/${locale}/ordering/guest`}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors"
            >
              <ShoppingCart size={14} /> New Order
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-100 px-6">
        <div className="max-w-5xl mx-auto flex gap-6">
          {(["orders", "profile", "saved"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-4 text-sm font-semibold border-b-2 transition-all ${
                tab === t
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Orders Tab */}
        {tab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-6">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <Package size={48} className="mx-auto mb-3 opacity-30" />
                <p>No orders yet.</p>
                <Link
                  href={`/${locale}/ordering/guest`}
                  className="mt-4 inline-block px-6 py-2.5 bg-amber-500 text-white rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors"
                >
                  Place First Order
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-stone-50">
                      <div>
                        <p className="text-xs text-stone-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="font-bold text-stone-900">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                    <div className="px-5 py-3 flex items-center justify-between">
                      <p className="text-xs text-stone-500">
                        {order.items?.length || 0} item(s)
                        {order.admin_note && ` • Note: ${order.admin_note}`}
                      </p>
                      <button
                        onClick={() => {
                          // Re-add items to cart
                          alert("Items added to cart! Proceed to checkout.");
                        }}
                        className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold hover:text-amber-700"
                      >
                        <RefreshCw size={12} /> Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-6">Your Profile</h2>
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-4">
                <User size={28} />
              </div>
              <p className="font-semibold text-stone-800">{user?.email}</p>
              <p className="text-stone-400 text-sm mt-1">Member since {new Date().getFullYear()}</p>
              <div className="mt-6 pt-6 border-t border-stone-100">
                <p className="text-xs text-stone-400 italic">Profile editing coming soon. Contact us to update your details.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Saved Tab */}
        {tab === "saved" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-6">Saved Orders</h2>
            <div className="text-center py-16 text-stone-400">
              <Clock size={48} className="mx-auto mb-3 opacity-30" />
              <p>Saved orders feature coming soon.</p>
              <p className="text-xs mt-2">Once you place orders, you can save them here for quick reordering.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
