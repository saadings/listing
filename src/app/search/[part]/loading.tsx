import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // Define the number of Skeletons you want to render
  const skeletonCount = 12;

  return (
    <main className="flex min-h-lvh select-none flex-col items-center justify-center space-y-8 p-24">
      <div className="flex flex-row space-x-4">
        <Skeleton className="h-12 w-28" />
        <Skeleton className="h-12 w-28" />
      </div>
      <div className="grid grid-cols-4 gap-8">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <Skeleton key={index} className="h-80 w-80" />
        ))}
      </div>
    </main>
  );
}
