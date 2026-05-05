"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

// Maps the home-page category keys → catalog page category query param
const CATALOG_LINKS: Record<string, string> = {
  meats: "Meats",
  seafood: "Seafood",
  produce: "Vegetables",
  dairy: "Dairy",
  dryGoods: "Dry+Goods",
};

const CATEGORY_IMAGES: Record<string, string> = {
  meats: "https://images.unsplash.com/photo-1558030137-a56c1b004fa3?w=700&q=85",
  seafood: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=700&q=85",
  produce: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&q=85",
  dairy: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&q=85",
  dryGoods: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=700&q=85",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  meats: "from-red-900 to-red-700",
  seafood: "from-blue-900 to-blue-700",
  produce: "from-green-900 to-green-700",
  dairy: "from-sky-900 to-sky-700",
  dryGoods: "from-amber-900 to-amber-700",
};

const CATEGORY_ICONS: Record<string, string> = {
  meats: "🥩",
  seafood: "🦐",
  produce: "🥦",
  dairy: "🥛",
  dryGoods: "🌾",
};

const CATEGORY_KEYS = ["meats", "seafood", "produce", "dairy", "dryGoods"] as const;

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
          <span className="text-red-600 text-sm font-semibold tracking-widest uppercase">
            Our Products
          </span>
          <h2 className="font-serif text-4xl font-bold text-stone-900 mt-2">
            {t("categoriesHeading")}
          </h2>
          <p className="text-stone-500 mt-3 text-sm">
            Click any category to browse the full catalogue
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORY_KEYS.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/${locale}/catalogue?category=${CATALOG_LINKS[key]}`}
                className="group relative block aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400"
              >
                {/* Background image — zooms on hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-600 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${CATEGORY_IMAGES[key]})` }}
                />
                {/* Dark gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${CATEGORY_GRADIENTS[key]} opacity-65 group-hover:opacity-55 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white">
                  <span className="text-3xl mb-2 drop-shadow-lg">{CATEGORY_ICONS[key]}</span>
                  <span className="font-bold text-sm text-center leading-tight drop-shadow">
                    {tCat(key as keyof typeof tCat)}
                  </span>
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs flex items-center gap-1 text-white/90"
                  >
                    Shop all <ArrowRight size={11} />
                  </motion.span>
                </div>

                {/* Hover border glow */}
                <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-white/30 transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
