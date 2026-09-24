export const footer = {
  newsletter: {
    title: "Join Our Newsletter",
    description: "Subscribe to our newsletter for expert tips, industry updates, marketing insights.",
    label: "Email address",
    placeholder: "Enter your email address",
    submitLabel: "Subscribe",
    // Validation / status microcopy (not in Figma — needed for accessible form states).
    errorEmpty: "Enter your email address.",
    errorInvalid: "Enter a valid email address, like name@company.com.",
    submitting: "Subscribing…",
    pending: "Almost there! Check your inbox and confirm your subscription.",
    exists: "You're already subscribed — thanks for being with us!",
    rateLimited: "Too many attempts. Please try again in a few minutes.",
    unavailable: "Newsletter sign-up is temporarily unavailable. Please try again later.",
    error: "Something went wrong. Please try again.",
  },
  // Figma reads "© 2025"; the year is rendered from the build date so it never goes stale.
  copyright: (year: number) => `© ${year} WorkUp. All rights reserved.`,
};
