import Link from "next/link";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";

const page = async ({ searchParams }: { searchParams: DateRange }) => {
  const url =
    process.env.NEXT_PUBLIC_API_URL +
    "/search?" +
    "from=" +
    searchParams.from +
    "&to=" +
    searchParams.to;

  const response = await fetch(url, {
    method: "POST",
  });

  const { message, data } = await response.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-52 p-24">
      <div className="flex w-3/4 flex-col items-center justify-center space-y-20 p-4">
        <div className="w-full space-y-4">
          <h1 className="text-2xl font-bold ">Positive Velocity</h1>
          <div className="rounded-lg border border-white/20 p-4 shadow-md hover:bg-white/10">
            {data.positiveVelocity}
          </div>
        </div>
        <div className="w-full space-y-4">
          <h1 className="text-2xl font-bold ">Negative Velocity</h1>
          <div className="rounded-lg border border-white/20 p-4 shadow-md hover:bg-white/10">
            {data.negativeVelocity}
          </div>
        </div>
        <Link href="/">
          <Button>Return to Search</Button>
        </Link>
      </div>
    </main>
  );
};

export default page;
