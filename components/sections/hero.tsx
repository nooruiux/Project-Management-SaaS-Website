import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { hero } from "@/content/hero";
import arrowRightSm from "@/public/figma/icon-arrow-right-sm.svg";
import arrowRight from "@/public/figma/icon-arrow-right.svg";
import avatarPlus from "@/public/figma/avatar-plus.svg";
import bolt from "@/public/figma/icon-bolt.svg";
import play from "@/public/figma/icon-play.svg";
import stars from "@/public/figma/icon-stars.svg";
import avatar1 from "@/public/figma/hero-avatar-1.webp";
import avatar2 from "@/public/figma/hero-avatar-2.webp";
import dashboard from "@/public/figma/hero-dashboard.webp";

/*
 * Figma 1:1649 — built in CSS rather than exported, so a decorative layer never becomes the LCP element.
 * 64px cells with a 1px rgba(208,213,221,0.8) right/bottom stroke; grid content is offset (-240, +1),
 * so lines fall at x ≡ 15 and y ≡ 0 (mod 64). Filled cells use #e6e6e6 (= border token).
 * Rows 0 and 1 use lower stroke opacity (0.08 / 0.48 of 0.8) over part of their width — reproduced with white
 * veils (page background is white). The Blocks frame also strokes its top edge at y=1.
 * Alpha mask: radial ellipse 686.346 × 1315 at (720, 125), opaque to 32%, clear at 95.3125%.
 * The whole frame is at 32% opacity.
 */
const patternFilledCells: ReadonlyArray<readonly [number, number]> = [
  [16, 65],
  [272, 129],
  [976, 129],
  [1360, 129],
  [144, 321],
  [1040, 321],
  [1296, 449],
  [208, 513],
  [912, 513],
  [1104, 577],
  [1296, 641],
  [16, 705],
  [336, 705],
  [1168, 705],
  [528, 769],
  [144, 833],
  [656, 833],
  [1296, 833],
  [-48, 897],
  [400, 897],
  [1168, 897],
];

export function HeroBackground() {
  return (
    <GridPattern
      className="top-0"
      height={916}
      cells={patternFilledCells}
      gridTop={1}
      gridPosition="16px 0"
      mask="radial-gradient(686.346px 1315px at 720px 125px, #000 32%, transparent 95.3125%)"
    >
      <span className="absolute top-px left-[144px] h-16 w-[1216px] bg-surface opacity-90" />
      <span className="absolute top-[65px] left-[80px] h-16 w-[1216px] bg-surface opacity-40" />
      <span className="absolute inset-x-0 top-px h-px bg-[rgba(208,213,221,0.8)]" />
    </GridPattern>
  );
}

/*
 * Inline headline elements are sized in `em` so they track the fluid display size.
 * Figma @64px: bolt tile 52px (0.8125em) with 12px padding, avatars 48px (0.75em) overlapping 12px.
 * Side gaps calibrated against the Figma render's ink positions: bolt 9.8px left (0.153em) /
 * 7.8px right (0.122em); the avatar pill sits flush against the words and ~3px below centre.
 */
function BoltBadge() {
  return (
    <span
      aria-hidden="true"
      className="mr-[0.122em] ml-[0.153em] inline-flex size-[0.8125em] items-center justify-center rounded-full border border-ink/4 bg-surface align-middle drop-shadow-[8px_8px_20px_rgba(99,59,192,0.16)]"
    >
      <Image src={bolt} alt="" width={28} height={28} unoptimized className="size-[0.4375em]" />
    </span>
  );
}

function TeamAvatars() {
  return (
    <span
      aria-hidden="true"
      className="relative top-[0.047em] inline-flex items-center rounded-full bg-surface p-[0.0625em] align-middle drop-shadow-[8px_8px_20px_rgba(99,59,192,0.04)]"
    >
      <Avatar src={avatar1} alt="" className="-mr-[0.1875em] size-[0.75em]" />
      <Avatar src={avatar2} alt="" className="-mr-[0.1875em] size-[0.75em]" />
      {/* Figma exports the "+" tile with its blur/shadow canvas: 176px around a 48px circle offset 56px. */}
      <span className="relative size-[0.75em] shrink-0">
        <Image
          src={avatarPlus}
          alt=""
          width={176}
          height={176}
          unoptimized
          className="absolute top-[-0.875em] left-[-0.875em] size-[2.75em] max-w-none"
        />
      </span>
    </span>
  );
}

export function Hero() {
  const { announcement, headline } = hero;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip py-16">
      <div className="container-site flex flex-col items-center gap-16">
        <div className="flex w-full max-w-[681px] flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <Link
                href={announcement.href}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary-border bg-primary-tint py-1 pr-2 pl-1 transition-colors hover:bg-primary-soft"
              >
                <Badge variant="chip">
                  <Image src={stars} alt="" width={16} height={16} unoptimized />
                  {announcement.badge}
                </Badge>
                <span className="inline-flex min-w-0 items-center gap-1 text-left text-sm leading-[18px] font-medium text-primary-ink">
                  {announcement.text}
                  <Image src={arrowRightSm} alt="" width={16} height={16} unoptimized className="shrink-0" />
                </span>
              </Link>

              {/*
                Figma: 64/76, -1.28px tracking. Gaps are inline elements, never spaces; sr-only spaces keep the accessible text intact.
                pb-0.5 + the CTA block's -mt-px reproduce Figma's rendered positions (its text box is 155px, not 2×76).
              */}
              <h1 id="hero-title" className="pb-0.5 text-display leading-[1.1875] font-bold tracking-[-0.02em] text-ink">
                {headline.beforeIcon}
                <span className="sr-only"> </span>
                <BoltBadge />
                {headline.afterIcon}{" "}
                {/* ≥768 keep Figma's two-line composition: "Streamline ⚡ work for / team 👥 productivity". */}
                <br className="hidden md:inline" />
                {headline.beforeAvatars}
                <span className="sr-only"> </span>
                <TeamAvatars />
                {headline.afterAvatars}
              </h1>
            </div>
            {/* Figma box is 637px; the approved "tracking" copy fix needs the full 681px column to stay on 2 lines. */}
            <p className="max-w-[681px] text-lead text-ink-subtle">{hero.lead}</p>
          </div>

          <div className="-mt-px flex w-full flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-[18px] md:w-auto md:flex-row">
              <Button
                href={hero.primaryCta.href}
                size="lg"
                className="w-full md:w-auto"
                rightIcon={<Image src={arrowRight} alt="" width={20} height={20} unoptimized />}
              >
                {hero.primaryCta.label}
              </Button>
              <Button
                href={hero.secondaryCta.href}
                variant="secondary"
                size="lg"
                className="w-full md:w-auto"
                leftIcon={<Image src={play} alt="" width={24} height={24} unoptimized />}
              >
                {hero.secondaryCta.label}
              </Button>
            </div>
            <p className="text-sm leading-[21px] text-ink-muted">{hero.note}</p>
          </div>
        </div>

        {/*
         * Figma 1:2374 exported @2x (2448×1584). ≥768: scales with the column up to 1224px.
         * <768: kept at a readable 720px, bleeding off the right edge with a fade instead of shrinking.
         */}
        <div className="w-[calc(100%+var(--gutter))] self-start overflow-hidden rounded-l-[24px] [mask-image:linear-gradient(to_right,black_70%,transparent)] md:w-full md:max-w-[1224px] md:self-center md:rounded-[24px] md:shadow-[-12px_-12px_64px_0_rgba(0,0,0,0.06),12px_12px_64px_0_rgba(0,0,0,0.06)] md:[mask-image:none]">
          <Image
            src={dashboard}
            alt={hero.dashboardAlt}
            width={1224}
            height={792}
            // Not preloaded: the mobile LCP is the H1, so this must not compete with the font/CSS.
            loading="eager"
            fetchPriority="auto"
            quality={90}
            // <768: 720 CSS px wide but mostly off-canvas; 420px keeps ≤2x phones on the 750w variant.
            sizes="(min-width: 1288px) 1224px, (min-width: 768px) calc(100vw - 64px), 420px"
            className="h-auto w-[720px] max-w-none md:w-full md:max-w-full"
          />
        </div>
      </div>
    </section>
  );
}
