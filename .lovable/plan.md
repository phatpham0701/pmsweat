## PM Sweat Lovable Build v3.0 — Plan

### Brand & Design System
- Copy logo SVG (`pm-sweat-logo-icon.svg`, `pm-sweat-logo-full.svg`, `pm-sweat-logo-dark-bg.svg`) → `src/assets/brand/`.
- Copy favicon set + `site.webmanifest` → `public/`, wire vào `__root.tsx` head.
- Design tokens trong `src/styles.css` (oklch):
  - `--navy: #1a1a2e`, `--indigo: #4a5568`, `--mint: #48d1cc` mapped vào `--primary` (mint), `--background` (navy in dark), accent (indigo).
  - Light + Dark mode, default theo system (`prefers-color-scheme`), toggle trong Settings (lưu localStorage).
- Typography: Inter (Lovable default), tracking tight cho heading.

### Backend (Lovable Cloud)
Enable Cloud, tạo schema:

```
profiles (id uuid PK = auth.users.id, name, nickname, gender, dob,
          height_cm, weight_kg, location, avatar_url, athlete_type,
          training_frequency, custom_goal, fitness_goals text[],
          health_conditions text[], sports text[], wearable_device,
          consent_given bool, onboarding_completed bool, created_at, updated_at)

integrations (id, user_id FK, provider, connected bool, last_sync, device, meta jsonb)

sessions (id, user_id FK, sport, started_at, duration_min, load_au, notes, metrics jsonb)
```
- RLS: user chỉ select/update/insert/delete row của chính mình (`auth.uid() = user_id`).
- Trigger `handle_new_user` tự tạo profile khi signup.
- Storage bucket `avatars` (public read, owner write) cho ảnh upload.

### Auth
- Email/password + Google (qua Lovable broker + `configure_social_auth`).
- Route `/login`, `/signup`, `/reset-password`.
- `_authenticated` layout guard, redirect `/login` nếu chưa auth.
- Sau signup → check `onboarding_completed`, nếu false redirect `/onboarding`.

### Demo Mode (Johnny — Pro Triathlete)
- Nút "Try Demo" ở Landing → set `sessionStorage.is_demo=true` + `localStorage.current_user` = full Johnny JSON (spec section 5.1) + integrations + 90 ngày sessions sinh từ weekly pattern (section 5.2).
- Trong demo: tất cả hooks (`useCurrentUser`, `useSessions`, `useIntegrations`) đọc từ localStorage thay vì Supabase; mọi mutate ghi lại localStorage.
- Logout demo → clear sessionStorage + localStorage → redirect `/`.

### Routes
```
/                       Landing (hero PM Sweat, CTA Sign Up / Try Demo)
/login, /signup, /reset-password
/_authenticated/
  onboarding            5-step wizard (state machine, progress bar)
  dashboard             Hero metrics (sleep, readiness, weekly load), 
                        integrations status, recent sessions
  sessions              List + filter 90 ngày
  profile               Avatar + name/nickname/gender/DOB/location/type/stats,
                        Edit Avatar link, Edit Fitness Profile button
  settings              Retake Onboarding, Integrations (5 platforms),
                        Theme toggle, Danger Zone (Reset Profile w/ "Confirm" modal),
                        Logout
```

### Onboarding 5 bước (component-shared cho cả first-time và Edit Fitness Profile)
1. Fitness Goal — multi-select tags + Custom textarea (max 200, counter).
2. About You — name, nickname (auto-fill từ name), gender (radio M/F/Other/PNS), DOB picker, height (140–230), weight (30–200), health conditions checklist (+ Other text).
3. Wearable — 6 cards single-select (Garmin/Strava/Oura/Apple Health/Fitbit/None yet).
4. Sports + Frequency — multi-select sports tags + single-select frequency 1–7 days + Flexible.
5. Consent — card + checkbox + Complete.
- Sau STEP 5 → mở Avatar Upload modal → save profile + redirect `/dashboard`.
- Validation bằng Zod, hiển thị inline errors.
- Edit mode: pre-fill từ profile hiện tại, có nút "Save" thay vì "Complete".

### Avatar Upload Component
- 3 tabs: **Icon** (12 preset SVG icons), **Initial** (chữ cái đầu + chọn bg color: Indigo/Mint/Navy/Gray), **Upload Photo**.
- Upload: drag-drop + click, validate ≥200×200, ≤5MB, JPG/PNG/WebP.
- Crop UI 1:1 fixed ratio: `react-easy-crop` (zoom slider, rotate 90°), circular preview.
- Save: 
  - Auth user → upload crop blob lên Storage `avatars/{user_id}.jpg`, update `profiles.avatar_url`.
  - Demo → lưu base64 vào localStorage.

### Settings — Reset Profile
- Modal: warning list + text input require user gõ "Confirm" (case-insensitive) → enable nút đỏ.
- Action:
  - Auth: server fn xóa rows ở `profiles/integrations/sessions` (giữ auth.user), reset `onboarding_completed=false`, redirect `/onboarding`.
  - Demo: clear localStorage user, reload Johnny fresh template.

### Dashboard + Sessions (cơ bản)
- Dashboard: cards Sleep Score, Readiness, Weekly Load, Recovery, Active Calories; Integrations status list; Recent 5 sessions.
- Sessions page: timeline 90 ngày, filter theo sport, badge load AU.

### Tech notes
- Server fns trong `src/lib/*.functions.ts` cho profile/sessions/integrations/reset.
- `useCurrentUser` hook: nếu `is_demo` → localStorage, else → server fn `getMyProfile`.
- Sessions sinh từ weekly pattern × 13 tuần, randomize nhẹ.
- React Query cho cache + invalidate sau mutate.
- Zod schemas dùng chung client/server.
- Toast (sonner) cho feedback.

### Deliverables checklist
- [ ] Cloud enabled, schema + RLS + trigger + storage bucket
- [ ] Auth (email/password + Google)
- [ ] 5-step onboarding + validation
- [ ] Avatar upload 3 tabs + crop 1:1
- [ ] Profile page (Edit Avatar, Edit Fitness Profile)
- [ ] Settings (Retake, Integrations, Theme, Reset w/ Confirm modal, Logout)
- [ ] Dashboard + Sessions
- [ ] Demo Johnny đầy đủ + localStorage management
- [ ] Brand assets + favicon + Navy/Indigo/Mint palette
- [ ] Light/Dark theo system + toggle
- [ ] Responsive mobile/tablet/desktop

Approve để mình bắt đầu build, hoặc reply chỉnh chỗ nào cần.
