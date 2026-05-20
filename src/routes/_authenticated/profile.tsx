import { createFileRoute, Link } from "@tanstack/react-router";
import { useProfile } from "@/hooks/use-pm-sweat";
import { Button } from "@/components/ui/button";
import { AvatarDisplay } from "@/components/avatar-display";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — PM Sweat" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: p } = useProfile();

  const bmi = p?.height_cm && p?.weight_kg
    ? (p.weight_kg / ((p.height_cm / 100) ** 2)).toFixed(1)
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header card */}
      <div className="rounded-2xl border bg-card p-8 pb-10 shadow-elevated">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <AvatarDisplay profile={p ?? null} size={96} />
          <div className="flex-1 text-center sm:text-left space-y-2">
            {/* Name — White/bold */}
            <h1 className="text-3xl md:text-4xl font-bold">{p?.name || "Unnamed"}</h1>

            {/* Athlete type — Mint badge */}
            {p?.athlete_type && (
              <div className="inline-block rounded-full border border-mint/30 bg-mint/10 px-4 py-1">
                <p className="text-sm font-medium text-mint">{p.athlete_type}</p>
              </div>
            )}

            {/* Location / nickname — Gray secondary */}
            <p className="text-sm text-muted-foreground">
              {p?.nickname && `@${p.nickname}`}
              {p?.nickname && p?.location && " · "}
              {p?.location}
            </p>
          </div>
          <Link to="/onboarding">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="mb-4 text-xl font-bold">Physical stats</h2>
        <div className="space-y-3">
          <StatRow label="Height" value={p?.height_cm ? `${p.height_cm} cm` : null} />
          <StatRow label="Weight" value={p?.weight_kg ? `${p.weight_kg} kg` : null} />
          {/* BMI — Mint with checkmark */}
          <div className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
            <span className="text-sm text-muted-foreground">BMI</span>
            <span className="text-sm font-semibold text-mint">{bmi ? `${bmi} ✓` : "—"}</span>
          </div>
          <StatRow label="Gender" value={p?.gender} />
          <StatRow label="Date of birth" value={p?.date_of_birth} />
        </div>
      </div>

      {/* Training profile */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="mb-4 text-xl font-bold">Training profile</h2>
        <div className="space-y-3">
          <StatRow label="Frequency" value={p?.training_frequency ? `${p.training_frequency} days/week` : null} />
          <StatRow label="Wearable" value={p?.wearable_device} />
          <StatRow label="Sports" value={p?.sports?.join(", ")} />
          <StatRow label="Goals" value={p?.fitness_goals?.join(", ")} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/onboarding">
          <Button>{p?.onboarding_completed ? "Edit Fitness Profile" : "Finish Onboarding"}</Button>
        </Link>
        <Link to="/settings">
          <Button variant="outline">Go to Settings →</Button>
        </Link>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value || "—"}</span>
    </div>
  );
}
