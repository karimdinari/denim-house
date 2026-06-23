import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AtelierLayout } from "@/components/atelier-layout";
import moodDenim from "@/assets/mood-denim.jpg";
import moodAtelier from "@/assets/mood-atelier.jpg";
import moodConcrete from "@/assets/mood-concrete.jpg";
import {
  useTasks,
  useScoring,
  useAssignTask,
  useAlerts,
  usePlanning,
  useMoodBoards,
  usePrototypes,
} from "@/lib/queries";
import {
  FAMILY_LABELS,
  PRIORITY_LABELS,
  PHASE_LABELS,
  PHASES_ORDER,
  ALERT_KIND,
  alertTone,
  taskRef,
  userName,
  formatDeadline,
  startOfWeek,
} from "@/lib/labels";
import { toast } from "sonner";
import type { Task, PlanningBlock } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atelier Workspace — Denim House R&D" },
      {
        name: "description",
        content:
          "Real-time R&D dashboard for the Denim House atelier: tasks, smart assignments, prototyping phases and creative direction.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const weekStart = startOfWeek();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: alerts = [] } = useAlerts();
  const { data: planning = [] } = usePlanning(weekStart);
  const { data: moodBoards = [] } = useMoodBoards();
  const { data: prototypes = [] } = usePrototypes();
  const assignTask = useAssignTask();

  const activeTasks = useMemo(
    () => tasks.filter((t) => t.status !== "DONE").slice(0, 5),
    [tasks],
  );
  const featured = activeTasks[0];
  const { data: scoring } = useScoring(featured?.id);

  const topCandidate = scoring?.recommendations[0];
  const bottleneckCount = alerts.filter((a) => a.type === "BOTTLENECK").length;

  const featuredProto = prototypes[0];
  const featuredBoard = moodBoards[0];

  async function handleAssign() {
    if (!featured || !topCandidate) return;
    try {
      await assignTask.mutateAsync({
        taskId: featured.id,
        userId: topCandidate.user.id,
      });
      toast.success(`Assigned to ${userName(topCandidate.user)}`);
    } catch {
      toast.error("Assignment failed");
    }
  }

  return (
    <AtelierLayout
      eyebrow="Workspace / R&D Management"
      title={
        <>
          Autumn &apos;24 — <span className="not-italic font-serif">Selvedge</span> Collection
        </>
      }
    >
      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 space-y-6 lg:col-span-8">
          <header className="flex items-center justify-between">
            <h2 className="font-serif text-2xl italic text-indigo-dye">Active Task Assignments</h2>
            <span className="border border-selvedge/30 bg-selvedge/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-selvedge">
              {bottleneckCount} bottlenecks detected
            </span>
          </header>

          {tasksLoading ? (
            <p className="font-mono text-sm text-charcoal/50">Loading tasks…</p>
          ) : featured ? (
            <article className="relative bg-card border border-charcoal/10 p-7">
              <div className="absolute -top-2 left-8 h-1 w-12 bg-stitch" aria-hidden />
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <span className="inline-block bg-indigo-dye/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-indigo-dye">
                    {FAMILY_LABELS[featured.family]}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-semibold italic text-charcoal">
                    {featured.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-charcoal/50">
                    Ref · {taskRef(featured.id)} &nbsp;·&nbsp; Priority ·{" "}
                    {PRIORITY_LABELS[featured.priority]}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
                    Smart Score
                  </span>
                  <span className="font-mono text-4xl tabular-nums text-indigo-dye">
                    {topCandidate?.scores.total ?? "—"}
                  </span>
                </div>
              </div>

              {topCandidate && (
                <div className="mt-6 grid grid-cols-12 gap-6 border-t border-charcoal/10 pt-6">
                  <div className="col-span-12 lg:col-span-5 border-l-2 border-indigo-dye bg-canvas-warm p-4">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-charcoal/50">
                      Top recommendation
                    </p>
                    <p className="mt-2 font-serif text-xl italic">
                      {userName(topCandidate.user)}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/60">
                      Load · {topCandidate.workloadHours}h / 8h
                    </p>
                    <button
                      onClick={handleAssign}
                      disabled={assignTask.isPending}
                      className="mt-4 inline-flex items-center gap-2 bg-indigo-dye px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-canvas transition active:scale-95 hover:bg-charcoal disabled:opacity-50"
                    >
                      Assign &amp; start →
                    </button>
                  </div>

                  <div className="col-span-12 lg:col-span-7">
                    <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-charcoal/50">
                      Score breakdown
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: "Software", key: "skill" as const, w: 35 },
                        { label: "Expertise", key: "domain" as const, w: 25 },
                        { label: "Availability", key: "availability" as const, w: 25 },
                        { label: "History", key: "history" as const, w: 15 },
                      ].map((b) => (
                        <div key={b.label} className="grid grid-cols-12 items-center gap-3">
                          <span className="col-span-3 font-mono text-[11px] uppercase tracking-widest text-charcoal/60">
                            {b.label}
                          </span>
                          <div className="col-span-7 h-2 bg-charcoal/5">
                            <div
                              className="h-full bg-indigo-dye"
                              style={{ width: `${topCandidate.scores[b.key]}%` }}
                            />
                          </div>
                          <span className="col-span-2 text-right font-mono text-[11px] tabular-nums text-charcoal/70">
                            {topCandidate.scores[b.key]}{" "}
                            <span className="text-charcoal/30">/{b.w}%</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          ) : (
            <p className="font-mono text-sm text-charcoal/50">No active tasks.</p>
          )}

          <div className="divide-y divide-charcoal/10 border border-charcoal/10 bg-card">
            {activeTasks.slice(1).map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </div>

          <PlanningPreview planning={planning} weekStart={weekStart} />
        </section>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          {featuredProto && <ProtoPanel proto={featuredProto} />}

          {featuredBoard && (
            <div className="border border-charcoal/10 bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-mono text-[11px] uppercase tracking-widest">
                  Atmosphere · {featuredBoard.collection ?? featuredBoard.title}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {featuredBoard.images[0] ? (
                  <img
                    src={featuredBoard.images[0].url}
                    alt=""
                    className="aspect-square object-cover"
                  />
                ) : (
                  <img src={moodDenim} alt="" className="aspect-square object-cover" />
                )}
                {featuredBoard.images[1] ? (
                  <img
                    src={featuredBoard.images[1].url}
                    alt=""
                    className="aspect-square object-cover"
                  />
                ) : (
                  <img src={moodAtelier} alt="" className="aspect-square object-cover" />
                )}
                <div className="aspect-square bg-indigo-dye p-3 text-canvas flex flex-col justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest opacity-60">
                    Anchor hue
                  </span>
                  <div>
                    <p className="font-serif text-2xl italic">
                      {featuredBoard.colors[0]?.hex ?? "Raw Indigo"}
                    </p>
                  </div>
                </div>
                <img src={moodConcrete} alt="" className="aspect-square object-cover" />
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1">
                {(featuredBoard.colors.length
                  ? featuredBoard.colors
                  : [{ hex: "#1B2B48" }]
                ).map((c) => (
                  <div key={c.hex} className="space-y-1">
                    <div className="aspect-square" style={{ backgroundColor: c.hex }} />
                    <p className="font-mono text-[8px] uppercase tracking-widest text-charcoal/50 text-center">
                      {c.hex.slice(1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-charcoal/60">
              Live alerts
            </h2>
            {alerts.length === 0 ? (
              <p className="font-mono text-[10px] text-charcoal/40">No active alerts.</p>
            ) : (
              alerts.slice(0, 5).map((a) => {
                const tone = alertTone(a.type);
                const toneClass =
                  tone === "selvedge"
                    ? "border-selvedge bg-selvedge/5 text-selvedge"
                    : tone === "stitch"
                      ? "border-stitch bg-stitch/5 text-stitch"
                      : "border-indigo-dye bg-indigo-dye/5 text-indigo-dye";
                return (
                  <div key={a.id} className={`border-l-4 ${toneClass} p-4`}>
                    <p className="font-mono text-[10px] uppercase tracking-widest font-semibold">
                      {ALERT_KIND[a.type]}
                    </p>
                    <p className="mt-1 font-serif text-sm italic text-charcoal leading-snug">
                      {a.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </AtelierLayout>
  );
}

function TaskRow({ task }: { task: Task }) {
  const dep = task.blockedBy?.[0]?.blockingTask?.title;
  return (
    <div className="grid grid-cols-12 items-center gap-4 p-5">
      <span className="col-span-2 font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
        {taskRef(task.id)}
      </span>
      <div className="col-span-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
          {FAMILY_LABELS[task.family]}
        </p>
        <p className="font-medium text-[15px] leading-snug">{task.title}</p>
      </div>
      <div className="col-span-3 font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
        {dep && (
          <span className="inline-flex items-center gap-1">
            <span className="size-1.5 bg-selvedge" /> dep · {dep}
          </span>
        )}
        <span className="block">due · {formatDeadline(task.deadline)}</span>
      </div>
      <span className="col-span-1 text-right font-mono text-xl tabular-nums text-charcoal/70">
        —
      </span>
    </div>
  );
}

function ProtoPanel({ proto }: { proto: import("@/lib/types").Prototype }) {
  const phaseIdx = PHASES_ORDER.indexOf(proto.currentPhase);
  return (
    <div className="relative bg-indigo-dye text-canvas p-7 overflow-hidden">
      <div className="absolute right-0 top-0 stitched-y h-full w-px text-stitch/60" aria-hidden />
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-serif text-xl italic">{proto.name}</h2>
        <span className="font-mono text-[9px] uppercase tracking-widest text-canvas/50">
          Phase {String(phaseIdx + 1).padStart(2, "0")} / 06
        </span>
      </div>
      <ol className="relative space-y-5">
        <span className="absolute left-[7px] top-2 bottom-2 w-px bg-canvas/20" aria-hidden />
        {PHASES_ORDER.map((ph, i) => {
          const state = i < phaseIdx ? "done" : i === phaseIdx ? "active" : "pending";
          return (
            <li key={ph} className="flex items-start gap-4">
              <span
                className={[
                  "z-10 mt-1 size-4 rounded-full border-2 border-canvas",
                  state === "done"
                    ? "bg-canvas"
                    : state === "active"
                      ? "bg-stitch animate-pulse"
                      : "bg-indigo-dye",
                ].join(" ")}
              />
              <div className={state === "pending" ? "opacity-40" : ""}>
                <p
                  className={[
                    "font-mono text-[9px] uppercase tracking-widest",
                    state === "active" ? "text-stitch" : "text-canvas/50",
                  ].join(" ")}
                >
                  {state === "done" ? "Complete" : state === "active" ? "In progress" : "Pending"}
                </p>
                <p className="text-sm font-semibold uppercase tracking-wide">
                  {PHASE_LABELS[ph]}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PlanningPreview({
  planning,
  weekStart,
}: {
  planning: PlanningBlock[];
  weekStart: string;
}) {
  const byUser = useMemo(() => {
    const map = new Map<string, { name: string; blocks: PlanningBlock[] }>();
    for (const block of planning) {
      if (!block.user) continue;
      const key = block.user.id;
      if (!map.has(key)) {
        map.set(key, { name: userName(block.user), blocks: [] });
      }
      map.get(key)!.blocks.push(block);
    }
    return [...map.values()].slice(0, 4);
  }, [planning]);

  return (
    <div className="border border-charcoal/10 bg-card p-6">
      <div className="mb-4 flex items-end justify-between">
        <h3 className="font-serif text-xl italic text-indigo-dye">Loom — This week</h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
          08:00 → 18:00 · 30 min slots
        </span>
      </div>
      {byUser.length === 0 ? (
        <p className="font-mono text-[10px] text-charcoal/40">No planning blocks this week.</p>
      ) : (
        <div className="overflow-hidden">
          <div
            className="grid"
            style={{ gridTemplateColumns: "120px repeat(20, minmax(0,1fr))" }}
          >
            <div className="bg-canvas-warm px-2 py-1.5 font-mono text-[9px] uppercase tracking-widest text-charcoal/40">
              Artisan
            </div>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="bg-canvas-warm px-1 py-1.5 text-center font-mono text-[8px] tabular-nums text-charcoal/40 border-l border-charcoal/5"
              >
                {(8 + Math.floor(i / 2)).toString().padStart(2, "0")}
                {i % 2 === 0 ? "" : ":30"}
              </div>
            ))}
            {byUser.map((row) => (
              <RowSlot key={row.name} name={row.name} blocks={row.blocks} weekStart={weekStart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RowSlot({
  name,
  blocks,
  weekStart,
}: {
  name: string;
  blocks: PlanningBlock[];
  weekStart: string;
}) {
  const cells = Array.from({ length: 20 }, () => null as null | "indigo" | "stitch" | "selvedge");
  const weekStartDate = new Date(weekStart);

  for (const block of blocks) {
    const blockDate = new Date(block.date);
    if (blockDate.toDateString() !== weekStartDate.toDateString()) continue;
    const start = new Date(block.startTime);
    const end = new Date(block.endTime);
    const startSlot = (start.getHours() - 8) * 2 + (start.getMinutes() >= 30 ? 1 : 0);
    const endSlot = (end.getHours() - 8) * 2 + (end.getMinutes() >= 30 ? 1 : 0);
    const tone: "indigo" | "stitch" | "selvedge" =
      endSlot - startSlot > 8 ? "selvedge" : "indigo";
    for (let i = startSlot; i < endSlot && i < 20; i++) cells[i] = tone;
  }

  return (
    <>
      <div className="border-t border-charcoal/5 px-2 py-2 text-sm font-medium">{name}</div>
      {cells.map((c, i) => (
        <div key={i} className="border-l border-t border-charcoal/5 h-9 p-0.5">
          {c && (
            <div
              className={[
                "h-full",
                c === "indigo" && "bg-indigo-dye",
                c === "stitch" && "bg-stitch",
                c === "selvedge" && "bg-selvedge",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          )}
        </div>
      ))}
    </>
  );
}
