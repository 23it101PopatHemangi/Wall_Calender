/** Simple debounce for note auto-save and similar UX */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (t) {
      clearTimeout(t);
    }
    t = setTimeout(() => {
      fn(...args);
      t = undefined;
    }, ms);
  };
}
