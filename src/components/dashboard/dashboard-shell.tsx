"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarCheck, ClipboardList, CreditCard, Home, LayoutDashboard, ListChecks,
  Menu, PlusCircle, ReceiptText, Settings, ShieldCheck, Users, Wrench, X,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/logo";
import PageLoader from "@/components/page-loader";
import UserAvatar from "@/components/user-avatar";
import { useSession } from "@/lib/auth-client";
import { ROLE_LABEL, dashboardPath, type Role } from "@/lib/constants";

type Item = { href: string; label: string; icon: LucideIcon };

const MENU: Record<Role, Item[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: CalendarCheck },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/technician/add-service", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Wrench },
    { href: "/dashboard/technician/requests", label: "Manage Requests", icon: ClipboardList },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: ShieldCheck },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: ListChecks },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: ReceiptText },
  ],
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const role = (session?.user.role ?? "customer") as Role;
  const allowed =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/profile") || pathname.startsWith(`/dashboard/${role}`);

  
  useEffect(() => {
    if (isPending) return;
    if (!session) router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
    else if (!allowed) router.replace(dashboardPath(role));
  }, [isPending, session, allowed, role, pathname, router]);

  if (isPending || !session || !allowed) return <PageLoader />;

  const items = [...MENU[role], { href: "/dashboard/profile", label: "Update Profile", icon: Settings }];

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center justify-between border-b px-5">
        <Logo />
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open sidebar">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="hidden items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary lg:flex">
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-600 lg:hidden"><Home className="h-5 w-5" /></Link>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{session.user.name}</p>
              <p className="text-xs text-slate-500">{ROLE_LABEL[role]}</p>
            </div>
            <UserAvatar name={session.user.name} image={session.user.image} className="h-9 w-9" />
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}