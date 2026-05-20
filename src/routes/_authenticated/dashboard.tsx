import { createFileRoute, Link } from "@tanstack/react-router";
import { useProfile, useMetrics, useSessions, useIntegrations } from "@/hooks/use-pm-sweat";
import { Activity, Flame, Moon, TrendingUp, Watch, Zap } from "lucide-react";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Hi, {profile.data?.nickname || profile.data?.name || "Athlete"} 👋
        </h1>
        <p className="text-muted-foreground">
          {profile.data?.athlete_type ?? "Hybrid Athlete"} · {profile.data?.location ?? "—"}
        </p>
      </div>

      {/* Metrics grid — color-coded */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        {/* Sleep — Mint (primary positive) */}
        <div className="rounded-2xl border border-mint/30 bg-mint/5 p-5 shadow-elevated">
          <div className="flex items-center gap-2 text-sm text-mint/70"><Moon className="h-4 w-4" />Sleep Score</div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-mint">{m?.sleep_score ?? "—"}</span>
            {m?.sleep_score && <span className="text-sm text-muted-foreground">/100</span>}
          </div>
          {m?.sleep_score && <p className="mt-1 text-xs text-mint/70">Excellent Recovery ✓</p>}
        </div>

        {/* Readiness — Mint */}
        <div className="rounded-2xl border border-mint/30 bg-mint/5 p-5 shadow-elevated">
          <div className="flex items-center gap-2 text-sm text-mint/70"><Zap className="h-4 w-4" />Readiness</div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-mint">{m?.readiness_score ?? "—"}</span>
            {m?.readiness_score && <span className="text-sm text-muted-foreground">/100</span>}
          </div>
          {m?.readiness_score && <p className="mt-1 text-xs text-mint/70">Ready to train ✓</p>}
        </div>

        {/* Weekly Load — Indigo (secondary metric) */}
        <div className="rounded-2xl border border-indigo/20 bg-indigo/5 p-5 shadow-elevated">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Activity className="h-4 w-4" />Weekly Load</div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-indigo">{m?.weekly_training_load ?? 0}</span>
            <span className="ml-1 text-sm text-muted-foreground">AU</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Training units / week</p>
        </div>

        {/* Recovery — Mint */}
        <div className="rounded-2xl border border-mint/30 bg-mint/5 p-5 shadow-elevated">
          <div className="flex items-center gap-2 text-sm text-mint/70"><TrendingUp className="h-4 w-4" />Recovery</div>
          <div className="mt-2 text-2xl font-bold text-mint">{m?.recovery_status ?? "—"}</div>
        </div>

        {/* Calories — White number + Mint trend */}
        <div className="rounded-2xl border bg-card p-5 shadow-elevated">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><Flame className="h-4 w-4" />Active Calories</div>
          <div className="mt-2 text-3xl font-bold">
            {m?.active_calories_goal ? m.active_calories_goal.toLocaleString() : "—"}
          </div>
          {m?.active_calories_goal && <p className="mt-1 text-xs text-mint">↑ +15% vs last week</p>}
        </div>

        {/* HR Zone — Indigo */}
        <div className="rounded-2xl border border-indigo/20 bg-indigo/5 p-5 shadow-elevated">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">HR Zone</div>
          <div className="mt-2 text-3xl font-bold text-indigo">{m?.avg_hr_zone ?? "—"}</div>
          <p className="mt-1 text-xs text-muted-foreground">65% of session time</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Integrations */}
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Watch className="h-4 w-4" /> Integrations
          </h2>
          <ul className="space-y-2">
            {integrations.data?.length ? integrations.data.map((i) => (
              <li key={i.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 text-sm">
                <span className="capitalize font-medium">{i.provider.replace("_", " ")}</span>
                {i.connected
                  ? <span className="text-mint font-semibold">✓ Connected</span>
                  : <span className="text-muted-foreground">Disconnected</span>
                }
              </li>
            )) : (
              <li className="text-sm text-muted-foreground">No integrations yet. Connect in Settings.</li>
            )}
          </ul>
        </div>

        {/* Recent Sessions */}
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Activity className="h-4 w-4" /> Recent Sessions
          </h2>
          <ul className="space-y-3">
            {sessions.data?.length ? sessions.data.map((s) => (
              <li key={s.id}>
                <Link
                  to="/sessions/$sessionId"
                  params={{ sessionId: s.id }}
                  className="flex items-center justify-between text-sm hover:bg-accent/50 rounded-lg px-2 py-1 -mx-2 transition-colors"
                >
                  <div>
                    <div className="font-medium">{s.sport}</div>
                    <div className="text-xs text-muted-foreground">{new Date(s.started_at).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div>{s.duration_min}m</div>
                    <div className="text-xs text-muted-foreground">{s.load_au} AU</div>
                  </div>
                </Link>
              </li>
            )) : <li className="text-sm text-muted-foreground">No sessions yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
