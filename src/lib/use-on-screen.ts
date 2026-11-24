"use client";

import { useEffect, useState, type RefObject } from "react";

// One observer shared by every card: a layer can have ~80 cards and search ~700.
const listeners = new WeakMap<Element, (onScreen: boolean) => void>();
let observer: IntersectionObserver | undefined;

function shared(): IntersectionObserver {
  // 200px margin: demos restart just before they scroll into view.
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) listeners.get(e.target)?.(e.isIntersecting);
    },
    { rootMargin: "200px 0px" },
  );
  return observer;
}

export type Visibility = {
  /** On or near the screen right now. Starts true so the first paint animates. */
  onScreen: boolean;
  /** Has been on or near the screen at least once. Starts false: gates one-time loads such as fonts. */
  seen: boolean;
};

export function useOnScreen(ref: RefObject<Element | null>): Visibility {
  const [v, setV] = useState<Visibility>({ onScreen: true, seen: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = shared();
    listeners.set(el, (onScreen) => setV((prev) => ({ onScreen, seen: prev.seen || onScreen })));
    io.observe(el);
    return () => {
      io.unobserve(el);
      listeners.delete(el);
    };
  }, [ref]);
  return v;
}
