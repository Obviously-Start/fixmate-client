"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import PageLoader from "@/components/page-loader";
import { buttonVariants } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatMoney } from "@/lib/format";
import type { Payment } from "@/lib/types";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { data: session, isPending } = useSession();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (!session) return router.replace("/sign-in?redirect=/dashboard/customer/bookings");
    if (!sessionId) return setError("Payment session not found");
    if (started.current) return;
    started.current = true;

    // Server Stripe theke verify kore payment save kore
    apiFetch<{ data: Payment }>(`/api/payments/verify?session_id=${sessionId}`)
      .then((res) => setPayment(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not verify payment"));
  }, [isPending, session, sessionId, router]);

  if (!payment && !error) return <PageLoader />;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      {payment ? (
        <>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Payment Successful</h1>
          <p className="mt-2 text-slate-600">Thank you! Your payment for {payment.serviceTitle} was received.</p>
          <div className="mt-6 space-y-2 rounded-xl border bg-white p-5 text-left text-sm">
            <p className="flex justify-between"><span className="text-slate-500">Amount</span><b>{formatMoney(payment.amount)}</b></p>
            <p className="flex justify-between gap-4"><span className="text-slate-500">Transaction ID</span><b className="break-all font-mono text-xs">{payment.transactionId}</b></p>
          </div>
        </>
      ) : (
        <>
          <XCircle className="mx-auto h-16 w-16 text-red-600" />
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Verification failed</h1>
          <p className="mt-2 text-slate-600">{error}</p>
        </>
      )}
      <Link href="/dashboard/customer/bookings" className={`${buttonVariants({ size: "lg" })} mt-8`}>
        Back to My Bookings
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SuccessContent />
    </Suspense>
  );
}