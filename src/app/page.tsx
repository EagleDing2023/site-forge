import { Rail, type RailStep } from "@/components/rail";
import { TopBar } from "@/components/top-bar";
// Temporary: step 2 replaces this with the typed src/data/catalog.ts.
import { STEPS } from "../../site-forge-handoff/data/catalog.js";

const railSteps: RailStep[] = STEPS.map((s: { id: string; name: string; layer: string; kind: string }) => ({
  id: s.id,
  name: s.name,
  layer: s.layer,
  chosen: s.kind === "export" ? "DESIGN.md · prompt · tokens" : "—",
  done: false,
}));

export default function Home() {
  return (
    <div className="min-h-screen">
      <TopBar pickCount={0} />
      <div className="flex flex-wrap items-start gap-4 p-4">
        <Rail steps={railSteps} activeIndex={0} />
        <main className="min-h-[560px] min-w-0 flex-[999_1_520px] rounded-xl border border-line bg-surface p-6 max-[760px]:p-4" />
      </div>
    </div>
  );
}
