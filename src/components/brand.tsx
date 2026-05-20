import { Link } from "@tanstack/react-router";
import logoIcon from "@/assets/brand/pm-sweat-logo-icon.svg";
import logoDark from "@/assets/brand/pm-sweat-logo-dark-bg.svg";
import { useTheme } from "@/hooks/use-theme";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  const { mode } = useTheme();
  const dark = mode === "dark" || (mode === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  return <img src={dark ? logoDark : logoIcon} alt="PM Sweat" className={className} />;
}

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <Logo className="h-8 w-8" />
      <span className="font-semibold tracking-tight">PM Sweat</span>
    </Link>
  );
}
