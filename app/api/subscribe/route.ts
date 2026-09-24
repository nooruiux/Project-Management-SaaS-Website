import { addPendingMember, getMailchimpConfig } from "@/lib/mailchimp";
import { subscribeSchema, type SubscribeResponse } from "@/lib/newsletter";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const reply = (body: SubscribeResponse, status: number, headers?: HeadersInit) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Newsletter sign-up. Mailchimp is only ever called from here (never from the browser). */
export async function POST(request: Request) {
  const limit = rateLimit(clientIp(request));
  if (!limit.ok) return reply({ code: "rate_limited" }, 429, { "Retry-After": String(limit.retryAfter) });

  const json = await request.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(json);
  if (!parsed.success) return reply({ code: "invalid" }, 400);

  // Honeypot filled → a bot. Answer like a success so it learns nothing, but don't subscribe.
  if (parsed.data.company) return reply({ code: "pending" }, 200);

  const config = getMailchimpConfig();
  if (!config) return reply({ code: "unavailable" }, 503);

  const result = await addPendingMember(config, parsed.data.email);
  switch (result) {
    case "pending":
      return reply({ code: "pending" }, 200);
    case "exists":
      return reply({ code: "exists" }, 200);
    case "invalid":
      return reply({ code: "invalid" }, 400);
    default:
      return reply({ code: "error" }, 502);
  }
}
