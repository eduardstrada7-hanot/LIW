"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRight, MapPin } from "lucide-react";

const MILESTONES = [
  { year: "1985", label: "Founded in Philadelphia" },
  { year: "2001", label: "200+ Restaurant Clients" },
  { year: "2010", label: "Seafood Division Opens" },
  { year: "2024", label: "Online Platform Launches" },
];

export default function HeritageSection() {
  const locale = useLocale();

  return (
    <section className="py-20 px-6 bg-stone-900 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Photo column ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative frame */}
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-red-700/40 rounded-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/heritage-storefront.jpg"
                alt="The original Larry Inver Wholesale Foods storefront, 939 N. 2nd Street, Philadelphia, PA 19123"
                width={640}
                height={480}
                className="w-full object-cover sepia-[0.2] brightness-90"
                priority={false}
              />
              {/* Film-grain overlay for vintage feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
              {/* Address badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full border border-white/20">
                <MapPin size={11} className="text-red-400" />
                <span>939 N. 2nd Street, Philadelphia, PA 19123</span>
              </div>
              {/* Year watermark */}
              <div className="absolute top-4 right-4 font-serif text-white/30 text-5xl font-bold select-none">
                1985
              </div>
            </div>
          </motion.div>

          {/* ── Text column ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
              Our Story
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mt-3 mb-5 leading-tight">
              One of Northern Liberties&apos; Oldest Businesses
            </h2>
            <p className="text-stone-400 leading-relaxed mb-4">
              What started as a corner egg-and-dairy operation at 939 N. 2nd Street has grown into one of Philadelphia&apos;s most trusted wholesale food distributors. Four decades later, the same commitment to freshness and fair pricing drives everything we do.
            </p>
            <p className="text-stone-400 leading-relaxed mb-8">
              We serve hundreds of restaurants, caterers, and food-service professionals across the Greater Philadelphia area — delivering the quality a kitchen deserves, at the price a business needs.
            </p>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="border border-stone-700 rounded-xl p-3"
                >
                  <p className="font-serif text-2xl font-bold text-red-500">{m.year}</p>
                  <p className="text-stone-400 text-xs mt-0.5 leading-snug">{m.label}</p>
                </motion.div>
              ))}
            </div>

            <Link
              href={`/${locale}/history`}
              className="inline-flex items-center gap-2 text-white font-semibold text-sm hover:text-red-400 transition-colors group"
            >
              Read the full story
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
