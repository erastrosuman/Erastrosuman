import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listServicesAdmin, deleteService, duplicateService } from "@/lib/api/admin.functions";
import { getAuthToken } from "@/lib/auth";
import type { ServiceRow } from "@/types/database";
import { Plus, Pencil, Copy, EyeOff, Eye, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/services")({ component: AdminServices });

function AdminServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null); // ID currently being acted on

  async function load() {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No auth token.");
      const result = await listServicesAdmin({ data: { authToken: token } });
      setServices(result.services as ServiceRow[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleToggleActive(service: ServiceRow) {
    setActionId(service.id);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No auth token.");
      const { updateService } = await import("@/lib/api/admin.functions");
      await updateService({ data: { authToken: token, id: service.id, updates: { active: !service.active } } });
      setServices((prev) => prev.map((s) => s.id === service.id ? { ...s, active: !s.active } : s));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to toggle.");
    } finally {
      setActionId(null);
    }
  }

  async function handleDuplicate(id: string) {
    setActionId(id);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No auth token.");
      const result = await duplicateService({ data: { authToken: token, id } });
      setServices((prev) => [...prev, result.service as ServiceRow]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to duplicate.");
    } finally {
      setActionId(null);
    }
  }

  const CATEGORY_COLORS: Record<string, string> = {
    personal: "bg-amber-500/10 text-amber-400",
    professional: "bg-blue-500/10 text-blue-400",
    relationship: "bg-pink-500/10 text-pink-400",
    remedies: "bg-green-500/10 text-green-400",
    health: "bg-orange-500/10 text-orange-400",
    specialized: "bg-purple-500/10 text-purple-400",
    education: "bg-cyan-500/10 text-cyan-400",
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Services</h1>
          <p className="text-sm text-slate-400 mt-1">{services.length} readings total</p>
        </div>
        <Link
          to="/admin/services/$id"
          params={{ id: "new" }}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Plus size={16} /> New service
        </Link>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-400 py-12">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading services…</span>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-5 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Service</th>
                <th className="px-3 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Category</th>
                <th className="px-3 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Price</th>
                <th className="px-3 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-3 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Order</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {services.map((s) => (
                <tr key={s.id} className={`hover:bg-slate-800/50 transition-colors ${!s.active ? "opacity-50" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-slate-800">
                        {s.image_url ? (
                          <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-saffron text-lg">✦</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{s.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{s.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${CATEGORY_COLORS[s.category] ?? "bg-slate-700 text-slate-300"}`}>
                      {s.category}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-amber-400 font-semibold">₹{Number(s.price).toLocaleString("en-IN")}</td>
                  <td className="px-3 py-4">
                    <button
                      type="button"
                      disabled={actionId === s.id}
                      onClick={() => handleToggleActive(s)}
                      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                        s.active
                          ? "bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400"
                          : "bg-slate-700 text-slate-400 hover:bg-green-500/10 hover:text-green-400"
                      }`}
                    >
                      {actionId === s.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : s.active ? (
                        <><Eye size={10} /> Active</>
                      ) : (
                        <><EyeOff size={10} /> Inactive</>
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-4 text-slate-500 tabular-nums">{s.sort_order}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(s.id)}
                        disabled={actionId === s.id}
                        title="Duplicate"
                        className="w-8 h-8 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white inline-flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        {actionId === s.id ? <Loader2 size={13} className="animate-spin" /> : <Copy size={13} />}
                      </button>
                      <Link
                        to="/admin/services/$id"
                        params={{ id: s.id }}
                        className="w-8 h-8 rounded-md bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 inline-flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && !loading && (
            <div className="px-5 py-16 text-center text-slate-500">
              <p>No services yet.</p>
              <Link to="/admin/services/$id" params={{ id: "new" }} className="mt-3 inline-block text-amber-500 hover:text-amber-400 text-sm underline">
                Create your first service
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
