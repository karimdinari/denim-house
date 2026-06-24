import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ApiError, apiClient } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in — Denim House R&D" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("manager@denim.house");
  const [password, setPassword] = useState("manager123");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  if (user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      // Redirect based on role
      const { user } = await apiClient.me();
      if (user.role === "MANAGER") {
        navigate({ to: "/" });
      } else {
        navigate({ to: "/member" });
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md border border-charcoal/10 bg-card p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-charcoal/50">
          Denim House R&D
        </p>
        <h1 className="mt-2 font-serif text-3xl italic text-indigo-dye">Atelier Workspace</h1>
        <p className="mt-2 text-sm text-charcoal/60">Sign in with your manager account.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-charcoal/15 bg-canvas px-3 py-2 text-sm focus:border-indigo-dye focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full border border-charcoal/15 bg-canvas px-3 py-2 text-sm focus:border-indigo-dye focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-dye py-3 font-mono text-[10px] uppercase tracking-widest text-canvas hover:bg-charcoal disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 font-mono text-[9px] uppercase tracking-widest text-charcoal/40">
          Demo: manager@denim.house / manager123
        </p>
      </div>
    </div>
  );
}
