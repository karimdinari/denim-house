import { createFileRoute } from "@tanstack/react-router";
import { AtelierLayout } from "@/components/atelier-layout";
import { usePrototypes } from "@/lib/queries";
import { PHASE_LABELS, PHASES_ORDER, taskRef } from "@/lib/labels";
import type { PrototypePhase } from "@/lib/types";

export const Route = createFileRoute("/prototyping")({
  head: () => ({
    meta: [
      { title: "Prototyping — Denim House R&D" },
      {
        name: "description",
        content:
          "Phase tracking across Esquisse, Patronage, Coupe, Assemblage, Lavage and QC.",
      },
    ],
  }),
  component: Proto,
});

function Proto() {
  const { data: protos = [], isLoading } = usePrototypes();

  return (
    <AtelierLayout eyebrow="Workspace / Prototype phases" title="From Esquisse to QC">
      {isLoading ? (
        <p className="font-mono text-sm text-charcoal/50">Loading prototypes…</p>
      ) : protos.length === 0 ? (
        <p className="font-mono text-sm text-charcoal/50">No prototypes yet.</p>
      ) : (
        <div className="space-y-5">
          {protos.map((p) => {
            const phaseIdx = PHASES_ORDER.indexOf(p.currentPhase);
            const due = new Date(p.createdAt);
            due.setDate(due.getDate() + 30);
            return (
              <article key={p.id} className="border border-charcoal/10 bg-card p-6">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
                      Ref · {taskRef(p.id)}
                    </p>
                    <h3 className="font-serif text-2xl italic text-charcoal">{p.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
                      Due
                    </p>
                    <p className="font-mono text-lg tabular-nums text-indigo-dye">
                      {due.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>

                <PhaseGrid currentPhase={p.currentPhase} phaseIdx={phaseIdx} />
              </article>
            );
          })}
        </div>
      )}
    </AtelierLayout>
  );
}

function PhaseGrid({
  currentPhase,
  phaseIdx,
}: {
  currentPhase: PrototypePhase;
  phaseIdx: number;
}) {
  return (
    <div className="grid grid-cols-6 gap-px bg-charcoal/10 border border-charcoal/10">
      {PHASES_ORDER.map((ph, i) => {
        const done = i < phaseIdx;
        const active = ph === currentPhase;
        return (
          <div
            key={ph}
            className={[
              "p-3 bg-canvas relative min-h-[88px]",
              active && "bg-indigo-dye text-canvas",
              done && "bg-canvas-warm",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <p
              className={`font-mono text-[9px] uppercase tracking-widest ${active ? "text-stitch" : "text-charcoal/40"}`}
            >
              {String(i + 1).padStart(2, "0")} · {done ? "done" : active ? "now" : "queued"}
            </p>
            <p
              className={`mt-2 text-sm font-semibold uppercase tracking-wide ${active ? "" : done ? "text-charcoal" : "text-charcoal/40"}`}
            >
              {PHASE_LABELS[ph]}
            </p>
            {active && (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-stitch animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
}
