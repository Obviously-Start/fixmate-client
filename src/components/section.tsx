export default function Section({
  title,
  subtitle,
  children,
  muted = false,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section className={muted ? "bg-slate-50 py-16" : "py-16"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-3 text-slate-600">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}