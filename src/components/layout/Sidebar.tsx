"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Users, BookOpen, Mail, ShoppingCart,
  UserPlus, LogIn, ChevronDown, ChevronRight, Menu, X,
  LayoutGrid, Tag, BadgePercent
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  key: string;
  icon: React.ReactNode;
  href?: string;
  children?: { key: string; icon: React.ReactNode; href: string }[];
};

type NavContentProps = {
  navItems: NavItem[];
  orderingOpen: boolean;
  setOrderingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: (href: string) => boolean;
  t: ReturnType<typeof useTranslations<"nav">>;
};

function NavContent({
  navItems,
  orderingOpen,
  setOrderingOpen,
  setSidebarOpen,
  isActive,
  t,
}: NavContentProps) {
  return (
    <nav className="flex flex-col gap-1 p-4 pt-24">
      {navItems.map((item) => (
        <div key={item.key}>
          {item.href ? (
            <Link
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive(item.href)
                  ? "bg-amber-50 text-amber-700 shadow-sm"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              )}
            >
              <span className={cn(
                "transition-colors",
                isActive(item.href) ? "text-amber-600" : "text-stone-400 group-hover:text-stone-600"
              )}>
                {item.icon}
              </span>
              <span>{t(item.key as keyof typeof t)}</span>
              {isActive(item.href) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </Link>
          ) : (
            <div>
              <button
                onClick={() => setOrderingOpen(!orderingOpen)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 group"
              >
                <span className="text-stone-400 group-hover:text-stone-600">{item.icon}</span>
                <span className="flex-1 text-left">{t(item.key as keyof typeof t)}</span>
                <span className="text-stone-400">
                  {orderingOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>

              <AnimatePresence>
                {orderingOpen && item.children && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-4 mt-1 flex flex-col gap-1"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group",
                          isActive(child.href)
                            ? "bg-amber-50 text-amber-700"
                            : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                        )}
                      >
                        <span className={cn(
                          "transition-colors",
                          isActive(child.href) ? "text-amber-500" : "text-stone-400 group-hover:text-stone-500"
                        )}>
                          {child.icon}
                        </span>
                        {t(child.key as keyof typeof t)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [orderingOpen, setOrderingOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { key: "home", icon: <Home size={18} />, href: `/${locale}` },
    { key: "catalog", icon: <LayoutGrid size={18} />, href: `/${locale}/catalogue` },
    { key: "specials", icon: <Tag size={18} />, href: `/${locale}/specials` },
    { key: "deals", icon: <BadgePercent size={18} />, href: `/${locale}/deals` },
    { key: "about", icon: <Users size={18} />, href: `/${locale}/about` },
    { key: "history", icon: <BookOpen size={18} />, href: `/${locale}/history` },
    { key: "contact", icon: <Mail size={18} />, href: `/${locale}/contact` },
    {
      key: "ordering",
      icon: <ShoppingCart size={18} />,
      children: [
        { key: "guestOrder", icon: <UserPlus size={16} />, href: `/${locale}/ordering/guest` },
        { key: "login", icon: <LogIn size={16} />, href: `/${locale}/ordering/login` },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href;

  const navProps = { navItems, orderingOpen, setOrderingOpen, setSidebarOpen, isActive, t };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 left-6 z-50 lg:hidden w-12 h-12 bg-amber-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-amber-700 transition-colors"
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white z-40 lg:hidden shadow-2xl"
          >
            <NavContent {...navProps} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-stone-100 z-40">
        <NavContent {...navProps} />
      </aside>
    </>
  );
}
