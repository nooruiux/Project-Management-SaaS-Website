import { z } from "zod";

/** Request body for POST /api/subscribe. `company` is a honeypot — humans never see or fill it. */
export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  company: z.string().max(200).optional().default(""),
});

/** Response `code`s the form understands. */
export type SubscribeCode = "pending" | "exists" | "invalid" | "rate_limited" | "unavailable" | "error";
export type SubscribeResponse = { code: SubscribeCode };
