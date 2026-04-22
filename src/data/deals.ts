import type { Product } from "@/data/products";

// ─── Types ─────────────────────────────────────────────────────────────────────
export type DealItem = {
  name: string;
  price: string;
  unit: string;
  note?: string;
  hot?: boolean;
};

export type DealSection = {
  title: string;
  icon: string;
  color: string;
  items: DealItem[];
};

// ─── Data ──────────────────────────────────────────────────────────────────────
export const DEAL_SECTIONS: DealSection[] = [
  {
    title: "Beef & Pork",
    icon: "🥩",
    color: "from-red-700 to-red-500",
    items: [
      { name: "Ground Beef", price: "$4.50", unit: "/lb" },
      { name: "Ground Sirloin", price: "$7.00", unit: "/lb" },
      { name: "Ground Pork", price: "$4.00", unit: "/lb" },
      { name: "Flank Steak", price: "$8.50", unit: "/lb", note: "3lb min" },
      { name: "8 oz Center Cut Filet", price: "$16.00", unit: "/pc", note: "min 2 pc" },
      { name: "Choice Filets", price: "$12.00", unit: "/pc", note: "5–7lb pc" },
      { name: "Eye Round", price: "$7.25", unit: "/lb", note: "5lb pc" },
      { name: "Baby Back Ribs", price: "$3.95", unit: "/lb", note: "3lb min" },
      { name: "Boneless Short Rib", price: "$8.79", unit: "/lb", note: "8lb min" },
      { name: "Boneless Pork Shoulder", price: "$2.95", unit: "/lb", note: "8lb min" },
      { name: "Lightly Thick Cut Pork", price: "$20.00", unit: "/5lb pkg" },
      { name: "6 oz Pork Chop", price: "$7.00", unit: "/lb", note: "5lb min" },
      { name: "Maglio Italian Sausage", price: "$3.50", unit: "/lb" },
      { name: "Roast Beef / Brisket", price: "$4.50", unit: "/lb", note: "7–15lb avg" },
    ],
  },
  {
    title: "Poultry",
    icon: "🍗",
    color: "from-orange-700 to-amber-500",
    items: [
      { name: "10lb Bag Chicken Breast", price: "$25.00", unit: "/bag" },
      { name: "Unsized Chicken Breast Boneless Skinless", price: "$30.00", unit: "/bag" },
      { name: "6–8 oz ABF Chicken Breast Halves", price: "$50.00", unit: "/bag" },
      { name: "10lb Boneless Thigh Meat", price: "$25.00", unit: "/bag" },
      { name: "Jumbo Party Wings", price: "$30.00", unit: "/bag" },
      { name: "Chicken Wings", price: "$25.00", unit: "/bag" },
      { name: "Whole 2.5lb Chickens", price: "$7.50", unit: "/each" },
      { name: "Ground Turkey", price: "$2.95", unit: "/lb", note: "5lb min" },
      { name: "Turkey Bacon", price: "$22.00", unit: "/5lb pkg" },
      { name: "5lb Duck", price: "$5.00", unit: "/lb" },
      { name: "Canadian Bacon (4lb log)", price: "$13.00", unit: "/log" },
    ],
  },
  {
    title: "Seafood",
    icon: "🦐",
    color: "from-blue-700 to-blue-500",
    items: [
      { name: "Fresh Salmon Fillet, Pin Bone Out", price: "$40.00", unit: "/5lb pc" },
      { name: "Alaskan Cod Fillet", price: "$8.95", unit: "/lb" },
      { name: "House Cut Fluke", price: "$10.95", unit: "/lb" },
      { name: "Fresh Sword Fish Fillet", price: "$15.95", unit: "/lb" },
      { name: "Fresh Skate Fillet", price: "$4.95", unit: "/lb" },
      { name: "NJ Black Seabass Fillet", price: "$25.00", unit: "/lb" },
      { name: "Crawfish", price: "$8.00", unit: "/lb" },
      { name: "2lb Shrimp Bag", price: "$16.00", unit: "/bag" },
      { name: "Little Neck Clams", price: "$18.00", unit: "/bushel" },
      { name: "Jumbo Lump Crab Meat", price: "$28.00", unit: "/can" },
      { name: "Claw Crab Meat", price: "$12.00", unit: "/can" },
      { name: "Kippered Salmon Pieces", price: "$8.00", unit: "/lb", note: "1–2lb" },
      { name: "Sliced Nova Boards", price: "$26.00", unit: "/3lb pc" },
      { name: "#10 Can Tuna", price: "$20.00", unit: "/can" },
      { name: "New Zealand Lamb Rack", price: "$19.00", unit: "/pack", note: "2 racks" },
    ],
  },
  {
    title: "Dairy & Eggs",
    icon: "🥚",
    color: "from-sky-700 to-sky-500",
    items: [
      { name: "Free Range Eggs (1 doz carton)", price: "$2.00", unit: "/carton" },
      { name: "Vitamin D Milk", price: "$4.50", unit: "/gal" },
      { name: "Half & Half", price: "$3.00", unit: "/qt" },
      { name: "Heavy Cream", price: "$5.00", unit: "/qt" },
      { name: "Sour Cream", price: "$3.25", unit: "/qt tub" },
      { name: "Unsalted Butter Stick", price: "$4.00", unit: "/lb" },
    ],
  },
  {
    title: "Cheese",
    icon: "🧀",
    color: "from-yellow-700 to-amber-500",
    items: [
      { name: "Fresh Grated Parmesan", price: "$5.00", unit: "/lb" },
      { name: "Fresh Grated Pecorino Romano", price: "$5.00", unit: "/lb" },
      { name: "Mozzarella Loaf (2lb)", price: "$12.50", unit: "/pc" },
      { name: "3lb Yellow Cheddar", price: "$12.50", unit: "/pc" },
      { name: "5lb Shredded White Cheddar", price: "$16.00", unit: "/bag" },
      { name: "5lb Shredded Yellow Cheddar", price: "$16.00", unit: "/bag" },
      { name: "5lb Shredded Mont Jack", price: "$16.00", unit: "/bag" },
      { name: "5lb Sliced American Loaf", price: "$15.00", unit: "/loaf" },
      { name: "NJ White American (3lb)", price: "$15.00", unit: "/pack" },
      { name: "CV Sharp Cheddar (3lb)", price: "$15.00", unit: "/pack" },
      { name: "Monterey Jack", price: "$12.50", unit: "/pc" },
      { name: "3lb Provolone", price: "$12.50", unit: "/pc" },
      { name: "3lb Swiss", price: "$12.50", unit: "/pc" },
      { name: "Goat Cheese Kilo Log", price: "$15.25", unit: "/pc" },
      { name: "Swedish Fontina", price: "$8.00", unit: "/lb" },
      { name: "Dolce Gorgonzola", price: "$8.00", unit: "/lb" },
      { name: "Huntsman Cheese", price: "$8.00", unit: "/lb" },
      { name: "String Cheese Knot (1lb)", price: "$7.00", unit: "/bag" },
    ],
  },
  {
    title: "Pantry & Dry Goods",
    icon: "🌾",
    color: "from-stone-700 to-stone-500",
    items: [
      { name: "Don P Pizza Sauce #10 Can", price: "$8.50", unit: "/can" },
      { name: "#10 Can Chick Peas", price: "$8.50", unit: "/can" },
      { name: "#10 Can Black Beans", price: "$8.50", unit: "/can" },
      { name: "#10 Can Corn", price: "$8.50", unit: "/can" },
      { name: "Quick Oats", price: "$6.50", unit: "/ct" },
      { name: "Extra Virgin Olive Oil", price: "$23.00", unit: "/3L can" },
      { name: "Franks Hot Sauce", price: "$15.00", unit: "/gal" },
      { name: "Crystal Hot Sauce", price: "$15.00", unit: "/gal" },
      { name: "Anchovies", price: "$14.00", unit: "/can" },
      { name: "#10 Can White Albacore Tuna", price: "$18.00", unit: "/can" },
      { name: "Coconut Milk", price: "$3.00", unit: "/can" },
      { name: "Chicken Base", price: "$9.00", unit: "/ct" },
      { name: "Crab Base", price: "$15.00", unit: "/ct" },
      { name: "Lobster Base", price: "$20.00", unit: "/ct" },
      { name: "35 Can Packs of Soda", price: "$18.50", unit: "/pack" },
    ],
  },
  {
    title: "Nuts & Specialty",
    icon: "🥜",
    color: "from-amber-800 to-amber-600",
    items: [
      { name: "Almonds", price: "$9.50", unit: "/lb" },
      { name: "Pecans", price: "$9.50", unit: "/lb" },
      { name: "Hazelnuts", price: "$9.00", unit: "/lb" },
      { name: "Walnuts", price: "$8.00", unit: "/lb" },
      { name: "Cashews", price: "$9.50", unit: "/lb" },
      { name: "Raisins", price: "$3.00", unit: "/lb", note: "2lb min" },
      { name: "Jumbo Bavarian Pretzel (baked in Germany)", price: "$3.00", unit: "/pc" },
      { name: "Pierogies", price: "$8.00", unit: "/3lb bag" },
      { name: "1lb Kissing Sour Kraut", price: "$4.00", unit: "/bag" },
    ],
  },
  {
    title: "Fresh Produce",
    icon: "🥦",
    color: "from-green-700 to-green-500",
    items: [
      { name: "Apples", price: "Market", unit: "" },
      { name: "Oranges", price: "Market", unit: "" },
      { name: "Grapes", price: "Market", unit: "" },
      { name: "Blueberries", price: "Market", unit: "" },
      { name: "Strawberries", price: "Market", unit: "" },
      { name: "Pineapples", price: "Market", unit: "" },
      { name: "Lemons & Limes", price: "Market", unit: "" },
      { name: "Avocados", price: "Market", unit: "" },
      { name: "Spinach", price: "Market", unit: "" },
      { name: "Lettuce Crowns", price: "Market", unit: "" },
      { name: "Broccoli Crowns", price: "Market", unit: "" },
      { name: "Bell Peppers", price: "Market", unit: "" },
      { name: "Jalapeños", price: "Market", unit: "" },
      { name: "Peeled Garlic", price: "Market", unit: "" },
      { name: "Mushrooms (White)", price: "Market", unit: "" },
      { name: "Spring Mix", price: "Market", unit: "" },
      { name: "Cucumbers", price: "Market", unit: "" },
      { name: "Cauliflower", price: "Market", unit: "" },
      { name: "Carrots", price: "Market", unit: "" },
      { name: "Grape Tomatoes", price: "Market", unit: "" },
      { name: "Zucchini", price: "Market", unit: "" },
      { name: "Celery", price: "Market", unit: "" },
      { name: "Cantaloupes", price: "Market", unit: "" },
    ],
  },
];

// ─── Cart conversion helpers ───────────────────────────────────────────────────
function dealSectionToCategory(title: string): Product["category"] {
  const t = title.toLowerCase();
  if (t.includes("seafood")) return "seafood";
  if (t.includes("beef") || t.includes("pork") || t.includes("poultry")) return "meats";
  if (t.includes("dairy") || t.includes("cheese") || t.includes("egg")) return "dairy";
  if (t.includes("produce") || t.includes("fruit") || t.includes("vegetable")) return "produce";
  return "dryGoods";
}

export function parsePrice(price: string): number {
  if (!price || price === "Market") return 0;
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

export function dealItemToProduct(item: DealItem, section: DealSection, idx: number): Product {
  return {
    id: `deal-${section.title.replace(/[\s&/]+/g, "-").toLowerCase()}-${idx}`,
    name: item.name,
    category: dealSectionToCategory(section.title),
    unitSize: item.unit || "each",
    price: parsePrice(item.price),
    imageUrl: "",
    description: `${item.price}${item.unit}${item.note ? ` · ${item.note}` : ""}`,
    inStock: true,
  };
}
