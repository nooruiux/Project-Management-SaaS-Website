import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { footer } from "@/content/footer";
import { footerColumns, socialLinks, type SocialLink } from "@/content/navigation";
import facebook from "@/public/figma/social-facebook.svg";
import github from "@/public/figma/social-github.svg";
import linkedin from "@/public/figma/social-linkedin.svg";
import x from "@/public/figma/social-x.svg";
import { NewsletterForm } from "./newsletter-form";

const socialIcons: Record<SocialLink["icon"], StaticImageData> = { x, linkedin, facebook, github };

/*
 * Figma 1:3762 — full-width #03bfff band; 1280px content, 64px top / 48px bottom, 48px to the divider.
 * Top row: 440px brand + newsletter column, then four 230px link columns (Inter Bold 16 titles, Inter 16
 * links, 12px apart). Bottom: ink/8 divider, 24px, copyright + social icons (800px apart at 1440).
 * Text is ink @ 80% (5.7:1 on the cyan; the opaque ink-muted token would be 4.4:1).
 */
export function Footer() {
  const { newsletter } = footer;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-accent-cyan font-body text-ink/80">
      <div className="container-site flex flex-col gap-12 pt-16 pb-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-[440px_repeat(4,minmax(0,1fr))] xl:gap-0 min-[90rem]:grid-cols-[440px_230px_230px_230px_auto]">
          <div className="flex flex-col gap-10 md:col-span-2 xl:col-span-1">
            {/* -my-0.5: keeps the 44px tap target while occupying Figma's 40px row. */}
            <Logo wordmarkClassName="text-ink/80" className="-my-0.5" />
            <div className="flex flex-col gap-3 pb-5">
              <h2 className="font-sans text-xl leading-[30px] font-semibold text-ink">{newsletter.title}</h2>
              <div className="flex flex-col gap-5">
                <p className="max-w-[328px] text-base leading-6">{newsletter.description}</p>
                <NewsletterForm />
              </div>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 md:col-span-2 md:grid-cols-4 xl:contents">
            {footerColumns.map((column) => (
              <div key={column.title} className="flex min-w-24 flex-col gap-4">
                <h2 className="text-base leading-6 font-bold">{column.title}</h2>
                {/* <1280 (touch sizes): 44px tap targets; ≥1280: Figma's 24px rows, 12px apart. */}
                <ul className="flex flex-col xl:gap-3">
                  {column.links.map((link) => (
                    <li key={link.label} className="flex items-center gap-3">
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 min-w-11 items-center text-base leading-6 underline-offset-4 hover:text-ink hover:underline xl:min-h-0 xl:min-w-0"
                      >
                        {link.label}
                      </Link>
                      {link.badge ? (
                        <Badge variant="new" className="w-11">
                          {link.badge}
                        </Badge>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col-reverse gap-6 border-t border-ink/8 pt-6 md:flex-row md:items-center md:justify-between min-[90rem]:justify-start min-[90rem]:gap-[800px]">
          <p className="text-base leading-6">{footer.copyright(year)}</p>
          <ul className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <li key={social.icon} className="flex">
                {/* 24px icon with a 44px hit area that doesn't change the layout. */}
                <Link
                  href={social.href}
                  aria-label={social.label}
                  className="-m-2.5 inline-flex rounded-full p-2.5 transition-opacity hover:opacity-70"
                >
                  <Image src={socialIcons[social.icon]} alt="" width={24} height={24} unoptimized />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
