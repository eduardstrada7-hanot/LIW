import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are the LIW Ordering Assistant for Larry Inver Wholesale — a premium food wholesale company serving the Greater Philadelphia area. Your job is to help customers find the right products and place orders quickly and confidently.

COMPANY INFO:
- Name: Larry Inver Wholesale (LIW)
- Tagline: "From Our Home to Yours"
- Location: Greater Philadelphia, PA
- Phone: (215) 627-5323
- Address: 939 N. 2nd Street, Philadelphia, PA 19123
- Hours: Monday–Friday 6:00 AM – 4:00 PM, Saturday 6:00 AM – 12:00 PM
- Minimum order: $150
- Delivery: Greater Philadelphia area, Monday–Friday

PRODUCT CATEGORIES:
- Meats: Chicken breasts (40lb case), chicken thighs (40lb), ground beef 80/20 (10lb chub), pork shoulder, NY strip steaks, ground chicken
- Seafood: Atlantic salmon fillets (10lb), Gulf shrimp 16/20 (5lb), cod fillets (10lb), tilapia fillets (10lb)
- Produce: Roma tomatoes (25lb), yellow onions (50lb), russet potatoes (50lb), romaine hearts (24ct), broccoli crowns (20lb)
- Dairy: Shredded mozzarella (5lb), heavy cream (1 gallon), unsalted butter (36lb case), sour cream (5lb)
- Dry Goods: Canola oil (35lb), penne pasta (20lb), all-purpose flour (50lb), jasmine rice (50lb), kosher salt (10lb)

INSTRUCTIONS:
- Always try to suggest specific products when the customer describes a need
- Keep responses concise (2-3 sentences max)
- Guide customers toward completing their order
- If asked about minimums: $150 minimum order for Greater Philadelphia
- If asked about delivery: Monday–Friday, Greater Philadelphia area
- If asked about payment: pay on delivery/invoice OR Stripe online payment
- Be warm, helpful, and professional — like a knowledgeable family business`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Fallback: no AI key configured — return helpful static response
    const lastUser = messages[messages.length - 1]?.content?.toLowerCase() || "";
    let reply = "I'd be happy to help! Our most popular items include chicken breast (40lb case, $89.99), salmon fillets (10lb, $129.99), and Roma tomatoes (25lb, $28.99). Minimum order is $150. What are you looking for?";

    if (lastUser.includes("chicken")) {
      reply = "We carry Boneless Skinless Chicken Breast (40lb case — $89.99), Chicken Thighs (40lb — $74.99), and Ground Chicken (10lb — $38.99). Which works best for you?";
    } else if (lastUser.includes("salmon") || lastUser.includes("fish") || lastUser.includes("seafood")) {
      reply = "Our seafood includes Atlantic Salmon Fillet (10lb — $129.99), Gulf Shrimp 16/20 (5lb — $64.99), and Cod Fillet (10lb — $94.99). Want me to add any to your cart?";
    } else if (lastUser.includes("minimum") || lastUser.includes("order")) {
      reply = "Our minimum order is $150 for the Greater Philadelphia area. We deliver Monday–Friday. You can pay on delivery or online via Stripe.";
    } else if (lastUser.includes("deliver")) {
      reply = "We deliver throughout the Greater Philadelphia area, Monday through Friday. Orders placed by 2PM typically deliver next business day.";
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(reply));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Use Anthropic API with streaming
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
      stream: true,
    }),
  });

  // Stream the response back
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
            } catch {
              // skip malformed lines
            }
          }
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
