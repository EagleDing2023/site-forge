"use client";

// One tiny external store for { step, picks }, persisted to localStorage.
// useSyncExternalStore renders EMPTY_STATE on the server and during hydration,
// then switches to the saved state, so there's no hydration mismatch.
import { useSyncExternalStore } from "react";
import { EMPTY_STATE, LAST_STEP, applyPick, parseSaved, type ForgeState } from "./picks";

const KEY = "site-forge:v1";

let state: ForgeState | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): ForgeState {
  if (state === null) {
    try {
      state = parseSaved(localStorage.getItem(KEY));
    } catch {
      state = EMPTY_STATE;
    }
  }
  return state;
}

function getServerSnapshot(): ForgeState {
  return EMPTY_STATE;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function set(next: ForgeState) {
  state = next;
  try {
    if (next === EMPTY_STATE) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked (private mode): picks still work, they just won't survive a refresh.
  }
  listeners.forEach((fn) => fn());
}

export function useForge() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ...s,
    pick: (stepIndex: number, itemId: string) => set(applyPick(getSnapshot().picks, stepIndex, itemId)),
    goTo: (step: number) => set({ ...getSnapshot(), step: Math.max(0, Math.min(LAST_STEP, step)) }),
    reset: () => set(EMPTY_STATE),
  };
}
