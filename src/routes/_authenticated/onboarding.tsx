import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/use-pm-sweat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { FITNESS_GOALS, HEALTH_CONDITIONS, GENDERS, WEARABLES, SPORTS, TRAINING_FREQUENCIES } from "@/lib/types";
import { AvatarUpload } from "@/components/avatar-upload";
import type { Profile } from "@/lib/types";
import { toast } from "sonner";
import { Brand } from "@/components/brand";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — PM Sweat" }] }),
  component: Onboarding,
});

type Draft = Partial<Profile>;

function calcAge(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function Onboarding() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>({});
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(() => { if (profile) setDraft({ ...profile }); }, [profile]);

  const set = (patch: Draft) => setDraft((d) => ({ ...d, ...patch }));
  const toggleArr = (key: keyof Draft, val: string) => {
    const arr = ((draft[key] as string[] | undefined) ?? []);
    set({ [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] } as Draft);
  };

  const canNext: Record<number, boolean> = {
    1: (draft.fitness_goals ?? []).length > 0 && (!draft.fitness_goals?.includes("Custom") || !!draft.custom_goal),
    2: !!(draft.name && draft.name.length >= 2 && draft.gender && draft.date_of_birth && draft.height_cm && draft.weight_kg) &&
       (draft.date_of_birth ? calcAge(draft.date_of_birth) >= 13 && calcAge(draft.date_of_birth) <= 100 : false),
    3: !!draft.wearable_device,
    4: (draft.sports ?? []).length > 0 && !!draft.training_frequency,
    5: !!draft.consent_given,
  };

  const finish = async () => {
    await update.mutateAsync({ ...draft, onboarding_completed: true });
    setAvatarOpen(true);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <Brand />
        {/* Step indicators — Mint current/done, Gray upcoming */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                s < step
                  ? "bg-mint text-navy"
                  : s === step
                  ? "bg-mint text-navy ring-2 ring-mint/40"
                  : "border-2 border-muted-foreground/30 text-muted-foreground/50"
              }`}
            >
              {s < step ? "✓" : s}
            </div>
          ))}
        </div>
      </div>
      <Progress value={(step / 5) * 100} className="mb-8" />
      <div className="rounded-2xl border bg-card p-8 shadow-elevated">
        {step === 1 && (
          <Step title="What's your fitness goal?" desc="Help us personalize your experience">
            <div className="flex flex-wrap gap-2">
              {FITNESS_GOALS.map((g) => (
                <button key={g} type="button" onClick={() => toggleArr("fitness_goals", g)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${(draft.fitness_goals ?? []).includes(g) ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{g}</button>
              ))}
            </div>
            {(draft.fitness_goals ?? []).includes("Custom") && (
              <div className="mt-4">
                <Label>Tell us your goal</Label>
                <Textarea maxLength={200} rows={3} placeholder="e.g., Prepare for my first half-marathon"
                  value={draft.custom_goal ?? ""} onChange={(e) => set({ custom_goal: e.target.value })} />
                <div className="mt-1 text-right text-xs text-muted-foreground">{(draft.custom_goal ?? "").length}/200</div>
              </div>
            )}
          </Step>
        )}

        {step === 2 && (
          <Step title="Tell us about yourself" desc="This helps us calculate your baselines">
            <div className="grid gap-4">
              <Field label="Full name *"><Input value={draft.name ?? ""} maxLength={50}
                onChange={(e) => set({ name: e.target.value, nickname: draft.nickname || e.target.value.split(" ")[0] })} placeholder="John Doe" /></Field>
              <Field label="Nickname"><Input maxLength={20} value={draft.nickname ?? ""} onChange={(e) => set({ nickname: e.target.value })} placeholder="Johnny" /></Field>
              <Field label="Gender *">
                <RadioGroup value={draft.gender ?? ""} onValueChange={(v) => set({ gender: v })} className="grid grid-cols-2 gap-2">
                  {GENDERS.map((g) => (<label key={g.value} className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer"><RadioGroupItem value={g.value} />{g.label}</label>))}
                </RadioGroup>
              </Field>
              <Field label="Date of birth *">
                <Input type="date" value={draft.date_of_birth ?? ""} onChange={(e) => set({ date_of_birth: e.target.value })} />
                {draft.date_of_birth && (calcAge(draft.date_of_birth) < 13 || calcAge(draft.date_of_birth) > 100) && (
                  <p className="mt-1 text-xs text-destructive">Age must be between 13 and 100 years.</p>
                )}
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Height (cm) *"><Input type="number" min={140} max={230} value={draft.height_cm ?? ""} onChange={(e) => set({ height_cm: Number(e.target.value) || null })} /></Field>
                <Field label="Weight (kg) *"><Input type="number" min={30} max={200} value={draft.weight_kg ?? ""} onChange={(e) => set({ weight_kg: Number(e.target.value) || null })} /></Field>
              </div>
              <Field label="Health conditions">
                <div className="grid grid-cols-2 gap-2">
                  {HEALTH_CONDITIONS.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={(draft.health_conditions ?? []).includes(c)} onCheckedChange={() => toggleArr("health_conditions", c)} />{c}
                    </label>
                  ))}
                </div>
              </Field>
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="What wearable do you use?" desc="We'll sync your data automatically">
            <div className="grid gap-2 sm:grid-cols-2">
              {WEARABLES.map((w) => (
                <button key={w.value} type="button" onClick={() => set({ wearable_device: w.value })}
                  className={`rounded-xl border p-4 text-left transition ${draft.wearable_device === w.value ? "border-primary bg-primary/5" : "hover:bg-accent"}`}>
                  <div className="font-medium">{w.label}</div>
                  <div className="text-xs text-muted-foreground">{w.desc}</div>
                </button>
              ))}
            </div>
          </Step>
        )}

        {step === 4 && (
          <Step title="What sports do you do and how often?" desc="Help us tailor insights">
            <Label className="mb-2 block">Sports</Label>
            <div className="mb-6 flex flex-wrap gap-2">
              {SPORTS.map((s) => (
                <button key={s} type="button" onClick={() => toggleArr("sports", s)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${(draft.sports ?? []).includes(s) ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{s}</button>
              ))}
            </div>
            <Label className="mb-2 block">Training frequency *</Label>
            <RadioGroup value={draft.training_frequency ?? ""} onValueChange={(v) => set({ training_frequency: v })} className="grid grid-cols-2 gap-2">
              {TRAINING_FREQUENCIES.map((f) => (
                <label key={f.value} className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer"><RadioGroupItem value={f.value} />{f.label}</label>
              ))}
            </RadioGroup>
          </Step>
        )}

        {step === 5 && (
          <Step title="Your data, your control" desc="We need your consent to process your health data">
            <div className="rounded-xl bg-muted p-5 text-sm text-muted-foreground">
              By continuing, you agree that PM Sweat may process your health and activity data to provide insights and coaching. You can reset or delete your profile any time in Settings.
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <Checkbox checked={draft.consent_given ?? false} onCheckedChange={(v) => set({ consent_given: !!v })} />
              I agree to the data processing terms
            </label>
          </Step>
        )}

        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>Back</Button>
          {step < 5 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext[step]}>Next →</Button>
          ) : (
            <Button onClick={finish} disabled={!canNext[5] || update.isPending}>Complete</Button>
          )}
        </div>
      </div>

      <AvatarUpload open={avatarOpen} onOpenChange={(o) => {
        setAvatarOpen(o);
        if (!o) nav({ to: "/dashboard" });
      }} />
    </div>
  );
}

function Step({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-1 mb-6 text-muted-foreground">{desc}</p>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1 block">{label}</Label>{children}</div>;
}
