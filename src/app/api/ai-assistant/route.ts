import { NextRequest } from "next/server";
import { CATALOG_PRODUCTS } from "@/data/catalog";
import { DEAL_SECTIONS } from "@/data/deals";
import { PRODUCTS } from "@/data/products";

const BASE_SYSTEM = `You are the LIW Ordering Assistant for Larry Inver Wholesale — a premium food wholesale company serving the Greater Philadelphia area.

COMPANY INFO:
- Name: Larry Inver Wholesale (LIW)
- Location: 939 N. 2nd Street, Philadelphia, PA 19123
- Phone: (215) 627-5323
- Hours: Mon–Fri 6 AM – 4 PM, Sat 6 AM – 12 PM
- Minimum order: $150
- Delivery: Greater Philadelphia area, Mon–Fri
- Payment: on delivery/invoice OR Stripe online

INSTRUCTIONS:
- Use the PRODUCT SEARCH RESULTS below to answer the customer's question
- Always name specific products with their pack size and price
- Keep responses to 2–4 sentences
- If no matches found, suggest calling (215) 627-5323
- Be warm and helpful — this is a family business`;

function buildProductContext(userMessage: string): string {
  const stopWords = new Set(["the", "and", "for", "are", "you", "can", "how", "what",
    "have", "any", "some", "need", "want", "looking", "got", "get", "show", "find",
    "tell", "about", "with", "from", "our", "your", "please", "like", "much", "does"]);

  const terms = userMessage.toLowerCase()
    .split(/[\s,?.!]+/)
    .filter(t => t.length > 2 && !stopWords.has(t));

  const lines: string[] = [];

  if (terms.length === 0) {
    return "Customer asked a general question. Available categories: Meats, Poultry, Seafood, Dairy, Cheese, Vegetables, Potatoes, Dry Goods, Bread Products, Condiments, Appetizers, Prepared Foods.";
  }

  // Search the full catalog
  const catalogMatches = CATALOG_PRODUCTS
    .filter(p => terms.some(t =>
      p.name.toLowerCase().includes(t) ||
      p.category.toLowerCase().includes(t)
    ))
    .slice(0, 20)
    .map(p => `  • ${p.name} | ${p.pack} | ${p.price != null ? `$${p.price}/cs` : "call for price"} [Catalog]`);

  if (catalogMatches.length > 0) {
    lines.push("CATALOG:\n" + catalogMatches.join("\n"));
  }

  // Search weekly deals — match item name only (not section title)
  const dealLines: string[] = [];
  for (const section of DEAL_SECTIONS) {
    for (const item of section.items) {
      if (terms.some(t => item.name.toLowerCase().includes(t))) {
        const price = item.price === "Market" ? "call for price" : `${item.price}${item.unit}`;
        dealLines.push(`  • ${item.name} | ${price}${item.note ? ` (${item.note})` : ""} [Weekly Deal — ${section.title}]`);
      }
    }
  }
  if (dealLines.length > 0) {
    lines.push("WEEKLY DEALS:\n" + dealLines.slice(0, 15).join("\n"));
  }

  // Search ordering products
  const orderMatches = PRODUCTS
    .filter(p => terms.some(t =>
      p.name.toLowerCase().includes(t) ||
      p.category.toLowerCase().includes(t)
    ))
    .map(p => `  • ${p.name} | ${p.unitSize} | $${p.price} [Order Online]`);

  if (orderMatches.length > 0) {
    lines.push("ORDER-READY PRODUCTS:\n" + orderMatches.join("\n"));
  }

  if (lines.length === 0) {
    return `No exact matches for "${userMessage}". Suggest calling (215) 627-5323 or browsing the catalog. Categories: Meats, Poultry, Seafood, Dairy, Cheese, Vegetables, Potatoes, Dry Goods, Bread Products, Condiments.`;
  }

  return lines.join("\n\n");
}

function buildFallbackReply(userMessage: string): string {
  const terms = userMessage.toLowerCase().split(/[\s,?.!]+/).filter(t => t.length > 2);

  // General questions
  if (terms.some(t => ["minimum", "min", "order"].includes(t))) {
    return "Our minimum order is $150 for the Greater Philadelphia area. We deliver Monday–Friday. You can pay on delivery or online via Stripe.";
  }
  if (terms.some(t => ["deliver", "delivery", "shipping"].includes(t))) {
    return "We deliver throughout the Greater Philadelphia area Monday–Friday. Orders placed by 2 PM typically deliver next business day. Minimum order is $150.";
  }
  if (terms.some(t => ["hour", "hours", "open", "close", "time"].includes(t))) {
    return "We are open Monday–Friday 6 AM – 4 PM and Saturday 6 AM – 12 PM. Call us at (215) 627-5323!";
  }

  // Product search across all sources
  const catalogHits = CATALOG_PRODUCTS
    .filter(p => terms.some(t => p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)))
    .slice(0, 5);

  const dealHits: { name: string; price: string; unit: string; section: string }[] = [];
  for (const section of DEAL_SECTIONS) {
    for (const item of section.items) {
      if (terms.some(t => item.name.toLowerCase().includes(t))) {
        dealHits.push({ name: item.name, price: item.price, unit: item.unit, section: section.title });
      }
    }
    if (dealHits.length >= 5) break;
  }

  const results: string[] = [];

  if (catalogHits.length > 0) {
    const items = catalogHits.map(p => `${p.name} (${p.pack}${p.price != null ? `, $${p.price}/cs` : ""})`).join(", ");
    results.push(`From our catalog: ${items}.`);
  }

  if (dealHits.length > 0) {
    const items = dealHits.map(i => `${i.name} (${i.price === "Market" ? "call for price" : i.price + i.unit})`).join(", ");
    results.push(`This week's deals include: ${items}.`);
  }

  if (results.length === 0) {
    return `I couldn't find an exact match for "${userMessage}" — we carry thousands of items. Please call us at (215) 627-5323 or browse the full catalog for everything we offer.`;
  }

  return results.join(" ") + " Want me to add anything to your cart, or call (215) 627-5323 for custom orders?";
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const lastUserMessage = messages.findLast((m: { role: string }) => m.role === "user")?.content || "";
  const productContext = buildProductContext(lastUserMessage);

  const systemPrompt = `${BASE_SYSTEM}

PRODUCT SEARCH RESULTS FOR "${lastUserMessage}":
${productContext}

Answer using the products listed above. Be specific about names, pack sizes, and prices.`;

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const reply = buildFallbackReply(lastUserMessage);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(reply));
        controller.close();
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value);
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                controller.enqueue(encoder.encode(parsed.delta.text));
              }
            } catch { /* skip malformed */ }
          }
        }
      }
      controller.close();
    },
  });

  return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
