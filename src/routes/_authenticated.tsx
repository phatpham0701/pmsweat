import { createFileRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth, useProfile } from "@/hooks/use-pm-sweat";
import { AppHeader } from "@/components/app-header";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  const profile = useProfile();
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) nav({ to: "/login" });
  }, [isAuthenticated, loading, nav]);

  useEffect(() => {
    if (!profile.data) return;
    const onOnboarding = location.pathname.startsWith("/onboarding");
    if (profile.data.onboarding_completed === false && !onOnboarding) {
      nav({ to: "/onboarding" });
    } else if (profile.data.onboarding_completed && onOnboarding) {
      nav({ to: "/dashboard" });
    }
  }, [profile.data, location.pathname, nav]);

  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!isAuthenticated) return null;
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8"><Outlet /></main>
    </div>
  );
}
