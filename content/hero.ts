import { routes } from "@/content/routes";

export type HeroContent = {
  announcement: { badge: string; text: string; href: string };
  /** Headline split around the two inline elements (icon badge, avatar stack) and Figma's line break. */
  headline: { beforeIcon: string; afterIcon: string; beforeAvatars: string; afterAvatars: string };
  lead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  note: string;
  dashboardAlt: string;
};

export const hero: HeroContent = {
  announcement: { badge: "Update", text: "Connect all your tasks, docs, people", href: routes.integrations },
  headline: {
    beforeIcon: "Streamline",
    afterIcon: "work for",
    beforeAvatars: "team",
    afterAvatars: "productivity",
  },
  lead: "Boost team collaboration and communication. Our platform provides a central hub for organizing tasks, tracking progress, and staying in sync.",
  primaryCta: { label: "Get started", href: routes.comingSoon },
  secondaryCta: { label: "Watch demo", href: routes.comingSoon },
  note: "Start 14-day trial, no credit card required.",
  dashboardAlt:
    "WorkUp project timeline: Dashboard Design, App Design, UX Research, Landing Page and Project Meeting scheduled across the week, with assignees and progress for each task.",
};
