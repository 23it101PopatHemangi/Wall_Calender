"use client";

type DateCellProps = {
  dayNumber: number | null;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isRangeStartEdge: boolean;
  isRangeEndEdge: boolean;
  hasNote: boolean;
  isDisabled: boolean;
  fullDateLabel: string;
  onClick: () => void;
};

/**
 * Past dates (before today): muted, no hover, non-interactive. Today + future: full styling and smooth hover.
 * Range/selection styles never apply to past cells.
 */
export default function DateCell({
  dayNumber,
  isToday,
  isStart,
  isEnd,
  isInRange,
  isRangeStartEdge,
  isRangeEndEdge,
  hasNote,
  isDisabled,
  fullDateLabel,
  onClick,
}: DateCellProps) {
  if (dayNumber === null) {
    return <div className="min-h-11 rounded-xl bg-transparent md:min-h-12" />;
  }

  /* Past: before start of today — no range chrome, no hover, clicks blocked in Calendar too */
  if (isDisabled) {
    return (
      <button
        type="button"
        disabled
        title="Past dates cannot be selected"
        aria-label={fullDateLabel}
        className="relative flex min-h-11 w-full min-w-0 cursor-not-allowed touch-manipulation items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/95 text-sm font-semibold tabular-nums text-slate-400 opacity-50 shadow-inner shadow-slate-900/5 md:min-h-12 md:text-[15px]"
      >
        <span className="select-none">{dayNumber}</span>
      </button>
    );
  }

  const isBoundary = isStart || isEnd;
  const showRangeBase = isInRange || isBoundary;
  const isSingleDayRange = isStart && isEnd;

  const radiusClasses = (() => {
    if (!showRangeBase) {
      return "rounded-2xl";
    }
    if (isSingleDayRange) {
      return "rounded-2xl";
    }
    const left = isRangeStartEdge ? "rounded-l-2xl" : "rounded-none";
    const right = isRangeEndEdge ? "rounded-r-2xl" : "rounded-none";
    return `${left} ${right}`;
  })();

  return (
    <button
      type="button"
      onClick={onClick}
      title={fullDateLabel}
      aria-label={fullDateLabel}
      className={[
        "relative flex min-h-11 w-full min-w-0 cursor-pointer touch-manipulation items-center justify-center text-sm font-bold tabular-nums transition-[transform,box-shadow,background-color,border-color,ring-color,opacity] duration-300 ease-out md:min-h-12 md:text-[15px]",
        "motion-reduce:transition-none",
        "hover:z-[1] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.92] active:duration-150",
        showRangeBase ? "-mx-px md:-mx-0.5" : "",
        radiusClasses,
        isBoundary
          ? "z-[1] bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-white shadow-lg shadow-black/30 ring-2 ring-white/25 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)] hover:shadow-xl hover:ring-white/40"
          : isInRange
            ? "z-[1] bg-gradient-to-b from-[color-mix(in_srgb,var(--accent-range)_88%,white)] to-[color-mix(in_srgb,var(--accent-range)_100%,#0f172a_8%)] font-extrabold text-slate-900 shadow-md shadow-slate-900/10 ring-1 ring-slate-900/10 duration-500 hover:ring-2 hover:ring-[var(--accent-from)]/45 hover:shadow-lg"
            : "bg-gradient-to-b from-white to-slate-100/95 text-slate-950 shadow-[0_1px_3px_rgba(15,23,42,0.12)] ring-1 ring-slate-300/90 hover:bg-gradient-to-b hover:from-white hover:to-slate-50 hover:shadow-[0_4px_14px_rgba(15,23,42,0.14)] hover:ring-2 hover:ring-[var(--accent-from)]/50",
        !showRangeBase
          ? "hover:ring-offset-1 hover:ring-offset-white/0"
          : "",
        isToday
          ? isBoundary
            ? "ring-2 ring-white ring-offset-2 ring-offset-black/30"
            : "z-[1] border-2 border-[var(--accent-ring)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent-ring)_32%,transparent),0_0_22px_color-mix(in_srgb,var(--accent-ring)_42%,transparent)]"
          : "",
      ].join(" ")}
    >
      <span className="relative z-[1] select-none">{dayNumber}</span>
      {hasNote ? (
        <span
          className="absolute bottom-1 left-1/2 z-[2] h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--accent-dot)] shadow-md ring-2 ring-white transition-transform duration-300"
          aria-hidden
        />
      ) : null}
    </button>
  );
}
