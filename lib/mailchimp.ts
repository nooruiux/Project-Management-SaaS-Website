import "server-only";

type MailchimpConfig = { apiKey: string; serverPrefix: string; audienceId: string };

/** Reads the Mailchimp env vars; returns null when any is missing (the form then shows "unavailable"). */
export function getMailchimpConfig(): MailchimpConfig | null {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !serverPrefix || !audienceId) return null;
  return { apiKey, serverPrefix, audienceId };
}

export type AddMemberResult = "pending" | "exists" | "invalid" | "error";

/**
 * Adds a member with status "pending" (double opt-in: Mailchimp emails a confirmation link).
 * https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
 */
export async function addPendingMember(config: MailchimpConfig, email: string): Promise<AddMemberResult> {
  const url = `https://${config.serverPrefix}.api.mailchimp.com/3.0/lists/${encodeURIComponent(config.audienceId)}/members`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`workup:${config.apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email, status: "pending" }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return "error";
  }

  if (res.ok) return "pending";

  const body = (await res.json().catch(() => ({}))) as { title?: string; detail?: string };
  if (body.title === "Member Exists") return "exists";
  // Mailchimp rejects fake / disposable-looking addresses and compliance-blocked ones as 400s.
  if (res.status === 400 && (body.title === "Invalid Resource" || body.title === "Forgotten Email Not Subscribed")) {
    return "invalid";
  }
  console.error("[subscribe] Mailchimp error", res.status, body.title, body.detail);
  return "error";
}
