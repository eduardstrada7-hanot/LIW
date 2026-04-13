"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { CATEGORIES } from "@/data/products";
import { ArrowRight } from "lucide-react";

const CATEGORY_IMAGES: Record<string, string> = {
  meats: "https://images.unsplash.com/photo-1558030137-a56c1b004fa3?w=600&q=80",
  seafood: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  produce: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
  dairy: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80",
  dryGoods: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
};

export default function CategoryHighlights() {
  const t = useTranslations("home");
  const tCat = useTranslations("categories");
  const locale = useLocale();

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
            Our Products
          </span>
          <h2 className="font-serif text-4xl font-bold text-stone-900 mt-2">
            {t("categoriesHeading")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/${locale}/ordering/guest?category=${cat.key}`}
                className="group relative block aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${CATEGORY_IMAGES[cat.key]})` }}
                />
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70 group-hover:opacity-60 transition-opacity duration-300`} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white">
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <span className="font-semibold text-sm text-center leading-tight">
                    {tCat(cat.key as keyof typeof tCat)}
                  </span>
                  <span className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs flex items-center gap-1">
                    Shop <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
