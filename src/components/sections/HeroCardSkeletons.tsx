import { WebsiteShowcaseSkeleton } from "@/components/skeletons/WebsiteShowcaseSkeleton";

export { WebsiteShowcaseSkeleton };

const WebsiteHeroCardSkeleton = () => (
  <div className="space-y-2">
    <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-gray-300" />
        <div className="flex-1">
          <div className="mb-0.5 h-3 w-24 rounded bg-gray-800" />
          <div className="h-2 w-32 rounded bg-gray-300" />
        </div>
      </div>
      <div className="mb-2 h-20 rounded bg-gray-100" />
      <div className="grid grid-cols-3 gap-1.5">
        <div className="h-12 rounded bg-gray-50" />
        <div className="h-12 rounded bg-gray-50" />
        <div className="h-12 rounded bg-gray-50" />
      </div>
    </div>
    <div className="relative">
      <div className="absolute bottom-0 right-0 w-32 rounded border border-gray-200 bg-white p-2 shadow-md">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
            <div className="h-2.5 w-2.5 rounded bg-green-500" />
          </div>
          <div className="flex-1">
            <div className="mb-0.5 h-2.5 w-20 rounded bg-gray-800" />
            <div className="h-2 w-24 rounded bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BookingHeroCardSkeleton = () => (
  <div className="space-y-2">
    <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-800" />
        <div className="flex gap-1.5">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="h-5 w-5 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
          <div key={day} className="py-0.5 text-center text-[10px] text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="mb-2 grid grid-cols-7 gap-0.5">
        {Array.from({ length: 35 }).map((_, i) => {
          const date = i + 1;
          const isPurple = [5, 12, 19].includes(date);
          const isOrange = [8, 15, 22].includes(date);
          return (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded text-[10px] ${
                isPurple
                  ? "bg-[#6a50ff] text-white"
                  : isOrange
                    ? "bg-orange-300 text-gray-800"
                    : "bg-gray-50 text-gray-600"
              }`}
            >
              {date <= 31 ? date : ""}
            </div>
          );
        })}
      </div>
      <div className="border-t pt-2">
        <div className="mb-2 h-3 w-28 animate-pulse rounded bg-gray-800" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gray-300" />
            <div className="flex-1">
              <div className="mb-0.5 h-3 w-24 rounded bg-gray-800" />
              <div className="h-2 w-32 rounded bg-gray-300" />
            </div>
            <div className="rounded bg-[#6a50ff]/10 px-2 py-0.5 text-[10px] font-medium text-[#6a50ff]">
              Bevestigd
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gray-300" />
            <div className="flex-1">
              <div className="mb-0.5 h-3 w-28 rounded bg-gray-800" />
              <div className="h-2 w-32 rounded bg-gray-300" />
            </div>
            <div className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">
              Nieuw
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="relative">
      <div className="absolute bottom-0 left-0 w-36 rounded border border-gray-200 bg-white p-2 shadow-md">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6a50ff]/10">
            <div className="h-2.5 w-2.5 rounded bg-[#6a50ff]" />
          </div>
          <div className="flex-1">
            <div className="mb-0.5 h-2.5 w-24 rounded bg-gray-800" />
            <div className="h-2 w-20 rounded bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReviewHeroCardSkeleton = () => (
  <div className="space-y-2">
    <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-300" />
        <div className="flex-1">
          <div className="mb-0.5 h-3 w-24 rounded bg-gray-800" />
          <div className="h-2 w-32 rounded bg-gray-300" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="max-w-[80%] rounded-lg bg-gray-100 p-2">
          <div className="space-y-1">
            <div className="h-2 w-full animate-pulse rounded bg-gray-300" />
            <div className="h-2 w-5/6 animate-pulse rounded bg-gray-300" />
            <div className="h-2 w-4/6 animate-pulse rounded bg-gray-300" />
          </div>
          <div className="mt-1.5 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-2.5 w-2.5 rounded bg-gray-400" />
            ))}
          </div>
        </div>
        <div className="ml-auto max-w-[80%] rounded-lg bg-green-100 p-2">
          <div className="space-y-1">
            <div className="h-2 w-full animate-pulse rounded bg-green-200" />
            <div className="h-2 w-5/6 animate-pulse rounded bg-green-200" />
          </div>
          <div className="mt-1.5 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-2 w-2 rounded bg-yellow-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="relative">
      <div className="absolute right-0 top-0 w-32 rounded border border-gray-200 bg-white p-2 shadow-md">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
            <div className="h-2.5 w-2.5 rounded bg-green-500" />
          </div>
          <div className="flex-1">
            <div className="mb-0.5 h-2.5 w-20 rounded bg-gray-800" />
            <div className="h-2 w-24 rounded bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const HeroCardSkeleton = ({ type }: { type: number }) => {
  if (type === 1) return <WebsiteHeroCardSkeleton />;
  if (type === 2) return <BookingHeroCardSkeleton />;
  if (type === 3) return <ReviewHeroCardSkeleton />;
  return null;
};
