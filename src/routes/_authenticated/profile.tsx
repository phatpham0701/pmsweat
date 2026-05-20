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
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border bg-card p-8 shadow-elevated">
        <div className="flex items-center gap-6">
          <AvatarDisplay profile={p ?? null} size={96} />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{p?.name || "Unnamed"}</h1>
            <p className="text-muted-foreground">{p?.nickname && `@${p.nickname} · `}{p?.athlete_type ?? "Hybrid Athlete"}</p>
            <p className="text-sm text-muted-foreground">{p?.location ?? "—"}</p>
          </div>
          <Link to="/onboarding"><Button variant="outline">Edit Avatar</Button></Link>
        </div>
      </div>
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="mb-4 font-semibold">Profile details</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <Detail label="Gender" value={p?.gender} />
          <Detail label="Date of birth" value={p?.date_of_birth} />
          <Detail label="Height" value={p?.height_cm ? `${p.height_cm} cm` : null} />
          <Detail label="Weight" value={p?.weight_kg ? `${p.weight_kg} kg` : null} />
          <Detail label="Training frequency" value={p?.training_frequency} />
          <Detail label="Wearable" value={p?.wearable_device} />
          <Detail label="Sports" value={p?.sports?.join(", ")} />
          <Detail label="Goals" value={p?.fitness_goals?.join(", ")} />
        </dl>
      </div>
      <div className="flex gap-2">
        <Link to="/onboarding">
          <Button>{p?.onboarding_completed ? "Edit Fitness Profile" : "Finish Onboarding"}</Button>
        </Link>
        <Link to="/settings"><Button variant="outline">Go to Settings →</Button></Link>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value || "—"}</dd>
    </div>
  );
}
