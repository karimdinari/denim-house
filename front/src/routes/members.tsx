import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AtelierLayout } from "@/components/atelier-layout";
import avatar from "@/assets/avatar-director.jpg";
import { useUsers, useUserWorkloads } from "@/lib/queries";
import {
  BACKGROUND_LABELS,
  SOFTWARE_LABELS,
  DOMAIN_LABELS,
  userName,
  userInitials,
} from "@/lib/labels";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members & Skills — Denim House R&D" },
      {
        name: "description",
        content: "Atelier roster with software proficiency, expertise domains and current workload.",
      },
    ],
  }),
  component: Members,
});

function Members() {
  const { data: users = [], isLoading } = useUsers();
  const memberIds = useMemo(() => users.map((u) => u.id), [users]);
  const { data: workloads = {} } = useUserWorkloads(memberIds);

  const stats = useMemo(() => {
    const members = users.filter((u) => u.role === "MEMBER");
    const loads = members.map((m) => {
      const w = workloads[m.id];
      if (!w) return 0;
      return Math.min(100, Math.round((w.totalMin / 480) * 100));
    });
    const avgLoad = loads.length
      ? Math.round(loads.reduce((a, b) => a + b, 0) / loads.length)
      : 0;
    const domains = new Set(
      users.flatMap((u) => u.expertises?.map((e) => e.domain) ?? []),
    );
    return {
      count: members.length,
      avgLoad,
      domains: domains.size,
    };
  }, [users, workloads]);

  return (
    <AtelierLayout eyebrow="Workspace / Atelier roster" title="Members & Expertise">
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { l: "Active members", v: String(stats.count) },
          { l: "Avg. load", v: `${stats.avgLoad}%` },
          { l: "Skill domains", v: String(stats.domains) },
          { l: "Open positions", v: "02" },
        ].map((s) => (
          <div key={s.l} className="border border-charcoal/10 bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
              {s.l}
            </p>
            <p className="mt-2 font-serif text-3xl italic text-indigo-dye tabular-nums">{s.v}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <p className="font-mono text-sm text-charcoal/50">Loading members…</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {users.map((m) => {
            const w = workloads[m.id];
            const load = w ? Math.min(100, Math.round((w.totalMin / 480) * 100)) : 0;
            const bg = m.background ? BACKGROUND_LABELS[m.background] : m.role;
            return (
              <article key={m.id} className="relative border border-charcoal/10 bg-card p-6">
                <div className="absolute -top-2 left-6 h-1 w-10 bg-stitch" />
                <header className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={m.avatar ?? avatar}
                      alt=""
                      width={64}
                      height={64}
                      className="size-16 rounded-full object-cover ring-1 ring-charcoal/15"
                    />
                    <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-canvas border border-charcoal/15 font-mono text-[9px]">
                      {userInitials(m)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl italic text-charcoal">{userName(m)}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
                      {bg} · {m.role}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-charcoal/40">
                      Load
                    </p>
                    <p
                      className={`font-mono text-xl tabular-nums ${load > 85 ? "text-selvedge" : "text-indigo-dye"}`}
                    >
                      {load}%
                    </p>
                  </div>
                </header>

                <div className="mt-5">
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-charcoal/50">
                    Software · 1—5
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(m.skills ?? []).map((s) => (
                      <div key={s.id} className="flex items-center gap-2">
                        <span className="w-20 font-mono text-[10px] uppercase tracking-widest text-charcoal/60">
                          {SOFTWARE_LABELS[s.software] ?? s.software}
                        </span>
                        <div className="flex flex-1 gap-0.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <span
                              key={n}
                              className={`h-1.5 flex-1 ${n <= s.level ? "bg-indigo-dye" : "bg-charcoal/10"}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {(m.expertises ?? []).map((d) => (
                    <span
                      key={d.id}
                      className="border border-charcoal/15 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-charcoal/60"
                    >
                      {DOMAIN_LABELS[d.domain] ?? d.domain}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AtelierLayout>
  );
}
