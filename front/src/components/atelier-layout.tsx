import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LogOut, Settings, UserRound, BellRing } from "lucide-react";
import avatarDirector from "@/assets/avatar-director.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useUnreadCount } from "@/lib/queries";
import { userName } from "@/lib/labels";
import { RequireAuth } from "@/components/require-auth";

const NAV = [
  { n: "01", to: "/", label: "Dashboard" },
  { n: "02", to: "/tasks", label: "Tasks" },
  { n: "03", to: "/planning", label: "Planning" },
  { n: "04", to: "/members", label: "Members" },
  { n: "05", to: "/moodboard", label: "Mood Board" },
  { n: "06", to: "/prototyping", label: "Prototyping" },
] as const;

export function AtelierLayout({
  eyebrow,
  title,
  efficiency = "—",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  efficiency?: string;
  children: ReactNode;
}) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: unread } = useUnreadCount();

  const displayName = user ? userName(user) : "—";
  const roleLabel = user?.role === "MANAGER" ? "Manager" : "Member";

  function handleLogout() {
    logout();
    toast("Disconnected from the atelier");
    navigate({ to: "/login" });
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-canvas text-charcoal">
        <nav className="fixed left-0 top-0 z-50 flex h-full w-20 flex-col items-center gap-10 border-r border-charcoal/10 bg-canvas py-8">
          <Link to="/" className="font-serif text-2xl font-semibold italic text-indigo-dye border-b-2 border-selvedge pb-1.5 leading-none">
            DH
          </Link>
          <div className="flex flex-col gap-4">
            {NAV.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              return (
                <Link
                  key={item.n}
                  to={item.to}
                  title={item.label}
                  className={[
                    "group relative grid size-10 place-items-center rounded-sm transition-all",
                    active
                      ? "bg-indigo-dye text-canvas shadow-[0_8px_24px_-12px_rgba(27,43,72,0.6)]"
                      : "border border-charcoal/15 text-charcoal/40 hover:border-indigo-dye hover:text-indigo-dye hover:-rotate-2",
                  ].join(" ")}
                >
                  <span className="font-mono text-[11px]">{item.n}</span>
                  <span className="pointer-events-none absolute left-12 z-10 whitespace-nowrap rounded-sm bg-charcoal px-2 py-1 text-[10px] uppercase tracking-widest text-canvas opacity-0 transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-auto flex flex-col items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-charcoal/40">
            <div className="h-8 w-px bg-charcoal/15" />
            <span className="[writing-mode:vertical-rl] rotate-180">EST. 1892</span>
          </div>
        </nav>

        <main className="pl-20">
          <header className="sticky top-0 z-40 flex items-end justify-between border-b border-charcoal/10 bg-canvas/85 px-12 py-7 backdrop-blur">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-charcoal/50">
                {eyebrow}
              </p>
              <h1 className="font-serif text-[2.5rem] font-semibold italic leading-[1.05] text-indigo-dye">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
                  Atelier Efficiency
                </p>
                <p className="font-mono text-xl tabular-nums text-selvedge">{efficiency}</p>
              </div>
              <div className="h-10 w-px bg-charcoal/15" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium leading-tight">{displayName}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
                    {roleLabel}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="Open profile menu"
                      className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-dye"
                    >
                      <img
                        src={user?.avatar ?? avatarDirector}
                        alt={displayName}
                        width={48}
                        height={48}
                        className="size-12 rounded-full object-cover ring-1 ring-charcoal/15 transition group-hover:ring-indigo-dye"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-canvas bg-selvedge" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="w-64 rounded-none border border-charcoal/15 bg-canvas p-0 font-sans shadow-[0_24px_60px_-30px_rgba(27,43,72,0.45)]"
                  >
                    <div className="border-b border-charcoal/10 bg-card px-4 py-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-charcoal/50">
                        Signed in as
                      </p>
                      <p className="mt-1 font-serif text-lg italic text-indigo-dye leading-tight">
                        {displayName}
                      </p>
                      <p className="font-mono text-[10px] text-charcoal/60">{user?.email}</p>
                    </div>
                    <DropdownMenuLabel className="px-4 pt-3 pb-1 font-mono text-[9px] uppercase tracking-[0.25em] text-charcoal/50">
                      Atelier
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild className="rounded-none px-4 py-2 text-sm">
                      <Link to="/members" className="flex items-center gap-3">
                        <UserRound className="size-4 text-indigo-dye" />
                        <span>My profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-none px-4 py-2 text-sm">
                      <BellRing className="mr-3 size-4 text-indigo-dye" />
                      Notifications
                      <span className="ml-auto font-mono text-[10px] text-selvedge">
                        {unread?.count ?? 0}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-none px-4 py-2 text-sm">
                      <Settings className="mr-3 size-4 text-indigo-dye" />
                      Workspace settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-0 bg-charcoal/10" />
                    <DropdownMenuItem
                      onSelect={handleLogout}
                      className="rounded-none px-4 py-3 text-sm font-medium text-selvedge focus:bg-selvedge/10 focus:text-selvedge"
                    >
                      <LogOut className="mr-3 size-4" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="pattern-grid p-12">{children}</div>

          <footer className="border-t border-charcoal/10 px-12 py-6 font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/40 flex justify-between">
            <span>Denim House R&D / Internal Workspace v2.4</span>
            <span>Archive Access — Restricted</span>
          </footer>
        </main>
      </div>
    </RequireAuth>
  );
}
