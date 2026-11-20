import Link from "next/link";
import Logo from "@/components/logo";

export default function AuthCard({
  title,
  subtitle,
  footerText,
  footerLink,
  footerHref,
  children,
}: {
  title: string;
  subtitle: string;
  footerText: string;
  footerLink: string;
  footerHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-amber-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <h1 className="text-center text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-center text-sm text-slate-500">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <p className="mt-6 text-center text-sm text-slate-600">
          {footerText}{" "}
          <Link href={footerHref} className="font-semibold text-primary hover:underline">
            {footerLink}
          </Link>
        </p>
      </div>
    </div>
  );
}