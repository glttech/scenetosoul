import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/packs")({
  component: () => <Outlet />,
});

// Force re-mount on pathname change for nested children if needed.
void useRouterState;