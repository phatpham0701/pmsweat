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

// Weekly pattern: Mon..Sun
const WEEKLY: Array<Array<{ sport: string; duration: number; load: number; hour: number; notes?: string }>> = [
  [{ sport: "Gym", duration: 60, load: 40, hour: 9 }, { sport: "Running", duration: 50, load: 45, hour: 18, notes: "Easy 10km" }], // Mon
  [{ sport: "Swimming", duration: 45, load: 50, hour: 6, notes: "2000m" }, { sport: "Cycling", duration: 180, load: 130, hour: 17, notes: "Road 80km Z3" }], // Tue
  [{ sport: "Yoga", duration: 30, load: 15, hour: 9 }], // Wed
  [{ sport: "Cycling", duration: 60, load: 160, hour: 18, notes: "Interval hard" }], // Thu
  [{ sport: "Gym", duration: 60, load: 50, hour: 9 }, { sport: "Running", duration: 65, load: 70, hour: 17, notes: "Trail 12km" }], // Fri
  [{ sport: "Cycling", duration: 300, load: 240, hour: 8, notes: "Long ride 150km Z2" }], // Sat
  [{ sport: "Yoga", duration: 30, load: 20, hour: 9 }], // Sun
];

export function generateJohnnySessions(): Session[] {
  const out: Session[] = [];
  for (let d = 0; d < 90; d++) {
    const date = daysAgo(d);
    const dow = (date.getDay() + 6) % 7; // 0=Mon
    const day = WEEKLY[dow];
    for (const item of day) {
      const start = new Date(date);
      start.setHours(item.hour, Math.floor(Math.random() * 30), 0, 0);
      // skip with low prob to feel real
      if (Math.random() < 0.05) continue;
      out.push({
        id: `s-${d}-${item.sport}-${item.hour}`,
        user_id: "demo-johnny",
        sport: item.sport,
        started_at: start.toISOString(),
        duration_min: item.duration + Math.floor((Math.random() - 0.5) * 10),
        load_au: item.load + Math.floor((Math.random() - 0.5) * 10),
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
