"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export default function HistoryClient() {
  const t = useTranslations("history");
  const containerRef = useRef<HTMLDivElement>(null);

  const milestones = [
    { year: t("milestone1Year"), title: t("milestone1Title"), body: t("milestone1Body"), icon: "🌱" },
    { year: t("milestone2Year"), title: t("milestone2Title"), body: t("milestone2Body"), icon: "🏭" },
    { year: t("milestone3Year"), title: t("milestone3Title"), body: t("milestone3Body"), icon: "🤝" },
    { year: t("milestone4Year"), title: t("milestone4Title"), body: t("milestone4Body"), icon: "🦐" },
    { year: t("milestone5Year"), title: t("milestone5Title"), body: t("milestone5Body"), icon: "🚛" },
    { year: t("milestone6Year"), title: t("milestone6Title"), body: t("milestone6Body"), icon: "💻" },
  ];

  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-900 via-stone-800 to-stone-900 py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.05) 40px,
              rgba(255,255,255,0.05) 80px
            )`
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <span className="text-amber-300 text-sm font-semibold tracking-widest uppercase">
            Est. 1985
          </span>
          <h1 className="font-serif text-5xl font-bold text-white mt-3 mb-4">
            {t("heading")}
          </h1>
          <p className="text-amber-100/70 text-lg italic">{t("subheading")}</p>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6" ref={containerRef}>
        <div className="max-w-3xl mx-auto relative">
          {/* Center line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300 opacity-30 md:-translate-x-px" />

          <div className="space-y-16">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex items-start gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-row`}
              >
                {/* Desktop: spacer on one side */}
                <div className="hidden md:block flex-1" />

                {/* Center dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-xl shadow-lg shadow-amber-500/30 border-4 border-[#fdf8f0]"
                  >
                    {m.icon}
                  </motion.div>
                </div>

                {/* Card */}
                <div className="flex-1 ml-20 md:ml-0">
                  <div className={`bg-white rounded-2xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition-shadow ${
                    i % 2 === 0 ? "md:mr-10" : "md:ml-10"
                  }`}>
                    <span className="inline-block text-amber-600 font-bold text-2xl font-serif mb-2">
                      {m.year}
                    </span>
                    <h3 className="font-semibold text-stone-900 text-lg mb-2">{m.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{m.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* End marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex justify-center mt-16"
          >
            <div className="bg-amber-500 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-amber-500/30">
              🏆 The Story Continues...
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
