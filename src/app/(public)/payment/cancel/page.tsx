import Link from "next/link";
import { Ban } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <Ban className="mx-auto h-16 w-16 text-amber-500" />
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Payment Cancelled</h1>
      <p className="mt-2 text-slate-600">No money was taken. You can try again whenever you are ready.</p>
      <Link href="/dashboard/customer/bookings" className={`${buttonVariants({ size: "lg" })} mt-8`}>
        Try Again
      </Link>
    </div>
  );
}