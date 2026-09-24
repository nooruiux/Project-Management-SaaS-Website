import type { StaticImageData } from "next/image";
import editIcon from "@/public/figma/icon-edit.svg";
import fileIcon from "@/public/figma/icon-file.svg";
import layersIcon from "@/public/figma/icon-layers.svg";
import starsIcon from "@/public/figma/icon-stars-alt.svg";
import tagIcon from "@/public/figma/icon-tag.svg";
import avatar1 from "@/public/figma/table-avatar-1.webp";
import avatar2 from "@/public/figma/table-avatar-2.webp";
import avatar3 from "@/public/figma/table-avatar-3.webp";
import avatar4 from "@/public/figma/table-avatar-4.webp";
import avatar5 from "@/public/figma/table-avatar-5.webp";
import avatar6 from "@/public/figma/table-avatar-6.webp";
import efficiencyMockup from "@/public/figma/deliver-efficiency-mockup.webp";

export type ToggleOption = { label: string; icon: StaticImageData; on: boolean; mirrorIcon?: boolean };
export type Priority = "High" | "Normal" | "Medium" | "Low";
export type TaskRow = {
  title: string;
  /** Nesting depth (Figma indents 0 / 0 / 28 / 56px). */
  depth: number;
  expanded: boolean;
  done: boolean;
  assignees: StaticImageData[];
  due: string;
  priority: Priority;
  note: string;
};

export const deliverProjects = {
  title: { before: "Deliver more", highlight: "projects", after: "faster and on budget" },
  // Approved copy change (was "…to remove the busy work and efficient execution!").
  description:
    "Everyone moves faster when project planning and cross-team collaboration happens in one platform. Add in automations to remove the busy work, and focus on efficient execution.",
  measure: {
    title: "Measure, learn, and improve",
    // Figma: "WorkUp believe…" — subject–verb agreement fixed.
    description:
      "WorkUp believes in the power of data. Our tools provide real-time insights to help you track progress, identify bottlenecks.",
    toggles: [
      { label: "Projects", icon: layersIcon, on: true },
      { label: "Notes", icon: fileIcon, on: false },
      { label: "Tag", icon: tagIcon, on: false, mirrorIcon: true },
      { label: "Highlights", icon: editIcon, on: true },
      { label: "Insights", icon: starsIcon, on: true },
    ] satisfies ToggleOption[],
  },
  efficiency: {
    title: "Enhance work efficiency",
    description:
      "Work more effectively by creating a dedicated project workspace. It helps your team to seamlessly share files.",
    mockup: {
      src: efficiencyMockup,
      alt: "“Team Meeting” card for the SaaS Design team with four attendees and a Swipe to call button, next to an Average work time chart for week 1 rising from Monday to Saturday.",
    },
  },
  table: {
    group: "To do",
    count: 2,
    columns: { project: "Project", assigned: "Assigned", due: "Due date", priority: "Priority", note: "Note" },
    rows: [
      {
        // Figma: "saas" — casing fixed.
        title: "Design fintech SaaS landing page",
        depth: 0, expanded: false, done: false,
        assignees: [avatar1, avatar2], due: "Oct 20", priority: "High", note: "Ash to sync with Br...",
      },
      {
        title: "Email campaign template",
        depth: 0, expanded: true, done: false,
        assignees: [avatar3, avatar4], due: "Oct 25", priority: "Normal", note: "Ash to sync with Br...",
      },
      {
        title: "Design an email new landing page",
        depth: 1, expanded: true, done: false,
        assignees: [avatar5], due: "Oct 28", priority: "Medium", note: "Ash to sync with Br...",
      },
      {
        title: "Highlight the benefits of the new design",
        depth: 2, expanded: false, done: true,
        assignees: [avatar6], due: "Oct 30", priority: "Low", note: "Ash to sync with Br...",
      },
    ] satisfies TaskRow[],
    addLabel: "Add project",
  },
};
