import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { strategicPlanning } from "@/content/strategic-planning";
import arrowRight from "@/public/figma/icon-arrow-right.svg";

/*
 * Figma 1:2599 — 1240×550 cyan card (radius 24), 64px above/below. Content row 1120px wide, 68px from
 * the top: 474px text column, 100px gap, 546×414 task-card stack. The stack's skewed cards + shadows
 * render 617×491 starting (-35.7, -30.3) from its box — exported @2x from 1:2628 with that bleed.
 * <1280 the card stacks (text above the visual) with the container's 20/32px gutters.
 */
export function StrategicPlanning() {
  const { title, description, capabilities, cta, mockup } = strategicPlanning;

  return (
    <section aria-labelledby="strategic-planning-title" className="py-16">
      <div className="container-site">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-10 overflow-hidden rounded-[24px] bg-accent-cyan px-5 py-10 md:px-10 md:py-12 xl:h-[550px] xl:flex-row xl:items-start xl:gap-[100px] xl:px-[min(60px,calc((100%-1120px)/2))] xl:pt-[68px] xl:pb-0">
          <div className="flex max-w-[560px] flex-col items-start gap-10 xl:w-[474px] xl:max-w-none xl:shrink-0">
            <div className="flex flex-col gap-6">
              <SectionHeading
                id="strategic-planning-title"
                align="left"
                className="gap-4"
                title={title}
                description={description}
                // Figma: 40/50, no letter-spacing.
                titleClassName="leading-[1.25] tracking-normal"
                // ink @ 80% (not the opaque ink-muted token): 5.7:1 on the cyan vs 4.4:1.
                // Lead may run 14px into the 100px column gap (488px) so "WorkUp’s" copy keeps Figma's 2 lines.
                descriptionClassName="text-base leading-6 text-ink/80 xl:w-[488px] xl:max-w-none"
              />
              <ul className="flex max-w-[474px] flex-wrap gap-4">
                {capabilities.map((capability) => (
                  // Figma strokes don't add to size: 16/8px padding minus the 1.3px border keeps chips at Figma width.
                  <li
                    key={capability.label}
                    className="inline-flex items-center gap-2 rounded-[32px] border-[1.3px] border-primary/40 px-[14.7px] py-[6.7px] text-lg leading-[25px] font-medium text-ink"
                  >
                    <Image src={capability.icon} alt="" width={20} height={20} unoptimized />
                    {capability.label}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              href={cta.href}
              className="max-md:w-full"
              rightIcon={<Image src={arrowRight} alt="" width={20} height={20} unoptimized />}
            >
              {cta.label}
            </Button>
          </div>

          <div className="relative w-full xl:h-[414px] xl:w-[546px] xl:shrink-0">
            <Image
              src={mockup.src}
              alt={mockup.alt}
              width={617}
              height={491}
              quality={90}
              sizes="(min-width: 1280px) 618px, (min-width: 768px) 618px, 100vw"
              className="mx-auto h-auto w-full max-w-[617.45px] xl:absolute xl:top-[-30.32px] xl:left-[-35.7px] xl:w-[617.45px] xl:max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
