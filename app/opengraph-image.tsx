import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero } from "@/content/hero";
import { site } from "@/content/site";
import { BRAND_MARK_PATH, BRAND_PRIMARY } from "@/lib/brand-mark";

export const alt = "WorkUp — Streamline work for team productivity. Start a 14-day free trial, no credit card required.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const manropeBold = await readFile(join(process.cwd(), "assets/fonts/manrope-latin-700-normal.woff"));
const manropeMedium = await readFile(join(process.cwd(), "assets/fonts/manrope-latin-500-normal.woff"));

/** 1200×630 social card: brand gradient, logo, the hero headline and the trial note (all visible on the page). */
export default async function OpengraphImage() {
  const { headline } = hero;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#ffffff",
          fontFamily: "Manrope",
          // Brand gradient: primary → the purple→red highlight used on section headings.
          backgroundImage: `linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #834eff 55%, #ff1200 130%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "rgba(255,255,255,0.16)",
              border: "2px solid rgba(255,255,255,0.4)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="52" height="52" viewBox="0 0 36 36">
              <path d={BRAND_MARK_PATH} fill="#ffffff" />
            </svg>
          </div>
          <span style={{ fontSize: 40, fontWeight: 700 }}>{site.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
            <span>
              {headline.beforeIcon} {headline.afterIcon}
            </span>
            <span>
              {headline.beforeAvatars} {headline.afterAvatars}
            </span>
          </div>
          <span style={{ fontSize: 30, fontWeight: 500, opacity: 0.9 }}>{hero.note}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: manropeBold, style: "normal", weight: 700 },
        { name: "Manrope", data: manropeMedium, style: "normal", weight: 500 },
      ],
    },
  );
}
