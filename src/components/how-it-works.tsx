import { ClipboardList, CreditCard, Search, Wrench } from "lucide-react";
import Section from "@/components/section";

const steps = [
  { icon: Search, title: "Find a Service", text: "Browse approved repair services and pick the right technician." },
  { icon: ClipboardList, title: "Send a Request", text: "Describe the problem, add your address and preferred date." },
  { icon: Wrench, title: "Technician Fixes It", text: "Track every step: Accepted, In Progress, Completed." },
  { icon: CreditCard, title: "Pay After Completion", text: "Pay securely online only after the job is done." },
];

export default function HowItWorks({ muted = false }: { muted?: boolean }) {
  return (
    <Section title="How FixMate Works" subtitle="Four simple steps from a broken device to a happy fix." muted={muted}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-xl border bg-white p-6 text-center shadow-sm">
            <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {i + 1}
            </span>
            <span className="mx-auto mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-primary">
              <s.icon className="h-7 w-7" />
            </span>
            <h3 className="font-semibold text-slate-900">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{s.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}