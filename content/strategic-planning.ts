import type { StaticImageData } from "next/image";
import chipCollab from "@/public/figma/icon-chip-collab.svg";
import chipFile from "@/public/figma/icon-chip-file.svg";
import chipUsers from "@/public/figma/icon-chip-users.svg";
import chipWorkflow from "@/public/figma/icon-chip-workflow.svg";
import tasksMockup from "@/public/figma/strategic-tasks-mockup.webp";

export type Capability = { label: string; icon: StaticImageData };

export const strategicPlanning = {
  title: "Strategic planning, smarter execution",
  // Figma: "…with Wrike’s intuitive features" — Wrike is another product; fixed to WorkUp.
  description:
    "Gain control of your project management with WorkUp’s intuitive features. Take advantage of critical time-saving automation.",
  capabilities: [
    { label: "Project Management", icon: chipFile },
    { label: "Team Management", icon: chipUsers },
    { label: "Collaboration", icon: chipCollab },
    { label: "Workflow Automation", icon: chipWorkflow },
  ] satisfies Capability[],
  cta: { label: "Get started", href: "#" },
  mockup: {
    src: tasksMockup,
    alt: "Three stacked task cards: 01 “Improve Fintech website’s UI design” (UI Improvement), 02 “Update Payment Gateway Integration” (Development, done) and 03 “Finance Website UX Research” (Research, done).",
  },
};
