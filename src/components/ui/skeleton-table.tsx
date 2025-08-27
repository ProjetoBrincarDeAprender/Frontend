import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 w-full">
      <div className="flex gap-2">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-32 rounded-lg" />
        ))}
      </div>

      {/* Linhas da tabela */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex gap-2">
            {Array.from({ length: cols }).map((_, col) => (
              <Skeleton key={col} className="h-6 w-28 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
