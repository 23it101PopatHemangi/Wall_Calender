"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  adjacentMonthIndices,
  heroImageForMonth,
} from "@/lib/monthHeroImages";

type HeroMonthImageProps = {
  heroImageUrl: string;
  monthIndex: number;
  className?: string;
};

/**
 * Month hero: preload neighbors, shimmer until decode, zoom-in + fade on load,
 * hover zoom. Gradient overlays live on the page shell.
 */
export default function HeroMonthImage({
  heroImageUrl,
  monthIndex,
  className = "",
}: HeroMonthImageProps) {
  const safeMonth = ((monthIndex % 12) + 12) % 12;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setLoaded(false));
  }, [heroImageUrl]);

  useEffect(() => {
    const { prev, next } = adjacentMonthIndices(safeMonth);
    [heroImageForMonth(prev), heroImageForMonth(next)].forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, [safeMonth]);

  return (
    <div
      className={`group relative z-0 h-[200px] min-h-[200px] w-full flex-1 overflow-hidden bg-black md:h-[260px] md:min-h-[260px] lg:h-full lg:min-h-0 ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 transition-opacity duration-500 ease-out motion-reduce:transition-none ${loaded ? "opacity-0" : "opacity-100"}`}
        aria-hidden
      >
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.14)_50%,rgba(255,255,255,0.08)_55%,transparent_100%)] bg-[length:220%_100%]" />
      </div>

      <div className="absolute inset-0 z-[2] transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        <Image
          key={heroImageUrl}
          src={heroImageUrl}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 420px"
          priority
          onLoadingComplete={() => setLoaded(true)}
          className={`object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"} ${loaded ? "animate-hero-zoom-loaded motion-reduce:animate-none" : "scale-105"}`}
        />
      </div>
    </div>
  );
}
