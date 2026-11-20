import Link from "next/link";
import HowItWorks from "@/components/how-it-works";
import Section from "@/components/section";
import { buttonVariants } from "@/components/ui/button";

const roles = [
  { title: "Customers", text: "Browse services, send repair requests, cancel while still requested, and pay only after the job is completed." },
  { title: "Technicians", text: "List your repair services, accept or reject requests, update job status and set the final amount." },
  { title: "Admins", text: "Approve services, manage users and roles, and monitor every job and transaction." },
];

export default function AboutPage() {
  return (
    <>
      <Section
        title="Repairs Without the Guesswork"
        subtitle="Finding a trustworthy technician is hard. FixMate gives every job a clear, trackable status and makes sure you pay only after the work is delivered."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{r.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{r.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <HowItWorks muted />
      <Section>
        <div className="rounded-2xl bg-slate-900 p-10 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get your device fixed?</h2>
          <Link href="/services" className={`${buttonVariants({ size: "lg" })} mt-6`}>
            Browse Services
          </Link>
        </div>
      </Section>
    </>
  );
}