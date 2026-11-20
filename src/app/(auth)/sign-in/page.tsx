"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AuthCard from "@/components/auth-card";
import Field from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient, useSession } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  // Je page e jete chaichhilo sekhane, nahole nijer dashboard e
  const raw = params.get("redirect") || "/dashboard";
  const redirectTo = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";

  useEffect(() => {
    if (session) router.replace(redirectTo);
  }, [session, router, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    const { error } = await authClient.signIn.email({ email: form.email.trim(), password: form.password });
    setBusy(false);

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }
    clearTokenCache();
    toast.success("Signed in successfully");
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to manage your repairs"
      footerText="Don't have an account?"
      footerLink="Sign Up"
      footerHref="/sign-up"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </Field>
        <Field label="Password" error={errors.password}>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" />
        </Field>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}