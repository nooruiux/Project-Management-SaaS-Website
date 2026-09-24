import type { StaticImageData } from "next/image";
import alarmClock from "@/public/figma/feature-alarm-clock.webp";
import chart from "@/public/figma/feature-chart.webp";
import database from "@/public/figma/feature-database.webp";
import invoice from "@/public/figma/feature-invoice.webp";
import settings from "@/public/figma/feature-settings.webp";
import users from "@/public/figma/feature-users.webp";

export type Feature = {
  title: string;
  description: string;
  icon: StaticImageData;
};

export const features = {
  heading: {
    before: "Ultimate",
    /** Rendered with the Figma purple → red gradient. */
    highlight: "solution",
    after: "for your business needs",
  },
  // Figma: "…with Workup . Our platform provides a central hub for organizing tasks, track progress."
  // Fixed: brand casing, stray space, and the list grammar.
  description:
    "Manage your comprehensive project with WorkUp. Our platform provides a central hub for organizing tasks and tracking progress.",
  items: [
    {
      title: "Clarity and accountability",
      description: "Deepen insights, empower pitches, and build stronger client relationships.",
      icon: database,
    },
    {
      title: "Time Tracking for Efficiency",
      // Figma: "optimises" — US spelling to match the rest of the page ("organizing").
      description: "Precision monitoring optimizes time for efficient workflows and timely projects.",
      icon: alarmClock,
    },
    {
      title: "Data-Driven Insights",
      description: "Fuel marketing prowess with insightful analytics & robust reporting capabilities.",
      icon: chart,
    },
    {
      title: "Real-time Collaboration",
      description: "Boost collaboration with shared workspaces for smooth design progress.",
      icon: users,
    },
    {
      title: "Workflow Automation",
      description: "Automate, save time, reduce errors, and streamline operations efficiently.",
      icon: settings,
    },
    {
      title: "Invoicing and Payment Tracking",
      description: "Simplify invoicing, track payments, gain insights effortlessly.",
      icon: invoice,
    },
  ] satisfies Feature[],
};
