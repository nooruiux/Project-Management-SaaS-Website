import { routes } from "@/content/routes";

export type NavLink = {
  label: string;
  href: string;
  badge?: string;
};

export type NavItem = NavLink & {
  /** Items with a chevron in Figma; their menu reuses the matching footer column's links. */
  menu?: NavLink[];
};

export type FooterColumn = {
  title: string;
  links: NavLink[];
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "x" | "linkedin" | "facebook" | "github";
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Task Management", href: routes.features },
      { label: "Dashboard & Reporting", href: routes.deliverProjects },
      { label: "WorkUp CRM", href: routes.comingSoon },
      { label: "Automations", href: routes.strategicPlanning },
      { label: "AI Chatbot", href: routes.comingSoon },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Project Management", href: routes.deliverProjects },
      { label: "Product Development", href: routes.comingSoon },
      { label: "Operation", href: routes.comingSoon },
      { label: "Sales & Marketing", href: routes.comingSoon },
      { label: "Human Resources", href: routes.comingSoon },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Customer Stories", href: routes.testimonials },
      { label: "Webinars", href: routes.comingSoon },
      { label: "Video Tutorials", href: routes.comingSoon },
      { label: "Careers", href: routes.comingSoon, badge: "New" },
      { label: "Blog", href: routes.comingSoon },
      { label: "Support Services", href: routes.comingSoon },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms and Conditions", href: routes.comingSoon },
      { label: "Privacy Policy", href: routes.comingSoon },
      { label: "Cookies Policy", href: routes.comingSoon },
    ],
  },
];

const menuFor = (title: string) => footerColumns.find((c) => c.title === title)?.links;

export const primaryNav: NavItem[] = [
  { label: "Product", href: routes.comingSoon, menu: menuFor("Product") },
  { label: "Solutions", href: routes.comingSoon, menu: menuFor("Solutions") },
  { label: "Resources", href: routes.comingSoon, menu: menuFor("Resources") },
  { label: "Pricing", href: routes.comingSoon },
  { label: "Blog", href: routes.comingSoon },
];

export const authNav = {
  login: { label: "Login", href: routes.comingSoon },
  cta: { label: "Start free trial", href: routes.comingSoon },
} satisfies Record<string, NavLink>;

// TODO: social URLs — icons are hidden in the footer until real profile links exist.
export const socialLinks: SocialLink[] = [
  { label: "WorkUp on X", href: routes.comingSoon, icon: "x" },
  { label: "WorkUp on LinkedIn", href: routes.comingSoon, icon: "linkedin" },
  { label: "WorkUp on Facebook", href: routes.comingSoon, icon: "facebook" },
  { label: "WorkUp on GitHub", href: routes.comingSoon, icon: "github" },
];
