import type { Product } from "@/data/products";

// ─── Types ─────────────────────────────────────────────────────────────────────
export type NewItem = {
  honorCode: string;
  name: string;
  pack: string;
  vendorCode?: string;
};

export type NewSection = {
  category: string;
  icon: string;
  items: NewItem[];
};

export type PromoItem = {
  honorCode: string;
  name: string;
  pack: string;
  vendorCode?: string;
};

export type PromoSection = {
  category: string;
  icon: string;
  savings: string;
  unit: "case" | "lb";
  items: PromoItem[];
};

// ─── New Items ─────────────────────────────────────────────────────────────────
export const NEW_ITEMS: NewSection[] = [
  {
    category: "Bagels & Bread",
    icon: "🥯",
    items: [
      { honorCode: "8848", name: "Bagel, Plain, Sliced", pack: "15/6ea", vendorCode: "87616" },
      { honorCode: "8849", name: "Bagel, Everything, Sliced", pack: "12/6ea", vendorCode: "87034" },
      { honorCode: "8850", name: "Bagel, Plain, Sliced", pack: "12/6ea", vendorCode: "87027" },
      { honorCode: "8851", name: "Bagel, Blueberry, Sliced", pack: "12/6ea", vendorCode: "87033" },
      { honorCode: "8852", name: "Bagel, Cinnamon Raisin, Sliced", pack: "15/6ea", vendorCode: "40503" },
      { honorCode: "8853", name: "Bagel, Cinnamon Raisin, Sliced", pack: "12/6ea", vendorCode: "87028" },
      { honorCode: "8846", name: "Muffins, Plain, English", pack: "12/6ea", vendorCode: "30001" },
      { honorCode: "8847", name: "Muffins, Plain, English", pack: "6/8ea", vendorCode: "30006" },
      { honorCode: "8888", name: "Sugar in the Raw, PC", pack: "12/2#", vendorCode: "50311" },
    ],
  },
  {
    category: "Ice Products",
    icon: "🧊",
    items: [
      { honorCode: "18005", name: 'Ice Cube, 1.75", Princess Cut', pack: "6/21ct", vendorCode: "001000BX" },
      { honorCode: "18006", name: 'Ice Cube, 2", Princess Cut', pack: "6/18ct", vendorCode: "001001BX" },
      { honorCode: "18007", name: 'Ice Cube, 2.5", Princess Cut', pack: "5/21ct", vendorCode: "001005BX" },
      { honorCode: "18008", name: 'Ice, Sphere, 2.3"', pack: "5/15ct", vendorCode: "001017BX" },
      { honorCode: "18009", name: 'Ice, Pillar, 1.45", Collins', pack: "3/21ct", vendorCode: "001003BX" },
    ],
  },
  {
    category: "Fruit & Canned Fruit",
    icon: "🍑",
    items: [
      { honorCode: "21058", name: "Mandarin Oranges, Whole, Natural Juice", pack: "6/#10", vendorCode: "GF5426" },
      { honorCode: "21059", name: "Mandarin Oranges, Broken, Natural Juice", pack: "6/#10", vendorCode: "GF5425" },
      { honorCode: "21049", name: "Peaches, Diced, Natural Juice", pack: "6/#10", vendorCode: "GF8965" },
      { honorCode: "21050", name: "Peaches, Halves, Natural Juice", pack: "6/#10", vendorCode: "GF7323" },
      { honorCode: "21051", name: "Peaches, Sliced, Natural Juice", pack: "6/#10", vendorCode: "GF7322" },
      { honorCode: "21052", name: "Pears, Diced, Natural Juice", pack: "6/#10", vendorCode: "GF1032" },
      { honorCode: "21053", name: "Pears, Halves, Natural Juice", pack: "6/#10", vendorCode: "GF1546" },
      { honorCode: "21054", name: "Pears, Sliced, Natural Juice", pack: "6/#10", vendorCode: "GF1287" },
      { honorCode: "21045", name: "Pineapple, Chunks, Natural Juice", pack: "6/#10", vendorCode: "GF6935" },
      { honorCode: "21046", name: "Pineapple, Crushed, Natural Juice", pack: "6/#10", vendorCode: "GF3120" },
      { honorCode: "21047", name: "Pineapple, Sliced, Natural Juice", pack: "6/#10", vendorCode: "GF3591" },
      { honorCode: "21048", name: "Pineapple, Tidbits, Natural Juice", pack: "6/#10", vendorCode: "GF5065" },
      { honorCode: "80152", name: "Peaches, Sliced, IQF", pack: "2/5#", vendorCode: "17150-00" },
    ],
  },
  {
    category: "Deli Meats",
    icon: "🍖",
    items: [
      { honorCode: "8881", name: "Capocollo, Bulk", pack: "2/3.19#", vendorCode: "20792000" },
      { honorCode: "8883", name: "Capocollo, Hot, Bulk", pack: "2/3.19#", vendorCode: "20792006" },
      { honorCode: "8885", name: "Mortadello with Pistachio", pack: "1/11#", vendorCode: "20793001" },
      { honorCode: "8884", name: "Pancetta Bulk", pack: "2/3.19#", vendorCode: "20794002" },
      { honorCode: "8887", name: "Prosciutto, Italiano", pack: "2/11#", vendorCode: "20793010" },
      { honorCode: "8882", name: "Soppressata, Bulk", pack: "2/3.19#", vendorCode: "20790017" },
    ],
  },
  {
    category: "Vegetables",
    icon: "🥦",
    items: [
      { honorCode: "90350", name: "Blend, Stir Fry", pack: "12/2#", vendorCode: "CHINA" },
      { honorCode: "90471", name: "Cauliflower, IQF", pack: "12/2#", vendorCode: "GUATEMALA" },
      { honorCode: "90020", name: "Beans, Cut, Green", pack: "1/20#", vendorCode: "EGYPT" },
      { honorCode: "90931", name: "Blend, Italian", pack: "12/2#", vendorCode: "CHINA" },
      { honorCode: "90056", name: "Asparagus, Cuts & Tips", pack: "6/2.5#", vendorCode: "PERU" },
      { honorCode: "90038", name: "Asparagus, Spears, Medium", pack: "6/2.5#", vendorCode: "ECUADOR" },
    ],
  },
];

// ─── Promo Sections ────────────────────────────────────────────────────────────
export const PROMO_SECTIONS: PromoSection[] = [
  {
    category: "Potatoes",
    icon: "🥔",
    savings: "$1.00–$2.00",
    unit: "case",
    items: [
      { honorCode: "4782", name: "Fries, Brew City, Maxi Cut", pack: "6/5#", vendorCode: "BCI00256" },
      { honorCode: "4811", name: "Fries, Brew City, Thin Cut", pack: "6/5#", vendorCode: "BCI00255" },
      { honorCode: "9109", name: "Potato Chips, Flat, Original", pack: "6/4#", vendorCode: "MCX05006" },
      { honorCode: "9317", name: "Potato Chips, Select Recipe", pack: "6/5#", vendorCode: "26136" },
      { honorCode: "4411", name: "Potato, Redskin, Mashed, Classic", pack: "6/4#", vendorCode: "29920" },
      { honorCode: "4462", name: 'Fries, Crinkle Cut, 3/8"', pack: "6/5#", vendorCode: "22303" },
      { honorCode: "4464", name: 'Fries, Shoestrings, 1/4"', pack: "6/4.5#", vendorCode: "22533" },
      { honorCode: "4397", name: 'Fries, Straight, 3/8"', pack: "6/5#", vendorCode: "47108" },
      { honorCode: "4326", name: 'Fries, Straight, 5/16", Skin On', pack: "6/5#", vendorCode: "23201" },
      { honorCode: "11128", name: 'Fries, Straight, 3/8"', pack: "6/5#", vendorCode: "BELGIUM" },
      { honorCode: "11130", name: 'Fries, Crinkle Cut, 3/8"', pack: "6/5#", vendorCode: "BELGIUM" },
      { honorCode: "11134", name: 'Fries, Straight, 3/8", Coated', pack: "6/5#", vendorCode: "BELGIUM" },
      { honorCode: "9216", name: "Fries, Cross Trax, Redstone Canyon", pack: "6/4.5#", vendorCode: "MCL03623" },
      { honorCode: "9221", name: "Fries, Spiral, Redstone Canyon", pack: "6/4#", vendorCode: "MCL03622" },
      { honorCode: "4747", name: "Fries, Wedge, Redstone Canyon, 8 Cut", pack: "6/5#", vendorCode: "MCX03626" },
      { honorCode: "4756", name: "Potato Cubes, Redstone Canyon, Skin On", pack: "6/5#", vendorCode: "MCL03624" },
    ],
  },
  {
    category: "Appetizers",
    icon: "🧆",
    savings: "$.12–$.30/lb · $2–$3",
    unit: "case",
    items: [
      { honorCode: "6366", name: "Corn Nugget, Battered", pack: "6/2#", vendorCode: "80008428" },
      { honorCode: "9422", name: "Pickle Spears, Breaded, Dill", pack: "4/4#", vendorCode: "50010153" },
      { honorCode: "12975", name: "Pickle Spears, Breaded, Dill", pack: "2/5#", vendorCode: "1000005885" },
      { honorCode: "9424", name: "Jalapeño Popper, Cheddar Mini", pack: "6/2.5#", vendorCode: "50010132" },
      { honorCode: "9423", name: "Broccoli & Cheddar Mini Bite, Breaded", pack: "6/2.5#", vendorCode: "50010277" },
      { honorCode: "9302", name: 'Onion Ring, Beer Batter, 5/8"', pack: "12/2#", vendorCode: "1000009775" },
      { honorCode: "9257", name: 'Onion Ring, Breaded, 5/8", Gourmet', pack: "12/2#", vendorCode: "1000009891" },
      { honorCode: "9260", name: 'Onion Ring, Breaded, Natural, Homestyle, 3/8"', pack: "12/2.5#", vendorCode: "10000010612" },
      { honorCode: "9183", name: 'Onion Ring, Beer Batter, 5/8"', pack: "6/2.5#", vendorCode: "70010011" },
      { honorCode: "6105", name: "Honey, Clover", pack: "6/5#", vendorCode: "BB1010" },
      { honorCode: "9245", name: 'Mozzarella Stick, Battered, 2.75"', pack: "6/2#", vendorCode: "10000011554" },
      { honorCode: "9249", name: 'Mozzarella Stick, Breaded, 3.25"', pack: "6/2#", vendorCode: "10000011557" },
    ],
  },
  {
    category: "Ethnic / Prepared Foods",
    icon: "🌮",
    savings: "$1.00–$5.00",
    unit: "case",
    items: [
      { honorCode: "13658", name: 'Tortillas, Yellow, Corn, 6"', pack: "6/120ct", vendorCode: "10076000621" },
      { honorCode: "13654", name: 'Tortillas, White, 12", Flour', pack: "6/12ct", vendorCode: "10078280621" },
      { honorCode: "14452", name: 'Tortillas, Herb Garlic, 12"', pack: "6/12ct", vendorCode: "10192190621" },
      { honorCode: "14451", name: 'Tortillas, Spinach, 12"', pack: "6/12ct", vendorCode: "10192290621" },
      { honorCode: "14454", name: 'Tortillas, Honey Wheat, 12"', pack: "6/12ct", vendorCode: "10192260621" },
      { honorCode: "14456", name: "Taco Shells, Yellow Corn", pack: "1/200ct", vendorCode: "10075290621" },
      { honorCode: "14467", name: "Tortilla Chips, Red, White & Blue", pack: "1/30#", vendorCode: "10076320621" },
      { honorCode: "19112", name: 'Tortillas, Flour, Jalapeño, 12"', pack: "6/12ct", vendorCode: "10192300621" },
      { honorCode: "14453", name: 'Tortillas, Flour, 6"', pack: "24/12ct", vendorCode: "10128850621" },
      { honorCode: "9639", name: "Pierogie, Potato & Cheddar", pack: "4/6.3#", vendorCode: "00370" },
      { honorCode: "9640", name: "Pierogie, Potato & Cheddar, Mini", pack: "4/2.86#", vendorCode: "00834" },
      { honorCode: "9661", name: "Pierogie, Snack, Cheddar, Sour Cream & Onion", pack: "12/1.32#", vendorCode: "00805" },
      { honorCode: "9662", name: "Pierogie, Snack, Cheddar and Ranch with Bacon", pack: "12/1.32#", vendorCode: "00804" },
      { honorCode: "2023", name: "Pierogie, Potato & 3 Cheese, 1.25oz", pack: "2/6#", vendorCode: "30060" },
    ],
  },
  {
    category: "Plant Based",
    icon: "🌱",
    savings: "$1.00–$3.00",
    unit: "case",
    items: [
      { honorCode: "13637", name: "Impossible Burgers, Bulk", pack: "4/5#", vendorCode: "60-00010" },
      { honorCode: "13638", name: "Impossible Burger Patties, 4oz", pack: "4/2.5#", vendorCode: "60-00011" },
      { honorCode: "13639", name: "Impossible Sausage Patties, 1.6oz", pack: "2/5#", vendorCode: "60-00022" },
      { honorCode: "14169", name: "Impossible Burger Patties, 5.33oz", pack: "1/10.66#", vendorCode: "3000000133" },
      { honorCode: "13611", name: "Beyond Chicken Tenders, Breaded", pack: "2/5#", vendorCode: "1C04-001" },
      { honorCode: "13619", name: "Beyond Sausage Patty, 1.66oz, Fully Cooked", pack: "2/5#", vendorCode: "290039" },
      { honorCode: "13620", name: "Beyond Burger, 4oz", pack: "40/4oz", vendorCode: "004668" },
      { honorCode: "13621", name: "Beyond Burger, 6oz", pack: "32/6oz", vendorCode: "004712" },
    ],
  },
  {
    category: "Dough & Pizza",
    icon: "🍕",
    savings: "$1.00–$8.00",
    unit: "case",
    items: [
      { honorCode: "1878", name: "Danish Dough, Stay Fresh", pack: "2/15#", vendorCode: "33385" },
      { honorCode: "1881", name: "Puff Pastry Dough", pack: "2/15#", vendorCode: "11016" },
      { honorCode: "1883", name: 'Puff Pastry Dough Squares, 5"x5"', pack: "120/2oz", vendorCode: "11014" },
      { honorCode: "1885", name: 'Puff Pastry Dough Sheets, 10"x15"', pack: "20/12oz", vendorCode: "45569" },
      { honorCode: "15065", name: 'Flatbread, 10", Bulk', pack: "50/3.8oz", vendorCode: "101410" },
      { honorCode: "15056", name: 'Pizza Crust, 10", Thin, Par-Baked', pack: "24/8.5oz", vendorCode: "2004" },
      { honorCode: "15058", name: 'Pizza Crust, 16", Thin, Par-Baked', pack: "24/17.6oz", vendorCode: "2001" },
    ],
  },
  {
    category: "Fruit & Vegetables",
    icon: "🫐",
    savings: "$.03–$.10/lb · $1.50",
    unit: "case",
    items: [
      { honorCode: "4475", name: "Guacamole, Dip, Western Classic Blend, Tuscan", pack: "12/1#", vendorCode: "19342" },
      { honorCode: "4590", name: "Guacamole, Dip, Western Classic", pack: "6/3#", vendorCode: "02983" },
      { honorCode: "90608", name: "Avocado, Pulp, Harvest Fresh", pack: "6/3#", vendorCode: "936220" },
      { honorCode: "80151", name: "Peaches, Slices, IQF", pack: "1/22#", vendorCode: "GREECE" },
      { honorCode: "80236", name: "Raspberries, Red, Whole, IQF", pack: "1/10#", vendorCode: "MEXICO" },
      { honorCode: "80350", name: "Rhubarb, IQF", pack: "1/22#", vendorCode: "POLAND" },
      { honorCode: "4382", name: "Classic Blend, Tuscan", pack: "8/3#", vendorCode: "60202" },
      { honorCode: "690460", name: "Carrots, Whole, Baby", pack: "4/5#", vendorCode: "FRANCE" },
      { honorCode: "90462", name: "Carrots, Whole, Baby", pack: "12/2#", vendorCode: "BELGIUM" },
    ],
  },
  {
    category: "Seafood",
    icon: "🐟",
    savings: "$.10/lb · $2.50",
    unit: "case",
    items: [
      { honorCode: "3445", name: "Haddock, Beer Batter, 6oz", pack: "1/10#", vendorCode: "10025917" },
      { honorCode: "3103", name: "Pollock, Breaded, Filet, Alaska, RTF, 8oz", pack: "1/10#", vendorCode: "6078" },
      { honorCode: "3343", name: "Sole w/Scallop & Crab Meat, 5oz", pack: "1/10#", vendorCode: "1039207" },
      { honorCode: "3097", name: "Tilapia, Potato Crunch, 5-6oz", pack: "1/10#", vendorCode: "14584" },
      { honorCode: "3371", name: "Cod, Potato Crust w/ Garlic/Lemon", pack: "1/10#", vendorCode: "1029746" },
      { honorCode: "63489", name: "Crab Cake, Maryland Style", pack: "4/3oz", vendorCode: "10004302" },
      { honorCode: "3451", name: "Fish Cakes, 2oz", pack: "1/10#", vendorCode: "10003405" },
    ],
  },
  {
    category: "Chicken",
    icon: "🍗",
    savings: "$2.50",
    unit: "case",
    items: [
      { honorCode: "19007", name: "Chicken Tender, Breaded, Ready to Cook", pack: "2/5#", vendorCode: "10074410928" },
      { honorCode: "19017", name: "Chicken Tenderloin, Steakhouse, Ready to Cook", pack: "2/5#", vendorCode: "1016280687" },
      { honorCode: "19019", name: "Chicken Tenderloin, Brandywine, Ready to Cook", pack: "2/5#", vendorCode: "10761560082" },
    ],
  },
  {
    category: "Dairy & Eggs",
    icon: "🥚",
    savings: "Varies",
    unit: "case",
    items: [
      { honorCode: "12963", name: "Oil, Blended, 10% Olive/Soy", pack: "6/1 gal", vendorCode: "6/1SAL" },
      { honorCode: "12919", name: "Oil, Salad, Canola", pack: "1/35#", vendorCode: "CAN35B" },
      { honorCode: "12923", name: "Shortening, Canola, Fry", pack: "1/35#", vendorCode: "CANFRY" },
      { honorCode: "12916", name: "Shortening, Clear", pack: "1/35#", vendorCode: "CLR35S" },
      { honorCode: "12915", name: "Shortening, Creamy", pack: "1/35#", vendorCode: "CRM35S" },
      { honorCode: "14394", name: "Eggs, Extra Large, White, Loose, AA Grade", pack: "15/doz", vendorCode: "02119904RD" },
      { honorCode: "14392", name: "Eggs, Extra Large, White, Loose, AA Grade", pack: "30/doz", vendorCode: "02119908BL" },
      { honorCode: "14474", name: "Eggs, Large, White, Loose, AA Grade", pack: "15/doz", vendorCode: "03119904RD" },
      { honorCode: "14472", name: "Eggs, Large, White, Loose, AA Grade", pack: "30/doz", vendorCode: "03119908BL" },
      { honorCode: "14477", name: "Eggs, Medium, White, Loose", pack: "15/doz", vendorCode: "04119904RD" },
      { honorCode: "12249", name: "Butter, Solids, Unsalted, USDA AA", pack: "36/1#", vendorCode: "0620" },
      { honorCode: "12671", name: "Butter, Solids, Salted, USDA AA", pack: "36/1#", vendorCode: "0637" },
      { honorCode: "12547", name: "Butter, Quarters, Unsalted", pack: "18/1#", vendorCode: "0658" },
      { honorCode: "12998", name: "Butter, Quarters, Salted", pack: "36/1#", vendorCode: "0655" },
      { honorCode: "12744", name: "Whipped Cream, Aerosol, Real", pack: "12/14oz", vendorCode: "0847" },
      { honorCode: "12200", name: "Sour Cream", pack: "6/5#", vendorCode: "0205" },
      { honorCode: "12828", name: "Yogurt, Plain, Greek, 10%", pack: "6/32oz", vendorCode: "0355" },
    ],
  },
];

// ─── Cart conversion helpers ───────────────────────────────────────────────────
function sectionToCategory(sectionName: string): Product["category"] {
  const s = sectionName.toLowerCase();
  if (s.includes("seafood") || s.includes("fish") || s.includes("crab") || s.includes("shrimp")) return "seafood";
  if (s.includes("beef") || s.includes("pork") || s.includes("deli") || s.includes("chicken") || s.includes("plant") || s.includes("poultry")) return "meats";
  if (s.includes("dairy") || s.includes("egg") || s.includes("cheese") || s.includes("butter")) return "dairy";
  if (s.includes("vegetable") || s.includes("fruit") || s.includes("produce") || s.includes("potato")) return "produce";
  return "dryGoods";
}

export function newItemToProduct(item: NewItem, section: NewSection): Product {
  return {
    id: `spec-new-${item.honorCode}`,
    name: item.name,
    category: sectionToCategory(section.category),
    unitSize: item.pack,
    price: 0,
    imageUrl: "",
    description: `HC: ${item.honorCode}${item.vendorCode ? ` · ${item.vendorCode}` : ""}`,
    inStock: true,
  };
}

export function promoItemToProduct(item: PromoItem, section: PromoSection): Product {
  return {
    id: `spec-promo-${item.honorCode}`,
    name: item.name,
    category: sectionToCategory(section.category),
    unitSize: item.pack,
    price: 0,
    imageUrl: "",
    description: `Save ${section.savings}/${section.unit} · HC: ${item.honorCode}`,
    inStock: true,
  };
}
