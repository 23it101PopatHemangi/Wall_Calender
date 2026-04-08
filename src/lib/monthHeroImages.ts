/** Unsplash IDs per month (0–11). Query string added in `heroImageForMonth`. */
export const monthImages: Record<number, string> = {
  0: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  1: "https://images.unsplash.com/photo-1511988617509-a57c8a288659",
  2: "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
  3: "https://images.unsplash.com/photo-1495805442109-bf1cf975750b",
  4: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
  5: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  6: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  7: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  8: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  9: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce",
  10: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66",
  11: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be",
};

const IMAGE_PARAMS = "auto=format&fit=crop&w=1600&q=80";

export function heroImageForMonth(monthIndex: number): string {
  const safe = ((monthIndex % 12) + 12) % 12;
  const base = monthImages[safe];
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${IMAGE_PARAMS}`;
}

export function adjacentMonthIndices(monthIndex: number): {
  prev: number;
  next: number;
} {
  const m = ((monthIndex % 12) + 12) % 12;
  return { prev: (m + 11) % 12, next: (m + 1) % 12 };
}
