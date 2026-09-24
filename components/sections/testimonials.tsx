import { GridPattern } from "@/components/ui/grid-pattern";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/content/testimonials";
import { TestimonialsCarousel } from "./testimonials-carousel";

// Figma 1:3054 pattern: content offset (-240, -120) → vertical lines x ≡ 15, horizontal y ≡ 7 (mod 64);
// circular alpha mask r=720 centred at (720, 570); frame 1440×696, 260px below the section content top.
const testimonialCells = [
  [16, -56], [272, 8], [976, 8], [1360, 8], [144, 200], [1040, 200], [1296, 328], [208, 392],
  [912, 392], [1104, 456], [1296, 520], [16, 584], [336, 584], [1168, 584], [528, 648],
] as const;

/*
 * Figma 1:3708 — 1280px column: header (H2 + subtitle, 24px apart) → 64px → cards (616px) → 48px → arrows.
 * 64px above (after Integrations), 128px below (before the footer).
 */
export function Testimonials() {
  const { title, description } = testimonials;

  return (
    <section aria-labelledby="testimonials-title" className="relative isolate pt-16 pb-32">
      <GridPattern
        className="top-[324px]"
        height={696}
        cells={testimonialCells}
        gridPosition="16px 8px"
        mask="radial-gradient(circle 720px at 720px 570px, #000 0%, transparent 100%)"
      />
      <div className="container-site flex flex-col items-center gap-16">
        <SectionHeading
          id="testimonials-title"
          title={
            <>
              {title.before}{" "}
              <span className="bg-[linear-gradient(102.26deg,#834eff_64.347%,#ff1200_101.46%)] bg-clip-text text-transparent">
                {title.highlight}
              </span>
            </>
          }
          description={description}
          // Figma: "Text lg/Medium" (a Montserrat style) → Inter Medium 18/28 per the body-copy rule.
          descriptionClassName="text-lg leading-7 font-medium text-ink-muted"
        />
        <TestimonialsCarousel />
      </div>
    </section>
  );
}
