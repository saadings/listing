import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-10 p-24">
      <div className="w-full space-y-3">
        <div className="flex justify-center">
          <Skeleton className="h-10 w-1/6" />
        </div>
        <Skeleton className="h-10" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-10 w-40" />
    </main>
  );
}
