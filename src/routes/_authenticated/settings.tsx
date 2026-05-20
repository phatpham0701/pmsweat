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
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Settings</h1>

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
            <li key={w.value} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{w.label}</div>
                <div className="text-xs text-muted-foreground">{w.desc}</div>
              </div>
              <div className="flex gap-2">
                {w.value === "garmin" && (
                  <Link to="/garmin"><Button size="sm" variant="ghost">Details</Button></Link>
                )}
                <Button
                  size="sm"
                  variant={isConnected(w.value) ? "outline" : "default"}
                  onClick={() => toggle.mutate({ provider: w.value, connected: !isConnected(w.value), device: w.label })}
                >
                  {isConnected(w.value) ? "Disconnect" : "Connect"}
                </Button>
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
        <Button variant="destructive" className="mt-4" onClick={() => { setConfirmText(""); setConfirmOpen(true); }}>Reset Profile</Button>
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
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={confirmText.trim().toLowerCase() !== "confirm" || reset.isPending} onClick={onReset}>
              Reset Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </div>
  );
}
