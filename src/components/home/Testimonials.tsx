"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marco Ricci",
    role: "Executive Chef, Trattoria Bella",
    avatar: "MR",
    quote:
      "LIW has been our go-to supplier for over a decade. The quality of their meats and produce is unmatched in the city. It truly feels like a family relationship.",
  },
  {
    name: "Sarah Chen",
    role: "Owner, Golden Lotus Restaurant",
    avatar: "SC",
    quote:
      "Reliable, fresh, and always on time. LIW understands what running a restaurant really means. I can count on them like no other distributor I've tried.",
  },
  {
    name: "David Ortega",
    role: "Catering Director, Celebrations Co.",
    avatar: "DO",
    quote:
      "The seafood and dairy products are always impeccable. The LIW team treats every order like it matters — because to them, it does.",
  },
];

export default function Testimonials() {
  const t = useTranslations("home");

  return (
    <section className="py-20 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="font-serif text-4xl font-bold text-stone-900 mt-2">
            {t("testimonialHeading")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-stone-600 text-sm leading-relaxed mb-6 italic">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                  {item.avatar}
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{item.name}</p>
                  <p className="text-stone-400 text-xs">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
