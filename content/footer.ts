export const footer = {
  newsletter: {
    title: "Join Our Newsletter",
    description: "Subscribe to our newsletter for expert tips, industry updates, marketing insights.",
    label: "Email address",
    placeholder: "Enter your email address",
    submitLabel: "Subscribe",
    // Validation / confirmation microcopy (not in Figma — needed for accessible form states).
    errorEmpty: "Enter your email address.",
    errorInvalid: "Enter a valid email address, like name@company.com.",
    success: "Thanks for subscribing! Check your inbox to confirm.",
  },
  // Figma reads "© 2025"; the year is rendered from the build date so it never goes stale.
  copyright: (year: number) => `© ${year} WorkUp. All rights reserved.`,
};
