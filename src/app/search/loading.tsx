import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-52 p-24">
      <div className="flex w-3/4 flex-col items-center justify-center space-y-20 p-4">
        <div className="w-full space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 rounded-lg p-4" />
        </div>
        <div className="w-full space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 rounded-lg p-4 shadow-md" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
    </main>
  );
}
