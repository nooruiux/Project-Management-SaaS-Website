import type { StaticImageData } from "next/image";
import collabMockup from "@/public/figma/work-collab-mockup.webp";
import tasksMockup from "@/public/figma/work-tasks-mockup.webp";

export type WorkCard = {
  title: string;
  description: string;
  mockup: { src: StaticImageData; alt: string };
};

export const workFaster = {
  title: "Do your most important work, faster",
  description: "From campaigns to operations and more, this is just the tip of the iceberg.",
  cards: {
    sync: {
      title: "Stay in sync on work with WorkUp",
      description:
        "Keep teams accountable by organizing projects and tasks in one place. Give everyone visibility into the work they need to do.",
      mockup: {
        src: tasksMockup,
        alt: "Task card “Salesforce website development”, tagged Development and Normal, due in 5 days with 3 attachments, assigned to two teammates and 5 others.",
      },
    },
    collab: {
      title: "Collab with team in real time",
      description:
        "Collaboration with teams accountable by organizing projects and tasks in one place. Give everyone visibility into the work.",
      mockup: {
        src: collabMockup,
        alt: "Team map connecting Ronald Richards (Wix Developer), Jenny Wilson (UI/UX Designer), Wade Warren (Developer) and Devon Lane (Programmer) through WorkUp.",
      },
    },
  } satisfies Record<string, WorkCard>,
};
