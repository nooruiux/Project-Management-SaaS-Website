import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { features } from "@/content/features";

/*
 * Figma 1:1581 — 64px vertical padding, 1101px content column, heading block → grid 64px,
 * grid rows 64px apart, columns 88px apart. Figma's two rows are "hug" rows whose columns drift
 * ~13px apart; a real 3-column grid aligns them (matches row 2 exactly).
 */
export function Features() {
  const { heading, description, items } = features;

  // mt-1: Figma leaves a 4px gap between the logo cloud frame (ends y=1660) and this one (y=1664).
  return (
    <section aria-labelledby="features-title" className="mt-1 py-16">
      <div className="container-site">
        <div className="mx-auto flex max-w-[1101px] flex-col items-center gap-16">
          <SectionHeading
            id="features-title"
            className="max-w-[559px]"
            title={
              <>
                {heading.before}{" "}
                <span className="bg-[linear-gradient(97.07deg,#834eff_44.416%,#ff1200_69.928%)] bg-clip-text text-transparent">
                  {heading.highlight}
                </span>{" "}
                {heading.after}
              </>
            }
            description={description}
            // Figma's 559px box at 48px scaled to the 40px H2 token (≈466px) keeps its "…for / your business needs" break.
            titleClassName="max-w-[11.65em]"
            descriptionClassName="text-lg"
          />

          <ul className="grid w-full grid-cols-1 gap-x-[88px] gap-y-12 md:grid-cols-2 md:gap-y-16 xl:grid-cols-3">
            {items.map((item) => (
              <li key={item.title} className="flex flex-col gap-6">
                {/* 56px tile: 2.8px primary padding around the 50.4px Figma icon, radius 11.2px. */}
                <span className="inline-flex size-14 items-center justify-center rounded-[11.2px] bg-primary p-[2.8px]">
                  <Image src={item.icon} alt="" width={50} height={50} unoptimized className="size-[50.4px]" />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl leading-[30px] font-semibold text-ink">{item.title}</h3>
                  <p className="text-base leading-6 text-ink-subtle">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
