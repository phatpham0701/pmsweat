// Johnny — Pro Triathlete demo data
import type { Profile, Integration, Session } from "@/lib/types";

const today = () => new Date();
const daysAgo = (n: number) => {
  const d = today();
  d.setDate(d.getDate() - n);
  return d;
};

export const JOHNNY_PROFILE: Profile = {
  id: "demo-johnny",
  name: "Johnny Doe",
  nickname: "JD",
  gender: "male",
  date_of_birth: "1993-08-10",
  height_cm: 183,
  weight_kg: 72,
  location: "Vietnam",
  avatar_url: null,
  avatar_kind: "initial",
  avatar_meta: { initial: "J", bg: "mint" },
  athlete_type: "Pro Triathlete",
  fitness_goals: ["Specific Goal"],
  custom_goal: null,
  health_conditions: [],
  wearable_device: "garmin",
  sports: ["Cycling", "Running", "Swimming"],
  training_frequency: "6",
  consent_given: true,
  onboarding_completed: true,
};

export const JOHNNY_INTEGRATIONS: Integration[] = [
  { id: "i1", user_id: "demo-johnny", provider: "garmin", connected: true, last_sync: today().toISOString(), device: "Fenix 7X" },
  { id: "i2", user_id: "demo-johnny", provider: "strava", connected: true, last_sync: today().toISOString(), device: null },
  { id: "i3", user_id: "demo-johnny", provider: "oura", connected: true, last_sync: today().toISOString(), device: "Ring Gen 3" },
  { id: "i4", user_id: "demo-johnny", provider: "apple_health", connected: true, last_sync: today().toISOString(), device: null },
  { id: "i5", user_id: "demo-johnny", provider: "fitbit", connected: true, last_sync: today().toISOString(), device: "Sense 2" },
];

// 14 sessions/week × 90 days / 7 ≈ 180 sessions, 1495 min/week ≈ 320 hours total
const WEEKLY: Array<Array<{ sport: string; duration: number; load: number; hour: number; notes?: string }>> = [
  // Mon: Gym + Running = 140 min
  [
    { sport: "Gym", duration: 65, load: 42, hour: 7, notes: "Strength & core" },
    { sport: "Running", duration: 75, load: 52, hour: 18, notes: "Easy run 14km" },
  ],
  // Tue: Swimming + Cycling = 345 min
  [
    { sport: "Swimming", duration: 75, load: 58, hour: 6, notes: "2500m technique" },
    { sport: "Cycling", duration: 270, load: 145, hour: 14, notes: "Road 120km Z2-Z3" },
  ],
  // Wed: Running + Yoga = 120 min
  [
    { sport: "Running", duration: 90, load: 70, hour: 6, notes: "Trail 16km" },
    { sport: "Yoga", duration: 30, load: 15, hour: 18 },
  ],
  // Thu: Cycling + Running = 160 min
  [
    { sport: "Cycling", duration: 90, load: 175, hour: 7, notes: "Interval hard 4×10min Z5" },
    { sport: "Running", duration: 70, load: 62, hour: 17, notes: "Brick run 12km" },
  ],
  // Fri: Gym + Swimming = 130 min
  [
    { sport: "Gym", duration: 65, load: 52, hour: 7, notes: "Strength & mobility" },
    { sport: "Swimming", duration: 65, load: 55, hour: 17, notes: "Open water 1.5km" },
  ],
  // Sat: Cycling + Running = 510 min
  [
    { sport: "Cycling", duration: 390, load: 255, hour: 7, notes: "Long ride 160km Z2" },
    { sport: "Running", duration: 120, load: 95, hour: 14, notes: "Half-marathon pace 21km" },
  ],
  // Sun: Swimming + Yoga = 90 min
  [
    { sport: "Swimming", duration: 60, load: 45, hour: 8, notes: "Recovery 1800m easy" },
    { sport: "Yoga", duration: 30, load: 20, hour: 17, notes: "Recovery yoga" },
  ],
];

export function generateJohnnySessions(): Session[] {
  const out: Session[] = [];
  for (let d = 0; d < 90; d++) {
    const date = daysAgo(d);
    const dow = (date.getDay() + 6) % 7; // 0=Mon
    for (const item of WEEKLY[dow]) {
      const start = new Date(date);
      start.setHours(item.hour, Math.floor(Math.random() * 20), 0, 0);
      out.push({
        id: `s-${d}-${item.sport}-${item.hour}`,
        user_id: "demo-johnny",
        sport: item.sport,
        started_at: start.toISOString(),
        duration_min: item.duration + Math.floor((Math.random() - 0.5) * 8),
        load_au: item.load + Math.floor((Math.random() - 0.5) * 8),
        notes: item.notes ?? null,
        metrics: {},
      });
    }
  }
  return out.sort((a, b) => b.started_at.localeCompare(a.started_at));
}

export const JOHNNY_METRICS = {
  sleep_score: 89,
  readiness_score: 88,
  active_calories_goal: 2800,
  passive_calories: 1900,
  avg_hr_zone: "Z3",
  weekly_training_load: 850,
  recovery_status: "Very Good",
  vo2_max: 62,
  resting_hr: 48,
  bmi: 21.5,
};
