"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Phone, RefreshCw, ArrowRight, Tag, ShoppingCart, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { DEAL_SECTIONS, dealItemToProduct, type DealSection } from "@/data/deals";
import type { Product } from "@/data/products";

export default function DealsClient() {
  const t = useTranslations("deals");
  const locale = useLocale();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd(itemId: string, product: Parameters<typeof addItem>[0]) {
    addItem(product, 1);
    setAddedId(itemId);
    setTimeout(() => setAddedId(null), 1500);
  }

  const visibleSections = DEAL_SECTIONS.filter(
    (s) => activeSection === null || s.title === activeSection
  );

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Hero */}
      <div className="bg-stone-900 pt-6 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`,
          backgroundSize: "20px 20px"
        }} />
        <div className="max-w-screen-xl mx-auto relative">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={12} className="text-red-400" />
            <p className="text-red-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
              Larry Inver Wholesale Foods
            </p>
          </div>
          <h1 className="font-serif text-xl sm:text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
            {t("heading")}
          </h1>
          <p className="text-stone-400 max-w-2xl text-xs sm:text-sm leading-relaxed">{t("subheading")}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="tel:+12156275323"
              className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold transition-colors shadow-lg"
            >
              <Phone size={12} />
              (215) 627-5323
            </a>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/10 text-stone-300 rounded-full text-xs">
              <RefreshCw size={11} />
              Updated weekly
            </div>
            <Link
              href={`/${locale}/ordering/guest`}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white rounded-full text-xs transition-colors"
            >
              Order Online <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* Section filter pills */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSection(null)}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all",
              activeSection === null
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            All
          </button>
          {DEAL_SECTIONS.map((s) => (
            <button
              key={s.title}
              onClick={() => setActiveSection(s.title === activeSection ? null : s.title)}
              className={cn(
                "shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition-all",
                activeSection === s.title
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              <span>{s.icon}</span>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4 py-3 sm:py-8 space-y-2 sm:space-y-3">
        {visibleSections.map((section, i) => (
          <SectionCard
            key={section.title}
            section={section}
            index={i}
            addedId={addedId}
            onAdd={handleAdd}
            defaultOpen={activeSection === section.title}
          />
        ))}

        {/* CTA */}
        <div className="rounded-2xl bg-stone-900 p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 mt-2">
          <div>
            <h3 className="font-serif text-base sm:text-xl font-bold text-white mb-1">
              Pick Up at 939 N. 2nd Street, Philadelphia, PA 19123
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{t("note")}</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0 w-full md:w-auto">
            <a
              href="tel:+12156275323"
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold transition-colors"
            >
              <Phone size={14} /> {t("callToOrder")}
            </a>
            <Link
              href={`/${locale}/ordering/guest`}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-semibold transition-colors"
            >
              Order Online <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section Card (collapsible) ────────────────────────────────────────────────
function SectionCard({
  section, index, addedId, onAdd, defaultOpen = false,
}: {
  section: DealSection;
  index: number;
  addedId: string | null;
  onAdd: (id: string, product: Product) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden"
    >
      {/* Tappable header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-4 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
      >
        <span className="text-lg sm:text-2xl">{section.icon}</span>
        <span className="font-serif text-sm sm:text-lg font-bold text-stone-900 flex-1">
          {section.title}
        </span>
        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
          {section.items.length}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-stone-400 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Collapsible items */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-stone-50">
              {section.items.map((item, idx) => {
                const product = dealItemToProduct(item, section, idx);
                const isAdded = addedId === product.id;
                const isMarket = item.price === "Market";
                return (
                  <div
                    key={`${item.name}-${idx}`}
                    className="flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 hover:bg-stone-50 transition-colors"
                  >
                    <p className="flex-1 min-w-0 text-xs sm:text-sm font-medium text-stone-800 truncate">
                      {item.name}
                      {item.note && (
                        <span className="text-stone-400 font-normal"> · {item.note}</span>
                      )}
                      {item.hot && (
                        <span className="ml-1 bg-red-100 text-red-600 text-[9px] font-bold px-1 py-0.5 rounded-full uppercase">
                          Hot
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isMarket ? (
                        <span className="text-[10px] sm:text-xs font-semibold text-red-500 italic whitespace-nowrap">
                          Call for Price
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-stone-900 whitespace-nowrap">
                          {item.price}
                          <span className="text-[10px] font-normal text-stone-400 ml-0.5">{item.unit}</span>
                        </span>
                      )}
                      <button
                        onClick={() => onAdd(product.id, product)}
                        className={cn(
                          "flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all shrink-0",
                          isAdded ? "bg-green-500 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                        )}
                      >
                        {isAdded ? <><Check size={10} /> Added!</> : <><ShoppingCart size={10} /> Add</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
