import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/logo";
import { FacebookIcon, XIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-slate-400">
            Trusted technicians, trackable repairs, and pay only after the job is done.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="rounded-full bg-slate-800 p-2 hover:bg-primary">
              <XIcon />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full bg-slate-800 p-2 hover:bg-primary">
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/about" className="hover:text-white">How It Works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Popular Categories</h4>
          <ul className="space-y-2 text-sm">
            {["Smartphone", "Laptop & PC", "AC", "Refrigerator"].map((c) => (
              <li key={c}>
                <Link href={`/services?category=${encodeURIComponent(c)}`} className="hover:text-white">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> support@fixmate.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Mirpur, Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} FixMate. All rights reserved.
      </div>
    </footer>
  );
}