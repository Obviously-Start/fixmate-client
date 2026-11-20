"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, UserCog, X } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/logo";
import UserAvatar from "@/components/user-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, useSession } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { ROLE_LABEL, dashboardPath, type Role } from "@/lib/constants";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const role = (session?.user.role ?? "customer") as Role;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  async function handleSignOut() {
    await authClient.signOut();
    clearTokenCache();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive(l.href) ? "bg-teal-50 text-primary" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? null : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none">
                <UserAvatar name={session.user.name} image={session.user.image} className="h-9 w-9" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <p className="font-semibold text-slate-900">{session.user.name}</p>
                  <span className="mt-1 inline-block rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
                    {ROLE_LABEL[role]}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(dashboardPath(role))}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                  <UserCog className="mr-2 h-4 w-4" /> Update Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/sign-in" className={buttonVariants({ variant: "outline" })}>
                Sign In
              </Link>
              <Link href="/sign-up" className={buttonVariants()}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="space-y-1 border-t bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                isActive(l.href) ? "bg-teal-50 text-primary" : "text-slate-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t pt-3">
            {session ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3">
                  <UserAvatar name={session.user.name} image={session.user.image} className="h-9 w-9" />
                  <div>
                    <p className="text-sm font-semibold">{session.user.name}</p>
                    <p className="text-xs text-slate-500">{ROLE_LABEL[role]}</p>
                  </div>
                </div>
                <Link href={dashboardPath(role)} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm">
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm">
                  Update Profile
                </Link>
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/sign-in" onClick={() => setOpen(false)} className={`${buttonVariants({ variant: "outline" })} flex-1`}>
                  Sign In
                </Link>
                <Link href="/sign-up" onClick={() => setOpen(false)} className={`${buttonVariants()} flex-1`}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}