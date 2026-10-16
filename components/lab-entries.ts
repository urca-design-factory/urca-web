import type { StaticImageData } from "next/image";
import kaldaBasalt from "@/public/images/lab/kalda-basalt.jpg";
import kaldaRain from "@/public/images/lab/kalda-rain.jpg";
import kaldaSource from "@/public/images/lab/kalda-source.jpg";
import halden from "@/public/images/lab/halden.jpg";
import haldenDock from "@/public/images/lab/halden-dock.jpg";
import haldenException from "@/public/images/lab/halden-exception.jpg";
import kiln from "@/public/images/lab/kiln.jpg";
import kilnHeatmap from "@/public/images/lab/kiln-heatmap.jpg";
import kilnTrace from "@/public/images/lab/kiln-trace.jpg";
import moreiraHolm from "@/public/images/lab/moreira-holm.jpg";
import moreiraHolmProject from "@/public/images/lab/moreira-holm-project.jpg";
import offpeak from "@/public/images/lab/offpeak.jpg";
import offpeakMap from "@/public/images/lab/offpeak-map.jpg";
import offpeakNight from "@/public/images/lab/offpeak-night.jpg";
import parity from "@/public/images/lab/parity.jpg";
import parityFooter from "@/public/images/lab/parity-footer.jpg";
import turndown from "@/public/images/lab/turndown.jpg";
import turndownFlow from "@/public/images/lab/turndown-flow.jpg";
import nightswim from "@/public/images/lab/nightswim.jpg";
import nightswimMap from "@/public/images/lab/nightswim-map.jpg";
import nightswimBoard from "@/public/images/lab/nightswim-board.jpg";

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
    name: "Tanabe Bros.",
    category: "Snowboard maker, a board for night riding",
    images: [
      {
        src: nightswim,
        alt: "Tanabe Bros. product page for the Nightswim snowboard: three boards with a lime, white, cobalt and black contour topsheet and one black base, beside the price in yen, sizes and specs.",
        label: "Product",
      },
      {
        src: nightswimMap,
        alt: "The Nightswim topsheet art shown as a trail map, with lifts, numbered lit and unlit runs, elevations and the strip the 154 board is cut from, next to the board itself.",
        label: "Trail map",
      },
      {
        src: nightswimBoard,
        alt: "Tanabe Bros. brand board: a night snowboarder under floodlights, the logotype, the line Last chair leaves at 20:20, an app screen showing lit runs, a palette, line icons, a night lift ticket, stickers, a screen-printing workshop, a portrait outside a lodge and a volcano above lit ski runs.",
        label: "Brand board",
      },
    ],
  },
  {
    number: "02",
    name: "Moreira Holm",
    category: "Architecture practice",
    images: [
      {
        src: moreiraHolm,
        alt: "Moreira Holm brand board: gouache paintings of a sunlit room, white houses on a hillside and a stone stair, a wide logotype split by a solid bar, business cards with two studio addresses on the front and the logotype on an ochre back, and a palette named Cal, Ocre, Oliva and Ardósia.",
        label: "Brand board",
      },
      {
        src: moreiraHolmProject,
        alt: "Moreira Holm website project page for Casa Lentisco on Paros: a house in three rooms around a courtyard and an olive tree, with a title block, a gouache of the courtyard and thumbnails with the floor plan.",
        label: "Project page",
      },
    ],
  },
  {
    number: "03",
    name: "Offpeak",
    category: "Home energy scheduling",
    images: [
      {
        src: offpeak,
        alt: "Offpeak website hero, The cleanest hour today is 03:00, above a 24-hour band coloured by forecast grid carbon intensity from coral evening peak to mint night low, with a dishwasher moved to 03:00.",
        label: "Hero",
      },
      {
        src: offpeakNight,
        alt: "Offpeak at 03:04: a dark kitchen lit by moonlight and the dishwasher, with the line Your dishwasher is running on wind, a live run card and the night's queue.",
        label: "Night",
      },
      {
        src: offpeakMap,
        alt: "Offpeak grid map on a dotted globe of Europe, each country's dots coloured by carbon intensity from Norway at 28 to Poland at 640 grams per kilowatt hour.",
        label: "Grid map",
      },
    ],
  },
  {
    number: "04",
    name: "Kaldá",
    category: "Mineral water, a story in three chapters",
    images: [
      {
        src: kaldaRain,
        alt: "Kaldá chapter one: rain falling on a wet black lava field flecked with moss, mountains fading into the storm, with the line It fell as rain on black lava.",
        label: "01 Rain",
      },
      {
        src: kaldaBasalt,
        alt: "Kaldá chapter two: a cut-open block of layered basalt with a glowing thread of water winding down through it, tagged with depths and years, and the minerals it picks up.",
        label: "02 Basalt",
      },
      {
        src: kaldaSource,
        alt: "Kaldá chapter three: a clear glass bottle beaded with condensation, standing on a hexagonal basalt column among other columns in a cold teal haze, with the line It comes up at four degrees.",
        label: "03 Source",
      },
    ],
  },
  {
    number: "05",
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
    number: "06",
    name: "Turndown",
    category: "Evening routine app",
    images: [
      {
        src: turndown,
        alt: "Turndown brand board: a clay sphere on linen under the sign Evening service from 21:30, a folded-blanket app icon, door hangers reading Turndown please and Do not disturb, a phone preparing the bedroom, a bedroom poster reading Your room has been turned down, and a lock-screen notice.",
        label: "Brand board",
      },
      {
        src: turndownFlow,
        alt: "Turndown evening flow: three phone screens for setting the evening, the room getting ready and a morning note for room 214, a dawn bedroom photo reading Good morning, room 214, and home-screen widgets.",
        label: "Evening flow",
      },
    ],
  },
  {
    number: "07",
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
    number: "08",
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
];
