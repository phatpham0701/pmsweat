import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Brand, Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { startDemo } from "@/lib/demo/storage";
import { useAuth } from "@/hooks/use-pm-sweat";
import { ArrowRight, Activity, Heart, Zap, Watch } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PM Sweat — Perfect Match Sweat" },
      { name: "description", content: "Premium sport lifestyle platform for hybrid athletes. AI coaching insights + health metrics tracking." },
      { property: "og:title", content: "PM Sweat — Perfect Match Sweat" },
      { property: "og:description", content: "Onboarding, wearables, and coaching for hybrid athletes." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const nav = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  useEffect(() => {
    if (!loading && isAuthenticated) nav({ to: "/dashboard" });
  }, [isAuthenticated, loading, nav]);
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
        <Brand />
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
          <Link to="/signup"><Button>Sign up</Button></Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-95" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <Logo className="mx-auto mb-6 h-16 w-16" />
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Perfect Match <span className="text-mint">Sweat</span>
              </h1>
              <p className="mt-6 text-lg text-white/80">
                Premium sport lifestyle platform for hybrid athletes. Track wearables, get AI coaching insights, and find your perfect match in training.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" className="bg-mint text-mint-foreground hover:bg-mint/90 shadow-mint" onClick={() => nav({ to: "/signup" })}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={() => { startDemo(); nav({ to: "/dashboard" }); }}>
                  Try Demo as Johnny
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { icon: Activity, title: "Hybrid Training", desc: "Cycling, running, swimming, and more — all in one." },
              { icon: Heart, title: "Health Metrics", desc: "Sleep, readiness, recovery — daily insights." },
              { icon: Watch, title: "Wearable Sync", desc: "Garmin, Strava, Oura, Apple Health, Fitbit." },
              { icon: Zap, title: "AI Coaching", desc: "Personalized plans based on your data." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-elevated">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-mint/15 text-mint-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
