import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Settings</h1>
      <p className="text-slate-400 text-sm">Site settings management coming soon.</p>
    </div>
  );
}
