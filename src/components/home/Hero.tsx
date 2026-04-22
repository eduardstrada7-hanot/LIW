"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Phone } from "lucide-react";

export default function Hero() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-stone-950">
      {/* Radial glow top-right */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,_rgba(120,_20,_20,_0.18),_transparent)]" />
      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-950 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 py-20 sm:py-24 w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

        {/* ── Left: Text ── */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-200 text-sm font-medium tracking-wide">
                Greater Philadelphia Area
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-4"
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
              &ldquo;{t("heroTagline")}&rdquo;
            </motion.p>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="text-stone-300 text-lg max-w-xl leading-relaxed mb-8"
            >
              {t("heroSubtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link
                href={`/${locale}/ordering/guest`}
                className="group flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-full transition-all duration-200 shadow-xl shadow-amber-900/30 hover:-translate-y-0.5"
              >
                {t("heroCta1")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/ordering/login`}
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                {t("heroCta2")}
              </Link>
              <a
                href="tel:+12156275323"
                className="flex items-center gap-2 px-6 py-3.5 bg-red-700/70 hover:bg-red-600 text-white font-semibold rounded-full border border-red-600/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Phone size={15} />
                (215) 627-5323
              </a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap gap-8 pt-6 border-t border-white/10"
            >
              {[
                { label: "200+", desc: "Active Clients" },
                { label: "40+", desc: "Years Serving Philly" },
                { label: "1,000+", desc: "Products in Catalog" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white">{s.label}</p>
                  <p className="text-xs text-stone-400 tracking-wide uppercase mt-0.5">{s.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Right: Logo ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className="flex items-center justify-center shrink-0 order-first lg:order-last"
        >
          <div className="relative">
            {/* Soft glow halo */}
            <div className="absolute inset-0 rounded-full bg-red-700/25 blur-[60px] scale-125" />
            <Image
              src="/logo-digitized.png"
              alt="Larry Inver Wholesale Foods"
              width={360}
              height={360}
              className="relative z-10 drop-shadow-2xl w-32 h-32 sm:w-48 sm:h-48 lg:w-[360px] lg:h-[360px]"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/30" />
        <span className="text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
