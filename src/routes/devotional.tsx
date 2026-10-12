import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/devotional")({
  component: DevotionalLayout,
});

function DevotionalLayout() {
  return <Outlet />;
}
