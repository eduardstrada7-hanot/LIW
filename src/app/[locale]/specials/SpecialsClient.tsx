"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { Tag, Sparkles, ArrowRight, ShoppingCart, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import {
  NEW_ITEMS, PROMO_SECTIONS,
  newItemToProduct, promoItemToProduct,
} from "@/data/specials";

type Tab = "new" | "promos";

export default function SpecialsClient() {
  const t = useTranslations("specials");
  const locale = useLocale();
  const [tab, setTab] = useState<Tab>("new");
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const q = search.trim().toLowerCase();

  const filteredNew = NEW_ITEMS
    .map(s => ({ ...s, items: q ? s.items.filter(i => i.name.toLowerCase().includes(q)) : s.items }))
    .filter(s => s.items.length > 0);

  const filteredPromos = PROMO_SECTIONS
    .map(s => ({ ...s, items: q ? s.items.filter(i => i.name.toLowerCase().includes(q)) : s.items }))
    .filter(s => s.items.length > 0);

  const totalResults = tab === "new"
    ? filteredNew.reduce((a, s) => a + s.items.length, 0)
    : filteredPromos.reduce((a, s) => a + s.items.length, 0);

  function handleTabChange(newTab: Tab) {
    setTab(newTab);
    setSearch("");
  }

  function handleAdd(id: string, product: Parameters<typeof addItem>[0]) {
    addItem(product, 1);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Hero */}
      <div className="bg-stone-900 pt-24 pb-10 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-red-400" />
            <p className="text-red-400 text-sm font-semibold tracking-widest uppercase">Monthly Specials</p>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">{t("heading")}</h1>
          <p className="text-stone-400 max-w-2xl">{t("subheading")}</p>

          <div className="mt-8 flex gap-2 flex-wrap">
            <button
              onClick={() => handleTabChange("new")}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
                tab === "new" ? "bg-red-600 text-white shadow-lg" : "bg-white/10 text-stone-300 hover:bg-white/20"
              )}
            >
              <Sparkles size={14} />
              {t("newItemsTab")}
              <span className="ml-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">
                {NEW_ITEMS.reduce((a, s) => a + s.items.length, 0)}
              </span>
            </button>
            <button
              onClick={() => handleTabChange("promos")}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
                tab === "promos" ? "bg-red-600 text-white shadow-lg" : "bg-white/10 text-stone-300 hover:bg-white/20"
              )}
            >
              <Tag size={14} />
              {t("promotionsTab")}
              <span className="ml-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">
                {PROMO_SECTIONS.reduce((a, s) => a + s.items.length, 0)}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-10">

        {/* Search bar */}
        <div className="relative max-w-xl mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search specials by name…"
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white shadow-sm transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
        {search && (
          <p className="text-sm text-stone-500 mb-6">
            {totalResults > 0
              ? <><span className="font-bold text-stone-800">{totalResults}</span> result{totalResults !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;</>
              : <>No results for &ldquo;{search}&rdquo; — try a different term</>}
          </p>
        )}

        {tab === "new" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid gap-6">
              {filteredNew.map((section) => (
                <div key={section.category} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                  {/* Section header */}
                  <div className="flex items-center gap-3 px-5 py-4 bg-stone-50 border-b border-stone-100">
                    <span className="text-2xl">{section.icon}</span>
                    <h2 className="font-serif text-lg font-bold text-stone-900 flex-1">{section.category}</h2>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                      NEW — {section.items.length} items
                    </span>
                  </div>
                  {/* Items */}
                  <div className="divide-y divide-stone-50">
                    {section.items.map((item) => {
                      const product = newItemToProduct(item, section);
                      const isAdded = addedId === product.id;
                      return (
                        <div key={item.honorCode} className="flex items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-stone-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-stone-800 leading-snug">{item.name}</p>
                            <p className="text-xs text-stone-400 mt-0.5 truncate">
                              Pack: {item.pack}
                              {item.vendorCode && <span className="ml-2 text-stone-300">· {item.vendorCode}</span>}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="hidden sm:inline text-xs font-mono text-stone-400">HC #{item.honorCode}</span>
                            <span className="text-xs font-semibold text-red-500 italic whitespace-nowrap">Call for Price</span>
                            <button
                              onClick={() => handleAdd(product.id, product)}
                              className={cn(
                                "flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                                isAdded ? "bg-green-500 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                              )}
                            >
                              {isAdded ? <><Check size={11} /> Added!</> : <><ShoppingCart size={11} /> Add</>}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === "promos" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid gap-6">
              {filteredPromos.map((section) => (
                <div key={section.category} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                  {/* Section header */}
                  <div className="flex items-center gap-3 px-5 py-4 bg-stone-50 border-b border-stone-100">
                    <span className="text-2xl">{section.icon}</span>
                    <div className="flex-1">
                      <h2 className="font-serif text-lg font-bold text-stone-900">{section.category}</h2>
                      <p className="text-xs text-green-600 font-semibold mt-0.5">
                        Save {section.savings} per {section.unit}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      {section.items.length} items on promo
                    </span>
                  </div>
                  {/* Items */}
                  <div className="divide-y divide-stone-50">
                    {section.items.map((item) => {
                      const product = promoItemToProduct(item, section);
                      const isAdded = addedId === product.id;
                      return (
                        <div key={item.honorCode} className="flex items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-stone-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-stone-800 leading-snug">{item.name}</p>
                            <p className="text-xs text-stone-400 mt-0.5">Pack: {item.pack}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="hidden sm:inline text-xs font-mono text-stone-400">HC #{item.honorCode}</span>
                            <span className="hidden sm:inline text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200">
                              Promo
                            </span>
                            <button
                              onClick={() => handleAdd(product.id, product)}
                              className={cn(
                                "flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                                isAdded ? "bg-green-500 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                              )}
                            >
                              {isAdded ? <><Check size={11} /> Added!</> : <><ShoppingCart size={11} /> Add</>}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-stone-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-1">Ready to place your order?</h3>
            <p className="text-stone-400 text-sm">Take advantage of April promotions — minimum order $150.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/${locale}/ordering/guest`}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold transition-colors shadow-lg"
            >
              {t("orderNow")} <ArrowRight size={16} />
            </Link>
            <Link
              href={`/${locale}/catalogue`}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-semibold transition-colors"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
