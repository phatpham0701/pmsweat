import { createFileRoute, Link } from "@tanstack/react-router";
import { useIntegrations } from "@/hooks/use-pm-sweat";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Clock, MapPin, Activity, Watch, Zap, Lock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/garmin")({
  head: () => ({ meta: [{ title: "Garmin Integration — PM Sweat" }] }),
  component: GarminPage,
});

function GarminPage() {
  const integrations = useIntegrations();
  const garmin = integrations.data?.find((i) => i.provider === "garmin");
  const isConnected = garmin?.connected ?? false;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/settings">
        <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back to Settings</Button>
      </Link>

      <div className="rounded-2xl border bg-card p-8 shadow-elevated">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Watch className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Garmin Connect</h1>
              <p className="text-sm text-muted-foreground">Sync your Garmin device data</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${isConnected ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
            {isConnected ? <><Check className="h-3 w-3" />Connected</> : "Not connected"}
          </span>
        </div>

        {isConnected && garmin && (
          <div className="mt-6 rounded-xl bg-muted/40 p-4 space-y-2 text-sm">
            {garmin.device && <div className="flex justify-between"><span className="text-muted-foreground">Device</span><span className="font-medium">{garmin.device}</span></div>}
            {garmin.last_sync && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last sync</span>
                <span className="font-medium">{new Date(garmin.last_sync).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold">What syncs from Garmin</h2>
        <ul className="space-y-3">
          {[
            { icon: Activity, label: "Activities & workouts", desc: "Running, cycling, swimming, triathlon sessions" },
            { icon: Zap, label: "Training load & recovery", desc: "Training Status, Training Load, Body Battery" },
            { icon: Clock, label: "Sleep & HRV", desc: "Sleep stages, heart rate variability" },
            { icon: MapPin, label: "GPS & route data", desc: "Routes, elevation, pace zones" },
          ].map(({ icon: Icon, label, desc }) => (
            <li key={label} className="flex gap-3">
              <div className="mt-0.5 rounded-lg bg-primary/10 p-1.5 h-fit"><Icon className="h-4 w-4 text-primary" /></div>
              <div>
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border-2 border-dashed bg-card p-6 text-center space-y-3">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-3"><Lock className="h-5 w-5 text-muted-foreground" /></div>
        </div>
        <h3 className="font-semibold">Full Garmin OAuth — Phase 2</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Direct Garmin Connect IQ OAuth integration is coming in Phase 2. Your device data will sync automatically once enabled.
        </p>
        <Button disabled className="mt-2">
          Authorize with Garmin <Lock className="ml-2 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
