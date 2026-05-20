import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSessions } from "@/hooks/use-pm-sweat";
import { SPORTS } from "@/lib/types";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/sessions")({
  head: () => ({ meta: [{ title: "Sessions — PM Sweat" }] }),
  component: SessionsPage,
});

function SessionsPage() {
  const { data = [] } = useSessions();
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = filter ? data.filter((s) => s.sport === filter) : data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Sessions</h1>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={!filter ? "default" : "outline"} onClick={() => setFilter(null)}>All</Button>
        {SPORTS.map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>{s}</Button>
        ))}
      </div>
      <div className="rounded-2xl border bg-card divide-y">
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No sessions.</p>}
        {filtered.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{s.sport}</div>
              <div className="text-xs text-muted-foreground">{new Date(s.started_at).toLocaleString()}{s.notes && ` · ${s.notes}`}</div>
            </div>
            <div className="text-right text-sm">
              <div>{s.duration_min}m</div>
              <div className="text-xs text-muted-foreground">{s.load_au} AU</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
