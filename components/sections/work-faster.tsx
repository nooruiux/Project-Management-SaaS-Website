import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { workFaster, type WorkCard } from "@/content/work-faster";
import { cn } from "@/lib/utils";

function CardText({ card }: { card: WorkCard }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-2xl leading-[34px] font-semibold text-ink">{card.title}</h3>
      <p className="font-body text-base leading-6 text-ink-muted max-xl:max-w-[34em] max-xl:text-pretty">{card.description}</p>
    </div>
  );
}

/*
 * Figma 1:2928 — 64px vertical padding, header → cards 64px, two 596×520 cards 24px apart (1216px row).
 * Card mockups are @2x Figma exports of the card content below the text (1:2934 / 1:3003, text cropped off).
 * Cards sit side by side from 1024px (columns ≥ 360px) and stack below that.
 */
export function WorkFaster() {
  const { title, description, cards } = workFaster;

  return (
    <section id="work-faster" aria-labelledby="work-faster-title" className="py-16 md:max-xl:py-20">
      <div className="container-site">
        <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-16">
          <SectionHeading
            id="work-faster-title"
            title={title}
            description={description}
            // Figma: no letter-spacing on this H2 (Features uses -2%).
            titleClassName="max-w-[11.6em] tracking-normal"
            descriptionClassName="max-w-[396px] text-base leading-6 text-ink-muted"
          />

          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Cyan card: text at (40, 41); the task-card stack is anchored bottom-right, 556px wide at desktop. */}
            <article className="flex flex-col overflow-hidden rounded-xl border border-accent-cyan-line bg-accent-cyan-soft pt-5 md:pt-6 xl:pt-10">
              {/* 39px + 1px border = Figma's 40px inset; 20/24px on phones/tablets. */}
              <div className="px-5 md:px-6 xl:px-[39px]">
                <CardText card={cards.sync} />
              </div>
              <Image
                src={cards.sync.mockup.src}
                alt={cards.sync.mockup.alt}
                width={556}
                height={321}
                quality={90}
                // Rendered min(556px, card − 38px) but never below 420px.
                sizes="(min-width: 1280px) 556px, (min-width: 1024px) 45vw, (min-width: 480px) 556px, 420px"
                className={cn(
                  // Capped at the Figma size (the @2x source); never narrower than 420px so the card stays legible on phones.
                  "mt-[68px] h-auto w-[calc(100%-38px)] max-w-[556px] min-w-[420px] self-end",
                  "-mr-px -mb-px",
                  // <768: anchor left and run off the right edge (same treatment as the hero dashboard).
                  "max-md:ml-5 max-md:self-start",
                )}
              />
            </article>

            {/* Lavender card: text at (40, 40); the collaboration map starts 67px below it and overhangs 4.5px right. */}
            <article className="flex flex-col overflow-hidden rounded-xl border border-primary/72 bg-primary-wash p-5 md:p-6 xl:px-[39px] xl:pt-[39px] xl:pb-[30px]">
              <CardText card={cards.collab} />
              <Image
                src={cards.collab.mockup.src}
                alt={cards.collab.mockup.alt}
                width={521}
                height={292}
                quality={90}
                sizes="(min-width: 1280px) 521px, (min-width: 1024px) 42vw, (min-width: 640px) 521px, calc(100vw - 72px)"
                className="mt-[67px] h-auto w-[calc(100%+4.5px)] max-w-[520.5px] self-center lg:self-start"
              />
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
