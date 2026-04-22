"use client";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { Product } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

type Props = { product: Product; index?: number };

export default function ProductCard({ product, index = 0 }: Props) {
  const t = useTranslations("ordering");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-stone-500 text-sm font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-stone-900 text-sm leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-stone-400 mb-3">{product.unitSize}</p>
          <p className="text-stone-500 text-xs leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <p className="font-bold text-stone-900 text-lg">
            {formatCurrency(product.price)}
          </p>

          <div className="flex items-center gap-2">
            {/* Qty selector */}
            <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-6 text-center text-sm font-semibold text-stone-800">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ShoppingCart size={13} />
              {added ? "Added!" : t("addToCart")}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
