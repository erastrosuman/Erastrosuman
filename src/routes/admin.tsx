import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Star,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/services", label: "Services", icon: Star },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { isAdmin, isLoading, user } = useAdmin();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono">Checking session…</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLoginInline />;
  }

  function isActive(to: string) {
    if (to === "/admin") return pathname === "/admin" || pathname === "/admin/";
    return pathname.startsWith(to) && (to !== "/admin" || pathname === "/admin" || pathname === "/admin/");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Brand */}
        <div className="px-5 h-16 border-b border-slate-800 flex items-center gap-2.5">
          <span className="text-amber-400 text-lg">✦</span>
          <span className="font-semibold text-white text-sm tracking-tight">SudnadiAstro</span>
          <span className="ml-auto text-[10px] font-mono bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-amber-500/15 text-amber-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon size={16} className={active ? "text-amber-400" : "text-slate-500"} />
                {label}
                {active && <ChevronRight size={12} className="ml-auto text-amber-500/60" />}
              </Link>
            );
          })}
        </nav>

        {/* User + sign-out */}
        <div className="px-3 pb-4 border-t border-slate-800 pt-3">
          <div className="px-3 py-2 mb-1">
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col bg-slate-950">
        <Outlet />
      </main>
    </div>
  );
}

// ─── Inline login form ───────────────────────────────────────
// Shown inside the admin shell when the user is not authenticated,
// so there's no redirect loop risk.

function AdminLoginInline() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-amber-400 text-4xl">✦</span>
          <h1 className="mt-3 text-2xl font-semibold text-white">Admin Sign In</h1>
          <p className="mt-1 text-sm text-slate-400">SudnadiAstro dashboard</p>
        </div>
        <AdminLoginForm onSuccess={() => navigate({ to: "/admin" })} />
      </div>
    </div>
  );
}

function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
      } else {
        onSuccess();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3 rounded-lg text-sm transition-colors disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

// React import needed for useState in this file
import { useState } from "react";
