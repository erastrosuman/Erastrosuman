import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/free-astrology")({
  component: FreeAstrologyLayout,
});

function FreeAstrologyLayout() {
  return <Outlet />;
}
