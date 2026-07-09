import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminStats } from "@/lib/api/admin.functions";
import { getAuthToken } from "@/lib/auth";
import {
  BookOpen,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

type Stats = Awaited<ReturnType<typeof getAdminStats>>["stats"];
type RecentBooking = Awaited<ReturnType<typeof getAdminStats>>["recentBookings"][number];

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending_payment: { label: "Pending", cls: "bg-yellow-500/15 text-yellow-400" },
  paid:            { label: "Paid",    cls: "bg-blue-500/15 text-blue-400" },
  processing:      { label: "Processing", cls: "bg-purple-500/15 text-purple-400" },
  completed:       { label: "Done",    cls: "bg-green-500/15 text-green-400" },
  cancelled:       { label: "Cancelled", cls: "bg-slate-500/15 text-slate-400" },
  failed:          { label: "Failed",  cls: "bg-red-500/15 text-red-400" },
};

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "text-amber-400",
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: string;
  sub?: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">{label}</span>
        <Icon size={16} className={accent} />
      </div>
      <p className="font-display text-3xl text-white font-semibold">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const token = await getAuthToken();
        if (!token) throw new Error("No auth token.");
        const result = await getAdminStats({ data: { authToken: token } });
        setStats(result.stats);
        setRecent(result.recentBookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Live snapshot of your bookings and messages.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading stats…</span>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Bookings"
              value={stats.totalBookings}
              icon={BookOpen}
              accent="text-amber-400"
            />
            <StatCard
              label="Revenue"
              value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
              icon={DollarSign}
              accent="text-green-400"
            />
            <StatCard
              label="Unread Messages"
              value={stats.unreadMessages}
              icon={MessageSquare}
              accent="text-blue-400"
              sub={`${stats.totalContactMessages} total`}
            />
            <StatCard
              label="Completed"
              value={stats.completedBookings}
              icon={CheckCircle}
              accent="text-green-400"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Paid (unprocessed)"
              value={stats.paidBookings}
              icon={TrendingUp}
              accent="text-blue-400"
            />
            <StatCard
              label="Pending Payment"
              value={stats.pendingBookings}
              icon={Clock}
              accent="text-yellow-400"
            />
            <StatCard
              label="Failed Orders"
              value={stats.failedOrders}
              icon={XCircle}
              accent="text-red-400"
            />
            <StatCard
              label="All Messages"
              value={stats.totalContactMessages}
              icon={AlertCircle}
              accent="text-slate-400"
            />
          </div>
        </>
      )}

      {/* Top Services */}
      {stats && Object.keys(stats.bookingsByService).length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">Bookings by service</h2>
          <div className="space-y-2">
            {Object.entries(stats.bookingsByService)
              .sort(([, a], [, b]) => b - a)
              .map(([name, count]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{name}</span>
                  <span className="text-sm font-semibold text-amber-400">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      {recent.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500">Recent bookings</h2>
          </div>
          <div className="divide-y divide-slate-800">
            {recent.map((b) => {
              const badge = STATUS_BADGE[b.status] ?? { label: b.status, cls: "bg-slate-700 text-slate-300" };
              return (
                <div key={b.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{b.customerName}</p>
                    <p className="text-xs text-slate-500 truncate">{b.serviceName} · {b.customerEmail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-amber-400">₹{Number(b.amount).toLocaleString("en-IN")}</p>
                    <span className={`inline-block mt-0.5 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
