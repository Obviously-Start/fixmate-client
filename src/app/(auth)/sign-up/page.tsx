"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Smartphone, Wrench } from "lucide-react";
import AuthCard from "@/components/auth-card";
import Field from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient, useSession } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";

function validatePassword(p: string) {
  if (p.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(p)) return "Password must have at least one uppercase letter";
  if (!/[a-z]/.test(p)) return "Password must have at least one lowercase letter";
  return "";
}

function SignUpForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" as "customer" | "technician" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  // Logged-in user ke dashboard e pathai
  useEffect(() => {
    if (session) router.replace("/dashboard");
  }, [session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address";
    const pwError = validatePassword(form.password);
    if (pwError) errs.password = pwError;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    });
    setBusy(false);

    if (error) {
      toast.error(error.message || "Sign up failed");
      return;
    }
    clearTokenCache();
    toast.success("Account created successfully!");
    router.replace("/dashboard");
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join FixMate as a customer or a technician"
      footerText="Already have an account?"
      footerLink="Sign In"
      footerHref="/sign-in"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Full Name" error={errors.name}>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </Field>
        <Field label="Password" error={errors.password}>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 chars, upper & lower case" />
        </Field>

        <div className="space-y-1.5">
          <p className="text-sm font-medium">I want to join as</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "customer", label: "Customer", icon: Smartphone },
              { value: "technician", label: "Technician", icon: Wrench },
            ].map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => setForm({ ...form, role: value as "customer" | "technician" })}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-sm font-medium transition ${
                  form.role === value ? "border-primary bg-teal-50 text-primary" : "border-slate-200 text-slate-600"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}