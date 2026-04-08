"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "@/lib/debounce";

const MAX_LEN = 5000;
const DEBOUNCE_MS = 450;

type NotesProps = {
  note: string;
  activeDateShort: string;
  onPersist: (value: string) => void;
};

/**
 * Debounced persist + visible Saved state; large textarea + strong focus ring.
 */
export default function Notes({
  note,
  activeDateShort,
  onPersist,
}: NotesProps) {
  const [draft, setDraft] = useState(note);
  const [savedFlash, setSavedFlash] = useState(false);
  const [typing, setTyping] = useState(false);
  const prevDateLabel = useRef<string | null>(null);

  useEffect(() => {
    if (prevDateLabel.current !== activeDateShort) {
      prevDateLabel.current = activeDateShort;
      queueMicrotask(() => {
        setDraft(note);
        setTyping(false);
      });
    }
  }, [activeDateShort, note]);

  const runSavedCue = useCallback(() => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2400);
  }, []);

  const persistDebounced = useMemo(
    () =>
      debounce((value: string) => {
        onPersist(value);
        setTyping(false);
        runSavedCue();
      }, DEBOUNCE_MS),
    [onPersist, runSavedCue],
  );

  const handleChange = useCallback(
    (value: string) => {
      const next = value.slice(0, MAX_LEN);
      setDraft(next);
      setTyping(true);
      persistDebounced(next);
    },
    [persistDebounced],
  );

  const handleBlur = useCallback(() => {
    onPersist(draft);
    setTyping(false);
  }, [draft, onPersist]);

  return (
    <section
      className={`rounded-[1.75rem] bg-white/95 p-4 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur-md md:rounded-[2rem] md:p-5 ${savedFlash ? "animate-notes-saved" : ""}`}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-semibold tracking-tight text-slate-800 md:text-xl">
            Notes
          </h3>
          <p className="mt-1.5 text-sm leading-snug text-slate-600">
            <span className="font-medium text-slate-500">Notes for </span>
            <span className="font-bold text-[var(--accent-btn-text)]">
              {activeDateShort}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center">
          {typing ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Saving…
            </span>
          ) : savedFlash ? (
            <span className="animate-saved-badge inline-flex items-center rounded-full bg-gradient-to-r from-[color-mix(in_srgb,var(--accent-from)_22%,white)] to-[color-mix(in_srgb,var(--accent-to)_18%,white)] px-3.5 py-1.5 text-sm font-bold text-slate-800 shadow-sm ring-2 ring-[var(--accent-btn-border)]">
              Saved
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-400">
              Auto-save on
            </span>
          )}
        </div>
      </div>

      <textarea
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Type your note for this date…"
        rows={8}
        className="min-h-[13rem] w-full resize-y rounded-2xl border-2 border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 p-4 text-[15px] leading-relaxed text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-[var(--accent-from)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent-from)_18%,transparent),0_8px_30px_-8px_color-mix(in_srgb,var(--accent-from)_25%,transparent)] md:min-h-[15rem] md:p-5 md:text-base"
      />

      <div className="mt-2.5 flex justify-end text-xs tabular-nums text-slate-400">
        {draft.length} / {MAX_LEN}
      </div>
    </section>
  );
}
