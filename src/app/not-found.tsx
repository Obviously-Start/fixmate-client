import Link from "next/link";
import { Wrench } from "lucide-react";
import Logo from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <Logo />
      <div className="relative mt-10 flex h-40 w-40 items-center justify-center rounded-full bg-teal-100">
        <Wrench className="h-20 w-20 -rotate-45 text-primary" />
      </div>
      <h1 className="mt-8 text-6xl font-bold text-slate-900">404</h1>
      <p className="mt-3 text-lg text-slate-600">Oops! This page is broken and needs a technician.</p>
      <Link href="/" className={`${buttonVariants({ size: "lg" })} mt-8`}>
        Back to Home
      </Link>
    </div>
  );
}