import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AtelierLayout } from "@/components/atelier-layout";
import { usePlanning, useUsers } from "@/lib/queries";
import { startOfWeek, userName } from "@/lib/labels";
import type { PlanningBlock } from "@/lib/types";

export const Route = createFileRoute("/planning")({
  head: () => ({
    meta: [
      { title: "Planning — Denim House R&D" },
      {
        name: "description",
        content:
          "30-minute slot grid with 8h/day cap and automatic absence and holiday exclusion.",
      },
    ],
  }),
  component: Planning,
});

function Planning() {
  const weekStart = startOfWeek();
  const { data: blocks = [], isLoading } = usePlanning(weekStart);
  const { data: users = [] } = useUsers();

  const days = useMemo(() => {
    const start = new Date(weekStart);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return {
        label: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" }),
        date: d.toISOString().slice(0, 10),
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
      };
    });
  }, [weekStart]);

  const artisans = useMemo(() => {
    const members = users.filter((u) => u.role === "MEMBER");
    return members.map((u) => ({
      id: u.id,
      name: userName(u),
      role: u.background ?? u.role,
    }));
  }, [users]);

  const blocksByUserDay = useMemo(() => {
    const map = new Map<string, PlanningBlock[]>();
    for (const b of blocks) {
      const dateKey = new Date(b.date).toISOString().slice(0, 10);
      const key = `${b.userId}:${dateKey}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    }
    return map;
  }, [blocks]);

  const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i);

  return (
    <AtelierLayout eyebrow="Workspace / Planning · 30-min slots" title="The Loom — This Week">
      {isLoading ? (
        <p className="font-mono text-sm text-charcoal/50">Loading planning…</p>
      ) : (
        <>
          <div className="border border-charcoal/10 bg-card">
            <div
              className="grid border-b border-charcoal/10"
              style={{ gridTemplateColumns: "180px repeat(7, minmax(0,1fr))" }}
            >
              <div className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
                Artisan
              </div>
              {days.map((d) => (
                <div
                  key={d.date}
                  className={[
                    "px-3 py-3 border-l border-charcoal/10 font-mono text-[10px] uppercase tracking-widest",
                    d.isWeekend ? "text-charcoal/30 bg-canvas-warm" : "text-charcoal/60",
                  ].join(" ")}
                >
                  {d.label}
                </div>
              ))}
            </div>

            {artisans.map((a) => (
              <div
                key={a.id}
                className="grid border-b border-charcoal/10 last:border-0"
                style={{ gridTemplateColumns: "180px repeat(7, minmax(0,1fr))" }}
              >
                <div className="px-4 py-4">
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
                    {a.role}
                  </p>
                </div>
                {days.map((d) => (
                  <DayCell
                    key={d.date}
                    day={d}
                    blocks={blocksByUserDay.get(`${a.id}:${d.date}`) ?? []}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
              08:00 → 18:00
            </span>
            <div className="flex flex-1 gap-px">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="flex-1 border-l border-charcoal/15 pl-1 py-1 font-mono text-[9px] tabular-nums text-charcoal/40"
                >
                  {h}:00
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AtelierLayout>
  );
}

function DayCell({
  day,
  blocks,
}: {
  day: { isWeekend: boolean; date: string };
  blocks: PlanningBlock[];
}) {
  if (day.isWeekend) {
    return <div className="border-l border-charcoal/10 bg-canvas-warm/60" />;
  }

  return (
    <div className="border-l border-charcoal/10 p-2 space-y-1.5 min-h-[110px]">
      {blocks.map((b) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);
        const durationH = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(1);
        const isOverload = parseFloat(durationH) > 4;
        return (
          <div
            key={b.id}
            className={[
              "px-2 py-1.5 font-mono text-[10px] leading-tight",
              isOverload
                ? "bg-selvedge/10 text-selvedge border-l-2 border-selvedge"
                : "bg-indigo-dye text-canvas",
            ].join(" ")}
          >
            <div className="uppercase tracking-widest text-[9px]">
              {start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {durationH}h
            </div>
            <div className="font-sans not-italic text-[11px] font-medium truncate">
              {b.task?.title ?? "Task"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
