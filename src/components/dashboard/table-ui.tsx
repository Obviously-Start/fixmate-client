export const TH = "px-4 py-3 text-left font-medium whitespace-nowrap";
export const TD = "px-4 py-3 align-middle";

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export const THead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-slate-50 text-slate-600">
    <tr>{children}</tr>
  </thead>
);