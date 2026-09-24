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
      { label: "Task Management", href: "#" },
      { label: "Dashboard & Reporting", href: "#" },
      { label: "WorkUp CRM", href: "#" },
      { label: "Automations", href: "#" },
      { label: "AI Chatbot", href: "#" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Project Management", href: "#" },
      { label: "Product Development", href: "#" },
      { label: "Operation", href: "#" },
      { label: "Sales & Marketing", href: "#" },
      { label: "Human Resources", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Customer Stories", href: "#" },
      { label: "Webinars", href: "#" },
      { label: "Video Tutorials", href: "#" },
      { label: "Careers", href: "#", badge: "New" },
      { label: "Blog", href: "#" },
      { label: "Support Services", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms and Conditions", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookies Policy", href: "#" },
    ],
  },
];

const menuFor = (title: string) => footerColumns.find((c) => c.title === title)?.links;

export const primaryNav: NavItem[] = [
  { label: "Product", href: "#", menu: menuFor("Product") },
  { label: "Solutions", href: "#", menu: menuFor("Solutions") },
  { label: "Resources", href: "#", menu: menuFor("Resources") },
  { label: "Pricing", href: "#" },
  { label: "Blog", href: "#" },
];

export const authNav = {
  login: { label: "Login", href: "#" },
  cta: { label: "Start free trial", href: "#" },
} satisfies Record<string, NavLink>;

export const socialLinks: SocialLink[] = [
  { label: "WorkUp on X", href: "#", icon: "x" },
  { label: "WorkUp on LinkedIn", href: "#", icon: "linkedin" },
  { label: "WorkUp on Facebook", href: "#", icon: "facebook" },
  { label: "WorkUp on GitHub", href: "#", icon: "github" },
];
