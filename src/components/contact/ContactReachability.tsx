import type { LucideIcon } from "lucide-react";
import { Lightbulb, Mail, MessageCircle, Phone, Smartphone } from "lucide-react";
import { contactInfo } from "@/data/contact";

type ContactColumnProps = {
  label: string;
  icon: LucideIcon;
  value: string;
  href: string;
};

const ContactColumn = ({ label, icon: Icon, value, href }: ContactColumnProps) => (
  <div>
    <p className="mb-2 text-[15px] font-semibold leading-none text-[#008080]">{label}</p>
    <a
      href={href}
      className="inline-flex items-center gap-2 text-[15px] font-medium leading-snug text-[#001a1a] transition-opacity hover:opacity-65"
    >
      <Icon className="h-[18px] w-[18px] shrink-0 text-[#001a1a]" strokeWidth={1.5} />
      {value}
    </a>
  </div>
);

const SplitContactColumns = ({ columns }: { columns: [ContactColumnProps, ContactColumnProps] }) => (
  <div className="flex">
    <div className="min-w-0 flex-1 pr-5">
      <ContactColumn {...columns[0]} />
    </div>
    <div className="w-px shrink-0 self-stretch bg-[#d4d0c8]" aria-hidden />
    <div className="min-w-0 flex-1 pl-5">
      <ContactColumn {...columns[1]} />
    </div>
  </div>
);

type CardButtonProps = {
  href: string;
  label: string;
  external?: boolean;
};

const CardButton = ({ href, label, external }: CardButtonProps) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className="flex h-[42px] w-full items-center justify-between rounded-[10px] border border-[#001a1a] bg-white px-4 text-[15px] font-normal text-[#001a1a] transition-colors hover:bg-[#fafafa]"
  >
    <span>{label}</span>
    <span className="text-[18px] leading-none text-[#001a1a]">&rsaquo;</span>
  </a>
);

type IconBadgeProps = {
  icon: LucideIcon;
  variant: "circle-grey" | "circle-orange" | "circle-purple";
};

const iconStyles: Record<IconBadgeProps["variant"], string> = {
  "circle-grey": "bg-[#eceae4] text-[#555555]",
  "circle-orange": "bg-brand-orange-light text-brand-orange",
  "circle-purple": "bg-[#ebe6ff] text-[#6a50ff]",
};

const IconBadge = ({ icon: Icon, variant }: IconBadgeProps) => (
  <div
    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${iconStyles[variant]}`}
  >
    <Icon className="h-[20px] w-[20px]" strokeWidth={1.5} />
  </div>
);

const cards = [
  {
    icon: Smartphone,
    iconVariant: "circle-grey" as const,
    title: "Telefoon",
    description:
      "Onze sales en support collega's zijn doordeweeks tussen 09:00 tot 17:00 bereikbaar op de onderstaande telefoonnummers.",
    content: (
      <SplitContactColumns
        columns={[
          {
            label: "Sales",
            icon: Phone,
            value: contactInfo.phone.sales,
            href: `tel:${contactInfo.phone.sales.replace(/[\s()]/g, "")}`,
          },
          {
            label: "Support",
            icon: Phone,
            value: contactInfo.phone.support,
            href: `tel:${contactInfo.phone.support.replace(/[\s()]/g, "")}`,
          },
        ]}
      />
    ),
  },
  {
    icon: Mail,
    iconVariant: "circle-grey" as const,
    title: "E-mail",
    description:
      "Heb je een brandende vraag? Mail ons gerust op één van de onderstaande e-mailadressen. We reageren normaliter binnen 1 werkdag.",
    content: (
      <SplitContactColumns
        columns={[
          {
            label: "Sales",
            icon: Mail,
            value: contactInfo.email.sales,
            href: `mailto:${contactInfo.email.sales}`,
          },
          {
            label: "Support",
            icon: Mail,
            value: contactInfo.email.support,
            href: `mailto:${contactInfo.email.support}`,
          },
        ]}
      />
    ),
  },
  {
    icon: MessageCircle,
    iconVariant: "circle-orange" as const,
    title: "Chat",
    description: "Heb je een brandende vraag? Stel hem gerust via onze livechat.",
    content: <CardButton href={contactInfo.whatsapp} label="Start een livechat" external />,
  },
  {
    icon: Lightbulb,
    iconVariant: "circle-purple" as const,
    title: "Kennisbank",
    description:
      "Op onze kennisbank vind je artikelen over hoe je Nexavo optimaal inricht en gebruikt.",
    content: <CardButton href="/kennisbank" label="Naar de kennisbank" />,
  },
];

export const ContactReachability = () => (
  <div className="mx-auto w-full max-w-[1080px]">
    <h1 className="mb-8 text-center text-[2.75rem] font-bold leading-tight tracking-[-0.03em] text-[#001a1a] md:mb-10 md:text-[3.5rem]">
      Hoe kunnen we je helpen?
    </h1>

    <div className="grid items-stretch gap-4 sm:grid-cols-2 md:gap-5">
      {cards.map((card) => (
        <article
          key={card.title}
          className="flex h-full flex-col rounded-[18px] border border-border/40 bg-[#f8f6f1] p-6 md:p-7"
        >
          <IconBadge icon={card.icon} variant={card.iconVariant} />

          <h2 className="mb-2 text-[1.0625rem] font-bold leading-snug text-[#001a1a]">{card.title}</h2>

          <p className="mb-5 flex-1 text-[15px] leading-[1.5] text-[#4a4a4a]">{card.description}</p>

          <div className="mt-auto">{card.content}</div>
        </article>
      ))}
    </div>
  </div>
);
