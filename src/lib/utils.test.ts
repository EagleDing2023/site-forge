import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("keeps a custom font size next to a colour", () => {
    expect(cn("text-small", "text-muted-2")).toBe("text-small text-muted-2");
    expect(cn("text-badge font-semibold", "bg-fit-bg text-fit-ink")).toBe("text-badge font-semibold bg-fit-bg text-fit-ink");
  });

  it("still merges two sizes", () => {
    expect(cn("text-small", "text-label")).toBe("text-label");
  });
});
