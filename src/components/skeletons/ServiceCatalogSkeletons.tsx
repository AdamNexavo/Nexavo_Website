import { Bell, CheckCircle2, Globe, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  showcaseBorder,
  showcaseCardShadow,
  skeletonInnerRow,
} from "@/components/skeletons/showcase-tokens";

/** Diensten-catalogus: browser-achtige website-preview, breed en laag. */
export const WebsiteCatalogSkeleton = () => (
  <div className="relative w-full">
    <div className={cn("overflow-hidden rounded-xl", showcaseBorder, showcaseCardShadow, "bg-white")}>
      <div className="flex items-center gap-1.5 border-b border-[#ebe8e4] bg-[#f8f7f5] px-2 py-1.5">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e0ddd8]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#e0ddd8]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#e0ddd8]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1 rounded-md border border-[#ebe8e4] bg-white px-2 py-0.5">
          <Globe className="h-2.5 w-2.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <span className="truncate text-[8px] font-medium text-foreground">jouwbedrijf.nl</span>
        </div>
      </div>

      <div className="p-2">
        <div className="mb-2 flex items-center justify-between">
          <span className="h-4 w-12 rounded-md bg-primary" />
          <div className="flex gap-2">
            {["Home", "Diensten", "Contact"].map((item) => (
              <span
                key={item}
                className={cn(
                  "text-[7px] font-medium",
                  item === "Home" ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-2 grid grid-cols-[1fr_0.75fr] gap-2">
          <div className="space-y-1">
            <p className="text-[10px] font-bold leading-tight text-foreground">
              Groei online met vertrouwen
            </p>
            <p className="text-[8px] leading-relaxed text-muted-foreground">
              Professionele website voor meer aanvragen.
            </p>
            <span className="inline-block rounded-md bg-primary px-2 py-0.5 text-[7px] font-semibold text-white">
              Plan een gesprek
            </span>
          </div>
          <div className="h-14 rounded-lg border border-[#ebe8e4] bg-gradient-to-br from-primary/15 to-brand-orange/10" />
        </div>

        <div className="grid grid-cols-3 gap-1">
          {["Snel live", "Op maat", "Conversie"].map((title) => (
            <div key={title} className={cn("px-1.5 py-1.5", skeletonInnerRow)}>
              <p className="text-[7px] font-semibold text-foreground">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div
      className={cn(
        "absolute -bottom-1 right-0 flex w-28 items-center gap-1.5 rounded-xl bg-white p-1.5",
        showcaseBorder,
        showcaseCardShadow,
      )}
    >
      <div className="flex h-4 w-4 items-center justify-center rounded-md bg-emerald-500/10">
        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-semibold text-foreground">Reviews</p>
        <p className="text-[7px] text-muted-foreground">5,0 gemiddeld</p>
      </div>
    </div>
  </div>
);

const bookingDays = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const bookingDates = [null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const BookingCatalogSkeleton = () => (
  <div className="relative w-full">
    <div className={cn("rounded-xl p-2", showcaseBorder, showcaseCardShadow, "bg-white")}>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[9px] font-semibold text-foreground">Maart 2026</p>
        <div className="flex gap-0.5">
          <span className="flex h-4 w-4 items-center justify-center rounded border border-[#ebe8e4] bg-[#fafaf9] text-[8px] text-muted-foreground">
            ‹
          </span>
          <span className="flex h-4 w-4 items-center justify-center rounded border border-[#ebe8e4] bg-[#fafaf9] text-[8px] text-muted-foreground">
            ›
          </span>
        </div>
      </div>

      <div className="mb-0.5 grid grid-cols-7 gap-px">
        {bookingDays.map((day) => (
          <div key={day} className="text-center text-[7px] font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="mb-1.5 grid grid-cols-7 gap-px">
        {bookingDates.map((date, index) => {
          const isSelected = date === 12;
          const isBooked = date === 8;

          return (
            <div
              key={index}
              className={cn(
                "flex h-4 items-center justify-center rounded text-[8px] font-medium",
                date === null && "invisible",
                isSelected && "bg-primary text-white",
                !isSelected && isBooked && "bg-brand-orange/15 text-brand-orange",
                !isSelected && !isBooked && date && "bg-[#fafaf9] text-foreground/70",
              )}
            >
              {date ?? ""}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 rounded-lg border border-[#ebe8e4] bg-[#fafaf9] shadow-block p-1.5">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#eceae6] text-[7px] font-semibold">
          MJ
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[8px] font-semibold text-foreground">Mark Jansen</p>
          <p className="text-[7px] text-muted-foreground">12 mrt · 10:00</p>
        </div>
        <span className="text-[7px] font-semibold text-emerald-600">Bevestigd</span>
      </div>
    </div>

    <div
      className={cn(
        "absolute -bottom-1 left-0 flex w-28 items-center gap-1.5 rounded-xl bg-white p-1.5",
        showcaseBorder,
        showcaseCardShadow,
      )}
    >
      <div className="flex h-4 w-4 items-center justify-center rounded-md bg-primary/10">
        <Bell className="h-2.5 w-2.5 text-primary" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-semibold text-foreground">Herinnering</p>
        <p className="text-[7px] text-muted-foreground">24 uur vooraf</p>
      </div>
    </div>
  </div>
);

export const ReviewCatalogSkeleton = () => (
  <div className="relative w-full space-y-2">
    <div className={cn("rounded-xl p-2", showcaseBorder, showcaseCardShadow, "bg-white")}>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eceae6] text-[8px] font-semibold">
          LB
        </span>
        <div className="flex-1">
          <p className="text-[9px] font-semibold text-foreground">Lisa van der Berg</p>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-2 w-2 fill-amber-400 text-amber-400" strokeWidth={0} />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className={cn("max-w-[80%] p-1.5", skeletonInnerRow)}>
          <p className="text-[8px] leading-relaxed text-foreground">
            Geweldige service! Zeer tevreden met het resultaat.
          </p>
        </div>
        <div className="ml-auto max-w-[80%] rounded-lg border border-[#ebe8e4] bg-[#f5f5f6] p-1.5">
          <p className="text-[8px] leading-relaxed text-foreground/85">
            Hoi Lisa! Zou je een review willen achterlaten?
          </p>
        </div>
      </div>
    </div>
    <div
      className={cn(
        "absolute right-0 top-0 flex w-28 items-center gap-1.5 rounded-xl bg-white p-1.5",
        showcaseBorder,
        showcaseCardShadow,
      )}
    >
      <div className="flex h-4 w-4 items-center justify-center rounded-md bg-emerald-500/10">
        <Star className="h-2 w-2 fill-amber-400 text-amber-400" strokeWidth={0} />
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-semibold text-foreground">Nieuwe review</p>
        <p className="text-[7px] text-muted-foreground">5 sterren</p>
      </div>
    </div>
  </div>
);
