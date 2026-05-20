import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSessions } from "@/hooks/use-pm-sweat";
import { SPORTS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/sessions")({
  head: () => ({ meta: [{ title: "Sessions — PM Sweat" }] }),
  component: SessionsPage,
});

type SortField = "date" | "duration" | "load";
type SortDir = "asc" | "desc";

function SessionsPage() {
  const { data = [] } = useSessions();
  const [filter, setFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  const filtered = filter ? data.filter((s) => s.sport === filter) : data;
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "date") cmp = a.started_at.localeCompare(b.started_at);
    if (sortBy === "duration") cmp = a.duration_min - b.duration_min;
    if (sortBy === "load") cmp = a.load_au - b.load_au;
    return sortDir === "desc" ? -cmp : cmp;
  });

  const SortIcon = ({ field }: { field: SortField }) =>
    sortBy === field ? (
      sortDir === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
    ) : null;

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold">Sessions</h1>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={!filter ? "default" : "outline"} onClick={() => setFilter(null)}>All</Button>
        {SPORTS.map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>{s}</Button>
        ))}
      </div>

      <div className="flex gap-2 text-xs text-muted-foreground items-center">
        <span>Sort:</span>
        {(["date", "duration", "load"] as SortField[]).map((f) => (
          <button
            key={f}
            onClick={() => toggleSort(f)}
            className={`flex items-center gap-0.5 rounded border px-2 py-1 capitalize transition ${sortBy === f ? "border-primary bg-primary/5 text-primary font-medium" : "hover:bg-accent"}`}
          >
            {f} <SortIcon field={f} />
          </button>
        ))}
        <span className="ml-auto text-muted-foreground">{sorted.length} sessions</span>
      </div>

      <div className="rounded-2xl border bg-card divide-y">
        {sorted.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No sessions.</p>}
        {sorted.map((s) => (
          <Link
            key={s.id}
            to="/sessions/$sessionId"
            params={{ sessionId: s.id }}
            className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div>
              <div className="font-medium">{s.sport}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(s.started_at).toLocaleString()}{s.notes && ` · ${s.notes}`}
              </div>
            </div>
            <div className="text-right text-sm">
              <div>{s.duration_min}m</div>
              <div className="text-xs text-muted-foreground">{s.load_au} AU</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
