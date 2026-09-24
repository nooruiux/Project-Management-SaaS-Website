import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { Toggle } from "@/components/ui/toggle";
import { deliverProjects } from "@/content/deliver-projects";
import { cn } from "@/lib/utils";
import gradientFrame from "@/public/figma/deliver-gradient.svg";
import { TaskTable } from "./task-table";

function CardText({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-2xl leading-8 font-semibold text-ink">{title}</h3>
      <p className="font-body text-base leading-6 text-ink-muted">{description}</p>
    </div>
  );
}

/*
 * Figma 1:2754 — 64px vertical padding; 650px header (H2 540px, gradient on "projects"); 1104px content:
 * two 540×384 cards 24px apart, then the task table 24px below.
 * Card A: toggle list built in code at the mockup's 0.894 scale (Inter 14.308/21.462, 32×18 switches),
 * panel 160px from the top and clipped 3px by the card. Card B: @2x export of the chart + meeting card.
 */
export function DeliverProjects() {
  const { title, description, measure, efficiency } = deliverProjects;

  return (
    <section aria-labelledby="deliver-title" className="py-16">
      <div className="container-site">
        <div className="mx-auto flex max-w-[1104px] flex-col items-center gap-16">
          <SectionHeading
            id="deliver-title"
            title={
              <>
                {title.before}{" "}
                <span className="bg-[linear-gradient(98.23deg,#834eff_44.416%,#ff1200_69.928%)] bg-clip-text text-transparent">
                  {title.highlight}
                </span>{" "}
                {title.after}
              </>
            }
            description={description}
            titleClassName="max-w-[13.5em] tracking-normal"
            // 650px Figma box → 694px: the approved longer copy needs it to stay on 2 lines.
            descriptionClassName="max-w-[694px] text-base leading-6 text-ink-muted"
          />

          <div className="flex w-full flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Card A — "Measure, learn, and improve" */}
              <article className="relative isolate flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-ink/12 bg-accent-blue-soft px-5 pt-[31px] shadow-[12px_12px_60px_0_rgba(0,0,0,0.06)] md:px-[31px] lg:h-[384px]">
                {/* Decorative inner glow frame (Figma 1:2761), bleeding 62px past the card box. */}
                <Image
                  src={gradientFrame}
                  alt=""
                  aria-hidden="true"
                  width={688}
                  height={540}
                  unoptimized
                  className="pointer-events-none absolute top-[-63.2px] left-[-63.2px] -z-10 h-[540.39px] w-[688.39px] max-w-none"
                />
                <div className="w-full max-w-[471px]">
                  <CardText title={measure.title} description={measure.description} />
                </div>
                <ul className="flex h-[227px] w-[285.08px] shrink-0 flex-col gap-1 rounded-t-md bg-surface px-4 py-3 font-ui shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
                  {measure.toggles.map((option) => {
                    const labelId = `toggle-${option.label.toLowerCase()}`;
                    return (
                      <li key={option.label} className="flex h-[36.31px] items-center justify-between">
                        <span className="flex items-center gap-3">
                          <Image
                            src={option.icon}
                            alt=""
                            aria-hidden="true"
                            width={21}
                            height={21}
                            unoptimized
                            className={cn("size-[21.462px]", option.mirrorIcon && "-scale-x-100")}
                          />
                          <span id={labelId} className="text-[14.308px] leading-[21.462px] font-medium text-ink">
                            {option.label}
                          </span>
                        </span>
                        <Toggle size="mockup" defaultChecked={option.on} aria-labelledby={labelId} />
                      </li>
                    );
                  })}
                </ul>
              </article>

              {/* Card B — "Enhance work efficiency" */}
              <article className="flex flex-col overflow-hidden rounded-xl border border-accent-green/12 bg-accent-green-soft pt-[31px] lg:h-[384px]">
                <div className="px-5 md:px-[31px] lg:max-w-[530px]">
                  <CardText title={efficiency.title} description={efficiency.description} />
                </div>
                <Image
                  src={efficiency.mockup.src}
                  alt={efficiency.mockup.alt}
                  width={538}
                  height={261}
                  quality={90}
                  sizes="(min-width: 1280px) 538px, (min-width: 1024px) 45vw, 100vw"
                  className="mt-[2px] h-auto w-full max-w-[538px] self-center lg:max-w-none"
                />
              </article>
            </div>

            <TaskTable />
          </div>
        </div>
      </div>
    </section>
  );
}
