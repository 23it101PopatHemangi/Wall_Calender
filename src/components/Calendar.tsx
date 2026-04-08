"use client";

import { useEffect, useMemo, useState } from "react";
import DateCell from "./DateCell";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatFullDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type CalendarProps = {
  notedDates: Set<string>;
  onActiveDateChange: (date: Date) => void;
  onDisplayedMonthChange?: (monthStart: Date) => void;
};

export default function Calendar({
  notedDates,
  onActiveDateChange,
  onDisplayedMonthChange,
}: CalendarProps) {
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const [displayedDate, setDisplayedDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [monthAnimClass, setMonthAnimClass] = useState("animate-month-in-right");
  const [monthAnimKey, setMonthAnimKey] = useState(0);
  const [clearAnim, setClearAnim] = useState(false);

  useEffect(() => {
    onDisplayedMonthChange?.(displayedDate);
  }, [displayedDate, onDisplayedMonthChange]);

  const daysInMonth = useMemo(() => {
    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: firstDay + totalDays }, (_, index) =>
      index < firstDay ? null : index - firstDay + 1,
    );
  }, [displayedDate]);

  const monthTitle = displayedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function goToPreviousMonth() {
    setMonthAnimClass("animate-month-in-left");
    setMonthAnimKey((prev) => prev + 1);
    setDisplayedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  }

  function goToNextMonth() {
    setMonthAnimClass("animate-month-in-right");
    setMonthAnimKey((prev) => prev + 1);
    setDisplayedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  }

  function clearSelection() {
    setStartDate(null);
    setEndDate(null);
    setClearAnim(true);
    window.setTimeout(() => setClearAnim(false), 500);
  }

  function handleDateClick(day: number) {
    const clickedDate = new Date(
      displayedDate.getFullYear(),
      displayedDate.getMonth(),
      day,
    );
    /* Any calendar day before today is past — no selection or range anchor */
    if (clickedDate < todayStart) {
      return;
    }
    onActiveDateChange(clickedDate);

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      return;
    }

    if (clickedDate < startDate) {
      setStartDate(clickedDate);
      return;
    }

    setEndDate(clickedDate);
  }

  function getDayState(day: number) {
    const current = new Date(
      displayedDate.getFullYear(),
      displayedDate.getMonth(),
      day,
    );

    const isStart = Boolean(startDate && isSameDate(current, startDate));
    const isEnd = Boolean(endDate && isSameDate(current, endDate));
    const isInRange = Boolean(
      startDate && endDate && current > startDate && current < endDate,
    );
    const previous = new Date(
      displayedDate.getFullYear(),
      displayedDate.getMonth(),
      day - 1,
    );
    const next = new Date(
      displayedDate.getFullYear(),
      displayedDate.getMonth(),
      day + 1,
    );
    const prevInRange = Boolean(
      startDate &&
        endDate &&
        (isSameDate(previous, startDate) ||
          (previous > startDate && previous < endDate) ||
          isSameDate(previous, endDate)),
    );
    const nextInRange = Boolean(
      startDate &&
        endDate &&
        (isSameDate(next, startDate) ||
          (next > startDate && next < endDate) ||
          isSameDate(next, endDate)),
    );
    const isToday = isSameDate(current, today);
    const isRangeStartEdge = !prevInRange;
    const isRangeEndEdge = !nextInRange;
    const hasNote = notedDates.has(toKey(current));
    const isDisabled = current < todayStart; /* strictly before today */

    return {
      isStart,
      isEnd,
      isInRange,
      isToday,
      isRangeStartEdge,
      isRangeEndEdge,
      hasNote,
      isDisabled,
      fullDateLabel: formatFullDate(current),
    };
  }

  /** Gradient-filled nav — theme vars + soft glass edge */
  const navBtnClass =
    "rounded-2xl border px-4 py-2.5 text-sm font-semibold tracking-wide shadow-md transition-all duration-300 ease-out " +
    "min-h-11 min-w-[44px] touch-manipulation " +
    "border-white/25 bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-white " +
    "hover:-translate-y-0.5 hover:shadow-lg hover:brightness-105 active:scale-[0.96] active:shadow-md";

  const clearBtnClass =
    "rounded-2xl border px-4 py-2 text-xs font-bold tracking-wide shadow-sm transition-all duration-300 ease-out " +
    "min-h-11 touch-manipulation " +
    "border-[var(--accent-btn-border)] bg-white/95 text-[var(--accent-btn-text)] " +
    "hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-[0.96]";

  return (
    <section className="rounded-[1.75rem] bg-white/95 p-4 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur-md md:rounded-[2rem] md:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className={navBtnClass}
          aria-label="Go to previous month"
        >
          &larr; Prev
        </button>
        <h2
          key={`title-${monthAnimKey}`}
          className={`px-1 text-center font-serif text-lg font-semibold tracking-tight text-slate-800 md:text-xl lg:text-2xl ${monthAnimClass}`}
        >
          {monthTitle}
        </h2>
        <button
          type="button"
          onClick={goToNextMonth}
          className={navBtnClass}
          aria-label="Go to next month"
        >
          Next &rarr;
        </button>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 md:mb-4">
        <p className="max-w-[15rem] text-[11px] leading-relaxed text-slate-500 md:max-w-none md:text-xs">
          Today glows. Range uses a soft pill + theme gradient.
        </p>
        <button
          type="button"
          onClick={clearSelection}
          className={`${clearBtnClass} ${clearAnim ? "animate-clear-pop" : ""}`}
        >
          Clear range
        </button>
      </div>

      <div
        key={`grid-${monthAnimKey}`}
        className={`grid grid-cols-7 gap-2 md:gap-2.5 ${monthAnimClass}`}
      >
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="pb-1.5 text-center text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-700 md:pb-2 md:text-[10px] md:tracking-[0.16em]"
          >
            {day}
          </div>
        ))}

        {daysInMonth.map((day, index) => {
          if (day === null) {
            return (
              <DateCell
                key={`empty-${index}`}
                dayNumber={null}
                isToday={false}
                isStart={false}
                isEnd={false}
                isInRange={false}
                isRangeStartEdge={false}
                isRangeEndEdge={false}
                hasNote={false}
                isDisabled={false}
                fullDateLabel=""
                onClick={() => {}}
              />
            );
          }

          const state = getDayState(day);

          return (
            <DateCell
              key={day}
              dayNumber={day}
              isToday={state.isToday}
              isStart={state.isStart}
              isEnd={state.isEnd}
              isInRange={state.isInRange}
              isRangeStartEdge={state.isRangeStartEdge}
              isRangeEndEdge={state.isRangeEndEdge}
              hasNote={state.hasNote}
              isDisabled={state.isDisabled}
              fullDateLabel={state.fullDateLabel}
              onClick={() => handleDateClick(day)}
            />
          );
        })}
      </div>
    </section>
  );
}
