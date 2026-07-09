import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/bookings")({ component: AdminBookings });

function AdminBookings() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Bookings</h1>
      <p className="text-slate-400 text-sm">Booking management coming soon — use the Overview stats for now.</p>
    </div>
  );
}
