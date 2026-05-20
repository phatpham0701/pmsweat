export type Profile = {
  id: string;
  name: string | null;
  nickname: string | null;
  gender: string | null;
  date_of_birth: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  location: string | null;
  avatar_url: string | null;
  avatar_kind: "icon" | "initial" | "photo" | null;
  avatar_meta: Record<string, unknown>;
  athlete_type: string | null;
  fitness_goals: string[];
  custom_goal: string | null;
  health_conditions: string[];
  wearable_device: string | null;
  sports: string[];
  training_frequency: string | null;
  consent_given: boolean;
  onboarding_completed: boolean;
};

export type Integration = {
  id: string;
  user_id: string;
  provider: string;
  connected: boolean;
  last_sync: string | null;
  device: string | null;
};

export type Session = {
  id: string;
  user_id: string;
  sport: string;
  started_at: string;
  duration_min: number;
  load_au: number;
  notes: string | null;
  metrics: Record<string, unknown>;
};

export const SPORTS = ["Cycling", "Running", "Swimming", "Gym", "Yoga", "Hiking", "Triathlon", "Other"] as const;
export const FITNESS_GOALS = ["General Fitness", "Specific Goal", "Health Management", "Custom"] as const;
export const HEALTH_CONDITIONS = [
  "None / Good health",
  "Diabetes",
  "Hypertension",
  "Cardiovascular condition",
  "Thyroid condition",
  "Chronic pain",
  "Sleep disorder",
  "Asthma / Respiratory",
] as const;
export const GENDERS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer_not_say", label: "Prefer not to say" },
] as const;
export const WEARABLES = [
  { value: "garmin", label: "Garmin", desc: "Multisport watches" },
  { value: "strava", label: "Strava", desc: "Activity tracking" },
  { value: "oura", label: "Oura", desc: "Smart ring" },
  { value: "apple_health", label: "Apple Health", desc: "iPhone + Watch" },
  { value: "fitbit", label: "Fitbit", desc: "Wellness tracker" },
  { value: "none", label: "None yet", desc: "I'll add later" },
] as const;
export const TRAINING_FREQUENCIES = [
  { value: "1", label: "1 day / week" },
  { value: "2", label: "2 days / week" },
  { value: "3", label: "3 days / week" },
  { value: "4", label: "4 days / week" },
  { value: "5", label: "5 days / week" },
  { value: "6", label: "6 days / week" },
  { value: "7", label: "Every day" },
  { value: "flexible", label: "Flexible (work-dependent)" },
] as const;
