import type { StaticImageData } from "next/image";
import glyphtracker from "@/public/images/lab/glyphtracker.jpg";
import halden from "@/public/images/lab/halden.jpg";
import haldenDock from "@/public/images/lab/halden-dock.jpg";
import haldenException from "@/public/images/lab/halden-exception.jpg";
import kiln from "@/public/images/lab/kiln.jpg";
import kilnHeatmap from "@/public/images/lab/kiln-heatmap.jpg";
import kilnTrace from "@/public/images/lab/kiln-trace.jpg";
import moreiraHolm from "@/public/images/lab/moreira-holm.jpg";
import parity from "@/public/images/lab/parity.jpg";
import parityFooter from "@/public/images/lab/parity-footer.jpg";
import turndown from "@/public/images/lab/turndown.jpg";

export type LabImage = {
  src: StaticImageData;
  alt: string;
  /* Short name shown in the caption counter when an entry has several images. */
  label: string;
};

/* All images of one entry share an aspect ratio; the first sets the size. */
export type LabEntry = {
  number: string;
  name: string;
  category: string;
  images: LabImage[];
};

/* Self-initiated concepts. Every brand here is fictional. */
export const labEntries: LabEntry[] = [
  {
    number: "01",
    name: "Halden",
    category: "Logistics operations platform",
    images: [
      {
        src: halden,
        alt: "Halden lanes dashboard showing live shipping routes across the North Sea and Baltic, on a plaster wall in afternoon light.",
        label: "Lanes",
      },
      {
        src: haldenDock,
        alt: "Halden dock schedule for Gdańsk T2: six berths on a timeline with a now line at 13:40 and a suggestion to move MV Skagen to Berth 2.",
        label: "Docks",
      },
      {
        src: haldenException,
        alt: "Halden exception detail for a reefer container drifting above its temperature limit, with a six-hour chart, an event timeline and actions.",
        label: "Exception",
      },
    ],
  },
  {
    number: "02",
    name: "Turndown",
    category: "Evening routine app",
    images: [
      {
        src: turndown,
        alt: "Turndown brand board: a clay sphere on linen under the sign Evening service from 21:30, a folded-blanket app icon, door hangers reading Turndown please and Do not disturb, a phone preparing the bedroom, a bedroom poster reading Your room has been turned down, and a lock-screen notice.",
        label: "Overview",
      },
    ],
  },
  {
    number: "03",
    name: "Kiln",
    category: "Remote build cache",
    images: [
      {
        src: kiln,
        alt: "Kiln landing section: an isometric stack of build layers, the cached ones glowing acid green and the changed ones drawn as wireframes, above the headline Builds that start warm, CI stats and a terminal run.",
        label: "Landing",
      },
      {
        src: kilnTrace,
        alt: "Kiln build trace for build 4812: built in 48 seconds with 11 of 14 targets warm, a waterfall of targets with cached ones in acid green and three rebuilt ones in bone, and the critical path.",
        label: "Build trace",
      },
      {
        src: kilnHeatmap,
        alt: "Kiln cache page: 94.2% hit rate, 212 hours saved, a 30-day heatmap of hit rate per package, and the packages with the most cold starts with suggested fixes.",
        label: "Cache",
      },
    ],
  },
  {
    number: "04",
    name: "Moreira Holm",
    category: "Architecture practice",
    images: [
      {
        src: moreiraHolm,
        alt: "Moreira Holm brand board: gouache paintings of a sunlit room, white houses on a hillside and a stone stair, a wide logotype split by a solid bar, business cards with two studio addresses and a floor plan, and a palette named Cal, Ocre, Oliva and Ardósia.",
        label: "Overview",
      },
    ],
  },
  {
    number: "05",
    name: "Parity",
    category: "Design QA for pull requests",
    images: [
      {
        src: parity,
        alt: "Parity website hero, Ship the design you signed off, above a compare view that splits a payment card between its Figma design and production, with the drifted button marked in magenta, a list of three drifts and a pull request check.",
        label: "Hero",
      },
      {
        src: parityFooter,
        alt: "Parity footer: a wide photo of stacked acrylic sheets with the line Catch drift before it ships, the Parity wordmark rising out of the photo with its lower half shifted slightly, and footer links.",
        label: "Footer",
      },
    ],
  },
  {
    number: "06",
    name: "Glyphtracker",
    category: "Browser music tracker",
    images: [
      {
        src: glyphtracker,
        alt: "Glyphtracker in the browser: a four-channel pattern editor with hex rows and a yellow playhead, an ASCII scene of loudspeaker rings driven by the kick and lead, mapping sliders, transport, an oscilloscope and channel meters.",
        label: "Overview",
      },
    ],
  },
];
