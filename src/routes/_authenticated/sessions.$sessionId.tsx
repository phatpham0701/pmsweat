import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSessions } from "@/hooks/use-pm-sweat";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Flame, FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/sessions/$sessionId")({
  head: () => ({ meta: [{ title: "Session Detail — PM Sweat" }] }),
  component: SessionDetailPage,
});

function SessionDetailPage() {
  const { sessionId } = Route.useParams();
  const { data: sessions = [], isLoading } = useSessions();
  const session = sessions.find((s) => s.id === sessionId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Link to="/sessions">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back to Sessions</Button>
        </Link>
        <div className="rounded-2xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">Session not found.</p>
        </div>
      </div>
    );
  }

  const started = new Date(session.started_at);
  const ended = new Date(started.getTime() + session.duration_min * 60_000);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/sessions">
        <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back to Sessions</Button>
      </Link>

      <div className="rounded-2xl border bg-card p-8 shadow-elevated space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">{session.sport}</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {started.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard icon={Calendar} label="Start time" value={started.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} />
          <StatCard icon={Clock} label="Duration" value={`${session.duration_min} min`} />
          <StatCard icon={Flame} label="Load" value={`${session.load_au} AU`} />
        </div>

        {session.notes && (
          <div className="rounded-xl bg-muted p-4 flex gap-3">
            <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
            <p className="text-sm">{session.notes}</p>
          </div>
        )}

        <div className="rounded-xl border bg-muted/30 p-5">
          <h2 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Session Summary</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Sport" value={session.sport} />
            <Row label="Date" value={started.toLocaleDateString()} />
            <Row label="Start" value={started.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} />
            <Row label="End (est.)" value={ended.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} />
            <Row label="Duration" value={`${session.duration_min} min`} />
            <Row label="Training Load" value={`${session.load_au} AU`} />
          </dl>
        </div>

        <div className="rounded-xl border bg-muted/20 p-5">
          <h2 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">AI Session Review</h2>
          <p className="text-sm text-muted-foreground italic">AI-powered session analysis coming in Phase 2 — connect your wearable to unlock detailed insights.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Icon className="h-3.5 w-3.5" />{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
