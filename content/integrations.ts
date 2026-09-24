import type { StaticImageData } from "next/image";
import discord from "@/public/figma/integration-discord.svg";
import figma from "@/public/figma/integration-figma.svg";
import gmail from "@/public/figma/integration-gmail.svg";
import googleDocs from "@/public/figma/integration-google-docs.svg";
import mailchimp from "@/public/figma/integration-mailchimp.svg";
import microsoft from "@/public/figma/integration-microsoft.svg";
import notion from "@/public/figma/integration-notion.svg";
import sketch from "@/public/figma/integration-sketch.svg";
import slack from "@/public/figma/integration-slack.svg";
import zoom from "@/public/figma/integration-zoom.svg";

export type Integration = {
  name: string;
  logo: StaticImageData;
  /** Logo box inside the 72px tile (Figma). */
  size: [number, number];
  /** Tile top-left inside the 1240×704 card (Figma 1:2664). */
  position: [number, number];
};

export const integrations = {
  title: { before: "Boost productivity with powerful", highlight: "integrations" },
  description:
    "Connect your favorite tools and streamline your workflow. Our platform seamlessly integrates with a wide range of popular applications.",
  // Ordered roughly top-to-bottom, left-to-right so the <1024 grid reads naturally.
  items: [
    { name: "Microsoft", logo: microsoft, size: [40, 40], position: [385, 312] },
    { name: "Zoom", logo: zoom, size: [40, 40], position: [584, 333] },
    { name: "Sketch", logo: sketch, size: [44.189, 40], position: [768, 305] },
    { name: "Discord", logo: discord, size: [40, 31.094], position: [444, 449] },
    { name: "Gmail", logo: gmail, size: [40, 40], position: [720, 441] },
    { name: "Slack", logo: slack, size: [40, 40], position: [284, 500] },
    { name: "Notion", logo: notion, size: [40, 42.571], position: [889, 506] },
    { name: "Google Docs", logo: googleDocs, size: [33.058, 40], position: [394, 577] },
    { name: "Figma", logo: figma, size: [40, 40], position: [584, 553] },
    { name: "Mailchimp", logo: mailchimp, size: [40, 40], position: [773, 577] },
  ] satisfies Integration[],
  /** 5px #5f5f5f dots scattered on the orbits (Figma 1:2748–2753). */
  dots: [
    [493, 387], [402, 532], [722, 533], [482, 637], [657, 295], [942, 450],
  ] as const,
};
