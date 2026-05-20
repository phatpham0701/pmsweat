import { Link, useNavigate } from "@tanstack/react-router";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-pm-sweat";
import { LogOut, LayoutDashboard, User as UserIcon, Settings as SettingsIcon, Activity } from "lucide-react";

export function AppHeader() {
  const { signOut, isDemo } = useAuth();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <NavItem to="/sessions" icon={<Activity className="h-4 w-4" />} label="Sessions" />
          <NavItem to="/profile" icon={<UserIcon className="h-4 w-4" />} label="Profile" />
          <NavItem to="/settings" icon={<SettingsIcon className="h-4 w-4" />} label="Settings" />
        </nav>
        <div className="flex items-center gap-2">
          {isDemo && <span className="rounded-full bg-mint/20 px-3 py-1 text-xs font-medium text-mint-foreground">DEMO</span>}
          <Button variant="ghost" size="sm" onClick={async () => { await signOut(); nav({ to: "/" }); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" activeProps={{ className: "bg-accent text-foreground" }}>
      {icon}{label}
    </Link>
  );
}
