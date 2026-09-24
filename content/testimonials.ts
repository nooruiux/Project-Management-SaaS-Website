import type { StaticImageData } from "next/image";
import esther from "@/public/figma/testimonial-esther.webp";
import leslie from "@/public/figma/testimonial-leslie.webp";
import ralph from "@/public/figma/testimonial-ralph.webp";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Figma avatar export (includes its 1.5px ring). */
  avatar: StaticImageData;
};

export const testimonials = {
  title: { before: "Trusted by innovators", highlight: "worldwide" },
  description: "Real stories, real success: hear from our satisfied clients",
  items: [
    {
      quote:
        "Partnering with WorkUp has completely revolutionized our approach to project management. From day one, their team invested time in understanding our specific challenges and developed customized strategies that fit our workflow perfectly. Before we started working with WorkUp, we struggled with disorganization and missed deadlines, but now we feel empowered and in control of our projects. Their innovative tools and dedicated support have made all the difference for us!",
      name: "Esther Howard",
      role: "CEO, Castle Soft",
      avatar: esther,
    },
    {
      quote:
        "WorkUp has completely changed the way we handle cybersecurity. Their personalized solutions not only secured our sensitive information but also fueled our expansion. Highly recommend their services!",
      name: "Ralph Edwards",
      role: "Founder, Blogbyte",
      avatar: ralph,
    },
    {
      quote:
        "Partnering with WorkUp has transformed our cybersecurity strategy. Their bespoke approaches have not only protected our assets but also enhanced our operational efficiency. Truly a game changer!",
      name: "Leslie Alexander",
      // Figma: "Hubspot" — brand casing fixed.
      role: "Project Manager, HubSpot",
      avatar: leslie,
    },
  ] satisfies Testimonial[],
  prevLabel: "Previous testimonial",
  nextLabel: "Next testimonial",
};
