"use client";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  Check, ChevronRight, ShoppingCart, Search, X,
  Sparkles, Tag, LayoutGrid, ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Data sources
import { CATALOG_PRODUCTS, CATALOG_CATEGORIES, type CatalogProduct } from "@/data/catalog";
import { NEW_ITEMS, PROMO_SECTIONS, newItemToProduct, promoItemToProduct } from "@/data/specials";
import { DEAL_SECTIONS, dealItemToProduct } from "@/data/deals";
import type { Product } from "@/data/products";

// ─── Catalog → cart converter ──────────────────────────────────────────────────
const CAT_MAP: Record<string, Product["category"]> = {
  Potatoes: "produce", Appetizers: "dryGoods", "Bread Products": "dryGoods",
  Cheese: "dairy", Dairy: "dairy", Condiments: "dryGoods", "Dry Goods": "dryGoods",
  Meats: "meats", Poultry: "meats", "Prepared Foods": "dryGoods",
  Seafood: "seafood", Vegetables: "produce",
};

function catalogToProduct(item: CatalogProduct): Product {
  return {
    id: `cat-${item.id}`,
    name: item.name,
    category: CAT_MAP[item.category] ?? "dryGoods",
    unitSize: item.pack,
    price: item.price ?? 0,
    imageUrl: "",
    description: `Pack: ${item.pack} · #${item.id}`,
    inStock: true,
  };
}

// ─── Types ─────────────────────────────────────────────────────────────────────
type CustomerInfo = {
  name: string; email: string; phone: string; address: string;
  businessName: string; businessType: string;
};

const BUSINESS_TYPES = [
  "Restaurant", "Catering Company", "Hotel / Resort", "Food Truck",
  "Grocery Store", "School / Institution", "Individual", "Other",
];

type BrowseTab = "specials" | "deals" | "catalog";

// ─── Main Component ────────────────────────────────────────────────────────────
export default function GuestOrderClient() {
  const t = useTranslations("ordering");
  const locale = useLocale();
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState<CustomerInfo>({
    name: "", email: "", phone: "", address: "", businessName: "", businessType: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "invoice">("invoice");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const updateInfo = (field: keyof CustomerInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setInfo((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...info, items, total: total(), paymentMethod }),
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
    "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all bg-white";

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Header */}
      <div className="bg-stone-900 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif text-3xl font-bold text-white mb-1">{t("guestTitle")}</h1>
          <p className="text-stone-400 text-sm">{t("deliveryZone")} &middot; {t("minimumOrder")}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-stone-100 px-6 py-4 sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => i < step - 1 && setStep(i + 1)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  step === i + 1 ? "text-amber-600" : step > i + 1 ? "text-green-600" : "text-stone-400"
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
              {i < steps.length - 1 && <ChevronRight size={14} className="text-stone-300" />}
            </div>
          ))}
          {/* Cart badge always visible */}
          {items.length > 0 && (
            <div className="ml-auto shrink-0 flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-full">
              <ShoppingCart size={12} />
              <span className="hidden xs:inline">{items.length} item{items.length !== 1 ? "s" : ""} ·</span>
              <span>{formatCurrency(total())}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Customer Info ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-xl">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">{t("step1")}</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">{t("fullName")} *</label>
                    <input type="text" value={info.name} onChange={updateInfo("name")} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">{t("email")} *</label>
                    <input type="email" value={info.email} onChange={updateInfo("email")} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">{t("phone")} *</label>
                  <input type="tel" value={info.phone} onChange={updateInfo("phone")} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">{t("address")} *</label>
                  <input type="text" value={info.address} onChange={updateInfo("address")} className={inputClass} />
                </div>
                <div className="pt-2 border-t border-stone-100">
                  <p className="text-xs text-stone-400 mb-3 italic">Business info (optional)</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">{t("businessName")}</label>
                      <input type="text" value={info.businessName} onChange={updateInfo("businessName")} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">{t("businessType")}</label>
                      <select value={info.businessType} onChange={updateInfo("businessType")} className={inputClass}>
                        <option value="">Select type...</option>
                        {BUSINESS_TYPES.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!info.name || !info.email || !info.phone || !info.address) {
                    alert("Please fill in all required fields.");
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

          {/* ── Step 2: Browse & Add Items ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <BrowseStep t={t} />
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-full border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors"
                >
                  {t("prevStep")}
                </button>
                <button
                  onClick={() => {
                    if (items.length === 0) { alert("Please add at least one item."); return; }
                    setStep(3);
                  }}
                  className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition-colors text-sm"
                >
                  Review Order ({items.length} items) <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Review ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">{t("step3")}</h2>

              {/* Delivery info */}
              <div className="bg-white rounded-2xl p-5 border border-stone-100 mb-4">
                <h3 className="font-semibold text-stone-700 mb-3 text-xs uppercase tracking-wide">Delivery Info</h3>
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
                <div className="px-5 py-3 border-b border-stone-50 flex justify-between items-center bg-stone-50">
                  <h3 className="font-semibold text-stone-700 text-xs uppercase tracking-wide">Order Items</h3>
                  <button onClick={() => setStep(2)} className="text-xs text-amber-600 hover:text-amber-700 font-medium">Edit</button>
                </div>
                <div className="divide-y divide-stone-50">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                        <p className="text-xs text-stone-400 truncate">{item.unitSize}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 text-xs text-stone-500">
                          <span>×</span>
                          <input
                            type="number" min={1} value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-10 sm:w-12 text-center border border-stone-200 rounded-lg px-1 py-0.5 text-sm"
                          />
                        </div>
                        <p className="text-sm font-semibold text-stone-800 min-w-[44px] text-right whitespace-nowrap">
                          {item.price > 0 ? formatCurrency(item.price * item.quantity) : "Call"}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-300 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-stone-50 flex justify-between items-center border-t border-stone-100">
                  <div>
                    <span className="font-bold text-stone-900">Total</span>
                    {items.some((i) => i.price === 0) && (
                      <p className="text-xs text-amber-600 mt-0.5">* Call-for-price items will be confirmed by our team</p>
                    )}
                  </div>
                  <span className="font-bold text-stone-900 text-lg">{formatCurrency(total())}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-5 border border-stone-100 mb-6">
                <h3 className="font-semibold text-stone-700 mb-3 text-xs uppercase tracking-wide">{t("paymentMethod")}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(["invoice", "stripe"] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === method ? "border-amber-500 bg-amber-50" : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 ${
                        paymentMethod === method ? "border-amber-500 bg-amber-500" : "border-stone-300"
                      }`} />
                      <div>
                        <p className="font-semibold text-stone-800 text-sm">
                          {method === "invoice" ? t("payOnDelivery") : t("payOnline")}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {method === "invoice" ? "Pay when your order is delivered" : "Pay securely online with Stripe"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-full border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors">
                  {t("prevStep")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold rounded-full transition-colors text-sm"
                >
                  {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {t("placeOrder")}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Confirmed ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check size={40} className="text-green-500" />
              </motion.div>
              <h2 className="font-serif text-3xl font-bold text-stone-900 mb-3">{t("orderConfirmTitle")}</h2>
              {orderId && <p className="text-xs text-amber-600 font-mono font-semibold mb-3">Order #{orderId}</p>}
              <p className="text-stone-500 leading-relaxed mb-8">{t("orderConfirmBody")}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`/${locale}`} className="px-6 py-3 bg-stone-800 text-white rounded-full text-sm font-semibold hover:bg-stone-700 transition-colors">Return Home</a>
                <a href={`/${locale}/ordering/login`} className="px-6 py-3 bg-amber-500 text-white rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors">Create an Account</a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Browse Step ───────────────────────────────────────────────────────────────
function BrowseStep({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [activeTab, setActiveTab] = useState<BrowseTab>("catalog");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState<"name" | "price-asc" | "price-desc">("name");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 40;

  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = useCallback((id: string, product: Product) => {
    addItem(product, 1);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1500);
  }, [addItem]);

  // Catalog filtered
  const catalogFiltered = useMemo(() => {
    let list = [...CATALOG_PRODUCTS];
    if (activeCategory !== "All") list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) || p.id.includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "price-asc") return (a.price ?? 9999) - (b.price ?? 9999);
      if (sort === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [search, activeCategory, sort]);

  const totalPages = Math.ceil(catalogFiltered.length / PER_PAGE);
  const pagedCatalog = catalogFiltered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const tabs: { id: BrowseTab; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: "specials",
      label: "Monthly Specials",
      icon: <Sparkles size={14} />,
      count: NEW_ITEMS.reduce((a, s) => a + s.items.length, 0) + PROMO_SECTIONS.reduce((a, s) => a + s.items.length, 0),
    },
    {
      id: "deals",
      label: "Weekly Deals",
      icon: <Tag size={14} />,
      count: DEAL_SECTIONS.reduce((a, s) => a + s.items.length, 0),
    },
    {
      id: "catalog",
      label: "Full Catalog",
      icon: <LayoutGrid size={14} />,
      count: CATALOG_PRODUCTS.length,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h2 className="font-serif text-2xl font-bold text-stone-900">{t("step2")}</h2>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setPage(1); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all",
              activeTab === tab.id
                ? "bg-stone-900 text-white border-stone-900 shadow-md"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
            )}
          >
            {tab.icon}
            {tab.label}
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
              activeTab === tab.id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
            )}>
              {tab.count.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* ── Specials Tab ── */}
      {activeTab === "specials" && (
        <div className="space-y-6">
          {/* New Items */}
          <div>
            <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-red-500" /> New Items
            </h3>
            <div className="space-y-4">
              {NEW_ITEMS.map((section) => (
                <div key={section.category} className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border-b border-stone-100">
                    <span>{section.icon}</span>
                    <span className="font-semibold text-stone-800 text-sm">{section.category}</span>
                    <span className="ml-auto bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                  </div>
                  <div className="divide-y divide-stone-50">
                    {section.items.map((item) => {
                      const product = newItemToProduct(item, section);
                      const isAdded = addedId === product.id;
                      return (
                        <ItemRow
                          key={item.honorCode}
                          name={item.name}
                          sub={`Pack: ${item.pack} · HC #${item.honorCode}`}
                          price={null}
                          unit=""
                          isAdded={isAdded}
                          onAdd={() => handleAdd(product.id, product)}
                          addLabel={t("addToCart")}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promos */}
          <div>
            <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Tag size={14} className="text-green-600" /> Current Promotions
            </h3>
            <div className="space-y-4">
              {PROMO_SECTIONS.map((section) => (
                <div key={section.category} className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border-b border-stone-100">
                    <span>{section.icon}</span>
                    <span className="font-semibold text-stone-800 text-sm">{section.category}</span>
                    <span className="ml-auto text-xs text-green-600 font-semibold">Save {section.savings}/{section.unit}</span>
                  </div>
                  <div className="divide-y divide-stone-50">
                    {section.items.map((item) => {
                      const product = promoItemToProduct(item, section);
                      const isAdded = addedId === product.id;
                      return (
                        <ItemRow
                          key={item.honorCode}
                          name={item.name}
                          sub={`Pack: ${item.pack} · HC #${item.honorCode}`}
                          price={null}
                          unit=""
                          badge="Promo"
                          isAdded={isAdded}
                          onAdd={() => handleAdd(product.id, product)}
                          addLabel={t("addToCart")}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Deals Tab ── */}
      {activeTab === "deals" && (
        <div className="space-y-4">
          {DEAL_SECTIONS.map((section) => (
            <div key={section.title} className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
              <div className={`flex items-center gap-2 px-4 py-3 bg-gradient-to-r ${section.color} text-white`}>
                <span>{section.icon}</span>
                <span className="font-semibold text-sm">{section.title}</span>
                <span className="ml-auto text-xs text-white/70">{section.items.length} items</span>
              </div>
              <div className="divide-y divide-stone-50">
                {section.items.map((item, idx) => {
                  const product = dealItemToProduct(item, section, idx);
                  const isAdded = addedId === product.id;
                  const isMarket = item.price === "Market";
                  return (
                    <ItemRow
                      key={`${item.name}-${idx}`}
                      name={item.name}
                      sub={item.note ?? ""}
                      price={isMarket ? null : parseFloat(item.price.replace(/[^0-9.]/g, "")) || null}
                      unit={item.unit}
                      isAdded={isAdded}
                      onAdd={() => handleAdd(product.id, product)}
                      addLabel={t("addToCart")}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Catalog Tab ── */}
      {activeTab === "catalog" && (
        <div>
          {/* Search + filter toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={t("search")}
                className="w-full pl-9 pr-8 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
              />
              {search && (
                <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={activeCategory}
                onChange={(e) => { setActiveCategory(e.target.value); setPage(1); }}
                className="appearance-none pl-3 pr-8 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
              >
                <option value="All">All Categories</option>
                {CATALOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1); }}
                className="appearance-none pl-3 pr-8 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
              >
                <option value="name">Name A–Z</option>
                <option value="price-asc">Price Low–High</option>
                <option value="price-desc">Price High–Low</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
          </div>

          <p className="text-xs text-stone-400 mb-3">
            <span className="font-bold text-stone-600">{catalogFiltered.length.toLocaleString()}</span> products found
          </p>

          {pagedCatalog.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <Search size={40} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">No products found. Try a different search.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-stone-50">
                {pagedCatalog.map((item) => {
                  const product = catalogToProduct(item);
                  const isAdded = addedId === product.id;
                  return (
                    <ItemRow
                      key={item.id}
                      name={item.name}
                      sub={`${item.category} · Pack: ${item.pack} · #${item.id}`}
                      price={item.price}
                      unit="/cs"
                      isAdded={isAdded}
                      onAdd={() => handleAdd(product.id, product)}
                      addLabel={t("addToCart")}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-1.5 flex-wrap">
              <button
                onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 shadow-sm"
              >
                ← Prev
              </button>
              {(() => {
                const nums: number[] = [];
                for (let i = 1; i <= totalPages; i++) {
                  if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) nums.push(i);
                }
                const out: React.ReactNode[] = [];
                nums.forEach((n, idx) => {
                  if (idx > 0 && n - nums[idx - 1] > 1) out.push(<span key={`el-${n}`} className="px-1 text-stone-400">…</span>);
                  out.push(
                    <button
                      key={n}
                      onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={cn("w-9 h-9 rounded-xl text-sm font-semibold transition-all", page === n ? "bg-stone-800 text-white" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50")}
                    >
                      {n}
                    </button>
                  );
                });
                return out;
              })()}
              <button
                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-sm bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 shadow-sm"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Shared item row ───────────────────────────────────────────────────────────
function ItemRow({
  name, sub, price, unit, badge, isAdded, onAdd, addLabel,
}: {
  name: string;
  sub: string;
  price: number | null;
  unit: string;
  badge?: string;
  isAdded: boolean;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3 hover:bg-stone-50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-800 leading-snug">{name}</p>
        {sub && <p className="text-xs text-stone-400 mt-0.5 truncate">{sub}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
            {badge}
          </span>
        )}
        {price !== null && price > 0 ? (
          <span className="text-xs sm:text-sm font-bold text-stone-900 whitespace-nowrap text-right">
            ${price.toFixed(2)}<span className="text-xs font-normal text-stone-400">{unit}</span>
          </span>
        ) : (
          <span className="text-xs font-semibold text-red-500 italic whitespace-nowrap">Call</span>
        )}
        <button
          onClick={onAdd}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0",
            isAdded ? "bg-green-500 text-white" : "bg-red-600 hover:bg-red-700 text-white"
          )}
        >
          {isAdded ? <><Check size={11} /> Added!</> : <><ShoppingCart size={11} /> {addLabel}</>}
        </button>
      </div>
    </div>
  );
}
