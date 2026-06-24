import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AtelierLayout } from "@/components/atelier-layout";
import {
  useTasks,
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
  formatDeadline,
  startOfWeek,
} from "@/lib/labels";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import type { Task, PlanningBlock } from "@/lib/types";

export const Route = createFileRoute("/member")({
  head: () => ({
    meta: [
      { title: "Member Workspace — Denim House R&D" },
      {
        name: "description",
        content:
          "Personal workspace for Denim House members: view assigned tasks, update status, and track progress.",
      },
    ],
  }),
  component: MemberDashboard,
});

function MemberDashboard() {
  const { user } = useAuth();
  const weekStart = startOfWeek();
  const { data: myTasks = [], isLoading: tasksLoading } = useTasks({ assignedUserId: user?.id || "" });
  const { data: alerts = [] } = useAlerts();
  const { data: planning = [] } = usePlanning(weekStart);
  const { data: moodBoards = [] } = useMoodBoards();
  const { data: prototypes = [] } = usePrototypes();

  const activeTasks = useMemo(
    () => myTasks.filter((t) => t.status !== "DONE"),
    [myTasks],
  );
  const completedTasks = useMemo(
    () => myTasks.filter((t) => t.status === "DONE"),
    [myTasks],
  );

  const myPlanning = useMemo(
    () => planning.filter((p) => p.userId === user?.id),
    [planning, user?.id],
  );

  const featuredProto = prototypes[0];
  const featuredBoard = moodBoards[0];

  return (
    <AtelierLayout
      eyebrow="Member Workspace"
      title={
        <>
          My Tasks — <span className="not-italic font-serif">{user?.firstName} {user?.lastName}</span>
        </>
      }
    >
      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 space-y-6 lg:col-span-8">
          <header className="flex items-center justify-between">
            <h2 className="font-serif text-2xl italic text-indigo-dye">My Active Tasks</h2>
            <span className="border border-selvedge/30 bg-selvedge/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-selvedge">
              {activeTasks.length} active
            </span>
          </header>

          {tasksLoading ? (
            <p className="font-mono text-sm text-charcoal/50">Loading tasks…</p>
          ) : activeTasks.length === 0 ? (
            <p className="font-mono text-sm text-charcoal/50">No active tasks assigned to you.</p>
          ) : (
            <div className="divide-y divide-charcoal/10 border border-charcoal/10 bg-card">
              {activeTasks.map((task) => (
                <MyTaskRow key={task.id} task={task} />
              ))}
            </div>
          )}

          {completedTasks.length > 0 && (
            <>
              <header className="flex items-center justify-between pt-4">
                <h2 className="font-serif text-xl italic text-charcoal/60">Completed</h2>
                <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
                  {completedTasks.length}
                </span>
              </header>
              <div className="divide-y divide-charcoal/10 border border-charcoal/10 bg-card opacity-60">
                {completedTasks.map((task) => (
                  <MyTaskRow key={task.id} task={task} />
                ))}
              </div>
            </>
          )}

          <PlanningPreview planning={myPlanning} weekStart={weekStart} />
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
                  <div className="aspect-square bg-charcoal/10" />
                )}
                {featuredBoard.images[1] ? (
                  <img
                    src={featuredBoard.images[1].url}
                    alt=""
                    className="aspect-square object-cover"
                  />
                ) : (
                  <div className="aspect-square bg-charcoal/10" />
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
                <div className="aspect-square bg-charcoal/10" />
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

function MyTaskRow({ task }: { task: Task }) {
  const dep = task.blockedBy?.[0]?.blockingTask?.title;
  const statusColors = {
    TODO: "bg-charcoal/10 text-charcoal/60",
    IN_PROGRESS: "bg-indigo-dye/10 text-indigo-dye",
    IN_REVIEW: "bg-stitch/10 text-stitch",
    DONE: "bg-selvedge/10 text-selvedge",
  };

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
        <span className={`inline-block px-2 py-0.5 ${statusColors[task.status]} rounded`}>
          {task.status.replace('_', ' ')}
        </span>
        {dep && (
          <span className="block mt-1 inline-flex items-center gap-1">
            <span className="size-1.5 bg-selvedge" /> blocked by {dep}
          </span>
        )}
        <span className="block mt-1">due · {formatDeadline(task.deadline)}</span>
      </div>
      <span className="col-span-1 text-right font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
        {PRIORITY_LABELS[task.priority]}
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
  const cells = Array.from({ length: 20 }, () => null as null | "indigo" | "stitch" | "selvedge");
  const weekStartDate = new Date(weekStart);

  for (const block of planning) {
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
    <div className="border border-charcoal/10 bg-card p-6">
      <div className="mb-4 flex items-end justify-between">
        <h3 className="font-serif text-xl italic text-indigo-dye">My Schedule — Today</h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
          08:00 → 18:00 · 30 min slots
        </span>
      </div>
      {planning.length === 0 ? (
        <p className="font-mono text-[10px] text-charcoal/40">No planning blocks today.</p>
      ) : (
        <div className="overflow-hidden">
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" } as React.CSSProperties}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="bg-canvas-warm px-1 py-1.5 text-center font-mono text-[8px] tabular-nums text-charcoal/40 border-l border-charcoal/5"
              >
                {(8 + Math.floor(i / 2)).toString().padStart(2, "0")}
                {i % 2 === 0 ? "" : ":30"}
              </div>
            ))}
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
          </div>
        </div>
      )}
    </div>
  );
}
