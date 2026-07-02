export type ProjectType = "Website" | "Webshop" | "Platform";

export type ProjectItem = {
  slug: string;
  title: string;
  description: string;
  image: string;
  type: ProjectType;
  href: string;
};

export const projects: ProjectItem[] = [
  {
    slug: "crewstars",
    title: "Crewstars",
    description:
      "Flexibel technisch personeel voor de evenementenbranche. Opbouw, shows en productiecrew voor opdrachtgevers en talent.",
    image: "/projects/crewstars.png",
    type: "Website",
    href: "https://crewstars.nl",
  },
  {
    slug: "hirefaces",
    title: "Hire Faces",
    description:
      "Platform waar events en talent elkaar vinden. Hostessen, modellen en standpersoneel direct boeken met transparante prijzen.",
    image: "/projects/hirefaces.png",
    type: "Platform",
    href: "https://hirefaces.nl",
  },
  {
    slug: "bibi",
    title: "Bibi",
    description:
      "Plasticvrije wasstrips in een moderne webshop. Duurzaam wassen met een helder merkverhaal en sterke productpagina's.",
    image: "/projects/bibi.png",
    type: "Webshop",
    href: "https://bibivie.com",
  },
  {
    slug: "four-gifts",
    title: "Four Gifts",
    description:
      "Premium cadeauboxen met persoonlijke video via QR. Luxe webshop voor cadeaus voor hem, haar en zakelijk.",
    image: "/projects/fourgifts.png",
    type: "Webshop",
    href: "https://fourgifts.nl",
  },
  {
    slug: "tap-crew",
    title: "TAP Crew",
    description:
      "Horeca- en hospitalityteams voor opdrachtgevers en crew. Een strakke site die vertrouwen uitstraalt.",
    image: "/projects/tap.png",
    type: "Website",
    href: "https://tapcrew.nl",
  },
];
