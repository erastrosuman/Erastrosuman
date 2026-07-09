import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/messages")({ component: AdminMessages });

function AdminMessages() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Messages</h1>
      <p className="text-slate-400 text-sm">Contact message management coming soon.</p>
    </div>
  );
}
