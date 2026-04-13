"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingCart, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const count = useCartStore((s) => s.count);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total);

  const otherLocale = locale === "en" ? "es" : "en";
  const otherLocaleLabel = locale === "en" ? "ES" : "EN";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "py-2 bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20"
          : "py-4 bg-transparent"
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md group-hover:shadow-amber-500/30 transition-shadow duration-300">
            <span className="text-white font-black text-sm tracking-tight">LIW</span>
          </div>
          <div className="hidden sm:block">
            <p className={cn(
              "font-serif font-bold leading-none transition-colors duration-300",
              scrolled ? "text-stone-800 text-base" : "text-white text-lg drop-shadow-md"
            )}>
              Larry Inver Wholesale
            </p>
            <p className={cn(
              "italic text-xs leading-tight transition-colors duration-300",
              scrolled ? "text-amber-700" : "text-amber-300 drop-shadow"
            )}>
              {t("tagline")}
            </p>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <Link
            href={`/${otherLocale}`}
            className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-all duration-200",
              scrolled
                ? "text-stone-600 hover:text-amber-700 hover:bg-amber-50"
                : "text-white/80 hover:text-white hover:bg-white/10"
            )}
          >
            <Globe size={13} />
            {otherLocaleLabel}
          </Link>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative"
            aria-label={t("cart")}
          >
            <div className={cn(
              "p-2 rounded-full transition-all duration-200",
              scrolled
                ? "text-stone-700 hover:bg-amber-50 hover:text-amber-700"
                : "text-white hover:bg-white/10"
            )}>
              <ShoppingCart size={20} />
              <AnimatePresence>
                {count() > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {count()}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </button>

          {/* Checkout button */}
          <Link
            href={`/${locale}/ordering/guest`}
            className={cn(
              "hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
              scrolled
                ? "bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-amber-500/30"
                : "bg-amber-500/90 text-white hover:bg-amber-500 backdrop-blur-sm shadow-lg"
            )}
          >
            {t("checkout")}
          </Link>
        </div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-4 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-stone-100">
              <h3 className="font-semibold text-stone-800">{t("cart")} ({count()} items)</h3>
            </div>
            {items.length === 0 ? (
              <div className="p-6 text-center text-stone-400 text-sm">Your cart is empty</div>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto divide-y divide-stone-50">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                        <p className="text-xs text-stone-500">{item.unitSize} × {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-stone-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-stone-100 bg-stone-50">
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold text-stone-700">Total</span>
                    <span className="font-bold text-stone-900">${total().toFixed(2)}</span>
                  </div>
                  <Link
                    href={`/${locale}/ordering/guest`}
                    onClick={() => setCartOpen(false)}
                    className="block w-full text-center py-2 bg-amber-600 text-white rounded-xl font-semibold text-sm hover:bg-amber-700 transition-colors"
                  >
                    {t("checkout")}
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
