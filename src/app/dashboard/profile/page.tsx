"use client";
import { useState } from "react";
import { toast } from "sonner";
import PageLoader from "@/components/page-loader";
import Field from "@/components/field";
import UserAvatar from "@/components/user-avatar";
import PageHeader from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadImage } from "@/lib/imgbb";
import { ROLE_LABEL, type Role } from "@/lib/constants";

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
};

function ProfileForm({ user }: { user: ProfileUser }) {
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone ?? "",
    area: user.area ?? "",
    bio: user.bio ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters");
    setError("");
    setBusy(true);
    try {
      const image = file ? await uploadImage(file) : user.image || "";
      await apiFetch("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify({ ...form, image }),
      });
      // Session update, jate navbar ar top bar e sathe sathe notun name/photo dekha jay
      await authClient.updateUser({ name: form.name.trim(), image: image || undefined });
      toast.success("Profile updated successfully");
      setFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-white p-6 shadow-sm" noValidate>
      <div className="flex items-center gap-4">
        <UserAvatar name={user.name} image={user.image} className="h-16 w-16" />
        <div className="flex-1">
          <Field label="Profile Photo">
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </Field>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email (read-only)"><Input value={user.email} readOnly className="bg-slate-50" /></Field>
        <Field label="Role (read-only)"><Input value={ROLE_LABEL[(user.role ?? "customer") as Role]} readOnly className="bg-slate-50" /></Field>
      </div>
      <Field label="Name" error={error}>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" /></Field>
        <Field label="Area"><Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. Mirpur, Dhaka" /></Field>
      </div>
      <Field label="Bio">
        <Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short bio (skills & experience for technicians)" />
      </Field>
      <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save Changes"}</Button>
    </form>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  if (!session) return <PageLoader />;
  return (
    <div className="max-w-3xl">
      <PageHeader title="Update Profile" subtitle="Keep your details up to date." />
      <ProfileForm user={session.user as ProfileUser} />
    </div>
  );
}