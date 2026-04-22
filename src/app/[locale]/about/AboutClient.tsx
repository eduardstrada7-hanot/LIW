"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Heart, Clock, Truck } from "lucide-react";
import Image from "next/image";

const TEAM = [
  { name: "Larry Inver", role: "Founder & Owner", photo: "/team-2.jpg" },
  { name: "Eddie Inver", role: "Operations", photo: "/team-1.jpg" },
];

export default function AboutClient() {
  const t = useTranslations("about");

  const values = [
    { icon: <Heart size={22} />, title: t("value1Title"), body: t("value1Body") },
    { icon: <Clock size={22} />, title: t("value2Title"), body: t("value2Body") },
    { icon: <Truck size={22} />, title: t("value3Title"), body: t("value3Body") },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-stone-900 py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=80)" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
              Our Story
            </span>
            <h1 className="font-serif text-5xl font-bold text-white mt-3 mb-4">
              {t("heading")}
            </h1>
            <p className="text-stone-300 text-lg italic">{t("subheading")}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission + Image */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
              Mission
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-2 mb-4">
              {t("missionHeading")}
            </h2>
            <p className="text-stone-600 leading-relaxed text-lg">
              {t("missionBody")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl"
          >
            <Image
              src="/156423000_861298267781061_2328828615163694000_n.jpg"
              alt="Larry and Eddie Inver — LIW Team"
              fill
              className="object-cover object-center"
            />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              {t("valuesHeading")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-stone-900 text-lg mb-2">{v.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              {t("teamHeading")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <div className="relative w-44 h-52 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg ring-2 ring-stone-100">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <p className="font-bold text-stone-800 text-base">{member.name}</p>
                <p className="text-amber-600 text-sm font-medium mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
