"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=90",
  "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1600&q=90",
  "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=1600&q=90",
];

export default function Hero() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMAGES[0]})` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-900/60 to-stone-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-200 text-sm font-medium tracking-wide">
              Greater Philadelphia Area
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-4"
          >
            {t("heroTitle")}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="font-serif italic text-amber-300 text-xl sm:text-2xl mb-4"
          >
            "{t("heroTagline")}"
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="text-stone-300 text-lg max-w-xl leading-relaxed mb-10"
          >
            {t("heroSubtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href={`/${locale}/ordering/guest`}
              className="group flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-full transition-all duration-200 shadow-xl shadow-amber-900/30 hover:shadow-amber-500/40 hover:-translate-y-0.5"
            >
              {t("heroCta1")}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/ordering/login`}
              className="flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              {t("heroCta2")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap gap-6 mt-14"
        >
          {[
            { label: "200+", desc: "Active Clients" },
            { label: "40+", desc: "Years Serving Philly" },
            { label: "5", desc: "Product Categories" },
          ].map((s) => (
            <div key={s.label} className="text-white/80">
              <p className="text-2xl font-bold text-white">{s.label}</p>
              <p className="text-xs text-stone-400 tracking-wide uppercase">{s.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/30" />
        <span className="text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
