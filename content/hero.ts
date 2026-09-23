export type HeroContent = {
  announcement: { badge: string; text: string; href: string };
  /** Headline split around the two inline elements (icon badge, avatar stack). */
  headline: { beforeIcon: string; betweenIconAndAvatars: string; afterAvatars: string };
  lead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  note: string;
};

export const hero: HeroContent = {
  announcement: { badge: "Update", text: "Connect all your tasks, docs, people", href: "#" },
  headline: {
    beforeIcon: "Streamline",
    betweenIconAndAvatars: "work for team",
    afterAvatars: "productivity",
  },
  lead: "Boost team collaboration and communication. Our platform provides a central hub for organizing tasks, track progress, and staying in sync.",
  primaryCta: { label: "Get started", href: "#" },
  secondaryCta: { label: "Watch demo", href: "#" },
  note: "Start 14-days trial, no credit card required.",
};
