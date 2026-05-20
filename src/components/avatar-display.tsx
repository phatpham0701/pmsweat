import type { Profile } from "@/lib/types";

export function AvatarDisplay({ profile, size = 48 }: { profile: Profile | null; size?: number }) {
  const s = `${size}px`;
  if (profile?.avatar_url) {
    return <img src={profile.avatar_url} alt="" className="rounded-full object-cover" style={{ width: s, height: s }} />;
  }
  const meta = (profile?.avatar_meta ?? {}) as { initial?: string; bg?: string; icon?: string };
  const initial = meta.initial || profile?.name?.[0]?.toUpperCase() || profile?.nickname?.[0]?.toUpperCase() || "?";
  const bg: Record<string, string> = {
    mint: "bg-mint text-mint-foreground",
    indigo: "bg-indigo text-white",
    navy: "bg-navy text-white",
    gray: "bg-muted text-foreground",
  };
  return (
    <div className={`flex items-center justify-center rounded-full font-semibold ${bg[meta.bg ?? "mint"] ?? bg.mint}`} style={{ width: s, height: s, fontSize: size * 0.4 }}>
      {initial}
    </div>
  );
}
