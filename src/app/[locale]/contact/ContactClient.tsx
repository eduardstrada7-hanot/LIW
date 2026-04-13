"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Clock, CheckCircle, Send } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export default function ContactClient() {
  const t = useTranslations("contact");
  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      // graceful fail
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all bg-white";

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Hero */}
      <section className="bg-stone-900 py-20 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1423345560671-5ffd2a21adef?w=1600&q=80)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
            Contact Us
          </span>
          <h1 className="font-serif text-5xl font-bold text-white mt-3 mb-3">
            {t("heading")}
          </h1>
          <p className="text-stone-300 italic">{t("subheading")}</p>
        </motion.div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* Info sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {[
              {
                icon: <Clock size={20} />,
                heading: t("hoursHeading"),
                content: t("hours"),
              },
              {
                icon: <MapPin size={20} />,
                heading: t("addressHeading"),
                content: t("address"),
              },
              {
                icon: <Phone size={20} />,
                heading: t("phoneHeading"),
                content: "(215) 555-0100",
              },
            ].map((info) => (
              <div
                key={info.heading}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    {info.icon}
                  </div>
                  <h3 className="font-semibold text-stone-800 text-sm">{info.heading}</h3>
                </div>
                <p className="text-stone-500 text-sm whitespace-pre-line leading-relaxed">
                  {info.content}
                </p>
              </div>
            ))}

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-stone-100 h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d97817.12050516043!2d-75.21488!3d39.95238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6b7d8d4b54beb%3A0x89f514d88784e@Philadelphia%2C+PA!5e0!3m2!1sen!2sus!4v1700000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="LIW Location"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-stone-100"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-12 text-center"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-stone-500">{t("successMessage")}</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 px-6 py-2.5 bg-amber-500 text-white rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                        {t("nameLabel")} *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={update("name")}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                        {t("emailLabel")} *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                        {t("phoneLabel")}
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={update("phone")}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                        {t("subjectLabel")} *
                      </label>
                      <select
                        value={form.subject}
                        onChange={update("subject")}
                        required
                        className={inputClass}
                      >
                        <option value="">Select subject...</option>
                        <option value="general">{t("subjects.general")}</option>
                        <option value="order">{t("subjects.order")}</option>
                        <option value="pricing">{t("subjects.pricing")}</option>
                        <option value="delivery">{t("subjects.delivery")}</option>
                        <option value="other">{t("subjects.other")}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                      {t("messageLabel")} *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={update("message")}
                      required
                      rows={6}
                      className={inputClass + " resize-none"}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold rounded-full transition-colors text-sm"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    {t("sendButton")}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
