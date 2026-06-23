import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AtelierLayout } from "@/components/atelier-layout";
import { useTasks } from "@/lib/queries";
import {
  FAMILY_LABELS,
  PRIORITY_LABELS,
  taskRef,
  userName,
} from "@/lib/labels";
import type { Task, TaskFamily, TaskStatus } from "@/lib/types";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Kanban — Denim House R&D" },
      {
        name: "description",
        content:
          "Drag-and-drop task board across 18 task types, with smart assignment recommendations.",
      },
    ],
  }),
  component: Tasks,
});

type ColKey = "queue" | "assigned" | "progress" | "qc" | "done";

const COLS: { key: ColKey; label: string; status: TaskStatus | TaskStatus[] }[] = [
  { key: "queue", label: "In Queue", status: "TODO" },
  { key: "assigned", label: "Assigned", status: "TODO" },
  { key: "progress", label: "In Progress", status: "IN_PROGRESS" },
  { key: "qc", label: "Quality Control", status: "IN_REVIEW" },
  { key: "done", label: "Archived", status: "DONE" },
];

const FAMILIES: (TaskFamily | "all")[] = [
  "all",
  "THREE_D_DIGITAL",
  "VISUAL_CREATIVE",
  "PRODUCT_FABRICATION",
  "IMMERSIVE",
];

function kanbanCol(task: Task): ColKey {
  if (task.status === "DONE") return "done";
  if (task.status === "IN_REVIEW") return "qc";
  if (task.status === "IN_PROGRESS") return "progress";
  if (task.assignedUserId) return "assigned";
  return "queue";
}

function Tasks() {
  const [family, setFamily] = useState<TaskFamily | "all">("all");
  const params = family !== "all" ? { family } : undefined;
  const { data: tasks = [], isLoading } = useTasks(params);

  const counts = useMemo(() => {
    const c: Record<ColKey, number> = {
      queue: 0,
      assigned: 0,
      progress: 0,
      qc: 0,
      done: 0,
    };
    for (const t of tasks) c[kanbanCol(t)]++;
    return c;
  }, [tasks]);

  return (
    <AtelierLayout eyebrow="Workspace / Kanban" title="Atelier Floor — 18 Task Types">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest">
          {FAMILIES.map((f) => (
            <button
              key={f}
              onClick={() => setFamily(f)}
              className={[
                "border-b pb-1",
                family === f
                  ? "border-indigo-dye text-indigo-dye"
                  : "border-transparent text-charcoal/40 hover:text-charcoal",
              ].join(" ")}
            >
              {f === "all" ? "All families" : FAMILY_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="font-mono text-sm text-charcoal/50">Loading tasks…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {COLS.map((col) => (
            <div key={col.key} className="flex flex-col">
              <header className="mb-3 flex items-baseline justify-between border-b border-charcoal/15 pb-2">
                <h3 className="font-serif text-base italic text-indigo-dye">{col.label}</h3>
                <span className="font-mono text-[10px] tabular-nums text-charcoal/40">
                  {String(counts[col.key]).padStart(2, "0")}
                </span>
              </header>
              <div className="space-y-3">
                {tasks
                  .filter((t) => kanbanCol(t) === col.key)
                  .map((c) => (
                    <article
                      key={c.id}
                      className="group relative cursor-grab bg-card border border-charcoal/10 p-4 transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(18,18,18,0.25)]"
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-8 bg-charcoal/10 rounded-full" />
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-charcoal/50">
                          {FAMILY_LABELS[c.family]}
                        </span>
                        <span
                          className={[
                            "font-mono text-[9px] uppercase tracking-widest",
                            c.priority === "HIGH" || c.priority === "CRITICAL"
                              ? "text-selvedge"
                              : c.priority === "MEDIUM"
                                ? "text-stitch"
                                : "text-charcoal/40",
                          ].join(" ")}
                        >
                          {PRIORITY_LABELS[c.priority]}
                        </span>
                      </div>
                      <h4 className="font-medium leading-snug text-[14px]">{c.title}</h4>
                      <div className="mt-4 flex items-center justify-between border-t border-charcoal/5 pt-2 font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
                        <span>{taskRef(c.id)}</span>
                        <span>
                          {c.assignedTo ? userName(c.assignedTo) : "— unassigned"}
                        </span>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AtelierLayout>
  );
}
