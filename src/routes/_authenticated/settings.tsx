import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIntegrations, useToggleIntegration, useResetProfile, useAuth } from "@/hooks/use-pm-sweat";
import { useTheme } from "@/hooks/use-theme";
import { WEARABLES } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — PM Sweat" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const integrations = useIntegrations();
  const toggle = useToggleIntegration();
  const reset = useResetProfile();
  const { mode, setTheme } = useTheme();
  const { signOut } = useAuth();
  const nav = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const isConnected = (p: string) => integrations.data?.find((i) => i.provider === p)?.connected ?? false;

  const onReset = async () => {
    if (confirmText.trim().toLowerCase() !== "confirm") return;
    await reset.mutateAsync();
    setConfirmOpen(false);
    toast.success("Profile reset");
    nav({ to: "/onboarding" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold">Settings</h1>

      <Section title="Onboarding">
        <p className="text-sm text-muted-foreground">Update your fitness profile any time.</p>
        <Link to="/onboarding"><Button className="mt-3">Retake Onboarding</Button></Link>
      </Section>

      <Section title="Appearance">
        <div className="flex gap-2">
          {(["light", "dark", "system"] as const).map((m) => (
            <Button key={m} variant={mode === m ? "default" : "outline"} size="sm" onClick={() => setTheme(m)} className="capitalize">{m}</Button>
          ))}
        </div>
      </Section>

      <Section title="Integrations">
        <ul className="space-y-3">
          {WEARABLES.filter((w) => w.value !== "none").map((w) => (
            <li key={w.value} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
              <div>
                <div className="font-medium">{w.label}</div>
                <div className="text-xs text-muted-foreground">{w.desc}</div>
              </div>
              <div className="flex items-center gap-3">
                {isConnected(w.value)
                  ? <span className="text-sm font-semibold text-mint">✓ Connected</span>
                  : <span className="text-sm text-muted-foreground">Disconnected</span>
                }
                {w.value === "garmin" && (
                  <Link to="/garmin"><Button size="sm" variant="ghost">Details</Button></Link>
                )}
                <button
                  onClick={() => toggle.mutate({ provider: w.value, connected: !isConnected(w.value), device: w.label })}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold active:scale-95 transition-all duration-200 ${
                    isConnected(w.value)
                      ? "border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"
                      : "bg-mint text-navy hover:shadow-md hover:shadow-mint/40 hover:scale-105"
                  }`}
                >
                  {isConnected(w.value) ? "Disconnect" : "Connect"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Account">
        <Button variant="outline" onClick={async () => { await signOut(); nav({ to: "/" }); }}>Log out</Button>
      </Section>

      <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6">
        <h2 className="flex items-center gap-2 font-semibold text-destructive"><AlertTriangle className="h-4 w-4" /> Danger Zone</h2>
        <p className="mt-2 text-sm text-muted-foreground">Permanently delete your profile and all associated data. This action cannot be undone.</p>
        <button
          className="mt-4 px-6 py-2.5 rounded-lg bg-destructive/20 border border-destructive/30 text-destructive font-semibold hover:bg-destructive/30 active:scale-95 transition-all duration-200"
          onClick={() => { setConfirmText(""); setConfirmOpen(true); }}
        >
          Reset Profile
        </button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Are you sure?</DialogTitle>
            <DialogDescription>
              Resetting your profile will delete all personal data, sessions, and disconnect integrations. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Type <span className="font-mono font-bold">Confirm</span> below to permanently reset:</Label>
            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="Confirm" />
          </div>
          <DialogFooter>
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-5 py-2 rounded-lg border border-transparent text-muted-foreground hover:border-border hover:text-foreground active:scale-95 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              disabled={confirmText.trim().toLowerCase() !== "confirm" || reset.isPending}
              onClick={onReset}
              className="px-6 py-2 rounded-lg bg-destructive/20 border border-destructive/30 text-destructive font-semibold hover:bg-destructive/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {reset.isPending ? "Resetting…" : "Reset Profile"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-8">
      <h2 className="mb-6 text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
