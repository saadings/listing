import Link from "next/link";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DataGrid } from "@/components/DataGrid";
import PaginationButtons from "@/components/PaginationButtons";

const page = async ({
  searchParams,
}: {
  searchParams: DateRange & {
    vendorName: string;
    vendorPartNumber: string;
    manufacturerPartNumber: string;
    brandName: string;
    upc: string;
    page?: number;
    pageSize?: number;
  };
}) => {
  const url =
    process.env.NEXT_PUBLIC_API_URL +
    "/search?" +
    "page=" +
    (searchParams.page || 1) + // Default to 1 if searchParams.page is falsy
    "&pageSize=" +
    (searchParams.pageSize || 10) + // Default to 100 if searchParams.pageSize is falsy
    "&from=" +
    searchParams.from +
    "&to=" +
    searchParams.to +
    "&vendorName=" +
    encodeURIComponent(searchParams.vendorName) +
    "&vendorPartNumber=" +
    encodeURIComponent(searchParams.vendorPartNumber) +
    "&manufacturerPartNumber=" +
    encodeURIComponent(searchParams.manufacturerPartNumber) +
    "&brandName=" +
    encodeURIComponent(searchParams.brandName) +
    "&upc=" +
    encodeURIComponent(searchParams.upc);

  const controller = new AbortController();
  const signal = controller.signal;

  const response = await fetch(url, { signal });

  const {
    data,
  }: {
    data: {
      velocities: ReturnVelocitiesByDateRange[] | null;
      totalPages: number;
    };
  } = await response.json();

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
    <main className="flex min-h-lvh flex-col items-center justify-center space-y-10 p-24">
      <h1 className="text-4xl font-bold">Search Results</h1>
      <PaginationButtons totalPages={data.totalPages} />
      <Link href="/">
        <Button>Search Again</Button>
      </Link>
      <DataGrid velocities={data.velocities} />
    </main>
  );
};

export default page;
