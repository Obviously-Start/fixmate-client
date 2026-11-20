"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/page-loader";
import { useSession } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/constants";

export default function DashboardIndex() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace(dashboardPath(session.user.role));
  }, [session, router]);

  return <PageLoader />;
}