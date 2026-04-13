"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Phone } from "lucide-react";

export default function CTABanner() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-8 py-14 text-center shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold mb-4 border border-amber-500/20">
              Philadelphia's Trusted Wholesale Partner
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              {t("ctaHeading")}
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto mb-10 leading-relaxed">
              {t("ctaBody")}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`/${locale}/ordering/guest`}
                className="group flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-amber-900/30"
              >
                {t("ctaGuest")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/ordering/login`}
                className="flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                {t("ctaLogin")}
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-stone-500 text-sm">
              <Phone size={14} />
              <span>Questions? Call us: <span className="text-stone-300 font-medium">(215) 555-0100</span></span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
