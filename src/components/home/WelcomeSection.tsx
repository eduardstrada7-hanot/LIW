"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";

const FEATURES = [
  "Next-day delivery across Greater Philadelphia",
  "Minimum order $150 — no complex contracts",
  "Dedicated account representative",
  "Freshness guaranteed or we replace it",
];

export default function WelcomeSection() {
  const t = useTranslations("home");

  return (
    <section className="py-20 px-6 bg-[#fafaf8]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
            Why LIW
          </span>
          <h2 className="font-serif text-4xl font-bold text-stone-900 mt-2 mb-4 leading-tight">
            {t("welcomeHeading")}
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            {t("welcomeBody")}
          </p>

          <ul className="space-y-3">
            {FEATURES.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 text-stone-700 text-sm"
              >
                <CheckCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                {f}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Image grid */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&q=80",
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
            "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80",
            "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&q=80",
          ].map((url, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
            >
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
