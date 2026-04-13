"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Check, ChevronRight, Package } from "lucide-react";
import ProductCard from "@/components/ordering/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  businessName: string;
  businessType: string;
};

const BUSINESS_TYPES = [
  "Restaurant", "Catering Company", "Hotel / Resort", "Food Truck",
  "Grocery Store", "School / Institution", "Individual", "Other",
];

export default function GuestOrderClient() {
  const t = useTranslations("ordering");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [step, setStep] = useState(1);
  const [info, setInfo] = useState<CustomerInfo>({
    name: "", email: "", phone: "", address: "",
    businessName: "", businessType: "",
  });
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "invoice">("invoice");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const filteredProducts = useMemo(() => {
    let prods = PRODUCTS;
    if (category !== "all") prods = prods.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      prods = prods.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return prods;
  }, [category, search]);

  const updateInfo = (field: keyof CustomerInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setInfo((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...info,
          items,
          total: total(),
          paymentMethod,
        }),
      });
      const data = await res.json();
      setOrderId(data.orderId || "LIW-" + Date.now());
      clearCart();
      setStep(4);
    } catch {
      setSubmitting(false);
    }
  };

  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all";

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Page header */}
      <div className="bg-stone-900 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif text-3xl font-bold text-white mb-1">{t("guestTitle")}</h1>
          <p className="text-stone-400 text-sm">{t("deliveryZone")} • {t("minimumOrder")}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-stone-100 px-6 py-4 sticky top-16 z-30">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => i < step - 1 && setStep(i + 1)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  step === i + 1
                    ? "text-amber-600"
                    : step > i + 1
                    ? "text-green-600"
                    : "text-stone-400"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  step === i + 1
                    ? "border-amber-500 bg-amber-500 text-white"
                    : step > i + 1
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-stone-300 text-stone-400"
                }`}>
                  {step > i + 1 ? <Check size={12} /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < steps.length - 1 && (
                <ChevronRight size={14} className="text-stone-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {/* Step 1: Customer Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-xl"
            >
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">{t("step1")}</h2>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                      {t("fullName")} *
                    </label>
                    <input type="text" value={info.name} onChange={updateInfo("name")} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                      {t("email")} *
                    </label>
                    <input type="email" value={info.email} onChange={updateInfo("email")} required className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                    {t("phone")} *
                  </label>
                  <input type="tel" value={info.phone} onChange={updateInfo("phone")} required className={inputClass} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                    {t("address")} *
                  </label>
                  <input type="text" value={info.address} onChange={updateInfo("address")} required className={inputClass} />
                </div>

                {/* Optional business info */}
                <div className="pt-2 border-t border-stone-100">
                  <p className="text-xs text-stone-400 mb-3 italic">Business info (optional — helps us serve you better)</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                        {t("businessName")}
                      </label>
                      <input type="text" value={info.businessName} onChange={updateInfo("businessName")} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                        {t("businessType")}
                      </label>
                      <select value={info.businessType} onChange={updateInfo("businessType")} className={inputClass}>
                        <option value="">Select type...</option>
                        {BUSINESS_TYPES.map((bt) => (
                          <option key={bt} value={bt}>{bt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!info.name || !info.email || !info.phone || !info.address) {
                    alert("Please fill in required fields.");
                    return;
                  }
                  setStep(2);
                }}
                className="mt-8 flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition-colors"
              >
                {t("nextStep")} <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* Step 2: Browse Products */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="font-serif text-2xl font-bold text-stone-900">{t("step2")}</h2>
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 text-sm">
                  <Package size={14} className="text-amber-600" />
                  <span className="text-amber-700 font-semibold">{items.length} items in cart</span>
                </div>
              </div>

              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("search")}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setCategory("all")}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      category === "all"
                        ? "bg-stone-800 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setCategory(c.key)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        category === c.key
                          ? "bg-amber-500 text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {c.icon} {c.key.charAt(0).toUpperCase() + c.key.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {filteredProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-full border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors"
                >
                  {t("prevStep")}
                </button>
                <button
                  onClick={() => {
                    if (items.length === 0) {
                      alert("Please add at least one item to your cart.");
                      return;
                    }
                    if (total() < 150) {
                      alert(`Minimum order is $150. Your current total is ${formatCurrency(total())}.`);
                      return;
                    }
                    setStep(3);
                  }}
                  className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition-colors text-sm"
                >
                  {t("nextStep")} <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-2xl"
            >
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">{t("step3")}</h2>

              {/* Customer info summary */}
              <div className="bg-white rounded-2xl p-5 border border-stone-100 mb-4">
                <h3 className="font-semibold text-stone-800 mb-3 text-sm uppercase tracking-wide">Delivery Info</h3>
                <div className="grid sm:grid-cols-2 gap-y-2 text-sm">
                  <div><span className="text-stone-400">Name:</span> <span className="text-stone-700 ml-1">{info.name}</span></div>
                  <div><span className="text-stone-400">Email:</span> <span className="text-stone-700 ml-1">{info.email}</span></div>
                  <div><span className="text-stone-400">Phone:</span> <span className="text-stone-700 ml-1">{info.phone}</span></div>
                  <div><span className="text-stone-400">Address:</span> <span className="text-stone-700 ml-1">{info.address}</span></div>
                  {info.businessName && <div className="sm:col-span-2"><span className="text-stone-400">Business:</span> <span className="text-stone-700 ml-1">{info.businessName}</span></div>}
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl border border-stone-100 mb-4 overflow-hidden">
                <div className="px-5 py-3 border-b border-stone-50 flex justify-between items-center">
                  <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide">Order Items</h3>
                  <button onClick={() => setStep(2)} className="text-xs text-amber-600 hover:text-amber-700">Edit</button>
                </div>
                <div className="divide-y divide-stone-50">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                        <p className="text-xs text-stone-400">{item.unitSize}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-stone-500">
                          <span>×</span>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-10 text-center border border-stone-200 rounded px-1 py-0.5"
                          />
                        </div>
                        <p className="text-sm font-semibold text-stone-800 w-20 text-right">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-stone-50 flex justify-between items-center">
                  <span className="font-bold text-stone-900">Total</span>
                  <span className="font-bold text-stone-900 text-lg">{formatCurrency(total())}</span>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl p-5 border border-stone-100 mb-6">
                <h3 className="font-semibold text-stone-800 mb-3 text-sm uppercase tracking-wide">
                  {t("paymentMethod")}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(["invoice", "stripe"] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === method
                          ? "border-amber-500 bg-amber-50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                        paymentMethod === method ? "border-amber-500 bg-amber-500" : "border-stone-300"
                      }`} />
                      <div>
                        <p className="font-semibold text-stone-800 text-sm">
                          {method === "invoice" ? t("payOnDelivery") : t("payOnline")}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {method === "invoice"
                            ? "Pay when your order is delivered"
                            : "Pay securely online with Stripe"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors"
                >
                  {t("prevStep")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold rounded-full transition-colors text-sm"
                >
                  {submitting && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {t("placeOrder")}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmed */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check size={40} className="text-green-500" />
              </motion.div>
              <h2 className="font-serif text-3xl font-bold text-stone-900 mb-3">
                {t("orderConfirmTitle")}
              </h2>
              {orderId && (
                <p className="text-xs text-amber-600 font-mono font-semibold mb-3">
                  Order #{orderId}
                </p>
              )}
              <p className="text-stone-500 leading-relaxed mb-8">
                {t("orderConfirmBody")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`/${locale}`}
                  className="px-6 py-3 bg-stone-800 text-white rounded-full text-sm font-semibold hover:bg-stone-700 transition-colors"
                >
                  Return Home
                </a>
                <a
                  href={`/${locale}/ordering/login`}
                  className="px-6 py-3 bg-amber-500 text-white rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors"
                >
                  Create an Account
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
