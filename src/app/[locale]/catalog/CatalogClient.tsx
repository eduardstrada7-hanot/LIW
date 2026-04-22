"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, X, SlidersHorizontal,
  ChevronDown, Check, Phone,
} from "lucide-react";
import { CATALOG_PRODUCTS, CATALOG_CATEGORIES, type CatalogProduct } from "@/data/catalog";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

// ─── Cart compatibility ────────────────────────────────────────────────────────
const CAT_MAP: Record<string, Product["category"]> = {
  Potatoes: "produce",
  Appetizers: "dryGoods",
  "Bread Products": "dryGoods",
  Cheese: "dairy",
  Dairy: "dairy",
  Condiments: "dryGoods",
  "Dry Goods": "dryGoods",
  Meats: "meats",
  Poultry: "meats",
  "Prepared Foods": "dryGoods",
  Seafood: "seafood",
  Vegetables: "produce",
};

function toCartProduct(item: CatalogProduct): Product {
  return {
    id: item.id,
    name: item.name,
    category: CAT_MAP[item.category] ?? "dryGoods",
    unitSize: item.pack,
    price: item.price ?? 0,
    imageUrl: "",
    description: `${item.pack} — ${item.category}`,
    inStock: true,
  };
}

// ─── Category display config ───────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  Potatoes: "🥔",
  Appetizers: "🧆",
  "Bread Products": "🍞",
  Cheese: "🧀",
  Dairy: "🥛",
  Condiments: "🍯",
  "Dry Goods": "🌾",
  Meats: "🥩",
  Poultry: "🍗",
  "Prepared Foods": "🍱",
  Seafood: "🦐",
  Vegetables: "🥦",
};

// Category count cache
function buildCategoryCounts(products: CatalogProduct[]): Record<string, number> {
  const counts: Record<string, number> = { All: products.length };
  for (const p of products) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}

const CATEGORY_COUNTS = buildCategoryCounts(CATALOG_PRODUCTS);

type SortKey = "name" | "price-asc" | "price-desc" | "id";

// ─── Main component ────────────────────────────────────────────────────────────
export default function CatalogClient() {
  const t = useTranslations("catalog");
  const addItem = useCartStore((s) => s.addItem);
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category") ?? "All";
  const validCategory =
    urlCategory === "All" || (CATALOG_CATEGORIES as readonly string[]).includes(urlCategory)
      ? urlCategory
      : "All";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(validCategory);
  const [sort, setSort] = useState<SortKey>("name");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 60;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveCategory(validCategory);
    setPage(1);
  }, [validCategory]);

  const filtered = useMemo(() => {
    let list = [...CATALOG_PRODUCTS];
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.includes(q) ||
          p.pack.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-asc") return (a.price ?? 9999) - (b.price ?? 9999);
      if (sort === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
      return a.id.localeCompare(b.id, undefined, { numeric: true });
    });
    return list;
  }, [search, activeCategory, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleCategory = useCallback((cat: string) => {
    setActiveCategory(cat);
    setPage(1);
    setMobileFilterOpen(false);
  }, []);

  const handleAddToCart = useCallback(
    (item: CatalogProduct) => {
      addItem(toCartProduct(item), 1);
      setAddedId(item.id);
      setTimeout(() => setAddedId(null), 1600);
    },
    [addItem]
  );

  const categories = ["All", ...CATALOG_CATEGORIES];

  return (
    <div className="min-h-screen bg-[#fafaf8]">

      {/* ── Page Header ── */}
      <div className="bg-stone-900 pt-24 pb-10 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
            <div>
              <p className="text-red-400 text-xs font-bold tracking-widest uppercase mb-1">
                Larry Inver Wholesale Foods
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-1">
                {t("heading")}
              </h1>
              <p className="text-stone-400 text-sm">
                1,000+ products &middot; Updated pricing &middot; Philadelphia &amp; surrounding areas
              </p>
            </div>
            <a
              href="tel:+12156275323"
              className="flex items-center gap-2.5 px-5 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold text-sm transition-colors shrink-0 w-fit shadow-lg shadow-red-900/30"
            >
              <Phone size={16} />
              Call to Order: (215) 627-5323
            </a>
          </div>

          {/* Min order notice */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-400/25 rounded-lg text-amber-300 text-xs mb-5">
            <span className="font-bold">Min. Order:</span>
            <span>$150 &middot; Greater Philadelphia Metro Area</span>
            <span className="text-amber-400/60 mx-1">|</span>
            <span>Mon – Fri delivery</span>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:bg-white/15 transition-all text-sm"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-6 flex gap-6">

        {/* ── Desktop category sidebar ── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Categories
              </p>
            </div>
            <nav className="py-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-150 text-left",
                    activeCategory === cat
                      ? "bg-red-50 text-red-700 font-semibold"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  )}
                >
                  <span className="text-base leading-none shrink-0 w-5 text-center">
                    {cat !== "All" ? CATEGORY_ICONS[cat] : ""}
                  </span>
                  <span className="flex-1 truncate">{cat === "All" ? "All Products" : cat}</span>
                  <span className="text-[11px] text-stone-400 tabular-nums">
                    {CATEGORY_COUNTS[cat] ?? 0}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-stone-200 text-sm font-medium text-stone-700 shadow-sm"
            >
              <SlidersHorizontal size={14} />
              {activeCategory === "All" ? "All Products" : activeCategory}
            </button>

            <p className="text-sm text-stone-500 mr-auto">
              <span className="font-bold text-stone-800">{filtered.length.toLocaleString()}</span>{" "}
              {t("resultsCount")}
            </p>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-sm cursor-pointer"
              >
                <option value="name">{t("sortNameAZ")}</option>
                <option value="price-asc">{t("sortPriceLow")}</option>
                <option value="price-desc">{t("sortPriceHigh")}</option>
                <option value="id">{t("sortItemNum")}</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Product grid */}
          {paginated.length === 0 ? (
            <div className="text-center py-24 text-stone-400">
              <Search size={48} className="mx-auto mb-3 opacity-25" />
              <p className="font-medium">{t("noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {paginated.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  isAdded={addedId === item.id}
                  onAdd={handleAddToCart}
                  addLabel={t("addToCart")}
                  perCaseLabel={t("perCase")}
                  itemNumLabel={t("itemNum")}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5 flex-wrap">
              <button
                onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                ← Prev
              </button>
              {(() => {
                const pageNums: number[] = [];
                const radius = 2;
                for (let i = 1; i <= totalPages; i++) {
                  if (i === 1 || i === totalPages || (i >= page - radius && i <= page + radius)) {
                    pageNums.push(i);
                  }
                }
                const result: React.ReactNode[] = [];
                pageNums.forEach((num, idx) => {
                  if (idx > 0 && num - pageNums[idx - 1] > 1) {
                    result.push(<span key={`ellipsis-${num}`} className="px-1 text-stone-400">…</span>);
                  }
                  result.push(
                    <button
                      key={num}
                      onClick={() => { setPage(num); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={cn(
                        "w-9 h-9 rounded-xl text-sm font-semibold transition-all",
                        page === num
                          ? "bg-red-600 text-white shadow-md"
                          : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                      )}
                    >
                      {num}
                    </button>
                  );
                });
                return result;
              })()}
              <button
                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Next →
              </button>
            </div>
          )}

          {/* Bottom call-to-order strip */}
          <div className="mt-12 rounded-2xl bg-stone-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold">Need help placing your order?</p>
              <p className="text-stone-400 text-sm mt-0.5">
                Call us Mon – Fri 6 AM – 4 PM, Sat 6 AM – 12 PM
              </p>
            </div>
            <a
              href="tel:+12156275323"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold text-sm transition-colors shrink-0"
            >
              <Phone size={16} />
              (215) 627-5323
            </a>
          </div>
        </div>
      </div>

      {/* ── Mobile category drawer ── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-stone-50">
                <p className="font-bold text-stone-800">Categories</p>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X size={20} className="text-stone-500" />
                </button>
              </div>
              <nav className="py-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-3 text-sm transition-all text-left",
                      activeCategory === cat
                        ? "bg-red-50 text-red-700 font-semibold"
                        : "text-stone-600 hover:bg-stone-50"
                    )}
                  >
                    {cat !== "All" && (
                      <span className="text-xl w-6">{CATEGORY_ICONS[cat]}</span>
                    )}
                    <span className="flex-1">{cat === "All" ? "All Products" : cat}</span>
                    <span className="text-[11px] text-stone-400">
                      {CATEGORY_COUNTS[cat] ?? 0}
                    </span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
interface ProductCardProps {
  item: CatalogProduct;
  isAdded: boolean;
  onAdd: (item: CatalogProduct) => void;
  addLabel: string;
  perCaseLabel: string;
  itemNumLabel: string;
}

const CAT_CHIP: Record<string, string> = {
  Potatoes:        "bg-amber-50   text-amber-700  border-amber-200",
  Appetizers:      "bg-orange-50  text-orange-700 border-orange-200",
  "Bread Products":"bg-yellow-50  text-yellow-700 border-yellow-200",
  Cheese:          "bg-amber-50   text-amber-800  border-amber-300",
  Dairy:           "bg-sky-50     text-sky-700    border-sky-200",
  Condiments:      "bg-red-50     text-red-700    border-red-200",
  "Dry Goods":     "bg-stone-100  text-stone-600  border-stone-200",
  Meats:           "bg-red-50     text-red-800    border-red-200",
  Poultry:         "bg-orange-50  text-orange-800 border-orange-200",
  "Prepared Foods":"bg-purple-50  text-purple-700 border-purple-200",
  Seafood:         "bg-blue-50    text-blue-700   border-blue-200",
  Vegetables:      "bg-green-50   text-green-700  border-green-200",
};

function ProductCard({ item, isAdded, onAdd, addLabel, perCaseLabel }: ProductCardProps) {
  const chipStyle = CAT_CHIP[item.category] ?? "bg-stone-100 text-stone-600 border-stone-200";
  const icon = CATEGORY_ICONS[item.category] ?? "📦";

  return (
    <div className="group bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-lg hover:border-stone-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">

      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50 border-b border-stone-100">
        <span className={cn(
          "flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider",
          chipStyle
        )}>
          <span>{icon}</span>
          <span>{item.category}</span>
        </span>
        <span className="text-[10px] font-mono text-stone-400 bg-white border border-stone-200 px-2 py-0.5 rounded-md">
          #{item.id}
        </span>
      </div>

      {/* Product name + pack */}
      <div className="px-4 py-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-stone-800 leading-snug">
          {item.name}
        </h3>
        <p className="text-xs text-stone-400 mt-2 font-medium tracking-wide">
          Pack: {item.pack}
        </p>
      </div>

      {/* Price row */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-stone-100 bg-stone-50/60">
        <div>
          {item.price !== null ? (
            <p className="text-xl font-bold text-stone-900 leading-none">
              ${item.price.toFixed(2)}
              <span className="text-[11px] font-normal text-stone-400 ml-0.5">{perCaseLabel}</span>
            </p>
          ) : (
            <p className="text-sm font-semibold text-red-500 italic">Call for Price</p>
          )}
        </div>
        <button
          onClick={() => onAdd(item)}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0",
            isAdded
              ? "bg-green-500 text-white scale-95"
              : "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md hover:shadow-red-200/50"
          )}
        >
          {isAdded ? (
            <><Check size={12} /> Added!</>
          ) : (
            <><ShoppingCart size={12} /> {addLabel}</>
          )}
        </button>
      </div>
    </div>
  );
}
