import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="w-full">
      {/* Skeleton do input de pesquisa */}
      <div className="flex items-center gap-2 py-4">
        <Skeleton className="h-10 max-h-10 w-64 max-w-64 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      <div className="custom-table overflow-hidden rounded-xl border border-slate-200 shadow">
        <div className="flex gap-2 bg-blue-200">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-8 w-full rounded-none bg-transparent" />
          ))}
        </div>
        <div>
          {Array.from({ length: rows }).map((_, row) => (
            <div
              key={row}
              className={`flex gap-2 ${row % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
            >
              {Array.from({ length: cols }).map((_, col) => (
                <Skeleton key={col} className="h-6 w-full rounded-none" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
