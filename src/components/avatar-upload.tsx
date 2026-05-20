import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCw, Upload } from "lucide-react";
import { useAuth, useProfile, useUpdateProfile } from "@/hooks/use-pm-sweat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ICONS = ["🏃", "🚴", "🏊", "💪", "🧘", "🏋️", "⛰️", "🎯", "⚡", "🔥", "🏆", "❤️"];
const BGS: Array<{ value: string; label: string; cls: string }> = [
  { value: "mint", label: "Mint", cls: "bg-mint" },
  { value: "indigo", label: "Indigo", cls: "bg-indigo" },
  { value: "navy", label: "Navy", cls: "bg-navy" },
  { value: "gray", label: "Gray", cls: "bg-muted" },
];

export function AvatarUpload({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { user, isDemo } = useAuth();
  const { data: profile } = useProfile();
  const update = useUpdateProfile();

  const [initial, setInitial] = useState((profile?.name?.[0] ?? "J").toUpperCase());
  const [bg, setBg] = useState("mint");
  const [pickedIcon, setPickedIcon] = useState(ICONS[0]);

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedPixels, setCroppedPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const onFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5 MB"); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { toast.error("JPG, PNG, or WebP only"); return; }
    const r = new FileReader();
    r.onload = () => setImgSrc(r.result as string);
    r.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: unknown, area: { x: number; y: number; width: number; height: number }) => setCroppedPixels(area), []);

  const getCroppedBlob = async (): Promise<Blob | null> => {
    if (!imgSrc || !croppedPixels) return null;
    const img = new Image();
    img.src = imgSrc;
    await new Promise((r) => (img.onload = r));
    const canvas = document.createElement("canvas");
    const size = 400;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-size / 2, -size / 2);
    ctx.drawImage(img, croppedPixels.x, croppedPixels.y, croppedPixels.width, croppedPixels.height, 0, 0, size, size);
    return new Promise((res) => canvas.toBlob((b) => res(b), "image/jpeg", 0.9));
  };

  const saveIcon = async () => {
    await update.mutateAsync({ avatar_kind: "icon", avatar_url: null, avatar_meta: { icon: pickedIcon, bg } });
    toast.success("Avatar saved"); onOpenChange(false);
  };
  const saveInitial = async () => {
    await update.mutateAsync({ avatar_kind: "initial", avatar_url: null, avatar_meta: { initial: initial.toUpperCase().slice(0, 2), bg } });
    toast.success("Avatar saved"); onOpenChange(false);
  };
  const savePhoto = async () => {
    const blob = await getCroppedBlob();
    if (!blob) { toast.error("Crop the image first"); return; }
    if (isDemo) {
      const dataUrl = await new Promise<string>((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result as string); fr.readAsDataURL(blob); });
      await update.mutateAsync({ avatar_kind: "photo", avatar_url: dataUrl, avatar_meta: {} });
    } else if (user) {
      const path = `${user.id}/avatar-${Date.now()}.jpg`;
      const { error } = await supabase.storage.from("avatars").upload(path, blob, { upsert: true, contentType: "image/jpeg" });
      if (error) { toast.error(error.message); return; }
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await update.mutateAsync({ avatar_kind: "photo", avatar_url: data.publicUrl, avatar_meta: {} });
    }
    toast.success("Photo saved"); onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Set your profile picture</DialogTitle></DialogHeader>
        <Tabs defaultValue="initial">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="icon">Icon</TabsTrigger>
            <TabsTrigger value="initial">Initial</TabsTrigger>
            <TabsTrigger value="photo">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="icon" className="space-y-4">
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((i) => (
                <button key={i} onClick={() => setPickedIcon(i)} className={`flex h-14 items-center justify-center rounded-xl border text-2xl ${pickedIcon === i ? "border-primary bg-primary/10" : ""}`}>{i}</button>
              ))}
            </div>
            <BgPicker bg={bg} setBg={setBg} />
            <DialogFooter><Button onClick={saveIcon}>Save Avatar</Button></DialogFooter>
          </TabsContent>

          <TabsContent value="initial" className="space-y-4">
            <Label>Your initials</Label>
            <Input value={initial} onChange={(e) => setInitial(e.target.value.slice(0, 2))} maxLength={2} />
            <BgPicker bg={bg} setBg={setBg} />
            <div className="flex justify-center">
              <div className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold ${BGS.find((b) => b.value === bg)?.cls} text-white`}>
                {initial.toUpperCase()}
              </div>
            </div>
            <DialogFooter><Button onClick={saveInitial}>Save Avatar</Button></DialogFooter>
          </TabsContent>

          <TabsContent value="photo" className="space-y-4">
            {!imgSrc ? (
              <label className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer hover:bg-accent">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload (min 200×200, max 5 MB)</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
              </label>
            ) : (
              <>
                <div className="relative h-64 w-full overflow-hidden rounded-xl bg-muted">
                  <Cropper image={imgSrc} crop={crop} zoom={zoom} rotation={rotation} aspect={1} cropShape="round" showGrid={false}
                    onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-12 text-xs">Zoom</Label>
                  <Slider min={1} max={3} step={0.1} value={[zoom]} onValueChange={(v) => setZoom(v[0])} className="flex-1" />
                  <Button size="sm" variant="outline" onClick={() => setRotation((r) => r + 90)}><RotateCw className="h-4 w-4" /></Button>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setImgSrc(null)}>Cancel</Button>
                  <Button onClick={savePhoto}>Save Photo</Button>
                </DialogFooter>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function BgPicker({ bg, setBg }: { bg: string; setBg: (v: string) => void }) {
  return (
    <div>
      <Label className="mb-2 block">Background</Label>
      <div className="flex gap-2">
        {BGS.map((b) => (
          <button key={b.value} onClick={() => setBg(b.value)} className={`h-10 w-10 rounded-full ${b.cls} ${bg === b.value ? "ring-2 ring-offset-2 ring-primary" : ""}`} />
        ))}
      </div>
    </div>
  );
}
