import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { SectionLines } from "@/components/backgrounds/section-lines";

/** Volwassen zakelijke portretten — geen kinderen/jongeren (randomuser.me, index 20+). */
const ENTREPRENEUR_PORTRAITS = [
  ...[22, 25, 28, 31, 32, 33, 35, 36, 38, 41, 44, 45, 47, 48, 50, 52, 55, 56, 58, 61, 64, 65, 67, 70, 71, 74, 76, 79, 82, 85, 88, 91].map(
    (n) => `https://randomuser.me/api/portraits/men/${n}.jpg`,
  ),
  ...[21, 23, 26, 29, 34, 37, 40, 42, 46, 49, 51, 53, 57, 60, 62, 66, 68, 72, 75, 78, 80, 83, 86, 89, 92, 95].map(
    (n) => `https://randomuser.me/api/portraits/women/${n}.jpg`,
  ),
];

type CloudTile = {
  col: number;
  row: number;
  opacity: number;
  scale: number;
  portraitIndex: number;
};

const assignPortraitIndices = (count: number): number[] => {
  const result: number[] = [];

  for (let i = 0; i < count; i++) {
    let index = (i * 13 + 7) % ENTREPRENEUR_PORTRAITS.length;
    if (i > 0 && index === result[i - 1]) {
      index = (i * 13 + 11) % ENTREPRENEUR_PORTRAITS.length;
    }
    result.push(index);
  }

  return result;
};

const buildCloudTiles = (): CloudTile[] => {
  const cols = 18;
  const rows = 6;
  const centerX = (cols - 1) / 2;
  const centerY = (rows - 1) / 2;
  const tiles: CloudTile[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const nx = (col - centerX) / centerX;
      const ny = (row - centerY) / centerY;
      const dist = Math.sqrt(nx * nx * 0.72 + ny * ny * 1.1);
      const edgeNoise =
        Math.sin(col * 0.95 + row * 0.4) * 0.12 +
        Math.cos(col * 0.55 - row * 0.7) * 0.1;
      const threshold = 0.96 + edgeNoise;

      if (dist > threshold) continue;
      if (row === 0) continue;

      tiles.push({
        col,
        row,
        opacity: Math.max(0.5, 1 - dist * 0.42),
        scale: Math.max(0.8, 1 - dist * 0.14),
        portraitIndex: 0,
      });
    }
  }

  const portraitIndices = assignPortraitIndices(tiles.length);
  const withPortraits = tiles.map((tile, i) => ({ ...tile, portraitIndex: portraitIndices[i] }));

  return repositionOrphanTiles(withPortraits, cols, rows, centerX);
};

const repositionOrphanTiles = (
  tiles: CloudTile[],
  cols: number,
  rows: number,
  centerX: number,
): CloudTile[] => {
  const neighborCount = (tile: CloudTile) =>
    tiles.filter(
      (other) =>
        other !== tile &&
        Math.abs(other.col - tile.col) <= 1 &&
        Math.abs(other.row - tile.row) <= 1,
    ).length;

  const occupied = () => new Set(tiles.map((t) => `${t.col},${t.row}`));

  const orphans = tiles.filter((tile) => neighborCount(tile) === 0);

  if (orphans.length === 0) return tiles;

  const slots = occupied();

  for (const orphan of orphans) {
    slots.delete(`${orphan.col},${orphan.row}`);

    let placed = false;
    for (const row of [rows - 1, rows - 2, rows - 3]) {
      for (let offset = 0; offset <= 9 && !placed; offset++) {
        const candidates = [
          Math.round(centerX) + offset,
          Math.round(centerX) - offset,
        ];

        for (const col of candidates) {
          if (col < 0 || col >= cols) continue;
          const key = `${col},${row}`;
          if (slots.has(key)) continue;

          orphan.col = col;
          orphan.row = row;
          slots.add(key);
          placed = true;
          break;
        }
      }
    }
  }

  return tiles;
};

const LogoCloud = () => {
  const tiles = useMemo(() => buildCloudTiles(), []);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative mx-auto mb-8 h-[148px] w-full max-w-5xl sm:mb-10 sm:h-[168px] md:h-[188px]">
      <div
        className="absolute inset-0 isolate grid gap-[5px] sm:gap-[6px] md:gap-[7px]"
        style={{
          gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
          gridTemplateRows: "repeat(6, minmax(0, 1fr))",
        }}
      >
        {tiles.map((tile, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={`${tile.col}-${tile.row}-${index}`}
              className="relative flex items-center justify-center"
              style={{
                gridColumn: tile.col + 1,
                gridRow: tile.row + 1,
                opacity: tile.opacity,
                transform: `scale(${tile.scale})`,
                zIndex: isHovered ? 50 : 1,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-full border bg-[#e8e8ea] shadow-sm transition-all duration-300 ease-out ${
                  isHovered
                    ? "scale-[1.22] border-border/80 shadow-hover"
                    : "scale-100 border-border/40"
                }`}
              >
                <img
                  src={ENTREPRENEUR_PORTRAITS[tile.portraitIndex]}
                  alt=""
                  width={120}
                  height={120}
                  className={`h-full w-full object-cover transition-all duration-300 ease-out ${
                    isHovered ? "grayscale-0" : "grayscale"
                  }`}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const img = e.currentTarget;
                    const fallback = (tile.portraitIndex + 5) % ENTREPRENEUR_PORTRAITS.length;
                    if (img.src !== ENTREPRENEUR_PORTRAITS[fallback]) {
                      img.src = ENTREPRENEUR_PORTRAITS[fallback];
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 72% 85% at 50% 50%, transparent 35%, white 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, white 0%, rgba(255,255,255,0.85) 12%, transparent 32%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, white 0%, transparent 14%, transparent 86%, white 100%)",
        }}
      />
    </div>
  );
};

type BottomCTAProps = {
  titleLine1?: string;
  titleLine2?: string;
  titleLine2Serif?: boolean;
  description?: string | null;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  footnote?: string;
};

export const BottomCTA = ({
  titleLine1 = "Klaar om te groeien?",
  titleLine2 = "Begin bij Nexavo.",
  titleLine2Serif = true,
  description = null,
  primaryLabel = "Start nu",
  primaryHref = "/contact",
  secondaryLabel = "Plan een demo",
  secondaryHref = "/contact",
  footnote = "Vrijblijvend kennismakingsgesprek",
}: BottomCTAProps) => {
  return (
    <section className="relative bg-white border-t border-border/60 overflow-hidden nex-dot-grid">
      <SectionLines opacity="subtle" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />

      <div className="relative container max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-20 md:pb-28 text-center">
        <LogoCloud />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="nex-cta-headline mb-8 md:mb-10 max-w-3xl mx-auto">
            <span className="block nex-cta-headline-sans">{titleLine1}</span>
            {titleLine2 && (
              <span
                className={
                  titleLine2Serif
                    ? "block nex-cta-headline-serif mt-1"
                    : "block nex-cta-headline-sans mt-1"
                }
              >
                {titleLine2}
              </span>
            )}
          </h2>

          {description && (
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed font-sans">
              {description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={primaryHref}>
              <Button size="lg" variant="brand" className="min-w-[160px]">
                {primaryLabel}
              </Button>
            </Link>
            <Link to={secondaryHref}>
              <Button size="lg" variant="secondary" className="min-w-[160px]">
                {secondaryLabel}
              </Button>
            </Link>
          </div>

          {footnote && (
            <p className="text-sm text-muted-foreground mt-6 font-sans">{footnote}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
