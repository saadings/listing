import Link from "next/link";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";

const page = async () => {
  // const url =
  //   process.env.NEXT_PUBLIC_API_URL +
  //   "/search?" +
  //   "from=" +
  //   searchParams.from +
  //   "&to=" +
  //   searchParams.to;

  // const response = await fetch(url);

  // const { message, data } = await response.json();

  return (
    <div className="flex flex-col items-center justify-center space-y-28 p-4">
      {/* <div className="w-full space-y-4">
        <h1 className="text-2xl font-bold ">Positive Velocity</h1>
        <div className="rounded-lg bg-slate-400/30 p-4 shadow-md">
          {data.positiveVelocity}
        </div>
      </div>
      <div className="w-full space-y-4">
        <h1 className="text-2xl font-bold ">Negative Velocity</h1>
        <div className="rounded-lg bg-slate-400/30 p-4 shadow-md">
          {data.negativeVelocity}
        </div>
      </div>
      <Button>
        <Link href="/">Return to Search</Link>
      </Button> */}
    </div>
  );
};

export default page;
