"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Calendar from "@/components/Calendar";
import HeroMonthImage from "@/components/HeroMonthImage";
import Notes from "@/components/Notes";
import { heroImageForMonth } from "@/lib/monthHeroImages";
import { getMonthTheme, monthThemeStyle } from "@/lib/monthTheme";

const NOTES_BY_DATE_KEY = "wall-calendar-notes-by-date";

function toKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function Home() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [viewMonth, setViewMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [notesByDate, setNotesByDate] = useState<Record<string, string>>({});
  const [notesHydrated, setNotesHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(NOTES_BY_DATE_KEY);
        if (stored) {
          setNotesByDate(JSON.parse(stored) as Record<string, string>);
        }
      } catch {
        // ignore corrupt storage
      }
      setNotesHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!notesHydrated) {
      return;
    }
    localStorage.setItem(NOTES_BY_DATE_KEY, JSON.stringify(notesByDate));
  }, [notesByDate, notesHydrated]);

  const activeDateKey = toKey(activeDate);
  const activeNote = notesByDate[activeDateKey] ?? "";

  const activeDateShort = useMemo(
    () =>
      activeDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [activeDate],
  );

  const notedDates = useMemo(
    () =>
      new Set(
        Object.entries(notesByDate)
          .filter(([, note]) => note.trim())
          .map(([key]) => key),
      ),
    [notesByDate],
  );

  const monthYearLabel = useMemo(
    () =>
      viewMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [viewMonth],
  );

  const currentMonth = viewMonth.getMonth();
  const heroImage = heroImageForMonth(currentMonth);
  const theme = useMemo(() => getMonthTheme(currentMonth), [currentMonth]);
  const themeStyle = useMemo(() => monthThemeStyle(theme), [theme]);

  const handlePersistNote = useCallback((value: string) => {
    setNotesByDate((prev) => {
      const next = { ...prev };
      if (!value.trim()) {
        delete next[activeDateKey];
      } else {
        next[activeDateKey] = value;
      }
      return next;
    });
  }, [activeDateKey]);

  const handleDisplayedMonthChange = useCallback((monthStart: Date) => {
    setViewMonth(startOfMonth(monthStart));
  }, []);

  return (
    <main
      className="paper-texture min-h-screen overflow-x-hidden bg-slate-100/90 px-4 py-4 md:px-5 md:py-5 lg:px-6"
      style={themeStyle}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:gap-4 lg:grid lg:grid-cols-[minmax(0,420px)_1fr] lg:items-stretch lg:gap-6">
        <section className="relative isolate order-1 flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5 lg:order-1 lg:h-full">
          <HeroMonthImage
            heroImageUrl={heroImage}
            monthIndex={currentMonth}
          />
          {/* Stronger bottom read for premium month/year legibility */}
          <div
            className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black via-black/65 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-black/55 via-transparent to-transparent"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[42%] bg-gradient-to-t from-black/75 to-transparent md:h-[38%]" />
          <div className="pointer-events-none absolute bottom-0 left-0 z-30 max-w-[95%] p-4 pb-3.5 md:max-w-[92%] md:p-5 md:pb-4">
            <p
              key={monthYearLabel}
              className="animate-hero-title font-sans text-[2rem] font-black leading-[1.05] tracking-[0.04em] text-white antialiased md:text-[2.75rem] md:tracking-[0.045em] lg:text-[3.35rem] lg:tracking-[0.05em] [text-shadow:0_1px_0_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.95),0_4px_28px_rgba(0,0,0,0.65),0_0_40px_rgba(0,0,0,0.35)]"
            >
              {monthYearLabel}
            </p>
          </div>
        </section>

        <section className="order-2 space-y-3 md:space-y-4 lg:order-2">
          <p className="text-sm leading-snug text-slate-600 md:text-[0.9375rem]">
            <span className="font-semibold text-slate-800">Wall calendar</span>
            {" — "}
            two taps for a range. Theme follows the month. Notes per day.
          </p>

          <Calendar
            notedDates={notedDates}
            onActiveDateChange={setActiveDate}
            onDisplayedMonthChange={handleDisplayedMonthChange}
          />
          <Notes
            note={activeNote}
            activeDateShort={activeDateShort}
            onPersist={handlePersistNote}
          />
        </section>
      </div>
    </main>
  );
}
