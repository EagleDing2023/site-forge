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

/** True while the element is on (or near) the screen. Starts true so the first paint animates. */
export function useOnScreen(ref: RefObject<Element | null>): boolean {
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = shared();
    listeners.set(el, setOnScreen);
    io.observe(el);
    return () => {
      io.unobserve(el);
      listeners.delete(el);
    };
  }, [ref]);
  return onScreen;
}
