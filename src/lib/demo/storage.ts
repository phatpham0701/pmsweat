import type { Profile, Integration, Session } from "@/lib/types";
import { JOHNNY_PROFILE, JOHNNY_INTEGRATIONS, generateJohnnySessions, JOHNNY_METRICS } from "./johnny";

const KEY = "pm_sweat_demo_user";
const DEMO_FLAG = "pm_sweat_is_demo";

type DemoState = {
  profile: Profile;
  integrations: Integration[];
  sessions: Session[];
  metrics: typeof JOHNNY_METRICS;
};

function buildFresh(): DemoState {
  return {
    profile: { ...JOHNNY_PROFILE },
    integrations: JOHNNY_INTEGRATIONS.map((i) => ({ ...i })),
    sessions: generateJohnnySessions(),
    metrics: { ...JOHNNY_METRICS },
  };
}

export function isDemo(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(DEMO_FLAG) === "true";
}

export function startDemo() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DEMO_FLAG, "true");
  localStorage.setItem(KEY, JSON.stringify(buildFresh()));
}

export function endDemo() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DEMO_FLAG);
  localStorage.removeItem(KEY);
}

export function getDemo(): DemoState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoState;
  } catch {
    return null;
  }
}

export function saveDemo(state: DemoState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function updateDemoProfile(patch: Partial<Profile>) {
  const state = getDemo();
  if (!state) return;
  state.profile = { ...state.profile, ...patch };
  saveDemo(state);
}

export function resetDemoProfile() {
  const state = getDemo();
  if (!state) return;
  state.profile = {
    ...JOHNNY_PROFILE,
    name: null,
    nickname: null,
    gender: null,
    date_of_birth: null,
    height_cm: null,
    weight_kg: null,
    avatar_url: null,
    avatar_kind: null,
    avatar_meta: {},
    athlete_type: null,
    fitness_goals: [],
    custom_goal: null,
    health_conditions: [],
    wearable_device: null,
    sports: [],
    training_frequency: null,
    consent_given: false,
    onboarding_completed: false,
  };
  state.integrations = [];
  state.sessions = [];
  saveDemo(state);
}
