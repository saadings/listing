import Link from "next/link";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DataGrid } from "@/components/DataGrid";
import PaginationButtons from "@/components/PaginationButtons";

const page = async ({
  searchParams,
}: {
  searchParams: DateRange & { vendorName: string };
}) => {
  const url =
    process.env.NEXT_PUBLIC_API_URL +
    "/search?" +
    "from=" +
    searchParams.from +
    "&to=" +
    searchParams.to +
    "&vendorName=" +
    searchParams.vendorName;

  const response = await fetch(url);

  const {
    data,
  }: { data: { velocities: ReturnVelocitiesByDateRange[] | null } } =
    await response.json();

  if (!data?.velocities) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center space-y-10 p-24">
        <h1 className="text-4xl font-bold">No Results Found</h1>
        <Link href="/">
          <Button>Search Again</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-10 p-24">
      <h1 className="text-4xl font-bold">Search Results</h1>
      <DataGrid velocities={data.velocities} />
      <PaginationButtons />
      <Link href="/">
        <Button>Search Again</Button>
      </Link>
    </main>
  );
};

export default page;
