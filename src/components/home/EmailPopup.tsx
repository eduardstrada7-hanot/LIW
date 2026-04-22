"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EmailPopup() {
  const t = useTranslations("home");
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("liw-popup-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("liw-popup-dismissed", "1");
    setVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(dismiss, 2500);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[101] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mx-4">
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-full hover:bg-stone-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="p-8">
                {!submitted ? (
                  <>
                    {/* Icon */}
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
                      <span className="text-3xl">🏠</span>
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                      {t("emailPopupTitle")}
                    </h2>
                    <p className="text-stone-500 text-sm leading-relaxed mb-6">
                      {t("emailPopupBody")}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("emailPopupPlaceholder")}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-sm"
                      >
                        {t("emailPopupButton")}
                      </button>
                    </form>

                    <button
                      onClick={dismiss}
                      className="mt-4 w-full text-center text-xs text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {t("emailPopupSkip")}
                    </button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4 text-center"
                  >
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                      You&apos;re on the list!
                    </h3>
                    <p className="text-stone-500 text-sm">
                      Welcome to the LIW family. Watch your inbox for exclusive deals.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
