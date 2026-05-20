import { createFileRoute } from "@tanstack/react-router";
import { useProfile, useMetrics, useSessions, useIntegrations } from "@/hooks/use-pm-sweat";
import { Activity, Heart, Moon, Zap, Watch } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PM Sweat" }] }),
  component: Dashboard,
});

function Dashboard() {
  const profile = useProfile();
  const metrics = useMetrics();
  const sessions = useSessions(5);
  const integrations = useIntegrations();
  const m = metrics.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Hi, {profile.data?.nickname || profile.data?.name || "Athlete"} 👋</h1>
        <p className="text-muted-foreground">{profile.data?.athlete_type ?? "Hybrid Athlete"} · {profile.data?.location ?? "—"}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Moon} label="Sleep Score" value={m?.sleep_score ?? "—"} />
        <MetricCard icon={Zap} label="Readiness" value={m?.readiness_score ?? "—"} />
        <MetricCard icon={Activity} label="Weekly Load" value={`${m?.weekly_training_load ?? 0} AU`} />
        <MetricCard icon={Heart} label="Recovery" value={m?.recovery_status ?? "—"} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><Watch className="h-4 w-4" /> Integrations</h2>
          <ul className="space-y-2">
            {integrations.data?.length ? integrations.data.map((i) => (
              <li key={i.id} className="flex items-center justify-between text-sm">
                <span className="capitalize">{i.provider.replace("_", " ")}</span>
                <span className={i.connected ? "text-mint-foreground" : "text-muted-foreground"}>{i.connected ? "Connected" : "—"}</span>
              </li>
            )) : <li className="text-sm text-muted-foreground">No integrations yet. Connect in Settings.</li>}
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><Activity className="h-4 w-4" /> Recent Sessions</h2>
          <ul className="space-y-3">
            {sessions.data?.length ? sessions.data.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{s.sport}</div>
                  <div className="text-xs text-muted-foreground">{new Date(s.started_at).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div>{s.duration_min}m</div>
                  <div className="text-xs text-muted-foreground">{s.load_au} AU</div>
                </div>
              </li>
            )) : <li className="text-sm text-muted-foreground">No sessions yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-elevated">
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4" />{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
