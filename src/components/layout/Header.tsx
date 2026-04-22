"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
          ? "py-2 bg-white/90 backdrop-blur-xl shadow-sm border-b border-stone-200/60"
          : "py-3 bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-100"
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center group shrink-0">
          <div className={cn(
            "relative transition-all duration-300",
            scrolled ? "h-10" : "h-12"
          )}>
            <Image
              src="/logo-simplified.png"
              alt="Larry Inver Wholesale Foods"
              height={scrolled ? 40 : 48}
              width={scrolled ? 130 : 160}
              className="object-contain w-auto"
              priority
            />
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language toggle */}
          <Link
            href={`/${otherLocale}`}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full text-stone-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 border border-stone-200 hover:border-red-200"
          >
            <Globe size={12} />
            {otherLocaleLabel}
          </Link>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative p-2 rounded-full text-stone-700 hover:bg-stone-100 transition-all duration-200"
            aria-label={t("cart")}
          >
            <ShoppingCart size={20} />
            <AnimatePresence>
              {count() > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {count()}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Checkout pill */}
          <Link
            href={`/${locale}/ordering/guest`}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-red-500/30 transition-all duration-200"
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
            className="absolute right-2 sm:right-4 top-full mt-2 w-[min(320px,_calc(100vw-1rem))] bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-stone-100 flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">{t("cart")}</h3>
              <span className="text-xs text-stone-400">{count()} items</span>
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
                        <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-600">
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
                    className="block w-full text-center py-2 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors"
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
