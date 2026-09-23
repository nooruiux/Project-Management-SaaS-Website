export type NavLink = {
  label: string;
  href: string;
  /** Top-level items rendered with a dropdown chevron in the navbar. */
  hasDropdown?: boolean;
  badge?: string;
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

export const primaryNav: NavLink[] = [
  { label: "Product", href: "#", hasDropdown: true },
  { label: "Solutions", href: "#", hasDropdown: true },
  { label: "Resources", href: "#", hasDropdown: true },
  { label: "Pricing", href: "#" },
  { label: "Blog", href: "#" },
];

export const authNav = {
  login: { label: "Login", href: "#" },
  // Figma copy reads "Start free trail" — kept verbatim pending client confirmation.
  cta: { label: "Start free trail", href: "#" },
} satisfies Record<string, NavLink>;

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

export const socialLinks: SocialLink[] = [
  { label: "WorkUp on X", href: "#", icon: "x" },
  { label: "WorkUp on LinkedIn", href: "#", icon: "linkedin" },
  { label: "WorkUp on Facebook", href: "#", icon: "facebook" },
  { label: "WorkUp on GitHub", href: "#", icon: "github" },
];
