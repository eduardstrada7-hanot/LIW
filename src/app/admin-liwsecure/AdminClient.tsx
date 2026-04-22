"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, MessageSquare, Users, LogOut,
  Check, X, ChevronDown, ChevronUp, Eye
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Order, ContactMessage } from "@/lib/supabase";

type Tab = "orders" | "messages" | "customers";
type AdminUser = { email: string };

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  delivered: "bg-green-100 text-green-700",
};

export default function AdminClient() {
  const [authed, setAuthed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [noteTexts, setNoteTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [adminUser] = useState<AdminUser>({ email: "admin@larryinverwholesale.com" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, messagesRes] = await Promise.all([
        fetch("/api/admin/orders", { headers: { "x-admin-secret": localStorage.getItem("liw-admin-token") || "" } }),
        fetch("/api/admin/messages", { headers: { "x-admin-secret": localStorage.getItem("liw-admin-token") || "" } }),
      ]);
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminEmailEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@liw.com";
    const adminPassEnv = process.env.NEXT_PUBLIC_ADMIN_PASS || "liwadmin2024";
    if (adminEmail === adminEmailEnv && adminPass === adminPassEnv) {
      localStorage.setItem("liw-admin-token", btoa(adminEmail + ":" + adminPass));
      setAuthed(true);
      fetchData();
    } else {
      setLoginError("Invalid credentials.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("liw-admin-token");
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthed(true);
      fetchData();
    }
  }, [fetchData]);

  const updateOrderStatus = async (orderId: string, status: string, note?: string) => {
    await fetch(`/api/admin/orders`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": localStorage.getItem("liw-admin-token") || "",
      },
      body: JSON.stringify({ orderId, status, adminNote: note }),
    });
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem("liw-admin-token");
    setAuthed(false);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-stone-700 bg-stone-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-stone-500";

  if (!authed) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black text-lg mx-auto mb-4">
              LIW
            </div>
            <h1 className="text-white font-bold text-xl">Admin Login</h1>
            <p className="text-stone-400 text-sm mt-1">Internal access only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-900/50 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
                {loginError}
              </div>
            )}
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Admin email"
              required
              className={inputClass}
            />
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="Password"
              required
              className={inputClass}
            />
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Top bar */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-black text-xs">
            LIW
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">Admin Dashboard</h1>
            <p className="text-stone-400 text-xs">{adminUser.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-stone-400 hover:text-white text-sm transition-colors"
        >
          <LogOut size={14} /> Logout
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-stone-900 border-r border-stone-800 p-4">
          <nav className="space-y-1">
            {([
              { key: "orders", label: "Orders", icon: <ShoppingBag size={16} />, count: orders.filter(o => o.status === "pending").length },
              { key: "messages", label: "Messages", icon: <MessageSquare size={16} />, count: messages.filter(m => !m.read).length },
              { key: "customers", label: "Customers", icon: <Users size={16} /> },
            ] as const).map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === item.key
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-stone-400 hover:bg-stone-800 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
                {"count" in item && item.count > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Orders */}
              {tab === "orders" && (
                <div>
                  <h2 className="text-white font-bold text-lg mb-6">Orders</h2>
                  {orders.length === 0 ? (
                    <p className="text-stone-500 text-sm">No orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
                          <div
                            className="flex items-center justify-between px-5 py-4 cursor-pointer"
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          >
                            <div className="flex items-center gap-4">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                                {order.status}
                              </span>
                              <div>
                                <p className="text-white font-semibold text-sm">{order.customer_name}</p>
                                <p className="text-stone-400 text-xs">{order.customer_email} · {new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-white font-bold">{formatCurrency(order.total)}</span>
                              {expandedOrder === order.id ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedOrder === order.id && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden border-t border-stone-800"
                              >
                                <div className="p-5 space-y-4">
                                  {/* Items */}
                                  <div className="space-y-2">
                                    {order.items?.map((item, i) => (
                                      <div key={i} className="flex justify-between text-sm">
                                        <span className="text-stone-300">{item.name} × {item.quantity}</span>
                                        <span className="text-stone-400">{formatCurrency(item.price * item.quantity)}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Delivery */}
                                  <div className="text-xs text-stone-500">
                                    <p>📍 {order.delivery_address}</p>
                                    <p>📞 {order.customer_phone}</p>
                                    <p>💳 {order.payment_method}</p>
                                  </div>

                                  {/* Note */}
                                  <input
                                    type="text"
                                    placeholder="Optional note to customer..."
                                    value={noteTexts[order.id] || ""}
                                    onChange={(e) => setNoteTexts(n => ({ ...n, [order.id]: e.target.value }))}
                                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-300 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-stone-600"
                                  />

                                  {/* Actions */}
                                  {order.status === "pending" && (
                                    <div className="flex gap-3">
                                      <button
                                        onClick={() => updateOrderStatus(order.id, "accepted", noteTexts[order.id])}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
                                      >
                                        <Check size={14} /> Accept
                                      </button>
                                      <button
                                        onClick={() => updateOrderStatus(order.id, "rejected", noteTexts[order.id])}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                      >
                                        <X size={14} /> Reject
                                      </button>
                                    </div>
                                  )}
                                  {order.status === "accepted" && (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, "delivered")}
                                      className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
                                    >
                                      <Check size={14} /> Mark Delivered
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Messages */}
              {tab === "messages" && (
                <div>
                  <h2 className="text-white font-bold text-lg mb-6">Contact Messages</h2>
                  {messages.length === 0 ? (
                    <p className="text-stone-500 text-sm">No messages yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`bg-stone-900 rounded-xl border p-5 ${msg.read ? "border-stone-800" : "border-amber-500/30"}`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-white font-semibold text-sm">{msg.name}</p>
                              <p className="text-stone-400 text-xs">{msg.email} · {msg.subject}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {!msg.read && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
                              <span className="text-stone-500 text-xs">{new Date(msg.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <p className="text-stone-300 text-sm leading-relaxed">{msg.message}</p>
                          <div className="flex gap-3 mt-3">
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                            >
                              <Eye size={12} /> Reply via Email
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Customers */}
              {tab === "customers" && (
                <div>
                  <h2 className="text-white font-bold text-lg mb-6">Customers</h2>
                  <p className="text-stone-500 text-sm">Customer data is derived from Supabase Auth. Connect your Supabase project to view registered customers here.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
