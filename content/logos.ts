import type { StaticImageData } from "next/image";
import boltshift from "@/public/figma/logo-boltshift.svg";
import featherdev from "@/public/figma/logo-featherdev.svg";
import globalbank from "@/public/figma/logo-globalbank.svg";
import lightbox from "@/public/figma/logo-lightbox.svg";
import nietzsche from "@/public/figma/logo-nietzsche.svg";
import spherule from "@/public/figma/logo-spherule.svg";

export type CompanyLogo = {
  name: string;
  src: StaticImageData;
  /** Figma width at 44px tall. */
  width: number;
};

export const logoCloud = {
  caption: "Join 1,000+ companies already growing",
  logos: [
    { name: "Boltshift", src: boltshift, width: 155.833 },
    { name: "Lightbox", src: lightbox, width: 153.083 },
    { name: "FeatherDev", src: featherdev, width: 181.5 },
    { name: "Spherule", src: spherule, width: 152.167 },
    { name: "GlobalBank", src: globalbank, width: 180.583 },
    { name: "Nietzsche", src: nietzsche, width: 166.833 },
  ] satisfies CompanyLogo[],
};
