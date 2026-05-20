import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Brand, Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { startDemo } from "@/lib/demo/storage";
import { useAuth } from "@/hooks/use-pm-sweat";
import { Activity, Heart, Watch, Zap } from "lucide-react";

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

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(to bottom, #1a1a2e 0%, #162032 50%, #1a1a2e 100%)" }}
      >
        {/* Glow — top right (indigo) */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-10 pointer-events-none" />
        {/* Glow — bottom left (mint) */}
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-mint rounded-full blur-3xl opacity-10 pointer-events-none" />

        {/* Navigation */}
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
          <Brand />
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-mint text-navy font-semibold hover:bg-mint/90">Sign up</Button>
            </Link>
          </div>
        </header>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 pb-28 pt-12 text-center">
          <Logo className="mx-auto mb-8 h-16 w-16 opacity-90" />

          <div className="space-y-6 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Perfect Match{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-mint bg-clip-text text-transparent">
                Sweat
              </span>
            </h1>
            <p className="text-lg text-white/70">
              Verified training effort earns{" "}
              <span className="text-mint font-semibold">REAL rewards</span>
            </p>
          </div>

          {/* Stats card — glassmorphism */}
          <div className="mt-12 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-mint">180+</div>
                <div className="mt-2 text-sm text-white/50">Sessions</div>
              </div>
              <div className="border-l border-r border-white/10 text-center">
                <div className="text-3xl font-bold text-indigo-400">320</div>
                <div className="mt-2 text-sm text-white/50">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-mint">92%</div>
                <div className="mt-2 text-sm text-white/50">Consistency</div>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => { startDemo(); nav({ to: "/dashboard" }); }}
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-mint text-navy font-semibold hover:shadow-lg hover:shadow-mint/50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Try Demo Free
            </button>
            <button
              onClick={() => nav({ to: "/signup" })}
              className="w-full sm:w-auto px-8 py-3 rounded-lg border-2 border-indigo-400 text-indigo-400 font-semibold hover:bg-indigo-400/10 active:scale-95 transition-all duration-200"
            >
              Get Started
            </button>
          </div>

          {/* Scroll indicator */}
          <p className="mt-16 animate-bounce text-sm text-white/40">↓ Scroll to explore</p>
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
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
    </div>
  );
}
