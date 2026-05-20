import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isDemo, getDemo, updateDemoProfile, saveDemo, resetDemoProfile, endDemo } from "@/lib/demo/storage";
import type { Profile, Integration, Session } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

// ---------- Centralized Auth (single subscription) ----------
type AuthState = {
  user: User | null;
  isDemo: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [demo, setDemo] = useState<boolean>(() => (typeof window !== "undefined" ? isDemo() : false));
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setDemo(isDemo());
      qc.invalidateQueries();
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setDemo(isDemo());
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [qc]);

  const signOut = async () => {
    if (isDemo()) {
      endDemo();
      setDemo(false);
    } else {
      await supabase.auth.signOut();
    }
    qc.clear();
  };

  const value: AuthState = {
    user,
    isDemo: demo,
    isAuthenticated: !!user || demo,
    loading,
    signOut,
  };
  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Fallback for routes rendered outside provider (shouldn't happen)
    return { user: null, isDemo: false, isAuthenticated: false, loading: true, signOut: async () => {} };
  }
  return ctx;
}

// ---------- Data hooks ----------
export function useProfile() {
  const { user, isDemo: demo } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id ?? "demo"],
    enabled: !!user || demo,
    queryFn: async (): Promise<Profile | null> => {
      if (demo) return getDemo()?.profile ?? null;
      if (!user) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useUpdateProfile() {
  const { user, isDemo: demo } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Profile>) => {
      if (demo) { updateDemoProfile(patch); return; }
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("profiles").update(patch as never).eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useIntegrations() {
  const { user, isDemo: demo } = useAuth();
  return useQuery({
    queryKey: ["integrations", user?.id ?? "demo"],
    enabled: !!user || demo,
    queryFn: async (): Promise<Integration[]> => {
      if (demo) return getDemo()?.integrations ?? [];
      if (!user) return [];
      const { data, error } = await supabase.from("integrations").select("*").eq("user_id", user.id);
      if (error) throw error;
      return (data ?? []) as Integration[];
    },
  });
}

export function useToggleIntegration() {
  const { user, isDemo: demo } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ provider, connected, device }: { provider: string; connected: boolean; device?: string }) => {
      if (demo) {
        const state = getDemo();
        if (!state) return;
        const i = state.integrations.findIndex((x) => x.provider === provider);
        const row: Integration = {
          id: `demo-${provider}`, user_id: "demo-johnny", provider, connected,
          last_sync: connected ? new Date().toISOString() : null, device: device ?? null,
        };
        if (i >= 0) state.integrations[i] = row; else state.integrations.push(row);
        saveDemo(state);
        return;
      }
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("integrations").upsert({
        user_id: user.id, provider, connected,
        last_sync: connected ? new Date().toISOString() : null,
        device: device ?? null,
      }, { onConflict: "user_id,provider" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["integrations"] }),
  });
}

export function useSessions(limit?: number) {
  const { user, isDemo: demo } = useAuth();
  return useQuery({
    queryKey: ["sessions", user?.id ?? "demo", limit],
    enabled: !!user || demo,
    queryFn: async (): Promise<Session[]> => {
      if (demo) {
        const all = getDemo()?.sessions ?? [];
        return limit ? all.slice(0, limit) : all;
      }
      if (!user) return [];
      let q = supabase.from("sessions").select("*").eq("user_id", user.id).order("started_at", { ascending: false });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Session[];
    },
  });
}

export function useMetrics() {
  const { isDemo: demo } = useAuth();
  return useQuery({
    queryKey: ["metrics", demo ? "demo" : "real"],
    queryFn: async () => {
      if (demo) return getDemo()?.metrics ?? null;
      return {
        sleep_score: null, readiness_score: null, weekly_training_load: 0,
        recovery_status: "—", active_calories_goal: 0, passive_calories: 0,
        avg_hr_zone: "—", vo2_max: null, resting_hr: null, bmi: null,
      };
    },
  });
}

export function useResetProfile() {
  const { user, isDemo: demo } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (demo) { resetDemoProfile(); return; }
      if (!user) throw new Error("Not authenticated");
      await supabase.from("sessions").delete().eq("user_id", user.id);
      await supabase.from("integrations").delete().eq("user_id", user.id);
      await supabase.from("profiles").update({
        name: null, nickname: null, gender: null, date_of_birth: null,
        height_cm: null, weight_kg: null, avatar_url: null, avatar_kind: null, avatar_meta: {},
        athlete_type: null, fitness_goals: [], custom_goal: null,
        health_conditions: [], wearable_device: null, sports: [],
        training_frequency: null, consent_given: false, onboarding_completed: false,
      }).eq("id", user.id);
    },
    onSuccess: () => qc.invalidateQueries(),
  });
}
